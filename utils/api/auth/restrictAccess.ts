import decodeToken, { DecodeTokenSuccess } from "./decodeToken";
import prisma from "../../../prisma/instance";
import { Middleware } from "next-api-route-middleware";

const restrictAccess = (methods: string[]): Middleware => {
 return async (req, res, next) => {
  if (!methods.includes(req.method!)) next();

  const bearer = req.headers["authorization"];

  if (bearer) {
   const result = decodeToken({
    request: req,
   });

   if (Object.keys(result).includes("token")) {
    const { decoded } = result as DecodeTokenSuccess;

    const user = await prisma.user.findFirst({
     where: {
      userId: decoded.data.userId,
     },
    });

    if (user) next();

    res.status(401).json({ error: "User not logged in" });
   }
  }

  res.status(401).json({ error: "User not logged in" });
 };
};

export default restrictAccess;
