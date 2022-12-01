import { NextApiRequest, NextApiResponse } from "next";
import restrictAccess from "../../../../utils/api/auth/restrictAccess";
import prisma from "../../../../prisma/instance";
import bcrypt from "bcryptjs";
import createLogs from "../../../../utils/logs";
import { use } from "next-api-route-middleware";

async function handler(req: NextApiRequest, res: NextApiResponse) {
 if (process.env.NODE_ENV !== "production") createLogs(req);

 switch (req.method) {
  case "POST": {
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
    await prisma.post.deleteMany({
     where: {
      authorId: userId as string,
     },
    });

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

export default use(restrictAccess(["POST", "GET"]), handler);
