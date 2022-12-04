import { Input } from "@mantine/core";
import { Field, FieldProps, Form, Formik } from "formik";
import { MutableRefObject } from "react";
import { MdAlternateEmail, MdEmail } from "react-icons/md";
import { AltProps } from "..";
import { SignUpValues } from "../../..";
import useUpdateAccount from "../../../utils/authentication/useUpdateAccount";
import { updateSchema } from "../../../utils/validators";
import Button from "../../Button";
type Values = SignUpValues;

export default function InformationsForm({
 user,
 emailInputRef,
 classes,
}: AltProps & {
 emailInputRef: MutableRefObject<null>;
}) {
 const { update, loading } = useUpdateAccount();

 return (
  <Formik<Omit<Values, "password" | "passwordVerification">>
   initialValues={{
    email: user.email,
    username: user.username.substring(1),
   }}
   validationSchema={updateSchema["informations"]}
   onSubmit={async (values) => update(values, user.userId)}
  >
   <Form className={classes.form}>
    <Field name="email">
     {({ field, meta }: FieldProps) => (
      <Input.Wrapper error={meta.touched && meta.error} label="Your email">
       <Input
        icon={<MdEmail />}
        placeholder="Enter your email"
        ref={emailInputRef}
        {...field}
       />
      </Input.Wrapper>
     )}
    </Field>

    <Field name="username">
     {({ field, meta }: FieldProps) => (
      <Input.Wrapper error={meta.touched && meta.error} label="Your username">
       <Input
        placeholder="Enter your username"
        icon={<MdAlternateEmail />}
        {...field}
       />
      </Input.Wrapper>
     )}
    </Field>

    <Button
     type="submit"
     style={{ alignSelf: "end", letterSpacing: 0.2 }}
     loading={loading}
     color="green"
    >
     Update your account
    </Button>
   </Form>
  </Formik>
 );
}
