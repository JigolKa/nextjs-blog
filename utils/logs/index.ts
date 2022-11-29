import { format } from "date-fns";
import { NextApiRequest } from "next";
import multiSplit from "../strings/multiSplit";
import fs from "node:fs";
import { IP6to4 } from "../ip";

export default function createLogs(
 req: NextApiRequest,
 formatting: string = "[ %d@MM-dd-yyyy HH:mm:ss ] - %m %u %p/%hm"
) {
 var log = formatting;
 const options = multiSplit(formatting, ["@", "]"])[1].trim();
 const proto = req.headers["x-forwarded-proto"] ? "https" : "http";

 const forwarded = req.headers["x-forwarded-for"];

 const ip =
  typeof forwarded === "string"
   ? forwarded.split(/, /)[0]
   : req.socket.remoteAddress;

 const dirIP = IP6to4(
  (ip === "::1" || (ip && ip.includes("::::")) ? "127.0.0.1" : ip) || null
 );
 const formats = {
  d: format(new Date(), options),
  u: req.url || req.headers["location"],
  i: ip,
  m: req.method,
  jwt:
   typeof req.headers["Authorization"] === "string"
    ? req.headers["Authorization"].split(" ")[0]
    : "No JWT",
  p: proto.toUpperCase(),
  hm: req.httpVersion,
 } as { [key: string]: string };

 for (let i = 0; i < Object.keys(formats).length; i++) {
  const key = Object.keys(formats)[i];
  const value = formats[key];

  log = log.replace(`%${key}`, value);
 }

 const logParts = multiSplit(log, ["@", "]"]);
 var out = "";
 logParts.map((s, i) =>
  i === 1 ? "" : i === 0 ? (out += `${s} ]`) : (out += s)
 );

 try {
  if (!fs.existsSync(`logs/${dirIP}.log`)) {
   fs.writeFile(`logs/${dirIP}.log`, out + "\r\n", (err) => {
    if (err) throw err;
   });
   return;
  }

  fs.appendFileSync(`logs/${dirIP}.log`, out + "\r\n");
 } catch (error) {}
}
