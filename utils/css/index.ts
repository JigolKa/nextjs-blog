import { CSSObject } from "@mantine/core";

export function ellipsis(lines: number, css?: CSSObject): CSSObject {
 return {
  display: "-webkit-box",
  textOverflow: "ellipsis",
  overflow: "hidden",
  WebkitLineClamp: lines,
  WebkitBoxOrient: "vertical",
  overflowWrap: "break-word",
  lineHeight: "150%",
  ...(css || null),
 };
}

export function getDarkColor() {
 var color = "#";
 for (var i = 0; i < 6; i++) {
  color += Math.floor(Math.random() * 10);
 }
 return color;
}
