import { createStyles, Input, PasswordInput } from "@mantine/core";
import { NextPage } from "next";
import React from "react";
import { BsArrowRightShort } from "react-icons/bs";
import Link from "next/link";
import { Field, FieldProps, Form, Formik } from "formik";
import { LoginValues } from "..";
import useAuthentificationFlow from "../utils/authentification/useAuthentificationFlow";
import Button from "../components/Button";
import { MdEmail } from "react-icons/md";
import Head from "next/head";
import { loginSchema } from "../utils/validators";

const useStyles = createStyles((theme) => ({
 root: {
  display: "flex",
  marginRight: "auto",
  height: "100vh",
  background: "#fff",
 },

 container: {
  width: "50%",
  padding: 12,
  display: "flex",
  flexDirection: "column",
  position: "absolute",
  left: "50%",
  transform: "translateX(-50%)",
  top: "10%",
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

 signup: {
  position: "absolute",
  bottom: 10,
  right: 10,
  display: "flex",
  alignItems: "center",
  color: "#000",
  fontSize: 18,

  "> span": {
   display: "block",
   opacity: 0.4,
   transition: "200ms ease all",
  },

  "> svg": {
   transition: "200ms ease all",
   marginLeft: 5,
   opacity: 0.4,
  },

  "&:hover": {
   "> svg": {
    marginLeft: 10,
    opacity: 0.7,
   },

   "> span": {
    opacity: 0.7,
   },
  },
 },

 form: {
  display: "flex",
  flexDirection: "column",
  gap: 10,
 },
}));

const Login: NextPage = () => {
 const { classes } = useStyles();
 const { loading, login } = useAuthentificationFlow();

 return (
  <>
   <Head>
    <title>Login - Blog</title>
   </Head>
   <div className={classes.root}>
    <div className={classes.container}>
     <h2>Login</h2>

     <Formik<LoginValues>
      initialValues={{
       email: "",
       password: "",
      }}
      validationSchema={loginSchema}
      onSubmit={async (values) => login(values)}
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
         <Input.Wrapper
          error={meta.touched && meta.error}
          label="Your password"
         >
          <PasswordInput placeholder="Enter your password" {...field} />
         </Input.Wrapper>
        )}
       </Field>

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
    <Link href="/signup">
     <div className={classes.signup}>
      <span>Don&apos;t have an account yet?</span>
      <BsArrowRightShort size={22} />
     </div>
    </Link>
   </div>
  </>
 );
};

export default Login;
