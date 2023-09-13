import { useRouter } from "next/router";

export default function useBrowser() {
  const router = useRouter();

  const replaceHistoryByPathname = (pathname: string, delay: number = 1000) => {
    setTimeout(() => {
      // router.replace({ pathname }, undefined, { shallow: true, scroll: false });
      // workaround for https://github.com/vercel/next.js/issues/37362
      // router.replace causes cancellation issue which nextjs unresolved internal bug
      window.history.replaceState({}, "", pathname);
    }, delay);
  };

  return { replaceHistoryByPathname };
}
