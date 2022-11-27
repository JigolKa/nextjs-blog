import { NextApiRequest, NextApiResponse } from "next";
import jwtMiddleware from "./jwtMiddleware";
import prisma from "../../../prisma/instance";

export default async function restrictAccess(
 req: NextApiRequest,
 res: NextApiResponse
) {
 const bearer = req.headers["authorization"];

 if (bearer) {
  const jwtObject = jwtMiddleware(req);

  if (jwtObject) {
   const { decoded } = jwtObject;

   const user = await prisma.user.findFirst({
    where: {
     userId: decoded.data.userId,
    },
   });

   if (user) {
    return 200;
   }

   res.status(401).json({ error: "User not logged in" });
   return 401;
  }
 }

 res.status(401).json({ error: "User not logged in" });
 return 401;
}
