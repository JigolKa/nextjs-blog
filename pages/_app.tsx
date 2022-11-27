import "../styles/normalize.css";
import "react-toastify/dist/ReactToastify.min.css";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { persistor, store } from "../state/store";
import { PersistGate } from "redux-persist/integration/react";
import SearchProvider from "../contexts/SearchContext";
import { ToastContainer } from "react-toastify";
import Head from "next/head";
import Layout from "../components/Layout";
import PostsContextProvider from "../contexts/PostsContext";

function App({ Component, pageProps }: AppProps) {
 return (
  <>
   <Head>
    <meta charSet="UTF-8" />
    <meta name="author" content="JigolKa" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="shortcut icon" href="/assets/favicon.ico" type="image/x-icon" />
   </Head>
   <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
     <PostsContextProvider>
      <SearchProvider>
       <Layout excludedRoutes={["/404", "/_error"]}>
        <Component {...pageProps} />
       </Layout>
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
     </PostsContextProvider>
    </PersistGate>
   </Provider>
  </>
 );
}

export default App;
