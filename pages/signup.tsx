import { createStyles, Input, PasswordInput } from "@mantine/core";
import { NextPage } from "next";
import React from "react";
import { BsArrowRightShort } from "react-icons/bs";
import Link from "next/link";
import { Field, FieldProps, Form, Formik } from "formik";
import { SignUpValues } from "..";
import useAuthentificationFlow from "../utils/authentification/useAuthentificationFlow";
import Button from "../components/Button";
import { MdAlternateEmail, MdEmail } from "react-icons/md";
import Head from "next/head";
import { signupSchema } from "../utils/validators";

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

 login: {
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

const Signup: NextPage = () => {
 const { classes } = useStyles();
 const { loading, signup } = useAuthentificationFlow();

 return (
  <>
   <Head>
    <title>Sign up - Blog</title>
   </Head>
   <div className={classes.root}>
    <div className={classes.container}>
     <h2>Sign up</h2>

     <Formik<SignUpValues>
      initialValues={{
       email: "",
       password: "",
       passwordVerification: "",
       username: "",
      }}
      validationSchema={signupSchema}
      onSubmit={async (values) => signup(values)}
     >
      <Form className={classes.form}>
       <Field name="email">
        {({ field, meta }: FieldProps) => (
         <Input.Wrapper error={meta.touched && meta.error} label="Your email">
          <Input icon={<MdEmail />} placeholder="Enter your email" {...field} />
         </Input.Wrapper>
        )}
       </Field>

       <Field name="username">
        {({ field, meta }: FieldProps) => (
         <Input.Wrapper
          error={meta.touched && meta.error}
          label="Your username"
         >
          <Input
           placeholder="Enter your username"
           icon={<MdAlternateEmail />}
           {...field}
          />
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

       <Field name="passwordVerification">
        {({ field, meta }: FieldProps) => (
         <Input.Wrapper
          error={meta.touched && meta.error}
          label="Password confirmation"
         >
          <PasswordInput placeholder="Re-enter your password" {...field} />
         </Input.Wrapper>
        )}
       </Field>

       <Button
        type="submit"
        style={{ alignSelf: "end", letterSpacing: 0.2 }}
        loading={loading}
       >
        Sign up
       </Button>
      </Form>
     </Formik>
    </div>
    <Link href="/login">
     <div className={classes.login}>
      <span>Already have an account?</span>
      <BsArrowRightShort size={22} />
     </div>
    </Link>
   </div>
  </>
 );
};

export default Signup;
