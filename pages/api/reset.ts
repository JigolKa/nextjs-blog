import { NextApiRequest, NextApiResponse } from "next";
import { use } from "next-api-route-middleware";
import prisma from "../../prisma/instance";
import debugMethod from "../../utils/middleware/debugMethod";

async function handler(req: NextApiRequest, res: NextApiResponse) {
 const comments = await prisma.comment.deleteMany();
 const posts = await prisma.post.deleteMany();
 const activations = await prisma.activation.deleteMany();
 const users = await prisma.user.deleteMany();

 return res.status(200).json({ comments, posts, activations, users });
}

export default use(debugMethod, handler);
