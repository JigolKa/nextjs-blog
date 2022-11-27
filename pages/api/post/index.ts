import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/instance";
import createLogs from "../../../utils/logs";
import { getUniqueSlug } from "../../../utils/strings/toSlug";

export default async function handler(
 req: NextApiRequest,
 res: NextApiResponse
) {
 createLogs(req);
 res.setHeader("Access-Control-Allow-Origin", "*");
 res.setHeader("Access-Control-Allow-Origin", "*");
 switch (req.method) {
  case "POST": {
   const { authorId, description, title, quotedWebsite, images, video } =
    req.body;

   if (!(authorId || description || title) || authorId === "null") {
    return res.status(400).json({ error: "Missing required fields" });
   }

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
       userId: authorId,
      },
     },
     timezone: "Europe/France",
     slug: slug,
    },
   });

   return res.status(200).json(post);
  }

  case "GET": {
   const posts = await prisma.post.findMany({
    include: {
     author: true,
     likedBy: true,
     dislikedBy: true,
     topics: true,
    },
   });

   return res.status(200).json(posts);
  }

  case "DELETE": {
   //! dev method
   const posts = await prisma.post.deleteMany();

   return res.status(200).json(posts);
  }

  default: {
   return res.status(405).json({ error: "Method Not Allowed" });
  }
 }
}
