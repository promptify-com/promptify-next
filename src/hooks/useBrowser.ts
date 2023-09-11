import { useRouter } from "next/router";

export default function useBrowser() {
  const router = useRouter();

  const replaceHistoryByPathname = (pathname: string, delay: number = 1000) => {
    setTimeout(() => {
      router.replace({ pathname }, undefined, { shallow: true, scroll: false });
    }, delay);
  };

  return { replaceHistoryByPathname };
}
