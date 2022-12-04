import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/instance";
import bcrypt from "bcryptjs";
import decodeToken, {
 DecodeTokenFailure,
 DecodeTokenSuccess,
} from "../../../utils/api/auth/decodeToken";
import axios from "axios";
import jwt from "jsonwebtoken";
import { ONE_HOUR } from "../../../utils/time";
import config from "../../../utils/config";
import { userWithoutPassword } from "../../../utils/api/db/post";
import isBase64 from "../../../utils/strings/isBase64";

export default async function handler(
 req: NextApiRequest,
 res: NextApiResponse
) {
 res.setHeader("Access-Control-Allow-Origin", "*");

 switch (req.method) {
  case "POST": {
   const { username, email, password } = req.body;

   if (!(username || email || password)) {
    return res.status(400).json({ error: "Missing required fields" });
   }

   if (!isBase64(password)) {
    return res.status(400).json({ error: "Password not base64 encoded" });
   }

   const _password = Buffer.from(password, "base64").toString("ascii");
   const _username = (username as string).startsWith("@")
    ? username
    : `@${username}`;

   const userAlreadyExists = await prisma.user.findFirst({
    where: {
     OR: [
      {
       email: email,
      },
      {
       username: _username,
      },
     ],
    },
   });

   if (userAlreadyExists !== null)
    return res.status(409).json({ error: "User already exists" });

   const hash = await bcrypt.hash(_password, 8);

   const user = await prisma.user.create({
    data: {
     username: _username,
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
    const result = decodeToken({
     request: req,
    });

    if (Object.keys(result).includes("token")) {
     const { decoded } = result as DecodeTokenSuccess;

     const user = await prisma.user.findFirst({
      where: {
       userId: decoded.data.userId,
      },
      select: {
       posts: {
        include: {
         dislikedBy: true,
         likedBy: true,
         topics: true,
        },
       },
       userId: true,
       username: true,
       email: true,
       createdAt: true,
       permissions: true,
       profilePicture: true,
       followedBy: true,
       followedByIDs: true,
       following: true,
       followingIDs: true,
       activated: true,
       likedIDs: true,
       liked: true,
       dislikedIDs: true,
       disliked: true,
      },
     });

     return res.status(200).json(user);
    }

    return res
     .status((result as DecodeTokenFailure).status)
     .json({ error: (result as DecodeTokenFailure).error });
   } else {
    const users = await prisma.user.findMany({
     select: {
      ...userWithoutPassword,
     },
    });

    return res.status(200).json(users);
   }
  }

  default: {
   return res.status(405).json({ error: "Method Not Allowed" });
  }
 }
}
