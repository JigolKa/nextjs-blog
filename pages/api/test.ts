import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../prisma/instance";
import jwt from "jsonwebtoken";
import { ONE_HOUR } from "../../utils/time";
import config from "../../utils/config";

export default async function handler(
 _req: NextApiRequest,
 res: NextApiResponse
) {
 const user = await prisma.user.findFirst({
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

 res.json(token);
}
