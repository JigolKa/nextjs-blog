import { NextApiRequest, NextApiResponse } from "next";
import { likePost } from "../../../../utils/api/db/post";

export default async function handler(
 req: NextApiRequest,
 res: NextApiResponse
) {
 res.setHeader("Access-Control-Allow-Origin", "*");
 switch (req.method) {
  case "POST": {
   const { userId } = req.body;
   const { postId } = req.query;

   const result = await likePost(userId, postId as string);

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
