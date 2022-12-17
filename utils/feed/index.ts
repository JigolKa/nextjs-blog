import { GetServerSidePropsContext } from "next";
import prisma from "../../prisma/instance";
import decodeToken, { DecodeTokenSuccess } from "../api/auth/decodeToken";
import _ from "underscore";
import { User } from "@prisma/client";
import { userWithoutPassword } from "../api/db/user";
import { fetchSortedPosts, SortingAlgorithm } from "../sorting";

async function _getPostsWithoutUser(
 pass: number = 0,
 limit: number = 15,
 sort: SortingAlgorithm = "hot",
 notIn: string[] = []
) {
 return await fetchSortedPosts(limit, pass, sort, notIn);
}

export interface getPostsParams {
 context?: GetServerSidePropsContext;
 token?: string;
 user?: Omit<User, "password"> & {
  following: Omit<User, "password">[];
 };
}

export default async function getPosts(
 cookie: getPostsParams,
 sort: SortingAlgorithm,
 notIn: string[] = [],
 pass: number = 0,
 limit: number = 15
) {
 const token = cookie.context
  ? cookie.context.req.cookies["token"]
  : cookie.token;

 if (cookie.user) {
  if (!_.isEmpty(cookie.user.following)) {
   return await takeFollowing(cookie.user, pass, limit, sort);
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
   select: {
    ...userWithoutPassword,
   },
  });

  if (!user) return await _getPostsWithoutUser(pass, limit, sort, notIn);

  if (!_.isEmpty(user.following)) {
   return await takeFollowing(user, pass, limit, sort);
  }

  return await _getPostsWithoutUser(pass, limit, sort, notIn);
 }

 return await _getPostsWithoutUser(pass, limit, sort, notIn);
}

async function takeFollowing(
 user: Omit<User, "password"> & {
  following: Omit<User, "password">[];
 },
 pass: number,
 limit: number,
 sort: SortingAlgorithm,
 notIn: string[] = []
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
     in: notIn || undefined,
    },
   },
  },
  take: limit,
  skip: pass,
  include: {
   author: {
    select: {
     ...userWithoutPassword,
    },
   },
  },
 });

 return posts || (await _getPostsWithoutUser(pass, limit, sort, notIn));
}
