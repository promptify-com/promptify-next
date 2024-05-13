import { useEffect, useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";

export default function useBrowser(noSsr?: boolean) {
  const [clientLoaded, setClientLoaded] = useState(false);
  const { breakpoints } = useTheme();
  const isMobile = useMediaQuery(breakpoints.down("sm"), { noSsr });

  useEffect(() => {
    setClientLoaded(true);
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
