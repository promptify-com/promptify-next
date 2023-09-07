import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface Props {
  shouldShowOverlayCallback?: (url: string) => boolean;
  onCloseDrawerCallback?: () => void;
}

export const useRouteChangeOverlay = ({
  shouldShowOverlayCallback = () => false,
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

    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, [router, shouldShowOverlayCallback, onCloseDrawerCallback]);

  return { showOverlay };
};
