import { NextApiRequest } from "next";
import { Token } from "../../..";
import jwt from "jsonwebtoken";
import config from "../../config";

export type jwtMiddlewareResponse = {
 verified: boolean;
 decoded: Token;
 token: string;
 status: number;
};

export default function jwtMiddleware(
 req: NextApiRequest | null,
 token?: string
): jwtMiddlewareResponse | null {
 if (token) {
  const decoded = jwt.verify(token, config.jwt.secret) as Token;

  if (!decoded) return null;

  if (Date.now() > decoded.exp) return null;

  return {
   decoded,
   verified: true,
   token,
   status: 200,
  };
 }

 if (req) {
  const authorization = req.headers["authorization"];

  if (authorization) {
   const token = authorization.split(" ")[1];

   if (!token) {
    return null;
   }

   const decoded = jwt.verify(token, config.jwt.secret) as Token;

   if (!decoded) {
    return null;
   }

   if (Date.now() > decoded.exp) {
    return null;
   }

   return {
    decoded,
    verified: true,
    token,
    status: 200,
   };
  }

  return null;
 }

 return null;
}
