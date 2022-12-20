import create from "zustand";
import { User } from "@prisma/client";
import { persist } from "zustand/middleware";

export interface State {
 user: User | null;
 // eslint-disable-next-line no-unused-vars
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
  {
   name: "store",
   getStorage: () => ({
    setItem: (...args) => window.localStorage.setItem(...args),
    removeItem: (...args) => window.localStorage.removeItem(...args),
    getItem: async (...args) =>
     new Promise((resolve) => {
      if (typeof window === "undefined") {
       resolve(null);
      } else {
       setTimeout(() => {
        resolve(window.localStorage.getItem(...args));
       }, 0);
      }
     }),
   }),
  }
 )
);

export default useStore;
