import { Middleware } from "next-api-route-middleware";

const debugMethod: Middleware = async (req, res, next) => {
 res.setHeader("Access-Control-Allow-Origin", "*");

 if (process.env.NODE_ENV !== "production") return next();

 return res.status(404).json({ error: "Not found" });
};

export default debugMethod;
