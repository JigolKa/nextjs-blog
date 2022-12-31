import { Avatar, createStyles } from "@mantine/core";
import { User } from "@prisma/client";
import { membership } from "../../utils/strings";
import { ellipsis } from "../../utils/css";
import Link from "next/link";

const useStyles = createStyles((theme) => ({
 container: {
  width: "100%",
  padding: 12,
  background: theme.fn.lighten(theme.colors.gray[1], 0.3),
  borderRadius: 4,
  display: "flex",
  gap: 30,

  "&:hover .username": {
   color: theme.colors.blue[6],
  },
 },

 meta: {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-evenly",

  p: ellipsis(2),

  ".username": {
   fontSize: 22,
   fontWeight: 600,
  },
 },
}));

interface Props {
 user: User;
}

export default function UserProfile({ user }: Props) {
 const { classes } = useStyles();

 return (
  <Link href={`/user/${user.username}`}>
   <div className={classes.container}>
    <Avatar
     src={user.profilePicture}
     alt={`${membership(user.username)} profile picture`}
     radius={999}
     size={72}
    />
    <div className={classes.meta}>
     <h2 className="username">{user.username}</h2>
     {user.biography ? <p>{user.biography}</p> : <i>No biography</i>}
    </div>
   </div>
  </Link>
 );
}
