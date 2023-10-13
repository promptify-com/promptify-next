import { useEffect, useState } from "react";

export const useScrollToElement = (behavior: "auto" | "smooth") => {
  const [scrollTarget, setScrollTarget] = useState<string | null>(null);

  useEffect(() => {
    if (scrollTarget) {
      const element = document.getElementById(scrollTarget);
      if (element) {
        const y =
          element.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2 + element.clientHeight / 2;
        window.scrollTo({ top: y, behavior });
        setScrollTarget(null);
      }
    }
  }, [scrollTarget]);

  return setScrollTarget;
};
