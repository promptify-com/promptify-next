import { LCL_STR_KEY } from "@/common/constants";
import Storage from ".";

export default class SessionStorage extends Storage {
  static getInstance(): SessionStorage {
    return new SessionStorage();
  }

  get(key: string) {
    try {
      return JSON.parse(sessionStorage.getItem(`${LCL_STR_KEY}${key}`)!);
    } catch {
      return sessionStorage.getItem(`${LCL_STR_KEY}${key}`);
    }
  }

  set(key: string, item: string) {
    sessionStorage.setItem(`${LCL_STR_KEY}${key}`, item);
  }

  remove(key: string) {
    sessionStorage.removeItem(`${LCL_STR_KEY}${key}`);
  }

  clear() {
    sessionStorage.clear();
  }
}
