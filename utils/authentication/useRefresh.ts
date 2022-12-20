import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useStore from "../../state/store";
import setAuthorization from "../api/auth/setAuthorization";
import cookies from "../cookies";

export default function useRefresh() {
 const { user, setUser } = useStore();
 const router = useRouter();

 useEffect(() => {
  if (window.location.pathname === "/login") {
   return;
  }

  const token = cookies.get("token");

  if (!token) {
   router.push("/login");
   return;
  }

  if (token && !user) {
   axios
    .get("/api/user", setAuthorization(token))
    .then((res) => setUser(res.data));
   return;
  }

  axios
   .get("/api/user", setAuthorization(token))
   .then((res) => setUser(res.data));
 }, []);
}
