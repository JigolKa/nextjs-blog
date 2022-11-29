import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/instance";
import sendMail from "../../../utils/api/mail";
import config from "../../../utils/config";
import createLogs from "../../../utils/logs";

export default async function handler(
 req: NextApiRequest,
 res: NextApiResponse
) {
 if (process.env.NODE_ENV !== "production") createLogs(req);
 res.setHeader("Access-Control-Allow-Origin", "*");
 switch (req.method) {
  case "GET": {
   const activations = await prisma.activation.findMany();
   return res.status(200).json(activations);
  }

  case "POST": {
   const { userId } = req.body;

   if (!userId) {
    res.status(400).json({ error: "Missing required fields" });
    return;
   }

   const user = await prisma.user.findFirst({
    where: {
     userId: userId,
    },
   });

   if (!user) return res.status(404).json({ error: "Not found" });

   const activation = await prisma.activation.create({
    data: {
     userId: userId,
    },
   });

   await sendMail({
    from: "Awesome Blog AwesomeBlog36@gmail.com",
    to: user.email,
    subject: "Activate your new account!",
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
     <a href="${config.BASE_URL}/account/activate?userId=${user.userId}&id=${activation.activationId}">Click here to activate your account</a>
    </body>
    </html>`,
   });

   return res.status(200).json({ activationId: activation.activationId });
  }

  case "DELETE": {
   const { id, userId } = req.query;

   if (!(id || userId)) {
    res.status(400).json({ error: "Missing required fields" });
    return;
   }

   const activation = await prisma.activation.findFirst({
    where: {
     AND: [
      {
       userId: userId as string,
      },
      {
       activationId: id as string,
      },
     ],
    },
   });

   if (!activation || !activation?.active) {
    res.status(404).json({ error: "Wrong id" });
    return;
   }

   const user = await prisma.user.update({
    where: {
     userId: userId as string,
    },
    data: {
     activated: true,
    },
   });

   await prisma.activation.update({
    where: {
     activationId: id as string,
    },
    data: {
     active: false,
    },
   });

   res.status(200).json(user);

   return;
  }

  case "PATCH": {
   const activations = await prisma.activation.deleteMany();

   return res.status(200).json(activations);
  }

  default: {
   return res.status(405).json({ error: "Method Not Allowed" });
  }
 }
}
