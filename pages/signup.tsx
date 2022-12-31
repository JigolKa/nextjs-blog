import { createStyles, Input, PasswordInput } from "@mantine/core";
import { NextPage } from "next";
import React from "react";
import { BsArrowRightShort } from "react-icons/bs";
import Link from "next/link";
import { Field, FieldProps, Form, Formik } from "formik";
import { SignUpValues } from "..";
import useAuth from "../utils/authentication/useAuth";
import { MdAlternateEmail, MdEmail } from "react-icons/md";
import Head from "next/head";
import { signupSchema } from "../utils/validators";
import dynamic from "next/dynamic";

const PasswordStrength = dynamic(
 () => import("../components/Login/PasswordStrength")
);
const Button = dynamic(() => import("../components/Button"));

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

const Signup: NextPage = () => {
 const { classes } = useStyles();
 const { loading, signup } = useAuth();

 return (
  <>
   <Head>
    <title>Sign up - Blog</title>
   </Head>
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
     {({ values }) => (
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
       <PasswordStrength value={values.password} />

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
       <div className={classes.recover}>
        <Link href="/login" style={{ maxWidth: "fit-content" }}>
         <div>
          <span>Already have an account?</span>
          <BsArrowRightShort size={22} />
         </div>
        </Link>
       </div>

       <Button
        type="submit"
        style={{ alignSelf: "end", letterSpacing: 0.2 }}
        loading={loading}
       >
        Sign up
       </Button>
      </Form>
     )}
    </Formik>
   </div>
  </>
 );
};

export default Signup;
