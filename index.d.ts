import { Post, User } from "@prisma/client";
import { NextApiRequest } from "next";

export interface Token {
 iat: number;
 exp: number;
 data: {
  userId: string;
  email: string;
  password: string;
 };
}

export interface ContextProviderProps {
 children: React.ReactNode;
}

export interface LoginValues {
 email: string;
 password: string;
}

export interface SignUpValues {
 email: string;
 password: string;
 passwordVerification: string;
 username: string;
}

export type ActionType = "like" | "dislike";

export interface PostsFetching {
 posts: FullPost[];
}
export interface PostFetching {
 _post: string;
}

export type FullPost = Post & {
 likedBy: User[];
 author: User;
 dislikedBy: User[];
 topics: Topic[];
};

export type Booleanish = "true" | "false";

export type HTTPMethod =
 | "GET"
 | "OPTIONS"
 | "POST"
 | "PUT"
 | "PATCH"
 | "DELETE"
 | "HEAD"
 | "CONNECT"
 | "TRACE";

export interface NextApiRequestWithMiddlewareObject extends NextApiRequest {
 middlewareData?: {
  decoded: Token;
 };
}
