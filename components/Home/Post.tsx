import { createStyles, Tooltip } from "@mantine/core";
import { Post, Topic, User } from "@prisma/client";
import { format, formatDistance } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { forwardRef, MutableRefObject } from "react";
import {
 AiOutlineDislike,
 AiOutlineLike,
 AiOutlineShareAlt,
} from "react-icons/ai";
import { Booleanish } from "../..";
import { ellipsis } from "../../utils/css";
import useLikePost from "../../utils/feed/useLikePost";
import TransitionalButton from "./TransitionalButton";

export interface PostProps {
 post: Post & {
  author: User;
  topics: Topic[];
 };
 dontRefreshFeed?: boolean;
 dontShowMeta?: boolean;
}

const useStyles = createStyles((theme) => ({
 container: {
  width: "100%",
  padding: 12,
  background: theme.fn.lighten(theme.colors.gray[1], 0.5),
  boxShadow: theme.shadows.xs,
  borderRadius: 4,
  transition: "all 200ms ease",
  transform: "scale(1)",

  "&:hover": {
   boxShadow: theme.shadows.sm,
   transform: "scale(1.01)",
   background: theme.fn.lighten(theme.colors.gray[1], 0.45),
  },

  "> .actions": {
   display: "flex",
   alignItems: "center",
   gap: 10,
   marginTop: 12.5,
  },

  "> .content": {
   ".title": ellipsis(1, {
    fontWeight: 600,
    fontSize: 22,
    marginBottom: 5,
    maxWidth: "max-content",
   }),
   ".description": ellipsis(4, {
    color: theme.colors.gray[6],
    maxWidth: "100%",
   }),
  },

  ".author": {
   display: "flex",
   alignItems: "center",
   gap: 10,
   position: "relative",

   span: {
    color: theme.colors.gray[6],
    fontSize: 15,
   },

   ".postedAt": {
    cursor: "pointer",
   },

   ".profilePicture": {
    minHeight: 24,
    maxHeight: 24,
    minWidth: 24,
    position: "relative",
    borderRadius: 9999,
    overflow: "hidden",
    top: 1,
   },
  },
 },

 dot: {
  marginInline: 10,
 },
}));

const Post = forwardRef(
 ({ post: _post, dontRefreshFeed, dontShowMeta }: PostProps, ref) => {
  const { classes } = useStyles();
  const { likePost, liked, disliked, post } = useLikePost(
   _post,
   !dontRefreshFeed
  );

  if (post) {
   return (
    <div className={classes.container} ref={ref as MutableRefObject<null>}>
     {!dontShowMeta && (
      <div className="flex:post">
       <Link href={`/user/${post.author.username}`} className="author">
        <div className="profilePicture">
         <Image
          quality={50}
          sizes="100%"
          width={24}
          height={24}
          src={post.author.profilePicture}
          alt="Profile picture"
         />
        </div>
        <span>{post.author.username}</span>
       </Link>
       <div className={classes.dot}>•</div>
       <Tooltip
        position="top"
        label={format(new Date(post.createdAt), "H:m, MMMM dd yyyy, OOO")}
        withArrow
       >
        <span className="postedAt">
         {formatDistance(new Date(post.createdAt), new Date(), {
          addSuffix: true,
         })}
        </span>
       </Tooltip>
      </div>
     )}
     <div className="content">
      <Link className="fix-width" href={`/post/${post.slug}`}>
       <span className="title">{post.title}</span>
      </Link>
      <Link className="fix-width" href={`/post/${post.slug}`}>
       <p className="description">{post.content}</p>
      </Link>
     </div>
     <div className="actions">
      <TransitionalButton
       hover={{ x: "-22.5%", y: "-22.5%" }}
       onClick={() => likePost("like")}
       active={liked.toString() as Booleanish}
      >
       <AiOutlineLike size={20} />
      </TransitionalButton>
      {post.likedByIDs.length}
      <TransitionalButton
       hover={{ x: "15%", y: "15%" }}
       gradient="linear-gradient(225deg, #0093E9 0%, #20D8E7 100%)"
       active={disliked.toString() as Booleanish}
       onClick={() => likePost("dislike")}
      >
       <AiOutlineDislike size={20} />
      </TransitionalButton>
      {post.dislikedByIDs.length}
      <TransitionalButton
       gradient="linear-gradient(45deg, #44c47d 0%, #FFFB7D 100%)"
       hover={{ x: "22.5%", y: "-22.5%" }}
       active={null}
      >
       <AiOutlineShareAlt size={20} />
      </TransitionalButton>
     </div>
    </div>
   );
  }

  return null;
 }
);

Post.displayName = Post.name;

export default Post;
