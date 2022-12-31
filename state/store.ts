import create from "zustand";
import { User } from "@prisma/client";
import { persist } from "zustand/middleware";
import { useState, useEffect } from "react";

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

//! really ugly shit, but works
// https://github.com/pmndrs/zustand/issues/324#issuecomment-1028416353
type StateData = Omit<State, "setUser" | "resetUser">;

const defaultState: StateData = { user: null };

// eslint-disable-next-line
export const useStoreSSR = <U>(selector: (s: StateData) => U) => {
 const defaultValue = selector(defaultState);
 const [value, setValue] = useState(defaultValue);
 const zustandValue = useStore(selector);

 useEffect(() => setValue(zustandValue), []);
 return value;
};
