import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Cookie from "@/common/helpers/cookies";
import { setAnswers } from "@/core/store/chatSlice";
import { setGeneratedExecution, setSelectedExecution } from "@/core/store/executionsSlice";
import { setActiveToolbarLink } from "@/core/store/templatesSlice";
import { useAppDispatch } from "@/hooks/useStore";

declare global {
  var gtag: (arg1: string, arg2: string, arg3: Record<string, string>) => void;
}

const useVariant = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [variant, setVariant] = useState<string>("a");

  const isVariantB = variant === "b";
  const isVariantA = variant === "a";

  useEffect(() => {
    const cookieVariant = Cookie.get("variant");
    let variant = cookieVariant ?? (router.query.variant as string);

    if (!variant) {
      variant = Math.random() < 0.5 ? "a" : "b";
    }

    setVariant(variant);

    if (!cookieVariant) {
      sendPageViewEvent();

      Cookie.set("variant", variant, 30);
    }

    if (router.query.variant !== variant) {
      router.replace({ pathname: router.pathname, query: { ...router.query, variant } }, undefined, { shallow: true });
    }

    function sendPageViewEvent() {
      if (typeof window.gtag === "undefined") {
        const intervalID = setInterval(() => {
          if (typeof window.gtag === "function") {
            window.gtag("event", "pageview", { Branch: `staging-${variant}` });
            clearInterval(intervalID);
          }
        }, 1000);
      } else {
        window.gtag("event", "pageview", { Branch: `staging-${variant}` });
      }
    }
  }, [router]);

  const clearStoredStates = () => {
    dispatch(setActiveToolbarLink(null));
    dispatch(setAnswers([]));
    dispatch(setSelectedExecution(null));
    dispatch(setGeneratedExecution(null));
  };

  const switchVariant = () => {
    const newVariant = variant === "a" ? "b" : "a";
    setVariant(newVariant);

    Cookie.set("variant", newVariant, 30);
    clearStoredStates();

    router.replace({ pathname: router.pathname, query: { ...router.query, variant: newVariant } }, undefined, {
      shallow: true,
    });
  };

  return { switchVariant, variant, isVariantA, isVariantB };
};

export default useVariant;
