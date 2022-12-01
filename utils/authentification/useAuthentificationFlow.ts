import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { LoginValues, SignUpValues } from "../..";
import cookies from "../cookies";
import { resetUser, setUser } from "../../state/reducers/userSlice";
import setAuthorization from "../api/auth/setAuthorization";
import { useAppSelector } from "../../state/hooks";
import getUrlParams from "../strings/parseUrl";

export default function useAuthentificationFlow() {
 const [loading, setLoading] = useState(false);
 const router = useRouter();
 const dispatch = useDispatch();
 const { user } = useAppSelector((s) => s.user);
 const [url, setUrl] = useState({
  returnUrl: "",
 });

 useEffect(() => {
  const params = getUrlParams(window.location.search);

  setUrl(params as typeof url);
 }, []);

 return {
  loading,

  user: user,

  signup: async ({ username, email, password }: SignUpValues) => {
   setLoading(true);

   try {
    const response = await axios.post("/api/user", {
     username: `@${username}`,
     password: Buffer.from(password).toString("base64"),
     email: email,
    });

    if (response.status === 200) {
     cookies.set("token", response.data.token);
     dispatch(setUser(response.data.user));

     toast("Account created successfully");

     router.push(url["returnUrl"] ? url["returnUrl"] : "/");
     return;
    }
   } catch (error: any) {
    setLoading(false);
    toast(
     error.response.data.error
      ? `Account creation failed, ${error.response.data.error}`
      : "Please try again later"
    );
   }
  },

  login: async ({ email, password }: LoginValues) => {
   setLoading(true);

   try {
    const response = await axios.post("/api/user/auth", {
     login: Buffer.from(email).toString("base64"),
     password: Buffer.from(password).toString("base64"),
    });

    if (response.status === 200) {
     cookies.set("token", response.data);
     console.log("before request", response.data, cookies.get("token"));
     const user = await axios.get("/api/user", setAuthorization(response.data));

     dispatch(setUser(user.data));

     toast("Successfully connected");

     router.push(url["returnUrl"] ? url["returnUrl"] : "/");
     return;
    }
   } catch (error: any) {
    setLoading(false);
    toast(
     error.response.data.error
      ? `Login failed, ${error.response.data.error}`
      : "Please try again later"
    );
   }

   //TODO: hashmaps of status codes
  },

  logout: () => {
   cookies.delete("token");
   dispatch((resetUser as any)());

   toast("Successfully disconnected");
  },
 };
}
