import { Avatar, createStyles, Tooltip } from "@mantine/core";
import type { Post as PostType, User } from "@prisma/client";
import axios from "axios";
import { GetServerSidePropsContext, NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";
import prisma from "../../prisma/instance";
import useStore from "../../state/store";
import { userWithoutPasswordAndPosts } from "../../utils/api/db/user";
import { serializeJSON } from "../../utils/json";
import membership from "../../utils/strings/membership";

const Button = dynamic(() => import("../../components/Button"));
const Post = dynamic(() => import("../../components/Home/Post"));

interface Props {
 user: User & {
  posts: (PostType & {
   author: User;
  })[];
  following: User[];
  followedBy: User[];
 };
}

const useStyles = createStyles(() => ({
 container: {
  position: "relative",

  ".account": {
   marginTop: 160,
   width: "100%",
   padding: "30px 0 16px 0",
  },

  ".infos": {
   width: "100%",
   display: "flex",
   alignItems: "center",
   justifyContent: "space-between",
  },

  ".picture": {
   position: "absolute",
   top: -130,
   borderRadius: 9999,

   ".img": {
    borderRadius: 9999,
   },
  },

  ".relations": {
   display: "flex",
   gap: 25,
   marginTop: 15,

   "> div": {
    width: 350,
   },
  },

  ".posts": {
   h2: {
    marginBlock: "10px 15px",
   },
   ".container": {
    display: "flex",
    flexDirection: "column",
    gap: 10,
   },
  },
 },
}));

const Account: NextPage<Props> = ({ user }) => {
 const { classes } = useStyles();
 const { user: currentUser } = useStore();
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

  setFollowed((p) => !p);
  await axios.post(`/api/user/${user.userId}/follow`, {
   userId: currentUser.userId,
  });
 };

 if (user) {
  const buttonText = currentUser
   ? currentUser.userId === user.userId
     ? "Go to your account"
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
   <>
    <Head>
     <title>{user.username} - Blog</title>
    </Head>
    <div className={classes.container}>
     <div className="account">
      <div className="picture">
       <Image
        src={user.profilePicture}
        width={150}
        height={150}
        className="img"
        alt={`${membership(user.username)} profile picture`}
       />
      </div>

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

      <div className="relations">
       <div className="followers">
        <h3>Followers</h3>
        {user.followedBy.length ? (
         <Tooltip.Group>
          <Avatar.Group spacing="sm" mt={5}>
           {user.followedBy.slice(0, 5).map((following: User, i) => (
            <Tooltip label={following.username} withArrow key={i}>
             <Avatar src={following.profilePicture} radius="xl" />
            </Tooltip>
           ))}
           {user.following.length > 5 && (
            <Avatar radius="xl">+{user.followedBy.length - 5}</Avatar>
           )}
          </Avatar.Group>
         </Tooltip.Group>
        ) : (
         <h4 style={{ marginTop: 10 }}>{user.username} has no followers</h4>
        )}
       </div>
       <div className="following">
        <h3>Following</h3>
        {user.following.length ? (
         <Tooltip.Group openDelay={300} closeDelay={100}>
          <Avatar.Group spacing="sm" mt={5}>
           {user.following.slice(0, 5).map((following: User, i) => (
            <Tooltip label={following.username} withArrow key={i}>
             <Avatar src={following.profilePicture} radius="xl" />
            </Tooltip>
           ))}
           {user.following.length > 5 && (
            <Avatar radius="xl">+{user.following.length - 5}</Avatar>
           )}
          </Avatar.Group>
         </Tooltip.Group>
        ) : (
         <h4 style={{ marginTop: 10 }}>
          {user.username} doesn&apos;t follow anyone
         </h4>
        )}
       </div>
      </div>
     </div>
     <div className="posts">
      <h2>Posts from {user.username}</h2>
      <div className="container">
       {user.posts.map((post) => (
        <Post dontShowMeta post={post} key={post.postId} />
       ))}
      </div>
     </div>
    </div>
   </>
  );
 }

 return null;
};

export default Account;

export async function getServerSideProps(context: GetServerSidePropsContext) {
 const { username } = context.params as ParsedUrlQuery;

 if (!username) {
  return {
   redirect: {
    permanent: false,
    destination: "/404",
   },
   props: {},
  };
 }

 const user = await prisma.user.findFirst({
  where: {
   username: username as string,
  },
  select: {
   posts: {
    include: {
     author: true,
    },
   },
   ...userWithoutPasswordAndPosts,
  },
 });

 if (!user) {
  return {
   redirect: {
    permanent: false,
    destination: "/404",
   },
   props: {},
  };
 }

 return {
  props: {
   user: serializeJSON(user),
  },
 };
}