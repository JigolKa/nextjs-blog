import { createStyles, Input, PasswordInput } from "@mantine/core";
import { useRouter } from "next/router";
import { createRef, MutableRefObject, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { SignUpValues } from "../..";
import Button from "../../components/Button";
import { MdAlternateEmail, MdEmail } from "react-icons/md";
import { Field, FieldProps, Form, Formik } from "formik";
import { updateSchema } from "../../utils/validators";
import useUpdateAccount from "../../utils/authentification/useUpdateAccount";
import { User } from "@prisma/client";
import axios from "axios";
import setAuthorization from "../../utils/api/auth/setAuthorization";
import cookies from "../../utils/cookies";
import { toast } from "react-toastify";
import { resetUser } from "../../state/reducers/userSlice";
import useRefresh from "../../utils/authentification/useRefresh";
import Head from "next/head";
import config from "../../utils/config";

const useStyles = createStyles((theme) => ({
 form: {
  display: "flex",
  flexDirection: "column",
  gap: 10,
  marginTop: 10,
 },

 danger: {
  marginTop: 10,
  color: theme.colors.red[7],

  ".item": {
   display: "flex",
   width: "100%",
   justifyContent: "space-between",
   alignItems: "center",
   fontSize: 18,
   marginBlock: 10,

   "&:last-of-type": {
    marginBottom: 0,
   },
  },
 },

 notActivated: {
  padding: 18,
  borderRadius: 12,
  border: `1px solid ${theme.colors.gray[1]}`,
  color: "#fff",
  marginBottom: 10,
  backgroundImage:
   "linear-gradient(109.6deg, rgba(45,116,213,1) 11.2%, rgba(121,137,212,1) 91.2%)",

  p: {
   marginTop: 7.5,
  },

  ".buttons": {
   display: "flex",
   alignItems: "center",
   gap: 15,
   marginTop: 10,
  },
 },
}));

type Values = SignUpValues;

type AltProps = { user: User };

export default function Account() {
 const { user } = useAppSelector((s) => s.user);
 const { classes } = useStyles();
 const { update, loading } = useUpdateAccount();
 const router = useRouter();
 const dispatch = useAppDispatch();
 const emailInputRef = createRef() as MutableRefObject<null>;
 const [isDeleting, setDeleting] = useState(false);
 useRefresh();

 const deleteAccount = async (password: string) => {
  if (!user) return;

  const response = await axios.post(
   `/api/user/${user.userId}/delete`,
   { password: Buffer.from(password).toString("base64") },
   setAuthorization(cookies.get("token") || "")
  );

  if (response.status === 200) {
   toast("Account deleted successfully");
   dispatch((resetUser as any)());
   router.push("/");
  }
 };

 if (user) {
  return (
   <>
    <Head>
     <title>Your account - Blog</title>
    </Head>

    <NotActivated user={user} emailInputRef={emailInputRef} />

    <h2>Your informations</h2>

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

    <h2>Change your password</h2>
    <PasswordForm user={user} />

    <div className={classes.danger}>
     <h2>Danger zone</h2>
     <div className="item">
      <span>Delete your account</span>
      <Button color="red" onClick={() => setDeleting((p) => !p)}>
       Delete
      </Button>
     </div>
     {isDeleting && (
      <Formik
       initialValues={{
        password: "",
       }}
       validationSchema={updateSchema["delete"]}
       onSubmit={async (values) => deleteAccount(values.password)}
      >
       <Form className={classes.form}>
        <Field name="password">
         {({ field, meta }: FieldProps) => (
          <Input.Wrapper
           error={meta.touched && meta.error}
           label="Confirm your account deletion"
          >
           <PasswordInput placeholder="Enter your password" {...field} />
          </Input.Wrapper>
         )}
        </Field>
        <Button type="submit" color="orange" style={{ alignSelf: "end" }}>
         Confirm
        </Button>
       </Form>
      </Formik>
     )}
    </div>
   </>
  );
 }

 router.push("/login");
 return null;
}

function NotActivated({
 user,
 emailInputRef,
}: AltProps & {
 emailInputRef: MutableRefObject<null>;
}) {
 const { classes } = useStyles();

 const sendVerification = async () => {
  await axios.post(`${config.BASE_URL}/api/verify/activate`, {
   userId: user.userId,
  });

  toast("Email verification sent");
 };

 if (!user.activated) {
  return (
   <div className={classes.notActivated}>
    <h3>Activate your account!</h3>
    <p>
     You should activate your account as soon as possible to enjoy all the
     functionalities of the Blog!
    </p>
    <div className="buttons">
     <Button color="green" onClick={async () => sendVerification()}>
      Resend activation link
     </Button>
     <Button
      color="cyan"
      onClick={() => (emailInputRef.current as any).focus()}
     >
      Change email address
     </Button>
    </div>
   </div>
  );
 }

 return null;
}

function PasswordForm({ user }: AltProps) {
 const { classes } = useStyles();
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
