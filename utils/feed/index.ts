import { GetServerSidePropsContext } from "next";
import prisma from "../../prisma/instance";
import decodeToken, { DecodeTokenSuccess } from "../api/auth/decodeToken";
import _ from "underscore";
import { User } from "@prisma/client";

async function _getPostsWithoutUser(
 pass: number = 0,
 limit: number = 15,
 not?: string[]
) {
 return await prisma.post.findMany({
  where: {
   NOT: {
    postId: {
     in: not || undefined,
    },
   },
  },
  include: {
   author: true,
   likedBy: true,
   dislikedBy: true,
   topics: true,
  },
  take: limit,
  skip: pass,
 });
}

export interface getPostsParams {
 context?: GetServerSidePropsContext;
 token?: string;
 user?: User & {
  following: User[];
 };
}

export default async function getPosts(
 cookie: getPostsParams,
 pass: number = 0,
 limit: number = 15,
 not?: string[]
) {
 const token = cookie.context
  ? cookie.context.req.cookies["token"]
  : cookie.token;

 if (cookie.user) {
  if (!_.isEmpty(cookie.user.following)) {
   return await takeFollowing(cookie.user, pass, limit, not);
  }
 }

 const result = decodeToken({ token: token });

 if (Object.keys(result).includes("token")) {
  const { decoded } = result as DecodeTokenSuccess;
  const { userId } = decoded.data;

  const user = await prisma.user.findFirst({
   where: {
    userId: userId,
   },
   include: {
    following: true,
   },
  });

  if (!user) return await _getPostsWithoutUser(pass, limit, not);

  if (!_.isEmpty(user.following)) {
   return await takeFollowing(user, pass, limit, not);
  }

  return await _getPostsWithoutUser(pass, limit, not);
 }

 return await _getPostsWithoutUser(pass, limit, not);
}

async function takeFollowing(
 user: User & { following: User[] },
 pass: number,
 limit: number,
 not?: string[]
) {
 const posts = await prisma.post.findMany({
  where: {
   author: {
    userId: {
     in: [...user.following.map((user) => user.userId), user.userId],
    },
   },
   NOT: {
    postId: {
     in: not || undefined,
    },
   },
  },
  take: limit,
  skip: pass,
  include: {
   author: true,
   likedBy: true,
   dislikedBy: true,
   topics: true,
  },
 });

 return posts || (await _getPostsWithoutUser(pass, limit, not));
}
