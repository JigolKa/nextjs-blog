import { NextApiResponse } from "next";
import { use } from "next-api-route-middleware";
import { NextApiRequestWithMiddlewareObject } from "../../..";
import prisma from "../../../prisma/instance";
import restrictAccess from "../../../utils/middleware/restrictAccess";
import { userWithoutPassword } from "../../../utils/api/db/user";

import { getUniqueSlug } from "../../../utils/strings/toSlug";
import { fetchSortedPosts, SortingAlgorithm } from "../../../utils/sorting";

async function handler(
 req: NextApiRequestWithMiddlewareObject,
 res: NextApiResponse
) {
 res.setHeader("Access-Control-Allow-Origin", "*");

 switch (req.method) {
  case "POST": {
   const { description, title, quotedWebsite, images, video, topics } =
    req.body;

   if (!(description || title)) {
    return res.status(400).json({ error: "Missing required fields" });
   }

   if (!req.middlewareData)
    return res.status(401).json({ error: "Not authorized" });

   const { decoded } = req.middlewareData;

   const slug = getUniqueSlug(title);

   const post = await prisma.post.create({
    data: {
     content: description,
     title: title,
     quotedWebsite: quotedWebsite || undefined,
     images: images || undefined,
     video: video || undefined,
     topics: topics || [],
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
   const { skip, take, sort, notIn } = req.query;

   const sortedPosts = await fetchSortedPosts(
    Number(take),
    Number(skip),
    sort as SortingAlgorithm,
    Array.isArray(notIn) ? notIn : []
   );

   return res.status(200).json(sortedPosts || -1);
  }

  default: {
   return res.status(405).json({ error: "Method Not Allowed" });
  }
 }
}

export default use(restrictAccess(["POST"]), handler);
