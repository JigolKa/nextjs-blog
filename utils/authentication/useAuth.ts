import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { LoginValues, SignUpValues } from "../..";
import cookies from "../cookies";
import setAuthorization from "../api/auth/setAuthorization";
import getUrlParams from "../strings/parseUrl";
import useStore from "../../state/store";

export default function useAuth() {
 const [loading, setLoading] = useState(false);
 const router = useRouter();
 const [url, setUrl] = useState({
  returnUrl: "",
 });
 const { user, setUser, resetUser } = useStore();

 useEffect(() => {
  const params = getUrlParams(window.location.search);

  setUrl(params as typeof url);
 }, []);

 return {
  loading,

  currentUser: user,

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
     setUser(response.data.user);

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
     const user = await axios.get("/api/user", setAuthorization(response.data));

     setUser(user.data);

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
   resetUser();

   toast("Successfully disconnected");
  },
 };
}
