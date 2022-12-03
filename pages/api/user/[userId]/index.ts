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
   const { userId } = req.query;

   const user = await prisma.user.findFirst({
    where: {
     userId: userId as string,
    },
    select: {
     ...userWithoutPassword,
    },
   });

   return res.status(200).json(user);
  }

  default: {
   return res.status(405).json({ error: "Method Not Allowed" });
  }
 }
}
