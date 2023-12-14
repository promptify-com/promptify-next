import { setCookie } from "@/common/helpers/cookies";
import { NextRouter } from "next/router";

export const switchVariant = (variant: string, router: NextRouter) => {
  const newVariant = variant === "a" ? "b" : "a";
  setCookie("variant", newVariant, 30);

  router.replace({ pathname: router.pathname, query: { ...router.query, variant: newVariant } }, undefined, {
    shallow: true,
  });
};
