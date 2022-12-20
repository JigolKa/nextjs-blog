import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import getUrlParams from "../../utils/strings/parseUrl";
import { toast } from "react-toastify";
import { createStyles } from "@mantine/core";
import useStore from "../../state/store";

const useStyles = createStyles((theme) => ({
 verified: {
  width: "100vw",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",

  h1: {
   marginTop: 25,
   fontSize: 30,
  },

  p: {
   fontSize: 18,
   color: theme.colors.gray[6],
   marginTop: 5,
  },

  span: {
   color: theme.colors.gray[4],
   marginTop: 5,
  },

  svg: {
   width: "100vw",
  },
 },
}));

export default function Activate() {
 const [response, setResponse] = useState(220);
 const router = useRouter();
 const [countdown, setCoundown] = useState(5);
 const { setUser } = useStore();
 const { classes } = useStyles();

 useEffect(() => {
  const params = getUrlParams(window.location.search);

  axios
   .delete(`/api/verify/activate?id=${params["id"]}&userId=${params["userId"]}`)
   .then((res) => {
    setInterval(() => setCoundown((p) => (p >= 0 ? (p -= 1) : p)), 1000);

    setUser(res.data);
    setResponse(res.status);
    toast("Account verified successfully");
   })
   .catch(() => router.push("/"));
 }, []);

 useEffect(() => {
  if (countdown === 0) {
   router.push("/");
  }
 }, [countdown]);

 if (response === 200) {
  return (
   <>
    <style scoped>{`
  #__next, body {
    overflow: hidden !important;
  }
  `}</style>
    <div className={classes.verified}>
     <h1>Account verified!</h1>
     <p>You can now enjoy all the functionnalities of the Blog!</p>

     {countdown === 0 ? (
      <span>Redirecting now...</span>
     ) : (
      countdown > 0 && <span>Redirecting in {countdown}...</span>
     )}

     <svg
      id="visual"
      viewBox="0 0 1800 600"
      width="1800"
      height="600"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      version="1.1"
     >
      <path
       d="M0 367L42.8 368.5C85.7 370 171.3 373 257 367.3C342.7 361.7 428.3 347.3 514 350.2C599.7 353 685.3 373 771.2 385.5C857 398 943 403 1028.8 394.2C1114.7 385.3 1200.3 362.7 1286 347.8C1371.7 333 1457.3 326 1543 326.5C1628.7 327 1714.3 335 1757.2 339L1800 343L1800 601L1757.2 601C1714.3 601 1628.7 601 1543 601C1457.3 601 1371.7 601 1286 601C1200.3 601 1114.7 601 1028.8 601C943 601 857 601 771.2 601C685.3 601 599.7 601 514 601C428.3 601 342.7 601 257 601C171.3 601 85.7 601 42.8 601L0 601Z"
       fill="#69b5fa"
      ></path>
      <path
       d="M0 355L42.8 366.2C85.7 377.3 171.3 399.7 257 404.7C342.7 409.7 428.3 397.3 514 385.8C599.7 374.3 685.3 363.7 771.2 371.7C857 379.7 943 406.3 1028.8 417C1114.7 427.7 1200.3 422.3 1286 415C1371.7 407.7 1457.3 398.3 1543 387.7C1628.7 377 1714.3 365 1757.2 359L1800 353L1800 601L1757.2 601C1714.3 601 1628.7 601 1543 601C1457.3 601 1371.7 601 1286 601C1200.3 601 1114.7 601 1028.8 601C943 601 857 601 771.2 601C685.3 601 599.7 601 514 601C428.3 601 342.7 601 257 601C171.3 601 85.7 601 42.8 601L0 601Z"
       fill="#4e9ef0"
      ></path>
      <path
       d="M0 454L42.8 450.8C85.7 447.7 171.3 441.3 257 439.7C342.7 438 428.3 441 514 447.8C599.7 454.7 685.3 465.3 771.2 467.7C857 470 943 464 1028.8 454.3C1114.7 444.7 1200.3 431.3 1286 428.3C1371.7 425.3 1457.3 432.7 1543 442.8C1628.7 453 1714.3 466 1757.2 472.5L1800 479L1800 601L1757.2 601C1714.3 601 1628.7 601 1543 601C1457.3 601 1371.7 601 1286 601C1200.3 601 1114.7 601 1028.8 601C943 601 857 601 771.2 601C685.3 601 599.7 601 514 601C428.3 601 342.7 601 257 601C171.3 601 85.7 601 42.8 601L0 601Z"
       fill="#3886e4"
      ></path>
      <path
       d="M0 526L42.8 521.8C85.7 517.7 171.3 509.3 257 506.8C342.7 504.3 428.3 507.7 514 503C599.7 498.3 685.3 485.7 771.2 486.2C857 486.7 943 500.3 1028.8 509.3C1114.7 518.3 1200.3 522.7 1286 523C1371.7 523.3 1457.3 519.7 1543 517.2C1628.7 514.7 1714.3 513.3 1757.2 512.7L1800 512L1800 601L1757.2 601C1714.3 601 1628.7 601 1543 601C1457.3 601 1371.7 601 1286 601C1200.3 601 1114.7 601 1028.8 601C943 601 857 601 771.2 601C685.3 601 599.7 601 514 601C428.3 601 342.7 601 257 601C171.3 601 85.7 601 42.8 601L0 601Z"
       fill="#296ed7"
      ></path>
      <path
       d="M0 552L42.8 552.2C85.7 552.3 171.3 552.7 257 554.7C342.7 556.7 428.3 560.3 514 553.8C599.7 547.3 685.3 530.7 771.2 527.7C857 524.7 943 535.3 1028.8 534.8C1114.7 534.3 1200.3 522.7 1286 518.7C1371.7 514.7 1457.3 518.3 1543 523C1628.7 527.7 1714.3 533.3 1757.2 536.2L1800 539L1800 601L1757.2 601C1714.3 601 1628.7 601 1543 601C1457.3 601 1371.7 601 1286 601C1200.3 601 1114.7 601 1028.8 601C943 601 857 601 771.2 601C685.3 601 599.7 601 514 601C428.3 601 342.7 601 257 601C171.3 601 85.7 601 42.8 601L0 601Z"
       fill="#2456c7"
      ></path>
     </svg>
    </div>
   </>
  );
 }
}
