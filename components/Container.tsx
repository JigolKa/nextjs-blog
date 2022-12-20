import { createStyles } from "@mantine/core";
import { useRouter } from "next/router";
import { ComponentPropsWithoutRef } from "react";

const useStyles = createStyles(
 (
  theme,
  { size, marginBlock }: Omit<ContainerProps, "excludedRoutes" | "children">
 ) => ({
  container: {
   maxWidth: size,
   marginInline: "auto",
   marginBlock: marginBlock ? marginBlock : 10,

   [`@media screen and (max-width: ${theme.breakpoints.md}px)`]: {
    maxWidth: "85vw",
   },

   [`@media screen and (max-width: ${theme.breakpoints.sm}px)`]: {
    maxWidth: "90vw",
   },
  },
 })
);

export interface ContainerProps extends ComponentPropsWithoutRef<"div"> {
 children: JSX.Element;

 /**
  * The container's size
  */
 size: string | number;

 /**
  * Margin prop to overwrite the existing one if needed
  */
 marginBlock?: number;

 /**
  * Routes to exclude from the container
  */
 excludedRoutes: string[];
}

export default function Container({
 size,
 children,
 marginBlock,
 excludedRoutes,
 ...rest
}: ContainerProps) {
 const { classes } = useStyles({ size, marginBlock });
 const router = useRouter();

 if (excludedRoutes.includes(router.pathname)) {
  return children;
 } else {
  return (
   <>
    <div className={classes.container} {...rest}>
     {children}
    </div>
   </>
  );
 }
}
