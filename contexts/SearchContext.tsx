import {
 createContext,
 createRef,
 Dispatch,
 SetStateAction,
 useEffect,
 useState,
} from "react";
import { ContextProviderProps } from "..";

export const SearchContext = createContext<{
 active: boolean;
 setActive: Dispatch<SetStateAction<boolean>> | null;
 inputRef: React.MutableRefObject<null> | null;
 dropdownRef: React.MutableRefObject<null> | null;
}>({
 active: false,
 setActive: null,
 inputRef: null,
 dropdownRef: null,
});

function SearchProvider({ children }: ContextProviderProps) {
 const [active, setActive] = useState(false);

 useEffect(() => {
  setActive(false);
 }, [typeof window !== "undefined" && window.location.href]);

 return (
  <SearchContext.Provider
   value={{
    active,
    setActive,
    inputRef: createRef(),
    dropdownRef: createRef(),
   }}
  >
   {children}
  </SearchContext.Provider>
 );
}

export default SearchProvider;
