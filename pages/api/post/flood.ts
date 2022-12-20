import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { use } from "next-api-route-middleware";
import setAuthorization from "../../../utils/api/auth/setAuthorization";
import debugMethod from "../../../utils/middleware/debugMethod";

async function handler(req: NextApiRequest, res: NextApiResponse) {
 res.end();
 const token = await axios.post("http://localhost:3000/api/token/generate");

 for (let i = 30; i < 900; i++) {
  await axios.post(
   "http://localhost:3000/api/post",
   {
    description: new Array(i)
     .fill(0)
     .map(() => "lorem ipsum, ")
     .join(","),
    title: `Flood n°${i}`,
   },
   setAuthorization(token.data)
  );
 }
}

export default use(debugMethod, handler);
