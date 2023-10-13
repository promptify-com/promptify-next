import { useEffect, useState } from "react";

export const useScrollToElement = (behavior: "auto" | "smooth") => {
  const [querySelector, setQuerySelector] = useState<string | null>(null);

  useEffect(() => {
    if (querySelector) {
      const element = document.getElementById(querySelector);
      if (element) {
        const y =
          element.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2 + element.clientHeight / 2;
        window.scrollTo({ top: y, behavior });
        setQuerySelector(null);
      }
    }
  }, [querySelector]);

  return setQuerySelector;
};
