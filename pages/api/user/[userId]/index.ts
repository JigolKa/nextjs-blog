import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../prisma/instance";
import createLogs from "../../../../utils/logs";

export default async function handler(
 req: NextApiRequest,
 res: NextApiResponse
) {
 if (process.env.NODE_ENV !== "production") createLogs(req);
 res.setHeader("Access-Control-Allow-Origin", "*");
 switch (req.method) {
  case "GET": {
   const { userId } = req.query;

   const user = await prisma.user.findFirst({
    where: {
     userId: userId as string,
    },
    include: {
     posts: true,
    },
   });

   return res.status(200).json(user);
  }

  default: {
   return res.status(405).json({ error: "Method Not Allowed" });
  }
 }
}
