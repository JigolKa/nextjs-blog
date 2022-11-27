import { createStyles } from "@mantine/core";
import { ComponentPropsWithoutRef, forwardRef, MutableRefObject } from "react";
import { Booleanish } from "../..";

const useStyles = createStyles(
 (
  theme,
  { size, hover, gradient, layerBackground }: TransitionalButtonProps
 ) => ({
  container: {
   height: size ? size : 38,
   width: size ? size : 38,
   borderRadius: 999,
   backgroundImage: gradient
    ? gradient
    : "linear-gradient(to top right, #fa709a 0%, #fee140 100%)",
   cursor: "pointer",

   position: "relative",

   "> *": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    width: size ? size : 40,
    height: size ? size : 40,
    borderRadius: 999,
    background: layerBackground ? layerBackground : theme.colors.gray[1],
    position: "absolute",
    transition: "all 300ms ease",
    transform: "translate(-1px, -1px)",
    boxShadow: "none",

    "> svg": {
     position: "relative",
     top: -1,
    },

    "&:hover": {
     transform: hover
      ? `translate(${hover.x}, ${hover.y})`
      : "translate(-15%, 15%)",
     boxShadow: theme.shadows.xs,
    },
   },

   "&:hover > .button": {
    transform: hover
     ? `translate(${hover.x}, ${hover.y})`
     : "translate(-15%, 15%)",
    boxShadow: theme.shadows.xs,
   },
  },
  active: {
   transform: hover
    ? `translate(${hover.x}, ${hover.y})`
    : "translate(-15%, 15%)",
   boxShadow: theme.shadows.xs,
  },
 })
);

export interface TransitionalButtonProps
 extends ComponentPropsWithoutRef<"div"> {
 /**
  * Size of the button
  */
 size?: number | string;

 /**
  * Y and X coordinates of the :hover effect
  */
 hover?: {
  x: string;
  y: string;
 };

 /**
  * Gradient of the button
  */
 gradient?: string;

 /**
  * Background of the second layer
  */
 layerBackground?: string;

 /**
  * If true, the layer will be the children
  */
 asLayer?: boolean;

 /**
  * State of the button
  */
 active: Booleanish | null;

 containerProps?: ComponentPropsWithoutRef<"div">;
}

function omit(key: string, obj: { [key: string]: any }) {
 // eslint-disable-next-line
 const { [key]: omit, ...rest } = obj;
 return rest;
}

const TransitionalButton = forwardRef((props: TransitionalButtonProps, ref) => {
 const { classes, cx } = useStyles(props);

 return (
  <div
   className={cx(
    classes.container,
    props.containerProps ? props.containerProps.className : null
   )}
   ref={ref as MutableRefObject<null>}
   {...omit("className", props)}
  >
   {props.asLayer ? (
    props.children
   ) : (
    <div
     className={cx(
      "button",
      { [classes.active]: props.active === "true" },
      props.className
     )}
    >
     {props.children}
    </div>
   )}
  </div>
 );
});

TransitionalButton.displayName = TransitionalButton.name;

export default TransitionalButton;
