import { Avatar, createStyles, Modal, Tabs, Tooltip } from "@mantine/core";
import type { Post as PostType, User } from "@prisma/client";
import { GetServerSidePropsContext, NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import Image from "next/image";
import { ParsedUrlQuery } from "querystring";
import { useContext, useEffect, useState } from "react";
import prisma from "../../prisma/instance";
import { useStoreSSR } from "../../state/store";
import { userWithoutPasswordAndPosts } from "../../utils/api/db/user";
import { serializeJSON } from "../../utils/json";
import { membership } from "../../utils/strings";
import StyledTabs from "../../components/Account/StyledTabs";
import UserProfile from "../../components/Account/UserProfile";
import { format } from "date-fns";
import { FullUserWithoutPassword } from "../..";
import { ShareModalContext } from "../../contexts/ShareModalContext";
import Share from "../../components/Post/Share";

const Post = dynamic(() => import("../../components/Home/Post"));
const Subscribe = dynamic(() => import("../../components/Account/Subscribe"));

interface Props {
 user: Omit<FullUserWithoutPassword, "posts"> & {
  posts: (PostType & {
   author: User;
  })[];
 };
}

const useStyles = createStyles((theme) => ({
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
 },

 tabsContainer: {
  marginTop: 15,
  display: "flex",
  flexDirection: "column",
  gap: 10,
 },

 emptyRelations: {
  fontWeight: 600,
  fontSize: 16,
 },

 joined: {
  marginTop: 7.5,
  display: "block",
  fontSize: 18,
  fontWeight: 400,
  color: theme.colors.gray[7],
 },

 aboutTitle: {
  fontSize: 18,
  fontWeight: 600,
  marginTop: 15,
  marginBottom: 10,
  display: "block",
 },

 aboutStatitistics: {
  marginTop: 15,
  marginBottom: 10,
 },

 noData: {
  fontSize: 18,
  fontWeight: 500,
 },
}));

const Account: NextPage<Props> = ({ user: _user }) => {
 const { classes } = useStyles();
 const { user: currentUser } = useStoreSSR((s) => s);
 const { open, slug, setOpen, setSlug } = useContext(ShareModalContext);

 const [user, setUser] = useState(_user);
 useEffect(() => setUser(_user), [_user]);

 const sameProfile = currentUser ? currentUser.userId === user.userId : false;
 const [activeTab, setActiveTab] = useState<string | null>("posts");

 useEffect(
  () => {
   setActiveTab("posts");
  },
  typeof window !== "undefined" ? [window.location.href] : undefined
 );

 if (user) {
  return (
   <>
    <Head>
     <title>{`${user.username} - Blog`}</title>
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

      <Subscribe user={user} currentUser={currentUser} setUser={setUser} />

      <span className={classes.joined}>
       Joined in {format(new Date(user.createdAt), "MM/yyyy")}
      </span>

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
         <h4 style={{ marginTop: 10 }} className={classes.emptyRelations}>
          {sameProfile
           ? "You have no followers"
           : `${user.username} has no followers`}
         </h4>
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
         <h4 style={{ marginTop: 10 }} className={classes.emptyRelations}>
          {sameProfile
           ? "You are not following anyone"
           : `${user.username} doesn't follow anyone`}
         </h4>
        )}
       </div>
      </div>
     </div>
     <StyledTabs value={activeTab} onTabChange={setActiveTab}>
      <Tabs.List>
       <Tabs.Tab value="posts">Posts</Tabs.Tab>
       <Tabs.Tab value="followers">Followers</Tabs.Tab>
       <Tabs.Tab value="following">Following</Tabs.Tab>
       <Tabs.Tab value="about">About</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="posts">
       <div className={classes.tabsContainer}>
        {user.posts.length ? (
         user.posts.map((post) => (
          <Post dontShowMeta post={post} key={post.postId} />
         ))
        ) : (
         <span className={classes.noData}>
          {user.username} has not published any post yet
         </span>
        )}
       </div>
      </Tabs.Panel>

      <Tabs.Panel value="followers">
       <div className={classes.tabsContainer}>
        {user.followedBy.length ? (
         user.followedBy.map((user) => (
          <UserProfile user={user} key={user.userId} />
         ))
        ) : (
         <span className={classes.noData}>
          {user.username} has no followers
         </span>
        )}
       </div>
      </Tabs.Panel>

      <Tabs.Panel value="following">
       <div className={classes.tabsContainer}>
        {user.following.length ? (
         user.following.map((user) => (
          <UserProfile user={user} key={user.userId} />
         ))
        ) : (
         <span className={classes.noData}>
          {user.username} doesn&apos;t follow anyone
         </span>
        )}
       </div>
      </Tabs.Panel>

      <Tabs.Panel value="about">
       <span className={classes.aboutTitle}>About {user.username}:</span>
       <p>{user.biography ? user.biography : <i>No biography</i>}</p>

       <div className={classes.aboutStatitistics}>
        <span>
         <b>Total posts:</b> {user.posts.length}
        </span>
       </div>
       <div className={classes.aboutStatitistics}>
        <span>
         <b>Total comments:</b> {user.comments ? user.comments.length : 0}
        </span>
       </div>
      </Tabs.Panel>
     </StyledTabs>
    </div>

    <Modal
     opened={open}
     onClose={() => {
      setOpen && setOpen(false);
      setSlug && setSlug(null);
     }}
     size="50%"
     title="Share this post"
     overlayOpacity={0.55}
     overlayBlur={3}
    >
     <Share slug={slug as string} />
    </Modal>
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
