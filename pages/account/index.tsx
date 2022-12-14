import { createStyles } from "@mantine/core";
import { useRouter } from "next/router";
import { createRef, MutableRefObject, useEffect, useState } from "react";
import Button from "../../components/Button";
import useRefresh from "../../utils/authentication/useRefresh";
import Head from "next/head";
import useStore from "../../state/store";
import dynamic from "next/dynamic";

const NotActivated = dynamic(
 () => import("../../components/Account/NotActivated")
);
const InformationsForm = dynamic(
 () => import("../../components/Account/Forms/InformationsForm")
);
const PasswordForm = dynamic(
 () => import("../../components/Account/Forms/PasswordForm")
);
const DeletionForm = dynamic(
 () => import("../../components/Account/Forms/DeletionForm")
);

const Modal = dynamic(() => import("@mantine/core").then((mod) => mod.Modal));

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

export default function Account() {
 const { user } = useStore();
 const { classes } = useStyles();
 const router = useRouter();
 const emailInputRef = createRef() as MutableRefObject<null>;
 const [isDeleting, setDeleting] = useState(false);
 useRefresh();

 useEffect(() => {
  if (!user) router.push("/login");
 }, []);

 if (user) {
  return (
   <>
    <Head>
     <title>Your account - Blog</title>
    </Head>

    <NotActivated user={user} emailInputRef={emailInputRef} classes={classes} />

    <h2>Your informations</h2>
    <InformationsForm
     emailInputRef={emailInputRef}
     user={user}
     classes={classes}
    />

    <h2>Change your password</h2>
    <PasswordForm user={user} classes={classes} />

    <div className={classes.danger}>
     <h2>Danger zone</h2>
     <div className="item">
      <span>Delete your account</span>
      <Button color="red" onClick={() => setDeleting((p) => !p)}>
       Delete
      </Button>
     </div>

     <Modal
      size="lg"
      opened={isDeleting}
      onClose={() => setDeleting((p) => !p)}
      title="Deleting your account"
     >
      <DeletionForm user={user} classes={classes} />
     </Modal>
    </div>
   </>
  );
 }

 return null;
}
