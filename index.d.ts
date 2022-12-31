import { Comment, Post, User } from "@prisma/client";
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

export type FullPost = Post & {
 likedBy: User[];
 author: User;
 dislikedBy: User[];
 topics: Topic[];
};

export type FullUser = User & {
 comments: Comment[];
 disliked: Post[];
 liked: Post[];
 following: User[];
 followedBy: User[];
 posts: Post[];
};

export type IdealUser = Omit<FullUserWithoutPassword, "posts"> & {
 posts: (Post & {
  author: User;
 })[];
};

export type FullUserWithoutPassword = Omit<FullUser, "password">;

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
