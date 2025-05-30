import { Button, createStyles, Modal } from "@mantine/core";
import axios from "axios";
import type { GetServerSidePropsContext, NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState, useContext } from "react";
import { PostsFetching } from "..";
import PostSkeleton from "../components/Home/PostSkeleton";
import { serializeArray } from "../utils/json";
import Share from "../components/Post/Share";
import { ShareModalContext } from "../contexts/ShareModalContext";
import Fetching from "../utils/fetch";

const Post = dynamic(() => import("../components/Home/Post"));

const useStyles = createStyles((theme) => ({
 postContainer: {
  display: "flex",
  flexDirection: "column",
  gap: 15,
  width: "100%",

  "> .posts": {
   display: "flex",
   flexDirection: "column",
   gap: 20,
  },
 },

 container: {
  display: "flex",
  gap: 20,
 },

 sort: {
  display: "flex",
  gap: 5,
  alignItems: "center",

  "h3.label": {
   marginRight: 15,
  },

  ".sorting": {
   borderRadius: 9999,
   padding: "8px 14px",
   transition: "background 250ms ease",
   cursor: "pointer",
   display: "flex",
   alignItems: "center",
   gap: 5,

   "&:hover:not(.active)": {
    background: theme.colors.gray[2],
   },

   "&.red.active": {
    background: theme.fn.lighten(theme.colors.red[3], 0.4),

    "> svg": {
     fill: theme.colors.red[7],
    },
   },

   "&.blue.active": {
    background: theme.fn.lighten(theme.colors.blue[3], 0.4),

    "> svg": {
     fill: theme.colors.blue[7],
    },
   },

   "&.green.active": {
    background: theme.fn.lighten(theme.colors.green[3], 0.4),

    "> svg": {
     fill: theme.colors.green[7],
    },
   },
  },
 },
}));

const Home: NextPage<PostsFetching> = ({ posts: _posts }) => {
 const { classes } = useStyles();
 const [isFetching, setIsFetching] = useState(false);
 const [posts, setPosts] = useState(_posts);
 const [postsOffset, setPostsOffset] = useState(15);
 const { open, slug, setOpen, setSlug } = useContext(ShareModalContext);
 const [noMorePosts, setNoMorePosts] = useState(false);

 useEffect(() => {
  const callback = () =>
   requestAnimationFrame(() => {
    if (posts.length < 15 || isFetching || noMorePosts) return () => void 1;

    const scrollPosition =
     document.documentElement.scrollTop + window.innerHeight;
    const documentHeight = document.body.offsetHeight - 1;

    if (scrollPosition >= documentHeight) {
     setIsFetching(true);

     axios.get(`/api/post?skip=${postsOffset}&take=15`).then((res) => {
      setPosts((p) => [...p, ...res.data]);

      // no more posts
      if (res.data.length < 15 && res.data.length>0) {
       setIsFetching(false);
       setNoMorePosts(true);
       return window.removeEventListener("scroll", callback);
      }

      setPostsOffset((p) => p + res.data.length);
      setIsFetching(false);
     });
    }
   });

  window.addEventListener("scroll", callback);

  return () => window.removeEventListener("scroll", callback);
 });


 return (
  <>
   <Head>
    <title>Home - Blog</title>
   </Head>
   <div className={classes.container}>
    <div className={classes.postContainer}>
     <div
      style={{
       display: "flex",
       alignItems: "center",
       justifyContent: "space-between",
      }}
     >
      <Button variant="subtle" size="md">
       Latest
      </Button>
     </div>
     <div className="posts">
      {posts && posts.length ? (
       posts.map((post) => <Post post={post} key={post.postId} />)
      ) : (
       <h3>
        No post yet!&nbsp;
        <Link href="/new">
         <span className="link">Be the first to post</span>
        </Link>
       </h3>
      )}
      {noMorePosts || posts.length < 15 ? (
       <h3 style={{ textAlign: "center" }}>No more posts to display!</h3>
      ) : null}
      {isFetching &&
       !noMorePosts &&
       new Array(2).fill(0).map((_, k) => <PostSkeleton key={k} />)}
     </div>
    </div>
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
};

export default Home;

export async function getServerSideProps(context: GetServerSidePropsContext) {
 const posts = await new Fetching({
  token: context.req.cookies["token"],
 }).fetch({
  take: 15,
 });

 return {
  props: {
   posts: serializeArray(posts),
  },
 };
}
