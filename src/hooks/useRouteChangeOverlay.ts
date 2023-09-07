import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { useWindowSize } from "usehooks-ts";

export const useRouteChangeOverlay = (
  shouldShowOverlayCallback?: (url: string) => boolean,
  onCloseDrawerCallback?: () => void,
) => {
  const router = useRouter();
  const { width: windowWidth } = useWindowSize();

  const IS_MOBILE = windowWidth < 900;

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

    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, [router, shouldShowOverlayCallback, onCloseDrawerCallback]);

  return { showOverlay, IS_MOBILE };
};
