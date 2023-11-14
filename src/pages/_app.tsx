import "@/styles/globals.css";

import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { ThemeProvider } from "@mui/material/styles";
import { wrapper } from "@/core/store";
import { theme } from "@/theme";
import Head from "next/head";
import { Provider } from "react-redux";
import { useEffect, useState } from "react";
import useToken from "@/hooks/useToken";
import { isValidUserFn, updateUser } from "@/core/store/userSlice";
import { userApi } from "@/core/api/user";
import Storage from "@/common/storage";
import { useRouter } from "next/router";
import { deletePathURL, savePathURL } from "@/common/utils";

const AnalyticsScripts = dynamic(
  () => import("@/components/global/AnalyticsScript").then(mod => mod.AnalyticsScripts),
  {
    ssr: false,
  },
);

function App({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { pageProps } = props;
  const isValidUser = isValidUserFn(store.getState());
  const storedToken = useToken();
  const router = useRouter();
  const [pageFullyLoaded, setPageFullyLoaded] = useState(false);

  useEffect(() => {
    const onPageLoad = () => {
      setPageFullyLoaded(true);
      // do something else
    };

    if (typeof window !== "undefined") {
      if (document.readyState === "complete") {
        onPageLoad();
      } else {
        window.addEventListener("load", onPageLoad, false);

        // Remove the event listener when the component unmounts
        return () => window.removeEventListener("load", onPageLoad);
      }
    }
  }, []);

  useEffect(() => {
    const _updateUser = async () => {
      const payload = await store.dispatch(userApi.endpoints.getCurrentUser.initiate(storedToken));

      store.dispatch(updateUser(payload.data!));
    };

    if (!isValidUser && storedToken) {
      const _currentUser = Storage.get("currentUser");

      if (_currentUser && Object.values(_currentUser).length) {
        store.dispatch(updateUser(_currentUser));
        return;
      }

      _updateUser();
    }
  }, [storedToken, isValidUser]);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (url.startsWith("/signin")) {
        savePathURL(window.location.pathname);
      } else {
        deletePathURL();
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router]);

  useEffect(() => {
    const viewportMetaTagElement = document?.querySelector("[name=viewport]") as HTMLMetaElement;

    if (navigator.userAgent.indexOf("iPhone") > -1 && !viewportMetaTagElement.content.includes("maximum-scale=1")) {
      viewportMetaTagElement.setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=1");
    }
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Head>
          <link
            rel="stylesheet"
            href="/styles/global.css"
          />
          <title>{pageProps?.title ?? "Promptify | Boost Your Creativity"}</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1"
          />
          <meta
            name="description"
            content={
              pageProps?.description ??
              "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out."
            }
          />
          <meta
            property="og:title"
            content={pageProps?.title ?? "Promptify | Boost Your Creativity"}
          />
          <meta
            property="og:description"
            content={
              pageProps?.description ??
              "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out."
            }
          />
          <meta
            property="og:image"
            content={pageProps?.image}
          />
          <meta
            property="keywords"
            content={pageProps?.meta_keywords}
          />
          <link
            rel="icon"
            href="/favicon.ico"
          />
          <link
            rel="preconnect"
            href={process.env.NEXT_PUBLIC_API_URL}
          />
          <link
            rel="preconnect"
            href="https://promptify.s3.amazonaws.com"
          />
          <link
            rel="preconnect"
            href="https://promptify.adtitan.io/"
          />
        </Head>
        <Component {...pageProps} />
        {router.pathname !== "/signin" && pageFullyLoaded && <AnalyticsScripts />}
      </ThemeProvider>
    </Provider>
  );
}
export default App;
