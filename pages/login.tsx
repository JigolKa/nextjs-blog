import { createStyles, Input, PasswordInput } from "@mantine/core";
import { NextPage } from "next";
import React, { useEffect } from "react";
import { BsArrowRightShort } from "react-icons/bs";
import Link from "next/link";
import type { LoginValues } from "..";
import useAuth from "../utils/authentication/useAuth";
import { MdEmail } from "react-icons/md";
import Head from "next/head";
import { loginSchema } from "../utils/validators";
import dynamic from "next/dynamic";
import { FieldProps } from "formik";
import cookies from "../utils/cookies";
import useStore from "../state/store";
import axios from "axios";
import setAuthorization from "../utils/api/auth/setAuthorization";
import { useRouter } from "next/router";

const Button = dynamic(() => import("../components/Button"));
const Formik = dynamic(() => import("formik").then((mod) => mod.Formik));
const Form = dynamic(() => import("formik").then((mod) => mod.Form));
const Field = dynamic(() => import("formik").then((mod) => mod.Field));

const useStyles = createStyles((theme) => ({
 container: {
  display: "flex",
  flexDirection: "column",
  gap: 15,

  '> button[type="submit"]': {
   cursor: "pointer",
   width: "max-content",
   padding: "4px 24px",
   background: theme.colors.blue[5],
   color: "#fff",
   borderRadius: 4,
   transition: "200ms ease background",
   border: "none",
   alignSelf: "end",

   "&:hover": {
    background: theme.colors.blue[7],
   },
  },
 },

 form: {
  display: "flex",
  flexDirection: "column",
  gap: 10,
 },

 recover: {
  display: "flex",
  justifyContent: "space-between",

  [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
   flexDirection: "column",
   gap: 2.5,
  },

  div: {
   fontSize: 14,
   display: "flex",
   alignItems: "center",
   color: theme.fn.darken(theme.colors.gray[6], 0.1),
   transition: "350ms ease color",

   "&:hover": {
    color: "#000",
   },
  },
 },
}));

const Login: NextPage = () => {
 const { classes } = useStyles();
 const { loading, login } = useAuth();
 const { user, setUser } = useStore();
 const router = useRouter();

 useEffect(() => {
  const token = cookies.get("token");

  if (!user && token) {
   axios
    .get("/api/user", setAuthorization(token))
    .then((res) => setUser(res.data));

   router.push("/");
  } else if (user) {
   router.push("/");
  }
 }, []);

 return (
  <>
   <Head>
    <title>Login - Blog</title>
   </Head>
   <div className={classes.container}>
    <h2>Login</h2>

    <Formik
     initialValues={{
      email: "",
      password: "",
     }}
     validationSchema={loginSchema}
     onSubmit={async (values) => login(values as LoginValues)}
    >
     <Form className={classes.form}>
      <Field name="email">
       {({ field, meta }: FieldProps) => (
        <Input.Wrapper error={meta.touched && meta.error} label="Your email">
         <Input icon={<MdEmail />} placeholder="Enter your email" {...field} />
        </Input.Wrapper>
       )}
      </Field>

      <Field name="password">
       {({ field, meta }: FieldProps) => (
        <Input.Wrapper error={meta.touched && meta.error} label="Your password">
         <PasswordInput placeholder="Enter your password" {...field} />
        </Input.Wrapper>
       )}
      </Field>

      <div className={classes.recover}>
       <Link href="/signup" style={{ maxWidth: "fit-content" }}>
        <div>
         <span>Doesn&apos;t have an account yet?</span>
         <BsArrowRightShort size={22} />
        </div>
       </Link>
       <Link href="/login" style={{ maxWidth: "fit-content" }}>
        <div>
         <span>Forgot your password?</span>
         <BsArrowRightShort size={22} />
        </div>
       </Link>
      </div>

      <Button
       type="submit"
       style={{ alignSelf: "end", letterSpacing: 0.2 }}
       loading={loading}
      >
       Login
      </Button>
     </Form>
    </Formik>
   </div>
  </>
 );
};

export default Login;
