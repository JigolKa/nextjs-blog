import { createStyles } from "@mantine/core";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { SearchContext } from "../../contexts/SearchContext";

export interface HeaderSearchProps
 extends React.ComponentPropsWithoutRef<"input"> {
 value: string;
 forContainer?: React.ComponentPropsWithoutRef<"div">;
}

const useStyles = createStyles((theme, { active }: { active: boolean }) => ({
 header: {
  width: "50vw",
  borderRadius: 999,
  border: "1px solid rgba(0,0,0,.2)",
  display: "flex",
  alignItems: "center",
  position: "relative",
  paddingRight: 16,
  outline: active ? `2px solid ${theme.colors.blue[7]}` : "none",

  "> svg": {
   cursor: "pointer",
  },

  "> input": {
   width: "calc(100% - 26px)",
   border: "none",
   borderRadius: 999,
   padding: "6px 18px",

   "&:focus": {
    outline: "none",
   },
  },
 },
}));

export default function HeaderSearch({
 value,
 onChange,
 forContainer,
 ...rest
}: HeaderSearchProps) {
 const { active, setActive, inputRef } = useContext(SearchContext);
 const { classes, cx } = useStyles({ active });
 const router = useRouter();

 useEffect(() => {
  if (!inputRef) return;
  window.onkeydown = (e) => {
   if (active && e.key === "Enter" && value.length < 1) {
    // router.push(`/search?q=${encodeURIComponent(value)}`);
    router.push("/501");
   }
  };
 });

 return (
  <div
   className={
    rest.className ? cx(rest.className, classes.header) : classes.header
   }
   {...forContainer}
   ref={inputRef}
   onClick={() => setActive && setActive(true)}
  >
   <input type="text" value={value} onChange={onChange} {...rest} />
   <AiOutlineSearch size={26} />
  </div>
 );
}
