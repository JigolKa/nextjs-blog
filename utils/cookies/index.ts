import { ONE_HOUR } from "../time";

export class Cookies {
 public set(name: string, value: string) {
  const date = new Date();
  date.setTime(date.getTime() + ONE_HOUR * 2);

  document.cookie =
   name +
   "=" +
   value +
   "; expires=" +
   date.toUTCString() +
   "; path=/; SameSite=Lax";
 }

 public delete(name: string) {
  const date = new Date();

  date.setTime(date.getTime() + -1 * 24 * 60 * 60 * 1000);

  document.cookie = name + "=; expires=" + date.toUTCString() + "; path=/";
 }

 public get(name: string) {
  const value = "; " + document.cookie;
  const parts = value.split("; " + name + "=");

  if (parts.length == 2) {
   return parts.pop()!.split(";").shift();
  }
 }
}

export default new Cookies();
