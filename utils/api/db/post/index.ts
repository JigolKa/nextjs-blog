import prisma from "../../../../prisma/instance";
import { addToArray, removeFromArray } from "../../../arrays";

export const userWithoutPassword = {
 userId: true,
 username: true,
 email: true,
 createdAt: true,
 permissions: true,
 profilePicture: true,
 posts: true,
 followedBy: true,
 followedByIDs: true,
 following: true,
 followingIDs: true,
 activated: true,
 likedIDs: true,
 liked: true,
 dislikedIDs: true,
 disliked: true,
};

//? QUESTION: do request to db to grab user/post
//? OR pass only necessary user's/post's data through post body

export async function likePost(userId: string, postId: string) {
 const user = await prisma.user.findFirst({
  where: {
   userId: userId,
  },
 });
 const post = await prisma.post.findFirst({
  where: {
   postId: postId,
  },
 });
 if (!post || !user) return null;

 const disliked = post.dislikedByIDs.includes(user.userId);
 const liked = post.likedByIDs.includes(user.userId);

 const updatedPost = await prisma.post.update({
  where: {
   postId: post.postId,
  },
  data: {
   likedByIDs: {
    set: liked
     ? removeFromArray(post.likedByIDs, (v) => v !== user.userId)
     : addToArray(post.likedByIDs, user.userId),
   },
   dislikedByIDs: {
    set: disliked
     ? removeFromArray(post.dislikedByIDs, (v) => v !== user.userId)
     : post.dislikedByIDs,
   },
  },
  include: {
   author: {
    select: {
     ...userWithoutPassword,
    },
   },
  },
 });

 const updatedUser = await prisma.user.update({
  where: {
   userId: user.userId,
  },
  data: {
   likedIDs: {
    set: liked
     ? [...user.likedIDs.filter((v) => v !== post.postId)]
     : [...user.likedIDs, post.postId],
   },
   dislikedIDs: {
    set: disliked
     ? [...user.dislikedIDs.filter((v) => v !== post.postId)]
     : user.dislikedIDs,
   },
  },
 });

 return { post: updatedPost, user: updatedUser };
}

export async function dislikePost(userId: string, postId: string) {
 const user = await prisma.user.findFirst({
  where: {
   userId: userId,
  },
 });
 const post = await prisma.post.findFirst({
  where: {
   postId: postId,
  },
 });
 if (!post || !user) return null;

 const disliked = post.dislikedByIDs.includes(user.userId);
 const liked = post.likedByIDs.includes(user.userId);

 const updatedPost = await prisma.post.update({
  where: {
   postId: post.postId,
  },
  data: {
   likedByIDs: {
    set: liked
     ? removeFromArray(post.likedByIDs, (v) => v !== user.userId)
     : post.likedByIDs,
   },
   dislikedByIDs: {
    set: disliked
     ? removeFromArray(post.dislikedByIDs, (v) => v !== user.userId)
     : addToArray(post.dislikedByIDs, user.userId),
   },
  },
  include: {
   author: {
    select: {
     ...userWithoutPassword,
    },
   },
  },
 });

 const updatedUser = await prisma.user.update({
  where: {
   userId: user.userId,
  },
  data: {
   likedIDs: {
    set: liked
     ? removeFromArray(user.likedIDs, (v) => v !== post.postId)
     : user.likedIDs,
   },
   dislikedIDs: {
    set: disliked
     ? removeFromArray(user.dislikedIDs, (v) => v !== post.postId)
     : addToArray(user.dislikedIDs, post.postId),
   },
  },
 });

 return { post: updatedPost, user: updatedUser };
}
