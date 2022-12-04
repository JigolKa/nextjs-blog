import { createStyles } from "@mantine/core";
import Image from "next/image";
import { forwardRef, MutableRefObject, useEffect, useState } from "react";
import useStore from "../state/store";
import { ellipsis } from "../utils/css";

export interface DropdownProps extends React.ComponentPropsWithRef<"div"> {
 parent: HTMLElement | null;
 active: boolean;
 onHeader?: boolean;
 items: DropdownItem[];
}

export interface DropdownItem {
 title: string;
 description?: string;
 image?: string;
 onClick?: () => void;
}

const useStyles = createStyles((theme) => ({
 root: {
  position: "absolute",
  outline: `2px solid ${theme.colors.blue[7]}`,
  background: "#fff",
  borderRadius: "0 0 15px 15px",
  maxHeight: 300,
  overflow: "auto",
  zIndex: 999,

  "&.not-active": {
   display: "none",
  },
 },

 item: {
  width: "100%",
  display: "flex",
  alignItems: "center",
  padding: "12px 16px",
  gap: 10,
  background: "#fff",
  borderBottom: "1px solid rgba(0, 0, 0, .2)",

  "&:last-of-type": {
   borderBottom: "none",
  },

  "> #image": {
   minHeight: 38,
   minWidth: 38,
   position: "relative",
  },

  "> .content": {
   display: "flex",
   flexDirection: "column",
   gap: 5,

   "> #title": ellipsis(1),

   "> #description": ellipsis(2),
  },
 },
}));

const Dropdown = forwardRef(
 ({ parent, items, active, onHeader, ...rest }: DropdownProps, ref) => {
  const { user } = useStore();
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const [width, setWidth] = useState(0);

  const { classes, cx } = useStyles();

  const updateCoordinates = (parent: HTMLElement) => {
   const rect = parent.getBoundingClientRect();
   setLeft(rect.left);
   setTop(onHeader ? 46 : rect.top);
   setWidth(rect.width);
  };

  useEffect(() => {
   if (!parent) return;

   updateCoordinates(parent);

   window.onresize = function () {
    updateCoordinates(parent);
   };
  }, [parent, user]);

  useEffect(() => {
   if (active) {
    if (!ref) return;

    (
     (ref as MutableRefObject<null>).current as unknown as HTMLElement
    ).scrollTop = 0;
   }
  }, [active]);

  if (!parent || parent.style.display === "none") return null;

  return (
   <div
    className={cx(classes.root, { "not-active": !active })}
    style={{ left: left, top: top, width: width }}
    ref={ref as MutableRefObject<null>}
    {...rest}
   >
    {items.map((v, i) => (
     <div className={classes.item} key={i}>
      {v.image ? (
       <div id="image">
        <Image
         src={v.image}
         quality={60}
         height={38}
         width={38}
         alt={v.title}
        />
       </div>
      ) : null}
      <div className="content">
       <span id="title">
        <b>{v.title}</b>
       </span>
       {v.description ? <span id="description">{v.description}</span> : null}
      </div>
     </div>
    ))}
   </div>
  );
 }
);

Dropdown.displayName = Dropdown.name;

export default Dropdown;
