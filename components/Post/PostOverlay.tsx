import { createStyles, Divider } from "@mantine/core";
import { Post, Topic, User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { forwardRef, MutableRefObject } from "react";
import {
 AiOutlineDislike,
 AiOutlineLike,
 AiOutlineShareAlt,
} from "react-icons/ai";
import { Booleanish } from "../..";
import membership from "../../utils/strings/membership";
import { ActionType } from "../..";
import TransitionalButton from "../Home/TransitionalButton";

export interface PostOverlayProps {
 post: Post & {
  author: User;
  topics: Topic[];
 };
 liked: boolean;
 disliked: boolean;
 // eslint-disable-next-line
 likePost: (action: ActionType) => Promise<void>;
}

const useStyles = createStyles((theme) => ({
 container: {
  position: "fixed",
  bottom: 20,
  left: "50%",
  transform: "translateX(-50%)",
  padding: "8px 16px",
  borderRadius: 9999,
  display: "flex",
  gap: 10,
  alignItems: "center",
  background: theme.colors.gray[2],
  color: "#000",
  boxShadow: theme.shadows.sm,

  ".icon": {
   background: "#fff",
   "> svg": {
    color: "#000",
   },
  },
 },

 picture: {
  borderRadius: 999,
  overflow: "hidden",
  maxHeight: 38,
  maxWidth: 38,
  cursor: "pointer",
 },

 user: {
  display: "flex",
  alignItems: "center",
  fontWeight: 500,
  gap: 10,

  "&:hover": {
   textDecoration: "underline",
  },
 },
}));

const PostOverlay = forwardRef(
 ({ post, liked, disliked, likePost }: PostOverlayProps, ref) => {
  const { classes } = useStyles();

  return (
   <div className={classes.container} ref={ref as MutableRefObject<null>}>
    <TransitionalButton
     hover={{ x: "-17.5%", y: "-17.5%" }}
     onClick={() => likePost("like")}
     active={liked.toString() as Booleanish}
     className="icon"
    >
     <AiOutlineLike size={20} />
    </TransitionalButton>
    {post.likedByIDs.length}
    <TransitionalButton
     hover={{ x: "10%", y: "10%" }}
     gradient="linear-gradient(225deg, #0093E9 0%, #20D8E7 100%)"
     active={disliked.toString() as Booleanish}
     onClick={() => likePost("dislike")}
     className="icon"
    >
     <AiOutlineDislike size={20} />
    </TransitionalButton>
    {post.dislikedByIDs.length}
    <TransitionalButton
     gradient="linear-gradient(45deg, #44c47d 0%, #FFFB7D 100%)"
     hover={{ x: "17.5%", y: "-17.5%" }}
     active={null}
     className="icon"
    >
     <AiOutlineShareAlt size={20} />
    </TransitionalButton>
    <Divider size="sm" orientation="vertical" />
    <Link href={`/user/${post.author.username}`}>
     <div className={classes.user}>
      <div className={classes.picture}>
       <Image
        height={38}
        width={38}
        src={post.author.profilePicture}
        alt={`${membership(post.author.username)} profile picture`}
       />
      </div>
      <h4>{post.author.username}</h4>
     </div>
    </Link>
   </div>
  );
 }
);

PostOverlay.displayName = PostOverlay.name;

export default PostOverlay;
