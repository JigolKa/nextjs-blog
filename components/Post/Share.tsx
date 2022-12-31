import { createStyles } from "@mantine/core";
import { IconType } from "react-icons";
import { GrReddit } from "react-icons/gr";
import { FaFacebookF, FaPinterestP } from "react-icons/fa";
import config from "../../utils/config";
import { AiOutlineTwitter } from "react-icons/ai";
import { HiMail } from "react-icons/hi";
import { BsLinkedin, BsWhatsapp } from "react-icons/bs";
import Link from "next/link";

const useStyles = createStyles(() => ({
 title: {
  fontSize: 18,
  fontWeight: 600,
  marginTop: 15,
 },

 card: {
  paddingBlock: 8,
  width: "calc(100% / 6 - 7.5px)",
  borderWidth: 1,
  borderStyle: "solid",
  display: "flex",
  justifyContent: "center",
  background: "#00000000",
  transition: "background 250ms ease",
  borderRadius: 4,

  "&:hover": {
   background: "#f2f0f09c",
  },
 },

 container: {
  marginTop: 7.5,
  width: "100%",
  display: "flex",
  gap: 7.5,
 },
}));

interface Card {
 icon: IconType;
 url: string;
 color: string;
}

interface Props {
 slug: string;
}

export default function Share({ slug }: Props) {
 const { classes } = useStyles();

 const getUrl = (base: string) => `${base}${config.BASE_URL}/post/${slug}`;

 const cards: Card[] = [
  {
   icon: FaFacebookF,
   url: getUrl("http://www.facebook.com/sharer/sharer.php?u="),
   color: "rgb(62, 91, 152)",
  },
  {
   icon: AiOutlineTwitter,
   url: getUrl("http://twitter.com/intent/tweet?url="),
   color: "rgb(77, 167, 222)",
  },
  {
   icon: GrReddit,
   url: getUrl("http://www.reddit.com/submit?url="),
   color: "rgb(231, 74, 30)",
  },
  {
   icon: FaPinterestP,
   url: getUrl("http://pinterest.com/pin/create/button/?url="),
   color: "rgb(201, 38, 25)",
  },
  {
   icon: HiMail,
   url: getUrl("mailto:?subject="),
   color: "rgb(0, 0, 0)",
  },
  {
   icon: BsLinkedin,
   url: getUrl("https://www.linkedin.com/cws/share?url="),
   color: "rgb(51, 113, 183)",
  },
  {
   icon: BsWhatsapp,
   url: getUrl("https://api.whatsapp.com/send?text="),
   color: "rgb(32, 176, 56)",
  },
 ];

 return (
  <div>
   <h4 className={classes.title}>Share:</h4>
   <div className={classes.container}>
    {cards.map((c, i) => (
     <Link
      className={classes.card}
      style={{ borderColor: c.color }}
      target="_blank"
      href={c.url}
      key={i}
     >
      <h1></h1>
      <div>
       <c.icon color={c.color} />
      </div>
     </Link>
    ))}
   </div>
  </div>
 );
}
