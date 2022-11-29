import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../prisma/instance";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ONE_HOUR } from "../../../../utils/time";
import config from "../../../../utils/config";
import createLogs from "../../../../utils/logs";

export default async function handler(
 req: NextApiRequest,
 res: NextApiResponse
) {
 if (process.env.NODE_ENV !== "production") createLogs(req);
 res.setHeader("Access-Control-Allow-Origin", "*");
 switch (req.method) {
  case "PATCH": {
   const values = req.body;
   const { userId } = req.query;

   if (!values) {
    res.status(400).json({ error: "Missing required fields" });
    return;
   }

   const filteredValues: { [key: string]: any } = {};

   for (let i = 0; i < Object.keys(values).length; i++) {
    const key = Object.keys(values)[i];

    if (key === "username" || key === "email" || key === "password") {
     if (key === "password") {
      const hash = await bcrypt.hash(
       Buffer.from(key, "base64").toString("ascii"),
       8
      );
      filteredValues[key] = hash;
     } else if (key === "username") {
      filteredValues[key] = values[key].startsWith("@")
       ? values[key]
       : `@${values[key]}`;
     } else {
      filteredValues[key] = values[key];
     }
    }
   }

   const user = await prisma.user.update({
    where: {
     userId: userId as string,
    },
    data: filteredValues,
   });

   const token = jwt.sign(
    {
     sub: user.userId,
     data: {
      userId: user.userId,
      email: user.email,
      password: user.password,
      activated: user.activated,
     },
     iat: Date.now(),
     exp: Date.now() + ONE_HOUR * 2,
    },
    config.jwt.secret
   );

   return res.status(200).json({ user, token });
  }

  default: {
   return res
    .status(405)
    .json({ error: "Method Not Allowed", method: req.method });
  }
 }
}
