import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import setAuthorization from "../api/auth/setAuthorization";
import cookies from "../cookies";
import { setUser } from "../../state/reducers/userSlice";

export default function useRefresh() {
 const { user } = useAppSelector((state) => state.user);
 const dispatch = useAppDispatch();
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
    .then((res) => dispatch(setUser(res.data)));
   return;
  }

  axios
   .get("/api/user", setAuthorization(token))
   .then((res) => dispatch(setUser(res.data)));
 }, []);
}
