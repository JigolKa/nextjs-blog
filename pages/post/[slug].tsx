import { createStyles, Modal } from "@mantine/core";
import { GetServerSidePropsContext, NextPage } from "next";
import Link from "next/link";
import { ParsedUrlQuery } from "querystring";
import { useContext } from "react";
import { AiOutlineLink } from "react-icons/ai";
import { FullPost } from "../..";
import prisma from "../../prisma/instance";
import useLikePost from "../../utils/fetch/useLikePost";
import dynamic from "next/dynamic";
import Head from "next/head";
import { serializeArray, serializeJSON } from "../../utils/json";
import { format } from "date-fns";
import Share from "../../components/Post/Share";
import Topics from "../../components/Post/Topics";
import { ShareModalContext } from "../../contexts/ShareModalContext";

const MarkdownPreview = dynamic(() => import("@uiw/react-markdown-preview"), {
 ssr: false,
});
const PostOverlay = dynamic(() => import("../../components/Post/PostOverlay"));
const Post = dynamic(() => import("../../components/Home/Post"));

const useStyles = createStyles((theme) => ({
 description: {
  overflowWrap: "break-word",
  marginTop: 25,
  color: theme.colors.gray[9],
  marginInline: "auto",
  textAlign: "left",
 },

 quotedWebsite: {
  display: "flex",
  gap: 7.5,
  alignItems: "center",
  fontSize: 18,
  marginTop: 10,
 },

 related: {
  display: "flex",
  flexDirection: "column",
  gap: 15,
  width: "50%",
  paddingBlock: 15,

  [`@media screen and (max-width: ${theme.breakpoints.xl}px)`]: {
   width: "65%",
  },
  [`@media screen and (max-width: ${theme.breakpoints.lg}px)`]: {
   width: "80%",
  },
  [`@media screen and (max-width: ${theme.breakpoints.md}px)`]: {
   width: "85%",
  },
  [`@media screen and (max-width: ${theme.breakpoints.sm}px)`]: {
   width: "90%",
  },

  ".more": {
   fontSize: 22.5,
   fontWeight: 600,
   color: "#fff",
  },
 },

 background: {
  marginTop: 40,
  width: "100vw",
  height: "auto",
  display: "flex",
  justifyContent: "center",
  background: theme.colors.blue[7],
 },

 container: {
  width: "50%",
  marginInline: "auto",
  marginTop: 40,

  [`@media screen and (max-width: ${theme.breakpoints.xl}px)`]: {
   width: "65%",
  },
  [`@media screen and (max-width: ${theme.breakpoints.lg}px)`]: {
   width: "80%",
  },
  [`@media screen and (max-width: ${theme.breakpoints.md}px)`]: {
   width: "85%",
  },
  [`@media screen and (max-width: ${theme.breakpoints.sm}px)`]: {
   width: "90%",
  },
 },

 title: {
  fontSize: 48,
  fontWeight: 700,
  marginInline: "auto",
  textAlign: "center",
  color: "rgb(2, 27, 156)",
 },

 informations: {
  marginTop: 25,
  display: "block",
  color: "rgb(2, 27, 156)",
  textAlign: "center",
 },
}));

interface Props {
 post: FullPost;
 sameUserPosts: FullPost[];
}

const PostPage: NextPage<Props> = ({ post: _post, sameUserPosts }) => {
 const { classes } = useStyles();
 const { likePost, liked, disliked, post } = useLikePost(_post);
 const { open, slug, setOpen, setSlug } = useContext(ShareModalContext);

 if (post) {
  return (
   <>
    <Head>
     <title>
      {post.title} - {post.author.username} - Blog
     </title>
    </Head>
    <div className={classes.container}>
     <h1 className={classes.title}>{post.title}</h1>
     <div className={classes.informations}>
      <span>{format(new Date(post.createdAt), "LL/dd/yyyy")}</span> -{" "}
      <span>
       Written by{" "}
       <Link href={`/user/${post.author.username}`}>
        <span className="link">{post.author.username}</span>
       </Link>
      </span>
      <Topics
       topics={post.topics}
       style={{
        maxWidth: "50%",
        marginInline: "auto",
        display: "flex",
        justifyContent: "center",
        gap: 10,
        marginTop: 10,
       }}
      />
     </div>
     <Share slug={post.slug} />
     <MarkdownPreview source={post.content} className={classes.description} />
     {post.quotedWebsite && (
      <Link href={post.quotedWebsite}>
       <span className={classes.quotedWebsite}>
        <AiOutlineLink size={28} />
        <b>{post.quotedWebsite}</b>
       </span>
      </Link>
     )}
    </div>
    <div className={classes.background}>
     <div className={classes.related}>
      <span className="more">Related posts:</span>
      {sameUserPosts.length ? (
       sameUserPosts.map((p) => <Post post={p} key={p.slug} />)
      ) : (
       <h4>No others posts from {post.author.username}</h4>
      )}
     </div>
    </div>
    <PostOverlay
     post={post}
     liked={liked}
     disliked={disliked}
     likePost={likePost}
    />
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

export default PostPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
 const { slug } = context.params as ParsedUrlQuery;

 if (!slug) {
  return {
   redirect: {
    permanent: false,
    destination: "/404",
   },
   props: {},
  };
 }

 const post = await prisma.post.findFirst({
  where: {
   slug: slug as string,
  },
  include: {
   author: true,
  },
 });

 if (!post) {
  return {
   redirect: {
    permanent: false,
    destination: "/404",
   },
   props: {},
  };
 }

 const sameUserPosts = await prisma.post.findMany({
  where: {
   authorId: post.author.userId,
   NOT: {
    postId: post.postId,
   },
  },
  include: {
   author: true,
  },
 });

 return {
  props: {
   post: serializeJSON(post),
   sameUserPosts: serializeArray(sameUserPosts),
  },
 };
}
