import { NextApiRequest, NextApiResponse } from "next";
import { restrictAccess } from "../../../../utils/api";
import prisma from "../../../../prisma/instance";
import bcrypt from "bcryptjs";
import createLogs from "../../../../utils/logs";

export default async function handler(
 req: NextApiRequest,
 res: NextApiResponse
) {
 createLogs(req);
 res.setHeader("Access-Control-Allow-Origin", "*");
 switch (req.method) {
  case "POST": {
   const status = await restrictAccess(req, res);

   if (status !== 200) return;

   const { userId } = req.query;
   const { password } = req.body;

   if (!password) {
    res.status(400).json({ error: "Missing required fields" });
    return;
   }

   const _password = Buffer.from(password, "base64").toString("ascii");

   const user = await prisma.user.findFirst({
    where: {
     userId: userId as string,
    },
   });

   if (!user) {
    return res.status(404).json({ error: "Not found" });
   }

   const valid = await bcrypt.compare(_password, user.password);

   if (valid) {
    const deletion = await prisma.user.delete({
     where: {
      userId: userId as string,
     },
    });
    return res.status(200).json(deletion);
   }

   return res.status(403).json({ error: "Bad password" });
  }

  default: {
   return res
    .status(405)
    .json({ error: "Method Not Allowed", method: req.method });
  }
 }
}
