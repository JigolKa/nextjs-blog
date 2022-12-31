import { AxiosRequestConfig } from "axios";

export default function setAuthorization(
 jwt: string | undefined
): AxiosRequestConfig {
 if (!jwt) return {};

 return {
  headers: {
   Authorization: `Bearer ${jwt}`,
  },
 };
}
