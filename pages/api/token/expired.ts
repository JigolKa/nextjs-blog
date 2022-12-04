import { NextApiRequest, NextApiResponse } from "next";
import { ONE_HOUR } from "../../../utils/time";
import jwt from "jsonwebtoken";
import config from "../../../utils/config";
import prisma from "../../../prisma/instance";
import { use } from "next-api-route-middleware";
import debugMethod from "../../../utils/middleware/debugMethod";

async function handler(req: NextApiRequest, res: NextApiResponse) {
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
     iat: Date.now() - ONE_HOUR * 4,
     exp: Date.now() - ONE_HOUR * 2,
    },
    config.jwt.secret
   );

   return res.status(200).send(token);
  }
 }
}

export default use(debugMethod, handler);
