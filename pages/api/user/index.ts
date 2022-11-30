import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/instance";
import bcrypt from "bcryptjs";
import createLogs from "../../../utils/logs";
import { jwtMiddleware } from "../../../utils/api";
import axios from "axios";
import jwt from "jsonwebtoken";
import { ONE_HOUR } from "../../../utils/time";
import config from "../../../utils/config";

export default async function handler(
 req: NextApiRequest,
 res: NextApiResponse
) {
 if (process.env.NODE_ENV !== "production") createLogs(req);
 res.setHeader("Access-Control-Allow-Origin", "*");

 switch (req.method) {
  case "POST": {
   const { username, email, password } = req.body;

   if (!(username || email || password)) {
    return res.status(400).json({ error: "Missing required fields" });
   }

   const _password = Buffer.from(password, "base64").toString("ascii");

   const validation = await prisma.user.findFirst({
    where: {
     OR: [
      {
       email: email,
      },
      {
       username: username,
      },
     ],
    },
   });

   if (validation !== null)
    return res.status(400).json({ error: "User already exists" });

   const hash = await bcrypt.hash(_password, 8);

   const user = await prisma.user.create({
    data: {
     username: username,
     email: email,
     password: hash,
    },
   });

   await axios.post(`${config.BASE_URL}/api/verify/activate`, {
    userId: user.userId,
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

  case "GET": {
   if (req.headers["authorization"]) {
    const jwtObject = jwtMiddleware(req);

    if (jwtObject) {
     const { decoded } = jwtObject;

     const user = await prisma.user.findFirst({
      where: {
       userId: decoded.data.userId,
      },
      include: {
       posts: {
        include: {
         dislikedBy: true,
         likedBy: true,
         topics: true,
        },
       },
       followedBy: true,
       following: true,
      },
     });

     return res.status(200).json(user);
    } else {
     return res.status(403).json({ error: "Bad token" });
    }
   }
  }

  default: {
   return res.status(405).json({ error: "Method Not Allowed" });
  }
 }
}
