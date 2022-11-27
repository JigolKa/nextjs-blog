import { createStyles, MantineColor } from "@mantine/core";
import { forwardRef, MutableRefObject } from "react";
import Spinner from "./Spinner";

const useStyles = createStyles(
 (theme, { borderRadius, loading, color = "blue" }: ButtonProps) => ({
  button: {
   cursor: loading ? "not-allowed" : "pointer",
   width: "max-content",
   padding: "10px 32px",
   background: loading ? theme.colors[color][3] : theme.colors[color][5],
   color: "#fff",
   transition: "200ms ease background",
   border: "none",
   display: "flex",
   borderRadius: borderRadius ? borderRadius : 4,
   position: "relative",

   "&:hover": {
    background: loading ? theme.colors[color][3] : theme.colors[color][7],
   },

   "&.outline": {
    border: `1px solid ${theme.colors[color][5]}`,
    background: "#fff",
    color: theme.colors[color][5],

    "&:hover": {
     background: loading
      ? "#fff"
      : theme.fn.lighten(theme.colors[color][0], 0.3),
    },
   },
  },
 })
);

export interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
 /**
  * Style type of the button
  */
 variant?: "fill" | "outline";

 /**
  * Loading state of the button
  */
 loading?: boolean;

 /**
  * Border radius property
  */
 borderRadius?: number;

 /**
  * Color of the button
  */
 color?: MantineColor;
}

const Button = forwardRef(
 (
  {
   children,
   loading,
   borderRadius,
   variant = "fill",
   color,
   ...rest
  }: ButtonProps,
  ref
 ) => {
  const { classes, cx } = useStyles({ borderRadius, loading, color });

  return (
   <button
    {...rest}
    ref={ref as MutableRefObject<null>}
    className={
     variant === "outline" ? cx(classes.button, "outline") : classes.button
    }
    disabled={loading ? loading : rest.disabled}
   >
    {loading ? (
     <Spinner
      active
      color={variant === "outline" ? "#228be6" : "#fff"}
      size={18}
     />
    ) : (
     children
    )}
   </button>
  );
 }
);

Button.displayName = Button.name;

export default Button;
