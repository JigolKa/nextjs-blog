import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import cookies from "../cookies";
import setAuthorization from "../api/auth/setAuthorization";
import useStore from "../../state/store";

export default function useUpdateAccount() {
 const [loading, setLoading] = useState(false);
 const { user, setUser } = useStore();

 return {
  loading,

  user: user,

  update: async (values: { [key: string]: string }, userId: string) => {
   setLoading(true);

   if (!user) {
    setLoading(false);
    return;
   }

   const filteredValues: { [key: string]: any } = {};

   for (let i = 0; i < Object.keys(values).length; i++) {
    const key = Object.keys(values)[i];

    if (key === "password") {
     const password = Buffer.from(key, "base64").toString("ascii");
     filteredValues[key] = password;
    } else {
     filteredValues[key] = values[key];
    }
   }

   try {
    const response = await axios.patch(
     `/api/user/${userId}/edit`,
     filteredValues,
     setAuthorization(cookies.get("token") || "")
    );

    if (response.status === 200) {
     cookies.set("token", response.data.token);
     setUser(response.data.user);
     setLoading(false);

     toast("Account updated successfully");
     return;
    }
   } catch (error: any) {
    setLoading(false);
    // toast(
    //  error.response.data.error
    //   ? `Account modification failed, ${error.response.data.error}`
    //   : "Please try again later"
    // );
   }
  },
 };
}
