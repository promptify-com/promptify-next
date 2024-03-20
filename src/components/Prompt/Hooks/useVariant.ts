import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Cookie from "@/common/helpers/cookies";
import { useAppDispatch } from "@/hooks/useStore";

declare global {
  var gtag: (arg1: string, arg2: string, arg3: Record<string, string>) => void;
}

function getRandomVariant() {
  return Math.random() < 0.5 ? "a" : "b";
}

// TODO: (to be removed) any needed piece of code not related to variation can be moved from here
const useVariant = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isAutomationPage = router.pathname.includes("/automation");
  const [variant, setVariant] = useState<string>(
    isAutomationPage
      ? "b"
      : (router.query.variant as string) !== "unknown"
      ? (router.query.variant as string)
      : getRandomVariant(),
  );

  const isVariantB = variant === "b";
  const isVariantA = variant === "a";

  useEffect(() => {
    if (isAutomationPage) {
      return;
    }
    Cookie.remove("variant");
    // const cookieVariant = Cookie.get("variant");
    // let effectiveVariant = cookieVariant ?? variant;

    // if (!effectiveVariant) {
    //   effectiveVariant = getRandomVariant();
    // }

    // setVariant(effectiveVariant);

    // if (!cookieVariant) {
    //   sendPageViewEvent();

    //   Cookie.set("variant", effectiveVariant, 30);
    // }

    // if (router.query.variant !== effectiveVariant) {
    //   const { hash, ...queries } = router.query;
    //   router.replace({ pathname: router.pathname, query: { ...queries, variant: effectiveVariant } }, undefined, {
    //     shallow: true,
    //   });
    // }

    // function sendPageViewEvent() {
    //   if (typeof window.gtag === "undefined") {
    //     const intervalID = setInterval(() => {
    //       if (typeof window.gtag === "function") {
    //         window.gtag("event", "pageview", { Branch: `staging-${effectiveVariant}` });
    //         clearInterval(intervalID);
    //       }
    //     }, 1000);
    //   } else {
    //     window.gtag("event", "pageview", { Branch: `staging-${effectiveVariant}` });
    //   }
    // }
  }, [router]);

  const switchVariant = () => {
    // const newVariant = variant === "a" ? "b" : "a";
    // setVariant(newVariant);
    // Cookie.set("variant", newVariant, 30);
    // dispatch(clearExecutionsStates());
    // dispatch(clearChatStates());
    // dispatch(setActiveToolbarLink(null));
    // const { hash, ...queries } = router.query;
    // router.replace({ pathname: router.pathname, query: { ...queries, variant: newVariant } }, undefined, {
    //   shallow: true,
    // });
  };

  return { switchVariant, variant, isVariantA, isVariantB, isAutomationPage };
};

export default useVariant;
