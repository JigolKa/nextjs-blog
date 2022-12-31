import { NextApiRequest } from "next";
import { Token } from "../../..";
import jwt from "jsonwebtoken";
import config from "../../config";

export interface DecodeTokenSuccess {
 verified: boolean;
 decoded: Token;
 token: string;
}

export interface DecodeTokenFailure {
 status: number;
 error: unknown;
}

export interface DecodeTokenProps {
 request?: NextApiRequest;
 token?: string | null;
}

export default function decodeToken({ request, token }: DecodeTokenProps) {
 if (token) {
  return decode(token);
 }

 if (request) {
  const authorization = request.headers["authorization"];

  if (authorization) {
   const token = authorization.split(" ");

   if (token.length <= 1) {
    return {
     // see documentation
     status: 437,
     error: "Token malformed",
    } as DecodeTokenFailure;
   }

   return decode(token[1]);
  }

  return {
   // see documentation
   status: 403,
   error: "Authorization header missing",
  } as DecodeTokenFailure;
 }

 return {
  // see documentation
  status: 403,
  error: "No token/request provided",
 } as DecodeTokenFailure;
}

function decode(token: string) {
 try {
  const decoded = jwt.verify(token, config.jwt.secret) as Token;

  if (Date.now() > decoded.exp) {
   return {
    status: 410,
    error: "Token is expired",
   };
  }

  return {
   decoded,
   verified: true,
   token,
  } as DecodeTokenSuccess;
 } catch (e) {
  return {
   status: 400,
   error: e,
  } as DecodeTokenFailure;
 }
}
