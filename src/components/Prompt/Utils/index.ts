import Cookie from "@/common/helpers/cookies";
import { NextRouter } from "next/router";

export const switchVariant = (variant: string, router: NextRouter) => {
  const newVariant = variant === "a" ? "b" : "a";
  Cookie.set("variant", newVariant, 30);

  router.replace({ pathname: router.pathname, query: { ...router.query, variant: newVariant } }, undefined, {
    shallow: true,
  });
};

export const isImageOutput = (output: string, engineType: "TEXT" | "IMAGE"): boolean => {
  try {
    const imgURL = new URL(output);
    const IsImage = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"].some(extension =>
      imgURL.pathname.endsWith(extension),
    );

    return IsImage || engineType === "IMAGE";
  } catch {
    return false;
  }
};
