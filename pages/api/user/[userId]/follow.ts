import { NextApiRequest, NextApiResponse } from "next";
import { followUser } from "../../../../utils/api/db/user";
import createLogs from "../../../../utils/logs";

export default async function handler(
 req: NextApiRequest,
 res: NextApiResponse
) {
 createLogs(req);
 res.setHeader("Access-Control-Allow-Origin", "*");
 switch (req.method) {
  case "POST": {
   const { userId } = req.body;
   const { userId: targetUserId } = req.query;

   if (!userId) {
    res.status(400).json({ error: "Missing required fields" });
    return;
   }

   const result = await followUser(targetUserId as string, userId);

   if (!result) {
    return res.status(404).json({ error: "Not found" });
   }

   return res.status(200).json(result);
  }

  default: {
   return res
    .status(405)
    .json({ error: "Method Not Allowed", method: req.method });
  }
 }
}
