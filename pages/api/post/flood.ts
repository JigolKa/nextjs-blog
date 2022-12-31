import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { use } from "next-api-route-middleware";
import setAuthorization from "../../../utils/api/auth/setAuthorization";
import debugMethod from "../../../utils/middleware/debugMethod";

async function handler(req: NextApiRequest, res: NextApiResponse) {
 const count = req.body.count ? Number(req.body.count) : 50;
 res.send(`Flooding ${count} posts`);
 const token = await axios.post("http://localhost:3000/api/token/generate");

 for (let i = 0; i < count; i++) {
  await axios.post(
   "http://localhost:3000/api/post",
   {
    description: "# LOREM IPSUM",
    title: `Flood n°${i}`,
   },
   setAuthorization(token.data)
  );
 }
}

export default use(debugMethod, handler);
