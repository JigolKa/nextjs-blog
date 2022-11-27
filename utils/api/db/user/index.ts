import prisma from "../../../../prisma/instance";
import { addToArray, removeFromArray } from "../../../arrays";

//? QUESTION: do request to db to grab user/post
//? OR pass only necessary user's/post's data through post body

export async function followUser(userIdToFollow: string, sourceUserId: string) {
 const userToFollow = await prisma.user.findFirst({
  where: {
   userId: userIdToFollow,
  },
 });
 const sourceUser = await prisma.user.findFirst({
  where: {
   userId: sourceUserId,
  },
 });
 if (!userToFollow || !sourceUser) return null;

 const followed = sourceUser.followingIDs.includes(userToFollow.userId);

 const updatedSourceUser = await prisma.user.update({
  where: {
   userId: sourceUser.userId,
  },
  data: {
   followingIDs: {
    set: followed
     ? removeFromArray(
        sourceUser.followingIDs,
        (v) => v !== userToFollow.userId
       )
     : addToArray(sourceUser.followingIDs, userToFollow.userId),
   },
  },
 });

 const updatedUserToFollow = await prisma.user.update({
  where: {
   userId: userToFollow.userId,
  },
  data: {
   followedByIDs: {
    set: followed
     ? removeFromArray(
        userToFollow.followedByIDs,
        (v) => v !== sourceUser.userId
       )
     : addToArray(userToFollow.followedByIDs, sourceUser.userId),
   },
  },
  include: {
   followedBy: true,
   following: true,
   posts: true,
  },
 });

 return {
  sourceUser: updatedSourceUser,
  targetUser: updatedUserToFollow,
 };
}
