import "../styles/normalize.css";
import "react-toastify/dist/ReactToastify.min.css";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import SearchProvider from "../contexts/SearchContext";
import { ToastContainer } from "react-toastify";
import Head from "next/head";
import Layout from "../components/Layout";
import ShareModalProvider from "../contexts/ShareModalContext";

function App({ Component, pageProps }: AppProps) {
 return (
  <>
   <Head>
    <meta charSet="UTF-8" />
    <meta name="author" content="JigolKa" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="shortcut icon" href="/assets/favicon.ico" type="image/x-icon" />
   </Head>
   <SearchProvider>
    <ShareModalProvider>
     <Layout excludedRoutes={["/404", "/_error"]}>
      <Component {...pageProps} />
     </Layout>
    </ShareModalProvider>
    <ToastContainer
     position="bottom-right"
     autoClose={3500}
     hideProgressBar={false}
     newestOnTop={false}
     closeOnClick
     rtl={false}
     draggable
     pauseOnHover
     theme="light"
     progressClassName="toast-progress-bar"
    />
   </SearchProvider>
  </>
 );
}

export default App;
