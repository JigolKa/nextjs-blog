import { createStyles } from "@mantine/core";
import type { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { FullPost, PostsFetching } from "..";
import Post from "../components/Home/Post";
import getPosts from "../utils/feed";
import useStringData from "../utils/strings/useStringData";

const useStyles = createStyles(() => ({
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
}));

const Home: NextPage<PostsFetching> = ({ _posts }) => {
 const posts = useStringData<FullPost[]>(_posts);
 const { classes } = useStyles();

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
     </div>
    </div>
   </div>
  </>
 );
};

export default Home;

export async function getServerSideProps(context: GetServerSidePropsContext) {
 return {
  props: {
   _posts: JSON.stringify(await getPosts({ context: context })),
  },
 };
}
