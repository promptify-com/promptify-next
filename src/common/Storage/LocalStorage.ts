import { LCL_STR_KEY } from "@/common/constants";
import Storage from ".";

class LocalStorage extends Storage {
  static getInstance(): LocalStorage {
    return new LocalStorage();
  }

  get(key: string) {
    try {
      return JSON.parse(localStorage.getItem(`${LCL_STR_KEY}${key}`)!);
    } catch {
      return localStorage.getItem(`${LCL_STR_KEY}${key}`);
    }
  }

  set(key: string, item: string) {
    localStorage.setItem(`${LCL_STR_KEY}${key}`, item);
  }

  remove(key: string) {
    localStorage.removeItem(`${LCL_STR_KEY}${key}`);
  }

  clear() {
    localStorage.clear();
  }
}

export default LocalStorage;
