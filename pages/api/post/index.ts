import { NextApiResponse } from "next";
import { use } from "next-api-route-middleware";
import { NextApiRequestWithMiddlewareObject } from "../../..";
import prisma from "../../../prisma/instance";
import restrictAccess from "../../../utils/middleware/restrictAccess";
import { userWithoutPassword } from "../../../utils/api/db/user";
import { getUniqueSlug } from "../../../utils/strings";
import Fetching from "../../../utils/fetch";

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
   //! API CHANGED
   const { skip, take, /*sort,*/ postIdNotIn, userIdNotIn } = req.query;

   return res.status(200).json(
    await new Fetching({
     token: req.cookies["token"],
    }).fetch({
     postIdNotIn: Array.isArray(postIdNotIn) ? postIdNotIn : [],
     userIdNotIn: Array.isArray(userIdNotIn) ? userIdNotIn : [],
     skip: typeof Number(skip) === "number" ? Number(skip) : 0,
     take: typeof Number(take) === "number" ? Number(take) : 15,
    })
   );
  }

  default: {
   return res.status(405).json({ error: "Method Not Allowed" });
  }
 }
}

export default use(restrictAccess(["POST"]), handler);
