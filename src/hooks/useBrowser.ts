import { isDesktopViewPort } from "@/common/helpers";
import { useEffect, useState } from "react";

export default function useBrowser() {
  const [isMobile, setIsMobile] = useState(true);
  const [clientLoaded, setClientLoaded] = useState(true);

  useEffect(() => {
    setIsMobile(!isDesktopViewPort());
    setClientLoaded(false);
  }, []);

  const replaceHistoryByPathname = (pathname: string, delay: number = 1000) => {
    setTimeout(() => {
      // router.replace({ pathname }, undefined, { shallow: true, scroll: false });
      // workaround for https://github.com/vercel/next.js/issues/37362
      // router.replace causes cancellation issue which nextjs unresolved internal bug
      window.history.replaceState({}, "", pathname);
    }, delay);
  };

  return { replaceHistoryByPathname, isMobile, clientLoaded };
}
