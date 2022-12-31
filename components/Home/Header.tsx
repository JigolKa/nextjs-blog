import { createStyles, Tooltip } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import Link from "next/link";
import { IconType } from "react-icons";
import { SearchContext } from "../../contexts/SearchContext";
import HeaderSearch from "./HeaderSearch";
import Button from "../Button";
import Image from "next/image";
import { useRouter } from "next/router";
import useAuth from "../../utils/authentication/useAuth";
import useStore from "../../state/store";

const useStyles = createStyles((theme) => ({
 root: {
  height: 56,
  width: "100vw",
  borderBottom: "1px solid rgba(0, 0, 0, .2)",
  display: "flex",
  paddingInline: 16,
  alignItems: "center",
  justifyContent: "space-between",
 },

 userContainer: {
  display: "flex",
  alignItems: "center",
  gap: 10,
 },

 user: {
  display: "flex",
  alignItems: "center",
  gap: 10,

  ".picture": {
   maxHeight: 38,
   maxWidth: 38,
   borderRadius: 9999,
   overflow: "hidden",
   position: "relative",
  },

  "&:hover": {
   textDecoration: "underline",
  },
 },

 divider: {
  height: "calc(56px - 24px)",
  width: 2,
  background: "rgba(0,0,0,.4)",
  borderRadius: 4,
 },

 icon: {
  height: 36,
  width: 36,
  borderRadius: 9999,
  padding: 8,
  transition: "background 150ms ease-in-out",
  opacity: 0.85,
  cursor: "pointer",

  "&:hover": {
   background: theme.fn.lighten(theme.colors.blue[1], 0.2),
  },
 },

 search: {
  [`@media screen and (max-width: 992px)`]: {
   display: "none",
  },
 },

 iconContainer: {
  height: 36,
  display: "flex",
  alignItems: "center",
 },
}));

export interface HeaderLink {
 icon: IconType;
 alt: string;
 onClick?: () => void;
}

export default function Header() {
 const { classes } = useStyles();
 const [search, setSearch] = useState("");
 const { setActive, inputRef } = useContext(SearchContext);
 const { user } = useStore();
 const router = useRouter();
 const { logout } = useAuth();

 const links: HeaderLink[] = [
  {
   icon: AiOutlinePlus,
   alt: "Create",
   onClick: () => router.push("/new"),
  },
  {
   icon: FiLogOut,
   alt: "Log out",
   onClick: () => logout(),
  },
 ];

 useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
   if (!inputRef) return;

   if (inputRef.current && !(inputRef.current as any).contains(event.target)) {
    if (setActive) setActive(false);
   }
  }

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
   document.removeEventListener("mousedown", handleClickOutside);
  };
 }, [inputRef]);

 return (
  <div className={classes.root}>
   <Link href="/">
    <h2>Blog</h2>
   </Link>
   <HeaderSearch
    type="text"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    forContainer={{ id: "search-input" }}
    placeholder="Search"
    className={classes.search}
   />

   {/* <Dropdown
    active={active}
    onHeader
    ref={dropdownRef}
    items={[
     {
      title: "Hello",
      description:
       "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quaerat placeat corrupti suscipit ducimus repellendus non in, sapiente numquam consectetur asperiores neque iusto enim minus aperiam beatae ut incidunt, magnam impedit.",
      image:
       "https://assets2.razerzone.com/images/pnx.assets/618c0b65424070a1017a7168ea1b6337/razer-wallpapers-page-hero-mobile.jpg",
     },
     {
      title: "Hello",
      description:
       "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quaerat placeat corrupti suscipit ducimus repellendus non in, sapiente numquam consectetur asperiores neque iusto enim minus aperiam beatae ut incidunt, magnam impedit.",
      image: "https://webgate.fr/bia/QCM/apple-touch-icon.png",
     },
     {
      title: "Hello",
      description:
       "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quaerat placeat corrupti suscipit ducimus repellendus non in, sapiente numquam consectetur asperiores neque iusto enim minus aperiam beatae ut incidunt, magnam impedit.",
      image: "https://webgate.fr/bia/QCM/apple-touch-icon.png",
     },
     {
      title: "Hello",
      description:
       "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quaerat placeat corrupti suscipit ducimus repellendus non in, sapiente numquam consectetur asperiores neque iusto enim minus aperiam beatae ut incidunt, magnam impedit.",
      image: "https://webgate.fr/bia/QCM/apple-touch-icon.png",
     },
     {
      title: "Hello",
      description:
       "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quaerat placeat corrupti suscipit ducimus repellendus non in, sapiente numquam consectetur asperiores neque iusto enim minus aperiam beatae ut incidunt, magnam impedit.",
      image: "https://webgate.fr/bia/QCM/apple-touch-icon.png",
     },
    ]}
   /> */}

   {user ? (
    <div className={classes.userContainer}>
     <div style={{ display: "flex" }}>
      {links.map((v, i) => (
       <Tooltip label={v.alt} withArrow key={i}>
        <div className={classes.iconContainer} key={i} onClick={v.onClick}>
         <v.icon className={classes.icon} />
        </div>
       </Tooltip>
      ))}
     </div>
     <div className={classes.divider}></div>
     <Link href={`/user/${user.username}`}>
      <div className={classes.user}>
       <span className="username">{user.username}</span>
       <div className="picture">
        <Image
         height={38}
         width={38}
         src={user.profilePicture}
         alt="Profile picture"
        />
       </div>
      </div>
     </Link>
    </div>
   ) : (
    <div style={{ display: "flex", gap: 15 }}>
     <Link href="/signup">
      <Button borderRadius={999}>Sign up</Button>
     </Link>
     <Link href="/login">
      <Button variant="outline" borderRadius={999}>
       Log in
      </Button>
     </Link>
    </div>
   )}
  </div>
 );
}
