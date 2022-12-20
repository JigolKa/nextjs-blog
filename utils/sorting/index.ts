import { Post, User } from "@prisma/client";
import { userWithoutPasswordAndPosts } from "../api/db/user";
import { getUnixTime } from "../time";
import prisma from "../../prisma/instance";

const epoch = new Date(1970, 1, 1);

export const epoch_seconds = (date: Date) => {
 const diff = Math.abs(date.getTime() - epoch.getTime());
 return diff * 1000;
};

type PostType = Post & {
 author: Omit<User, "password" | "posts">;
};

function hot(a: PostType, b: PostType) {
 const upvotesOffsetB = b.likedByIDs.length - b.dislikedByIDs.length;
 const upvotesOffsetA = a.likedByIDs.length - a.dislikedByIDs.length;

 const first = {
  order: Math.log(Math.max(Math.abs(upvotesOffsetA), 1)),
  sign: upvotesOffsetA > 0 ? 1 : upvotesOffsetA < 0 ? -1 : 0,
 };

 const second = {
  order: Math.log(Math.max(Math.abs(upvotesOffsetB), 1)),
  sign: upvotesOffsetB > 0 ? 1 : upvotesOffsetB < 0 ? -1 : 0,
 };

 const scoreA = (
  first.sign * first.order +
  epoch_seconds(new Date(a.createdAt)) -
  1134028003 / 45000
 ).toFixed(7);

 const scoreB = (
  second.sign * second.order +
  epoch_seconds(new Date(b.createdAt)) -
  1134028003 / 45000
 ).toFixed(7);

 if (scoreA < scoreB) return -1;
 if (scoreA > scoreB) return 1;

 return 0;
}

export type SortingAlgorithm = "hot" | "new" | "top";

export default function sortPosts(
 posts: PostType[],
 algorithm: SortingAlgorithm
) {
 // eslint-disable-next-line
 const algorithms: { [key in SortingAlgorithm]: PostType[] } = {
  hot: posts.sort(hot),
  new: posts.sort(
   (a, b) => getUnixTime(a.createdAt) - getUnixTime(b.createdAt)
  ),
  top: posts.sort((a, b) => b.likedByIDs.length - a.likedByIDs.length),
 };

 return algorithms[algorithm];
}

export async function fetchSortedPosts(
 take: number,
 skip: number,
 sort: SortingAlgorithm,
 notIn: string[]
) {
 const posts: PostType[] = await prisma.post.findMany({
  where: {
   authorId: {
    not: {
     in: notIn || undefined,
    },
   },
  },
  include: {
   author: {
    select: {
     ...userWithoutPasswordAndPosts,
    },
   },
  },
  take: take || 15,
  skip: skip || 0,
 });

 return sortPosts(posts, sort);
}
