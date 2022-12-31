import { User } from "@prisma/client";
import axios from "axios";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { IdealUser } from "../..";

const Button = dynamic(() => import("../../components/Button"));

interface Props {
 user: IdealUser;
 setUser: Dispatch<SetStateAction<IdealUser>>;

 currentUser: User | null;
}

export default function Subscribe({ currentUser, user, setUser }: Props) {
 const [isFollowed, setFollowed] = useState(false);
 const router = useRouter();

 useEffect(() => {
  if (currentUser && user) {
   setFollowed(user.followedByIDs.includes(currentUser.userId));
  }
 }, [currentUser, user]);

 const follow = async () => {
  if (!user || !currentUser) {
   router.push("/login");
   return;
  }

  const response = await axios.post(`/api/user/${user.userId}/follow`, {
   userId: currentUser.userId,
  });

  if (response.status === 200) {
   setFollowed((p) => !p);
   setUser(response.data.targetUser);
  }
 };

 if (user) {
  const buttonText = currentUser
   ? currentUser.userId === user.userId
     ? "Settings"
     : isFollowed
     ? "Unsubscribe"
     : "Subscribe"
   : "Subscribe";

  const buttonVariant = currentUser
   ? currentUser.userId === user.userId
     ? "outline"
     : isFollowed
     ? "outline"
     : "fill"
   : "fill";

  return (
   <div className="infos">
    <h2>{user.username}</h2>
    {currentUser ? (
     currentUser.userId === user.userId ? (
      <Link href="/account">
       <Button variant={buttonVariant}>{buttonText}</Button>
      </Link>
     ) : (
      <Button onClick={follow} variant={buttonVariant}>
       {buttonText}
      </Button>
     )
    ) : (
     <Button onClick={follow} variant={buttonVariant}>
      {buttonText}
     </Button>
    )}
   </div>
  );
 }

 return null;
}
