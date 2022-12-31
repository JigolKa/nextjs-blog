import { PrismaClient, User } from "@prisma/client";
import axios from "axios";
import config from "../config";
import prisma from "../../prisma/instance";
import { Prisma } from "../../node_modules/.prisma/client/index";
import setAuthorization from "../api/auth/setAuthorization";
import { userWithoutPasswordAndPosts } from "../api/db/user";

interface Props {
 token?: string;
}

interface FetchProps {
 skip?: number;
 take?: number;
 postIdNotIn?: string[];
 userIdNotIn?: string[];
}

export default class Fetching {
 private user: User | null;
 private isInitialized: boolean;
 private prisma: PrismaClient;
 private token: string | undefined;

 constructor({ token }: Props) {
  this.user = null;
  this.isInitialized = false;
  this.token = token;

  this.prisma = prisma;
 }

 private async init(): Promise<void> {
  if (this.isInitialized) return;

  const response = await axios.get(
   `${config.BASE_URL}/api/user`,
   setAuthorization(this.token)
  );

  if (response.status === 200) {
   this.user = response.data;
  } else {
   this.user = null;
  }

  this.isInitialized = true;
 }

 private getArgs(
  args: FetchProps,
  where?: Prisma.PostWhereInput
 ): Prisma.PostFindManyArgs {
  return {
   skip: args.skip || 0,
   take: args.take || 15,

   where: {
    AND: [
     {
      NOT: {
       authorId: {
        in: args.userIdNotIn
         ? args.userIdNotIn.length > 0
           ? args.userIdNotIn
           : undefined
         : undefined,
       },
      },
     },
     {
      NOT: {
       postId: {
        in: args.postIdNotIn
         ? args.postIdNotIn.length > 0
           ? args.postIdNotIn
           : undefined
         : undefined,
       },
      },
     },
    ],

    ...(where || null),
   },

   include: {
    author: {
     select: userWithoutPasswordAndPosts,
    },
   },
  };
 }

 public async fetch(args: FetchProps, where?: Prisma.PostWhereInput) {
  await this.init();

  return await this.prisma.post.findMany(
   this.getArgs(
    args,
    where
     ? this.user
       ? {
          authorId: {
           in: [...this.user.followingIDs.map((id) => id), this.user.userId],
          },
          ...where,
         }
       : where
     : {}
   )
  );
 }
}

export {};
