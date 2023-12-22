import { COOKIE_STR_KEY } from "../constants";
export default class Cookie {
  static get(key: string): string | null {
    if (typeof document === "undefined") {
      return null;
    }

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${COOKIE_STR_KEY}${key}=`);

    if (parts.length === 2) {
      return parts.pop()?.split(";").shift() || null;
    }

    return null;
  }

  static set(key: string, value: string, days: number): void {
    if (typeof document === "undefined") {
      return;
    }

    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${COOKIE_STR_KEY}${key}=${value}; expires=${expires}; path=/`;
  }

  static remove(key: string): void {
    if (typeof document === "undefined") {
      return;
    }

    document.cookie = `${COOKIE_STR_KEY}${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}
