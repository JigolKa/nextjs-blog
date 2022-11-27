import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import cookies from "../cookies";
import { setUser } from "../../state/reducers/userSlice";
import setAuthorization from "../api/auth/setAuthorization";
import { useAppSelector } from "../../state/hooks";

export default function useUpdateAccount() {
 const [loading, setLoading] = useState(false);
 const dispatch = useDispatch();
 const { user } = useAppSelector((s) => s.user);

 return {
  loading,

  user: user,

  update: async (
   { password, ...rest }: { [key: string]: string },
   userId: string
  ) => {
   setLoading(true);

   if (!user) {
    setLoading(false);
    return;
   }

   try {
    const response = await axios.patch(
     `/api/user/${userId}/edit`,
     {
      password: Buffer.from(password).toString("base64"),
      ...rest,
     },
     setAuthorization(cookies.get("token") || "")
    );

    if (response.status === 200) {
     cookies.set("token", response.data.token);
     dispatch(setUser(response.data.user));
     setLoading(false);

     toast("Account updated successfully");
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
 };
}
