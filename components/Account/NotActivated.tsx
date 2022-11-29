import axios from "axios";
import { MutableRefObject } from "react";
import { toast } from "react-toastify";
import { AltProps } from ".";
import config from "../../utils/config";
import Button from "../Button";

export default function NotActivated({
 user,
 emailInputRef,
 classes,
}: AltProps & {
 emailInputRef: MutableRefObject<null>;
}) {
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
