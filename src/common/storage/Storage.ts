import { isBrowser } from "@/common/helpers";
import { LCL_STR_KEY } from "@/common/constants";
import { StorageStrategy } from "./Types";
import { LocalStorageStrategy } from "./LocalStorage";
import { SessionStorageStrategy } from "./SessionStorage";

type StorageType = "localStorage" | "sessionStorage";

class Storage {
  private storage: StorageStrategy;

  constructor(type: StorageType) {
    if (type === "localStorage") {
      this.storage = new LocalStorageStrategy();
    } else if (type === "sessionStorage") {
      this.storage = new SessionStorageStrategy();
    } else {
      throw new Error("Invalid storage type");
    }
  }

  get(key: string) {
    if (!isBrowser()) {
      return null;
    }
    try {
      return JSON.parse(this.storage.getItem(`${LCL_STR_KEY}${key}`)!);
    } catch {
      return this.storage.getItem(`${LCL_STR_KEY}${key}`);
    }
  }

  set(key: string, item: string): void {
    if (!isBrowser()) {
      return;
    }
    this.storage.setItem(`${LCL_STR_KEY}${key}`, item);
  }

  remove(key: string): void {
    if (!isBrowser()) {
      return;
    }
    this.storage.removeItem(`${LCL_STR_KEY}${key}`);
  }

  clear(): void {
    if (!isBrowser()) {
      return;
    }
    this.storage.clear();
  }
}

export default Storage;
