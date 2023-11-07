import { useEffect, useLayoutEffect } from "react";
import { LANGUAGES_CODE_MAPPING } from "../constants";
import { useWindowSize } from "usehooks-ts";
import { IEditPrompts } from "../types/builder";

export const isBrowser = () => typeof window !== "undefined";
export const isomorphicLayoutEffect = isBrowser() ? useLayoutEffect : useEffect;
export const stripTags = (content: string) => content.replace(/<\/?[^>]+(>|$)/gi, "");
export const randomId = () => Math.floor(Math.random() * 1000000000);
export const getLanguageFromCode = (code: string) => LANGUAGES_CODE_MAPPING[code] || LANGUAGES_CODE_MAPPING["en"];
export const highlightSearch = (searchString: string, searchValue: string): string =>
  !searchValue
    ? searchString
    : searchString.replace(new RegExp(searchValue, "gi"), '<span class="highlight">$&</span>');
export const getBaseUrl = typeof window !== "undefined" && window.location.origin;
export const isDesktopViewPort = () => {
  const { width } = useWindowSize();
  return width >= 1024;
};
export const addSpaceBetweenCapitalized = (text: string) => text.replace(/([a-z])([A-Z])/g, "$1 $2");
export const promptComputeDomId = (prompt: IEditPrompts): string =>
  `prompt-${prompt.id ?? prompt.temp_id}-${prompt.title.toLowerCase().replace(/[^\w]/g, "-")}`;

export const redirectToPath = (path: string, searchParams: Record<string, string | number> = {}) => {
  if (!isBrowser()) {
    return;
  }

  const newUrl = new URL(window.location.origin);
  newUrl.pathname = path;

  if (!!Object.keys(searchParams).length) {
    for (const param in searchParams) {
      newUrl.searchParams.set(param, `${searchParams[param]}`);
    }
  }

  window.location.href = newUrl.toString();
};

export function allFieldsFilled(obj: Record<string, any>): boolean {
  return Object.values(obj).every(value => value !== "");
}
