import { MutableRefObject, useEffect } from "react";

/**
 * Hook that alerts clicks outside of the passed ref
 */
export default function useOutsideAlerter(
 ref: MutableRefObject<null>,
 callback: () => void,
 // eslint-disable-next-line
 handler?: (e: MouseEvent) => void
) {
 useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
   if (ref.current && !(ref.current as any).contains(event.target)) {
    callback();
   }
  }

  const listener = handler ? handler : handleClickOutside;

  document.addEventListener("mousedown", listener);

  return () => {
   document.removeEventListener("mousedown", listener);
  };
 }, [ref]);
}
