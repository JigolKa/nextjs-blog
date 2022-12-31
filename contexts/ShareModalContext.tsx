import { createContext, Dispatch, SetStateAction, useState } from "react";
import { ContextProviderProps } from "..";

export const ShareModalContext = createContext<{
 open: boolean;
 slug: string | null;
 setOpen: Dispatch<SetStateAction<boolean>> | null;
 setSlug: Dispatch<SetStateAction<string | null>> | null;
}>({
 open: false,
 slug: null,
 setSlug: null,
 setOpen: null,
});

export default function ShareModalProvider({ children }: ContextProviderProps) {
 const [open, setOpen] = useState(false);
 const [slug, setSlug] = useState<string | null>(null);

 return (
  <ShareModalContext.Provider value={{ open, slug, setSlug, setOpen }}>
   {children}
  </ShareModalContext.Provider>
 );
}
