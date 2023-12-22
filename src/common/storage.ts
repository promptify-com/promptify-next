import { LCL_STR_KEY } from "./constants";
export default class Storage {
  static get(key: string) {
    try {
      return JSON.parse(localStorage.getItem(`${LCL_STR_KEY}${key}`)!);
    } catch {
      return localStorage.getItem(`${LCL_STR_KEY}${key}`);
    }
  }

  static set(key: string, item: string) {
    localStorage.setItem(`${LCL_STR_KEY}${key}`, item);
  }

  static remove(key: string) {
    localStorage.removeItem(`${LCL_STR_KEY}${key}`);
  }
}
