import { Tabs, TabsProps } from "@mantine/core";

export default function StyledTabs(props: TabsProps) {
 return (
  <Tabs
   unstyled
   styles={(theme) => ({
    tab: {
     ...theme.fn.focusStyles(),
     width: "calc(100% / 4)",
     backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
     color:
      theme.colorScheme === "dark"
       ? theme.colors.dark[0]
       : theme.colors.gray[9],
     border: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[4]
     }`,
     padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
     cursor: "pointer",
     fontSize: theme.fontSizes.sm,
     display: "flex",
     alignItems: "center",
     justifyContent: "center",

     "&:disabled": {
      opacity: 0.5,
      cursor: "not-allowed",
     },

     "&:not(:first-of-type)": {
      borderLeft: 0,
     },

     "&:first-of-type": {
      borderTopLeftRadius: 4,
      borderBottomLeftRadius: 4,
     },

     "&:last-of-type": {
      borderTopRightRadius: 4,
      borderBottomRightRadius: 4,
     },

     "&[data-active]": {
      backgroundColor: theme.colors.blue[5],
      borderColor: theme.colors.blue[5],
      color: theme.white,
     },
    },

    tabIcon: {
     marginRight: theme.spacing.xs,
     display: "flex",
     alignItems: "center",
    },

    tabsList: {
     display: "flex",
     width: "100%",
    },
   })}
   {...props}
  />
 );
}
