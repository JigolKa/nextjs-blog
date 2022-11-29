import { Input, PasswordInput } from "@mantine/core";
import { Field, FieldProps, Form, Formik } from "formik";
import { AltProps } from "..";
import { SignUpValues } from "../../..";
import useUpdateAccount from "../../../utils/authentification/useUpdateAccount";
import { updateSchema } from "../../../utils/validators";
import Button from "../../Button";
type Values = SignUpValues;

export default function PasswordForm({ user, classes }: AltProps) {
 const { update, loading } = useUpdateAccount();

 return (
  <Formik<Omit<Values, "username" | "email">>
   initialValues={{
    password: "",
    passwordVerification: "",
   }}
   validationSchema={updateSchema["credentials"]}
   onSubmit={async ({ password }) => update({ password }, user.userId)}
  >
   <Form className={classes.form}>
    <Field name="password">
     {({ field, meta }: FieldProps) => (
      <Input.Wrapper error={meta.touched && meta.error} label="Your password">
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
     color="orange"
    >
     Change your password
    </Button>
   </Form>
  </Formik>
 );
}
