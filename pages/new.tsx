import { createStyles, Input, MultiSelect, Textarea } from "@mantine/core";
import axios from "axios";
import { FieldProps } from "formik";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { toast } from "react-toastify";
import * as Yup from "yup";
import useStore from "../state/store";
import setAuthorization from "../utils/api/auth/setAuthorization";
import cookies from "../utils/cookies";

const Button = dynamic(() => import("../components/Button"));
const Formik = dynamic(() => import("formik").then((mod) => mod.Formik));
const Form = dynamic(() => import("formik").then((mod) => mod.Form));
const Field = dynamic(() => import("formik").then((mod) => mod.Field));

const useStyles = createStyles(() => ({
 form: {
  display: "flex",
  flexDirection: "column",
  gap: 10,
  marginTop: 15,
 },

 button: {
  display: "flex",
  alignItems: "center",
  gap: 10,
 },
}));

export interface PostValues {
 title: string;
 description: string;
}

export default function New() {
 const { classes } = useStyles();
 const { user } = useStore();
 const [loading, setLoading] = useState(false);
 const router = useRouter();
 const [topics, setTopics] = useState<{ value: string; label: string }[]>([]);
 const [topicsList, setTopicsList] = useState<string[]>([]);

 const create = async (
  { description, title }: PostValues,
  topics: string[]
 ) => {
  if (!user) return;

  setLoading(true);

  try {
   const response = await axios.post(
    "/api/post",
    {
     title: title,
     description: description,
     authorId: user.userId,
     topics: topicsList,
    },
    setAuthorization(cookies.get("token") || "")
   );

   if (response.status === 200) {
    toast("Post successfully created");
    setLoading(false);

    router.push("/");
    return;
   }
  } catch (error: any) {
   setLoading(false);

   if (error.response.status === 401 || error.response.status === 403)
    return router.push("/login");

   toast(`Creation of post failed, ${error.response.data.error}`);
  }
 };

 const validationSchema = Yup.object().shape({
  title: Yup.string()
   .required("Title is required")
   .min(2, "At least 2 characters are required for the title"),
  description: Yup.string()
   .max(1024, "The description should not be bigger than 1024 characters")
   .required("Description is required"),
 });

 useEffect(() => {
  if (!user) {
   router.push("/login?returnUrl=/new");
  }
 }, [router, user]);

 return (
  <>
   <Head>
    <title>Create a post - Blog</title>
   </Head>
   <h1>Create a new post</h1>
   <Formik
    initialValues={{
     title: "",
     description: "",
    }}
    validationSchema={validationSchema}
    onSubmit={async (v) => await create(v as PostValues, topicsList)}
   >
    <Form className={classes.form}>
     <Field name="title">
      {({ field, meta }: FieldProps) => (
       <Input.Wrapper label="Title" error={meta.touched && meta.error}>
        <Input placeholder="Enter a title" {...field} />
       </Input.Wrapper>
      )}
     </Field>

     <Field name="description">
      {({ field, meta }: FieldProps) => (
       <Input.Wrapper error={meta.touched && meta.error} label="Description">
        <Textarea
         minRows={3}
         maxRows={5}
         {...field}
         placeholder="Enter a description"
        />
       </Input.Wrapper>
      )}
     </Field>

     <MultiSelect
      searchable
      limit={15}
      label="Topics"
      placeholder="Choose your post's topics"
      creatable
      data={topics}
      value={topicsList}
      onChange={setTopicsList}
      getCreateLabel={(query) => `+ Add ${query}`}
      onCreate={(query) => {
       const item = { value: query, label: query };
       setTopics((current) => [...current, item]);
       return item;
      }}
     />

     <Button
      type="submit"
      style={{ alignSelf: "end", letterSpacing: 0.2 }}
      loading={loading}
     >
      <div className={classes.button}>
       <AiOutlinePlus />
       <span>Create post</span>
      </div>
     </Button>
    </Form>
   </Formik>
  </>
 );
}
