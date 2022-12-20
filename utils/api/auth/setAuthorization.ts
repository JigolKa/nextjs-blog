import { AxiosRequestConfig } from "axios";

export default function setAuthorization(jwt: string): AxiosRequestConfig {
 return {
  headers: {
   Authorization: `Bearer ${jwt}`,
  },
 };
}
