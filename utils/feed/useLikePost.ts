import { Post, Topic, User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/router";
import {
 Dispatch,
 SetStateAction,
 useContext,
 useEffect,
 useState,
} from "react";
import { toast } from "react-toastify";
import { FullPost } from "../..";
import { PostsContext } from "../../contexts/PostsContext";
import { useAppSelector } from "../../state/hooks";
import { ActionType } from "../../";

export default function useLikePost(
 _post: Post & { author: User; topics: Topic[] },
 refreshFeed: boolean = true,
 // eslint-disable-next-line
 callback?: (post: FullPost, index: number) => any
) {
 const [liked, setLiked] = useState(false);
 const [disliked, setDisliked] = useState(false);
 const { user } = useAppSelector((s) => s.user);
 const [post, setPost] = useState<typeof _post>();
 const router = useRouter();
 const {
  feed: { posts, setPosts },
 } = useContext(PostsContext);

 useEffect(() => setPost(_post), [_post]);

 useEffect(() => {
  if (user && post) {
   if (post.likedByIDs.includes(user.userId)) {
    setLiked(true);
   }

   if (post.dislikedByIDs.includes(user.userId)) {
    setDisliked(true);
   }

   return;
  } else {
   setLiked(false);
   setDisliked(false);
  }

  return () => {
   setLiked(false);
   setDisliked(false);
  };
 }, [user, post]);

 const functions: {
  // eslint-disable-next-line
  [key in ActionType]: Dispatch<SetStateAction<boolean>>;
 } = {
  like: setLiked,
  dislike: setDisliked,
 };

 const likePost = async (action: ActionType) => {
  if (!post) return;
  if (!user) {
   router.push("/login");
   return;
  }

  if (action === "dislike" && liked) {
   setLiked(false);
  } else if (action === "like" && disliked) {
   setDisliked(false);
  }

  functions[action]((p) => !p);

  try {
   const response = await axios.post(`/api/post/${post.postId}/${action}`, {
    userId: user.userId,
   });
   if (response.status === 200) {
    const index = posts.findIndex((p) => p.postId === post.postId);

    setPost(response.data.post);

    callback && callback(response.data.post, index);

    if (refreshFeed && setPosts) {
     setPosts((p) => {
      const arr = [...p];
      arr[index] = response.data.post;

      return arr;
     });
    }
   }
  } catch (error: any) {
   toast(error ? error.response.data.error : error);
  }
 };

 return {
  liked,
  setLiked,
  disliked,
  setDisliked,
  likePost,
  post,
  user,
 };
}
