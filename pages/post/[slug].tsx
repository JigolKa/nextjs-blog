import { createStyles, Divider } from "@mantine/core";
import { GetServerSidePropsContext, NextPage } from "next";
import Link from "next/link";
import { ParsedUrlQuery } from "querystring";
import { AiOutlineLink } from "react-icons/ai";
import { FullPost } from "../..";
import PostOverlay from "../../components/Post/PostOverlay";
import prisma from "../../prisma/instance";
import useLikePost from "../../utils/feed/useLikePost";
import PostComponent from "../../components/Home/Post";
import Head from "next/head";
import getPosts from "../../utils/feed";
import { serializeArray, serializeJSON } from "../../utils/json";
import nl2br from "../../utils/strings/nl2br";

const useStyles = createStyles((theme) => ({
 description: {
  overflowWrap: "break-word",
  marginTop: 15,
  color: theme.colors.gray[9],
 },

 quotedWebsite: {
  display: "flex",
  gap: 7.5,
  alignItems: "center",
  fontSize: 18,
  marginTop: 10,
 },

 author: {
  marginTop: 20,
  display: "flex",
  flexDirection: "column",
  gap: 15,

  ".more": {
   fontSize: 22.5,
   fontWeight: 600,
  },
 },
}));

interface Props {
 post: FullPost;
 otherPosts: FullPost[];
 feed: FullPost[];
}

const Post: NextPage<Props> = ({ post: _post, otherPosts, feed }) => {
 const { classes } = useStyles();
 const { likePost, liked, disliked, post } = useLikePost(_post);

 if (post) {
  return (
   <>
    <Head>
     <title>
      {post.title} - {post.author.username} - Blog
     </title>
    </Head>
    <h1>{post.title}</h1>
    <p className={classes.description}>{nl2br(post.content)}</p>
    {post.quotedWebsite && (
     <Link href={post.quotedWebsite}>
      <span className={classes.quotedWebsite}>
       <AiOutlineLink size={28} />
       <b>{post.quotedWebsite}</b>
      </span>
     </Link>
    )}
    <Divider mt={20} />
    <div className={classes.author}>
     <span className="more">More from {post.author.username}:</span>
     {otherPosts.length ? (
      otherPosts.map((p) => (
       <PostComponent dontShowMeta dontRefreshFeed post={p} key={p.slug} />
      ))
     ) : (
      <h4>No others posts from {post.author.username}</h4>
     )}
    </div>
    <PostOverlay
     post={post}
     liked={liked}
     disliked={disliked}
     likePost={likePost}
    />
    <Divider mt={20} />
    <div className={classes.author}>
     <span className="more">Others posts:</span>
     {feed && feed.length ? (
      feed.map((p) => <PostComponent dontRefreshFeed post={p} key={p.slug} />)
     ) : (
      <h4>No others posts</h4>
     )}
    </div>
   </>
  );
 }

 return null;
};

export default Post;

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
   topics: true,
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

 const otherPosts = await prisma.post.findMany({
  where: {
   authorId: post.author.userId,
   NOT: {
    postId: post.postId,
   },
  },
  include: {
   author: true,
   topics: true,
  },
 });

 const feed = await getPosts({ context: context }, undefined, undefined, [
  post.postId,
  ...otherPosts.map((p) => p.postId),
 ]);

 return {
  props: {
   post: serializeJSON(post),
   otherPosts: serializeArray(otherPosts),
   feed: serializeArray(feed),
  },
 };
}
