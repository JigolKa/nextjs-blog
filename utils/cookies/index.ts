import { ONE_HOUR } from "../time";

export class Cookies {
 public get(key: string) {
  var cookies = document.cookie.split("; ");
  for (var i = 0; i < cookies.length; i++) {
   var part = cookies[i].split("=");
   if (part && part[0] === key) return decodeURIComponent(part[1]);
  }
 }

 public set(key: string, value: string, exp: number = ONE_HOUR * 2) {
  var date = new Date();
  date.setDate(date.getTime() + exp);

  return (document.cookie =
   key +
   "=" +
   encodeURIComponent(value) +
   "; expires=" +
   date.toUTCString() +
   "; path=/");
 }

 public delete(key: string) {
  this.set(key, "", -1);
 }
}

export default new Cookies();
