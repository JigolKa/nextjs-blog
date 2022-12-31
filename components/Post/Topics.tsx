import { createStyles } from "@mantine/core";
import Link from "next/link";
import { getDarkColor } from "../../utils/css";

interface Props {
 topics: string[];
}

const useStyles = createStyles(() => ({
 topics: {
  display: "flex",
  gap: 10,
 },
}));

export default function Topics({
 topics,
 ...rest
}: Props & React.ComponentPropsWithRef<"div">) {
 const { classes } = useStyles();

 if (!topics) return null;

 return (
  <div className={classes.topics} {...rest}>
   {topics.map((t) => (
    <Link key={t} href={`/topic/${t}`}>
     <span
      style={{
       fontSize: 14,
       color: getDarkColor(),
      }}
     >
      #{t}
     </span>
    </Link>
   ))}
  </div>
 );
}
