import { NextApiResponse } from "next";
import { use } from "next-api-route-middleware";
import { NextApiRequestWithMiddlewareObject } from "../../..";
import prisma from "../../../prisma/instance";
import restrictAccess from "../../../utils/api/auth/restrictAccess";
import { userWithoutPassword } from "../../../utils/api/db/post";

import { getUniqueSlug } from "../../../utils/strings/toSlug";

async function handler(
 req: NextApiRequestWithMiddlewareObject,
 res: NextApiResponse
) {
 res.setHeader("Access-Control-Allow-Origin", "*");

 switch (req.method) {
  case "POST": {
   const { description, title, quotedWebsite, images, video } = req.body;

   if (!(description || title)) {
    return res.status(400).json({ error: "Missing required fields" });
   }

   if (!req.middlewareData)
    return res.status(401).json({ error: "Not authorized" });

   const { decoded } = req.middlewareData;
   console.log("POST", "/api/post", decoded);

   const slug = await getUniqueSlug(title);

   const post = await prisma.post.create({
    data: {
     content: description,
     title: title,
     quotedWebsite: quotedWebsite || undefined,
     images: images || undefined,
     video: video || undefined,
     city: "Denver",
     region: "Paris",
     regionName: "Paris Ile de France",
     country: "France",
     lat: 45,
     lon: 7,
     author: {
      connect: {
       userId: decoded.data.userId,
      },
     },
     timezone: "Europe/France",
     slug: slug,
    },
    include: {
     author: {
      select: {
       ...userWithoutPassword,
      },
     },
    },
   });

   return res.status(200).json(post);
  }

  case "GET": {
   const posts = await prisma.post.findMany({
    include: {
     author: {
      select: {
       ...userWithoutPassword,
      },
     },
     likedBy: true,
     dislikedBy: true,
     topics: true,
    },
   });

   return res.status(200).json(posts);
  }

  default: {
   return res.status(405).json({ error: "Method Not Allowed" });
  }
 }
}

export default use(restrictAccess(["POST"]), handler);
