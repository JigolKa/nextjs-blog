import { Fragment } from "react";

export function nl2br(str: string) {
 return str.split("\\n").map((item, key) => {
  return (
   <Fragment key={key}>
    {item}
    <br />
   </Fragment>
  );
 });
}
