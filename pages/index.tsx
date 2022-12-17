import { createStyles } from "@mantine/core";
import axios from "axios";
import type { GetServerSidePropsContext, NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PostsFetching } from "..";
import PostSkeleton from "../components/Home/PostSkeleton";
import getPosts from "../utils/feed";
import { serializeArray } from "../utils/json";
import { SortingAlgorithm } from "../utils/sorting";

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
 const [sort] = useState<SortingAlgorithm>("hot");
 const [hasChangedSort] = useState(false);

 useEffect(() => setPosts(_posts), [_posts]);

 useEffect(() => {
  const callback = () =>
   requestAnimationFrame(() => {
    if (posts.length < 15 || isFetching) return () => void 1;

    const scrollPosition =
     document.documentElement.scrollTop + window.innerHeight;
    const documentHeight = document.body.offsetHeight - 1;

    if (scrollPosition >= documentHeight) {
     setIsFetching(true);

     axios
      .get(`/api/post?sort=${sort}&skip=${postsOffset}&take=15`)
      .then((res) => {
       if (Number(res.data) !== -1) setPosts((p) => [...p, ...res.data]);
       setPostsOffset((p) => p + 15);
       setIsFetching(false);
      });
    }
   });

  window.addEventListener("scroll", callback);

  return () => window.removeEventListener("scroll", callback);
 });

 useEffect(() => {
  if (!hasChangedSort) return;

  setIsFetching(true);

  axios.get(`/api/post?sort=${sort}&take=15`).then((res) => {
   if (Number(res.data) !== -1) setPosts(res.data);
   setIsFetching(false);
  });
 }, [sort]);

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
      <h3>Posts</h3>
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
      {posts.length < 15 && (
       <h3 style={{ textAlign: "center" }}>No more posts to display!</h3>
      )}
      {isFetching &&
       new Array(2).fill(0).map((_, k) => <PostSkeleton key={k} />)}
     </div>
    </div>
   </div>
  </>
 );
};

export default Home;

export async function getServerSideProps(context: GetServerSidePropsContext) {
 const posts = await getPosts(
  { context: context },
  (context.req.cookies["sort"] as SortingAlgorithm) || "hot"
 );

 return {
  props: {
   posts: serializeArray(posts),
  },
 };
}
