import { NextApiRequest, NextApiResponse } from "next";
import { fetchIP } from "../../utils/ip";
import createLogs from "../../utils/logs";

export default async function handler(
 req: NextApiRequest,
 res: NextApiResponse
) {
 createLogs(req);
 res.setHeader("Access-Control-Allow-Origin", "*");
 switch (req.method) {
  case "GET": {
   const ip = await fetchIP();
   return res.status(200).send(ip);
  }

  default: {
   res.status(405).json({ error: "Method Not Allowed" });
   break;
  }
 }
}
