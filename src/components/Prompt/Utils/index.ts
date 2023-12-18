import Cookie from "@/common/helpers/cookies";
import { NextRouter } from "next/router";

export const switchVariant = (variant: string, router: NextRouter) => {
  const newVariant = variant === "a" ? "b" : "a";
  Cookie.set("variant", newVariant, 30);

  router.replace({ pathname: router.pathname, query: { ...router.query, variant: newVariant } }, undefined, {
    shallow: true,
  });
};
