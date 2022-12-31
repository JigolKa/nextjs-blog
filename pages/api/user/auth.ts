import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/instance";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../../utils/config";
import { ONE_DAY, ONE_MINUTE } from "../../../utils/time";

import { getIP } from "../../../utils/ip";
import sleep from "../../../utils/sleep";
import NodeCache from "node-cache";
import { isBase64 } from "../../../utils/strings";

type Request = {
 requestedAt: Date;
 status: "success" | "error";
};

export type IPCache = {
 [key: string]: Request[];
};

const cache = new NodeCache({ stdTTL: ONE_DAY * 3 });

export default async function handler(
 req: NextApiRequest,
 res: NextApiResponse
) {
 res.setHeader("Access-Control-Allow-Origin", "*");

 const ip = getIP(req);
 const TIMEOUT = ONE_MINUTE * 3;

 if (!ip) {
  return res.status(403).json({ error: "Not Authorized" });
 }

 switch (req.method) {
  case "POST": {
   const { login, password } = req.body;

   const ipCache = cache.get<any>(ip);

   if (ipCache && process.env.NODE_ENV === "production") {
    if (ipCache.length >= 5) {
     const lastRequestDiffMS = Math.abs(
      ipCache[ipCache.length - 5].requestedAt.getTime() - new Date().getTime()
     );

     if (lastRequestDiffMS <= TIMEOUT) {
      return res.status(429).json({
       error: `Request timeout: ${(
        (TIMEOUT - lastRequestDiffMS) /
        1000
       ).toFixed()}s`,
      });
     }
    }
   }

   if (!(login || password))
    return res.status(400).json({ error: "Missing required fields" });

   if (!(isBase64(login) || isBase64(password)))
    return res.status(400).json({ error: "Fields not encrypted" });

   const _login = Buffer.from(login, "base64").toString("ascii");
   const _password = Buffer.from(password, "base64").toString("ascii");

   const user = await prisma.user.findFirst({
    where: {
     email: _login,
    },
    select: {
     userId: true,
     email: true,
     password: true,
     activated: true,
    },
   });

   if (!user) {
    cache.set(ip, [
     ...(ipCache || []),
     {
      requestedAt: new Date(),
      status: "error",
     },
    ]);

    await sleep(Math.floor(Math.random() * 500) + 500, () => {
     res.status(404).json({ error: "User doesn't exists" });
    });

    return;
   }

   const valid = await bcrypt.compare(_password, user.password);

   if (!valid) {
    cache.set(ip, [
     ...(ipCache || []),
     {
      requestedAt: new Date(),
      status: "error",
     },
    ]);

    await sleep(Math.floor(Math.random() * 500) + 500, () => {
     res.status(403).json({ error: "Bad password" });
    });

    return;
   }

   const token = jwt.sign(
    {
     sub: user.userId,
     data: user,
     iat: Date.now(),
     exp: Date.now() + ONE_DAY,
    },
    config.jwt.secret
   );

   cache.set(ip, [
    ...(cache.get<any>(ip) || []),
    {
     requestedAt: new Date(),
     status: "success",
    },
   ]);

   return res.status(200).json(token);
  }

  case "DELETE": {
   for (let i = 0; i < cache.keys().length; i++) {
    const element = cache.keys()[i];
    cache.del(element);
   }
   return res.end();
  }

  default: {
   return res.status(405).json({ error: "Method Not Allowed" });
  }
 }
}
