import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface Props {
  shouldShowOverlayCallback?: (url: string) => boolean;
  onCloseDrawerCallback?: () => void;
}

export const useRouteChangeOverlay = ({
  shouldShowOverlayCallback = () => true,
  onCloseDrawerCallback = () => {},
}: Props = {}) => {
  const router = useRouter();

  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      setShowOverlay(shouldShowOverlayCallback ? shouldShowOverlayCallback(url) : true);
    };
    const handleRouteChangeComplete = () => {
      setShowOverlay(false);
      if (onCloseDrawerCallback) {
        onCloseDrawerCallback();
      }
    };
    const handleRouteError = (error: any, url: string, { shallow }: any) => {
      console.warn("[routeChangeError]", { cancelled: error.cancelled, shallow, url });
      setShowOverlay(false);
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    router.events.on("routeChangeError", handleRouteError);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
      router.events.off("routeChangeError", handleRouteError);
    };
  }, [router, shouldShowOverlayCallback, onCloseDrawerCallback]);

  return { showOverlay };
};
