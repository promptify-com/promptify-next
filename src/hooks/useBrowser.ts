import { useRouter } from "next/router";
import { isDesktopViewPort } from "@/common/helpers";

export default function useBrowser() {
  const router = useRouter();

  const viewport = router.query.viewport ?? "unknown";

  const isMobile = viewport === "unknown" ? !isDesktopViewPort() : viewport === "mobile";

  const replaceHistoryByPathname = (pathname: string, delay: number = 1000) => {
    setTimeout(() => {
      // router.replace({ pathname }, undefined, { shallow: true, scroll: false });
      // workaround for https://github.com/vercel/next.js/issues/37362
      // router.replace causes cancellation issue which nextjs unresolved internal bug
      window.history.replaceState({}, "", pathname);
    }, delay);
  };

  return { replaceHistoryByPathname, isMobile };
}
