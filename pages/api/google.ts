import google from "googlethis";
import { NextApiRequest, NextApiResponse } from "next";
import createLogs from "../../utils/logs";

const options = {
 page: 0,
 safe: false,
 parse_ads: false,
 additional_params: {
  hl: "en",
 },
};

export default async function handler(
 req: NextApiRequest,
 res: NextApiResponse
) {
 createLogs(req);
 res.setHeader("Access-Control-Allow-Origin", "*");
 switch (req.method) {
  case "GET": {
   const { q } = req.query;

   if (!q) {
    res.status(400).json({ error: "Required fields missing" });
    return;
   }

   const response = await google.search(
    decodeURIComponent(q as string),
    options
   );

   return res.status(200).json(response);
  }
 }
}
