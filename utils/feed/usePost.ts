import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import { PostValues } from "../../pages/new";
import { useAppSelector } from "../../state/hooks";

export default function usePost() {
 const [loading, setLoading] = useState(false);
 const router = useRouter();
 const { user } = useAppSelector((s) => s.user);

 return {
  loading,

  createPost: async ({ description, title }: PostValues) => {
   setLoading(true);

   try {
    const response = await axios.post("/api/post", {
     title: title,
     description: description,
     authorId: user ? user.userId : null,
    });

    if (response.status === 200) {
     toast("Post successfully created");

     router.push("/");
     return;
    }
   } catch (error: any) {
    setLoading(false);
    toast(`Creation of post failed, ${error.response.data.error}`);
   }

   //TODO: hashmaps of status codes
  },
 };
}
