import { User, Post as PostType } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";
import { FullPost } from "../..";
import Post from "../../components/Home/Post";
import prisma from "../../prisma/instance";
import { removeKeys, serializeArray } from "../../utils/json";

interface Props {
 posts: Omit<FullPost, "comments">[];
 topic: string;
}

export default function Topic({ posts, topic }: Props) {
 return (
  <>
   <Head>
    <title>Posts with topic {topic} - Blog</title>
   </Head>
   {posts.length ? (
    <>
     <h3 style={{ marginBottom: 15 }}>Posts with topic {topic}</h3>
     {posts.map((p) => (
      <Post
       post={
        removeKeys<typeof p>(p, ["likedBy", "dislikedBy"]) as PostType & {
         author: User;
        }
       }
       key={p.postId}
      />
     ))}
    </>
   ) : (
    <h3>No posts with topic {topic}</h3>
   )}
  </>
 );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
 const { topic } = context.params as ParsedUrlQuery;

 const posts = await prisma.post.findMany({
  where: {
   topics: {
    has: topic as string,
   },
  },
  include: {
   author: true,
   dislikedBy: true,
   likedBy: true,
  },
 });

 return {
  props: {
   posts: serializeArray(posts),
   topic: topic as string,
  },
 };
}
