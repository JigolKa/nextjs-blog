import { Checkbox, Input, PasswordInput } from "@mantine/core";
import axios from "axios";
import { Field, FieldProps, Form, Formik } from "formik";
import { toast } from "react-toastify";
import { AltProps } from "..";
import { updateSchema } from "../../../utils/validators";
import Button from "../../Button";
import cookies from "../../../utils/cookies";
import setAuthorization from "../../../utils/api/auth/setAuthorization";
import { useRouter } from "next/router";
import useStore from "../../../state/store";

export default function DeletionForm({ user, classes }: AltProps) {
 const router = useRouter();
 const { resetUser } = useStore();

 const deleteAccount = async (values: {
  checked: boolean;
  password: string;
 }) => {
  if (!user || !values.checked) return;

  const response = await axios.post(
   `/api/user/${user.userId}/delete`,
   { password: Buffer.from(values.password).toString("base64") },
   setAuthorization(cookies.get("token") || "")
  );

  if (response.status === 200) {
   toast("Account deleted successfully");
   resetUser();
   router.push("/");
  }
 };

 return (
  <Formik<{ checked: boolean; password: string }>
   initialValues={{
    password: "",
    checked: false,
   }}
   validationSchema={updateSchema["delete"]}
   onSubmit={async (values) => deleteAccount(values)}
  >
   <Form className={classes.form}>
    <Field name="password">
     {({ field, meta }: FieldProps) => (
      <Input.Wrapper
       label="Confirm your identity"
       error={meta.touched && meta.error}
      >
       <PasswordInput placeholder="Enter your password" {...field} />
      </Input.Wrapper>
     )}
    </Field>
    <Field name="checked">
     {({ field, meta }: FieldProps) => (
      <Input.Wrapper error={meta.touched && meta.error}>
       <Checkbox
        label="I understand that deleting my account cannot be undone"
        {...field}
       />
      </Input.Wrapper>
     )}
    </Field>
    <Button type="submit" color="red" style={{ alignSelf: "end" }}>
     Delete
    </Button>
   </Form>
  </Formik>
 );
}
