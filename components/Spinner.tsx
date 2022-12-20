import { createStyles, keyframes } from "@mantine/core";
import { ComponentPropsWithRef, forwardRef, MutableRefObject } from "react";

export interface SpinnerProps extends ComponentPropsWithRef<"svg"> {
 /**
  * State of the spinner
  */
 active: boolean;

 /**
  * Color of the spinner
  */
 color?: string;

 /**
  * Size of the spinner
  */
 size?: string | number;
}

const dash = keyframes({
 "0%": {
  strokeDasharray: "1, 150",
  strokeDashoffset: 0,
 },
 "50%": {
  strokeDasharray: "90, 150",
  strokeDashoffset: -35,
 },
 "100%": {
  strokeDasharray: "90, 150",
  strokeDashoffset: -124,
 },
});

const rotate = keyframes({
 "100%": {
  transform: "rotate(360deg)",
 },
});

const useStyles = createStyles(
 (_theme, { color, size }: Omit<SpinnerProps, "active">) => ({
  spinner: {
   animation: `${rotate} 2s linear infinite`,
   width: size ? size : 50,
   height: size ? size : 50,

   "& .path": {
    stroke: color ? color : "#000",
    strokeLinecap: "round",
    animation: `${dash} 1.5s ease-in-out infinite`,
   },
  },
 })
);

const Spinner = forwardRef(({ active, color, size }: SpinnerProps, ref) => {
 const { classes } = useStyles({ color, size });

 if (!active) return null;

 return (
  <svg
   ref={ref as MutableRefObject<null>}
   className={classes.spinner}
   viewBox="0 0 50 50"
  >
   <circle
    className="path"
    cx="25"
    cy="25"
    r="20"
    fill="none"
    strokeWidth="5"
   ></circle>
  </svg>
 );
});

Spinner.displayName = Spinner.name

export default Spinner;
