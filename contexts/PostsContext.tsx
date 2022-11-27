import { createContext, Dispatch, SetStateAction, useState } from "react";
import { ContextProviderProps, FullPost } from "..";

export interface PostsContextProps {
 cache: {
  cached: boolean;
  setCached: Dispatch<SetStateAction<boolean>> | null;
 };

 feed: {
  posts: FullPost[];
  setPosts: Dispatch<SetStateAction<FullPost[]>> | null;
 };
}

export const PostsContext = createContext<PostsContextProps>({
 cache: {
  setCached: null,
  cached: false,
 },
 feed: {
  posts: [],
  setPosts: null,
 },
});

export default function PostsContextProvider(props: ContextProviderProps) {
 const [cached, setCached] = useState(false);
 const [posts, setPosts] = useState<FullPost[]>([]);

 return (
  <PostsContext.Provider
   value={{ cache: { cached, setCached }, feed: { posts, setPosts } }}
  >
   {props.children}
  </PostsContext.Provider>
 );
}
