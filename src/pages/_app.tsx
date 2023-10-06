import "@/styles/globals.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/space-mono/400.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material";
import { wrapper } from "@/core/store";
import { theme } from "@/theme";
import Head from "next/head";
import Script from "next/script";
import { Provider } from "react-redux";
import { useEffect } from "react";
import useToken from "@/hooks/useToken";
import { isValidUserFn, updateUser } from "@/core/store/userSlice";
import { userApi } from "@/core/api/user";
import Storage from "@/common/storage";
import { useRouter } from "next/router";
import { deletePathURL, savePathURL } from "@/common/utils";

function App({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { pageProps } = props;
  const isValidUser = isValidUserFn(store.getState());
  const storedToken = useToken();
  const router = useRouter();

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
        {router.pathname !== "/signin" && (
          <>
            <Script
              strategy="lazyOnload"
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
            />
            <Script strategy="lazyOnload">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
                page_path: window.location.pathname,
                });
            `}
            </Script>
            <Script
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
              (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:${process.env.NEXT_PUBLIC_HOTJAR_ID},hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
              `,
              }}
            />
          </>
        )}

        <Head>
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
        </Head>
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  );
}
export default App;
