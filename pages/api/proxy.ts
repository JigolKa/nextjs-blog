import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import createLogs from "../../utils/logs";

export default async function handler(
 req: NextApiRequest,
 res: NextApiResponse
) {
 createLogs(req);
 res.setHeader("Access-Control-Allow-Origin", "*");
 switch (req.method) {
  case "POST": {
   const { url, format } = req.body;

   if (!url) {
    return res.status(400).json({ error: "Missing required fields" });
   }

   const response = await axios.get(url as string);

   res.setHeader("Content-Type", format ? format : "application/json");

   return res.status(200).send(response.data);
  }

  default: {
   return res.status(405).json({ error: "Method Not Allowed" });
  }
 }
}
