import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../prisma/instance";
import { userWithoutPassword } from "../../../../utils/api/db/post";

export default async function handler(
 req: NextApiRequest,
 res: NextApiResponse
) {
 res.setHeader("Access-Control-Allow-Origin", "*");
 switch (req.method) {
  case "GET": {
   const { postId } = req.query;

   const post = await prisma.post.findFirst({
    where: {
     postId: postId as string,
    },
    include: {
     author: {
      select: {
       ...userWithoutPassword,
      },
     },
    },
   });

   return res.status(200).json(post);
  }

  default: {
   return res.status(405).json({ error: "Method Not Allowed" });
  }
 }
}
