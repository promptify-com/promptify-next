import { useEffect, useLayoutEffect } from "react";
import { LANGUAGES_CODE_MAPPING } from "../constants";
import { useWindowSize } from "usehooks-ts";

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
  return width >= 900;
};

export const addSpaceBetweenCapitalized = (text: string) => text.replace(/([a-z])([A-Z])/g, "$1 $2");
export const promptComputeDomId = ({ title = "" }): string => `prompt-${title.toLowerCase().replace(/[^\w]/g, "-")}`;

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

export function isUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function isObject(obj: any): obj is Record<string, any> {
  return typeof obj === "object" && obj !== null;
}

export function isDeepEqual(object1: Record<string, any>, object2: Record<string, any>): boolean {
  const objKeys1 = Object.keys(object1);
  const objKeys2 = Object.keys(object2);

  if (objKeys1.length !== objKeys2.length) return false;

  for (const key of objKeys1) {
    const value1 = object1[key];
    const value2 = object2[key];

    const isObjects = isObject(value1) && isObject(value2);

    if ((isObjects && !isDeepEqual(value1, value2)) || (!isObjects && value1 !== value2)) {
      return false;
    }
  }
  return true;
}
