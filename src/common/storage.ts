import { LCL_STR_KEY } from "./constants";
import { isBrowser } from "./helpers";
export default class Storage {
  static get(key: string): string | null {
    if (!isBrowser()) {
      return null;
    }
    try {
      return JSON.parse(localStorage.getItem(`${LCL_STR_KEY}${key}`)!);
    } catch {
      return localStorage.getItem(`${LCL_STR_KEY}${key}`);
    }
  }

  static set(key: string, item: string) {
    if (!isBrowser()) {
      return null;
    }
    localStorage.setItem(`${LCL_STR_KEY}${key}`, item);
  }

  static remove(key: string) {
    if (!isBrowser()) {
      return null;
    }
    localStorage.removeItem(`${LCL_STR_KEY}${key}`);
  }
}
