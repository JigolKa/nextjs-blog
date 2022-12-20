import { useEffect, useState, Dispatch, SetStateAction } from "react";

export default function useStrength(value: string) {
 const [score, setScore] = useState(0);

 useEffect(() => {
  setScore(value.length <= 10 ? value.length * 2 : 20);

  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?À-ÿ]+/.test(value))
   setScore((p) => (p += 40));

  if (/\d/.test(value)) setScore((p) => (p += 20));

  if (/[A-Z]/.test(value)) setScore((p) => (p += 20));
 }, [value]);

 return [score, setScore] as [number, Dispatch<SetStateAction<number>>];
}
