import create from "zustand";
import { User } from "@prisma/client";
import { persist } from "zustand/middleware";

export interface State {
 user: User | null;
 // eslint-disable-next-line
 setUser: (user: User) => void;
 resetUser: () => void;
}

const useStore = create(
 persist<State>(
  (set) => ({
   user: null,
   setUser: (user) => set({ user: user }),
   resetUser: () => set({ user: null }),
  }),
  { name: "Store" }
 )
);

export default useStore;
