import { NextApiRequest, NextApiResponse } from "next";
import { ONE_HOUR } from "../../../utils/time";
import jwt from "jsonwebtoken";
import config from "../../../utils/config";
import prisma from "../../../prisma/instance";

export default async function handler(
 req: NextApiRequest,
 res: NextApiResponse
) {
 res.setHeader("Access-Control-Allow-Origin", "*");
 switch (req.method) {
  case "POST": {
   const user = await prisma.user.findFirst({
    where: {
     userId: req.body.userId || undefined,
    },
    select: {
     userId: true,
     email: true,
     password: true,
     activated: true,
    },
   });

   const token = jwt.sign(
    {
     sub: user!.userId,
     data: user,
     iat: Date.now(),
     exp: Date.now() + ONE_HOUR * 2,
    },
    config.jwt.secret
   );

   return res.status(200).send(token);
  }

  default: {
   return res.status(405).json({ error: "Method not allowed" });
  }
 }
}
