import { NextApiRequest, NextApiResponse } from "next";
import { use } from "next-api-route-middleware";
import prisma from "../../../prisma/instance";
import debugMethod from "../../../utils/middleware/debugMethod";

async function handler(req: NextApiRequest, res: NextApiResponse) {
 res.status(200).json(await prisma.post.deleteMany());
}

export default use(debugMethod, handler);
