import "@/styles/globals.css";
import { Poppins, Space_Mono } from "next/font/google";
import { useRouter } from "next/router";
import { useEffect } from "react";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import Script from "next/script";
import { Provider } from "react-redux";
import { wrapper } from "@/core/store";
import { theme } from "@/theme";
import useToken from "@/hooks/useToken";
import { isValidUserFn, updateUser } from "@/core/store/userSlice";
import { userApi } from "@/core/api/user";
import Storage from "@/common/storage";
import { deletePathURL, savePathURL } from "@/common/utils";
import Toaster from "@/components/Toaster";
import Seo from "@/components/Seo";
import type { User } from "@/core/api/dto/user";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["400", "500"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["400"],
});

function App({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { pageProps } = props;
  const isValidUser = isValidUserFn(store.getState());
  const storedToken = useToken();
  const router = useRouter();

  useEffect(() => {
    const _updateUser = async () => {
      const payload = await store.dispatch(userApi.endpoints.getCurrentUser.initiate(storedToken));

      if (!payload.data) {
        return;
      }

      store.dispatch(updateUser(payload.data));
    };

    if (!isValidUser && storedToken) {
      const _currentUser = Storage.get("currentUser") as unknown as User;

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
    const viewportMetaTagElement = document.querySelector("[name=viewport]");

    if (viewportMetaTagElement && navigator.userAgent.includes("iPhone")) {
      viewportMetaTagElement.setAttribute("content", "width=device-width, initial-scale=1");
    }
    document.body.className = `${poppins.variable} font-sans ${spaceMono.variable} font-sans`;
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        {router.pathname !== "/signin" && (
          <>
            <Script
              strategy="lazyOnload"
              defer
              dangerouslySetInnerHTML={{
                __html: `(function(w,d,s,l){
                  w[l]=w[l]||[];
                  var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.defer;
                  j.src='https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}';
                  f.parentNode.insertBefore(j,f);
                  function gtag(){w[l].push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {page_path: window.location.pathname});
                })(window,document,'script','dataLayer');`,
              }}
            />
            <Script
              strategy="lazyOnload"
              defer
              dangerouslySetInnerHTML={{
                __html: `
              (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:${process.env.NEXT_PUBLIC_HOTJAR_ID},hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.defer;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
              `,
              }}
            />
          </>
        )}
        <Seo
          title={pageProps?.title}
          description={pageProps?.description}
          image={pageProps?.image}
          meta_keywords={pageProps?.meta_keywords}
        />
        <Toaster />
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  );
}
export default App;
