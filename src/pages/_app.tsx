import "@/styles/globals.css";
import { Poppins } from "next/font/google";
import { useRouter } from "next/router";
import { useEffect } from "react";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import Script from "next/script";
import { Provider } from "react-redux";
import store from "@/core/store";
import { theme } from "@/theme";
import useToken from "@/hooks/useToken";
import { isValidUserFn, updateUser } from "@/core/store/userSlice";
import { userApi } from "@/core/api/user";
import { LocalStorage } from "@/common/storage";
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

function App({ Component, pageProps }: AppProps) {
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
      const _currentUser = LocalStorage.get("currentUser") as unknown as User;

      if (_currentUser && Object.values(_currentUser).length) {
        store.dispatch(updateUser(_currentUser));
        return;
      }

      _updateUser();
    }
  }, [storedToken, isValidUser]);

  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      if (url.startsWith("/signin")) {
        savePathURL(window.location.pathname);
      } else {
        deletePathURL();
      }

      const cleanedAsPath = router.asPath.includes("?") ? router.asPath.split("?")[0] : router.asPath;
      const cleanedUrl = url.includes("?") ? url.split("?")[0] : url;

      if (cleanedAsPath !== cleanedUrl) {
        const _navigationLoadingSpinnerOverlay = document.querySelector(".navigationSpinnerOverlay");

        if (!_navigationLoadingSpinnerOverlay) {
          const navigationLoadingSpinnerOverlay = document.createElement("div");
          const navigationLoadingSpinner = document.createElement("div");
          navigationLoadingSpinner.id = "navigation-loading";

          navigationLoadingSpinnerOverlay.classList.add("navigationSpinnerOverlay");
          navigationLoadingSpinnerOverlay.appendChild(navigationLoadingSpinner);
          document.body.appendChild(navigationLoadingSpinnerOverlay);
        } else {
          _navigationLoadingSpinnerOverlay.classList.remove("hidden");
        }
      }
    };
    const handleRouteChangeComplete = (_url: string) => {
      const _navigationLoadingSpinnerOverlay = document.querySelector(".navigationSpinnerOverlay");

      if (_navigationLoadingSpinnerOverlay) {
        _navigationLoadingSpinnerOverlay.classList.add("hidden");
      }
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, [router]);

  useEffect(() => {
    const viewportMetaTagElement = document.querySelector("[name=viewport]");

    if (viewportMetaTagElement && navigator.userAgent.includes("iPhone")) {
      viewportMetaTagElement.setAttribute("content", "width=device-width, initial-scale=1");
    }
    document.body.className = `${poppins.variable} font-sans`;
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
