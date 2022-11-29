import randomString from "./strings/randomString";
import { ONE_HOUR } from "./time";

const config = {
 jwt: {
  secret: "^E::k_!p`'8,}nvHD6WNlt[O9]H3Zz2)gfBC#25c1J4d@I-_%7PJ#~",
  expires: Date.now() + ONE_HOUR * 2,
 },
 BASE_URL:
  process.env.NODE_ENV === "production"
   ? "https://awesome-nextjs-blog.netlify.app"
   : "http://127.0.0.1:3000",
};

export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 128;
export const EMAIL_REGEX =
 /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;

export default config;
