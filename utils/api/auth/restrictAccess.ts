import decodeToken, {
 DecodeTokenFailure,
 DecodeTokenSuccess,
} from "./decodeToken";
import prisma from "../../../prisma/instance";
import { Middleware } from "next-api-route-middleware";
import { NextApiRequestWithMiddlewareObject } from "../../..";

const restrictAccess = (
 methods: string[]
): Middleware<NextApiRequestWithMiddlewareObject> => {
 return async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (!methods.includes(req.method!)) return next();

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

    if (user) {
     req.middlewareData = {
      decoded: decoded,
     };
     return next();
    }

    return res.status(401).json({ error: "Not authorized" });
   }

   console.log(result);

   return res
    .status((result as DecodeTokenFailure).status)
    .json({ error: (result as DecodeTokenFailure).error });
  }

  return res.status(401).json({ error: "Not authorized" });
 };
};

export default restrictAccess;
