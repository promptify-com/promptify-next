import { isBrowser } from "@/common/helpers";

abstract class Storage {
  abstract get(key: string): string | null;
  abstract set(key: string, item: string): void;
  abstract remove(key: string): void;
  abstract clear(): void;

  static getInstance(): Storage {
    throw new Error("This method should be implemented by the subclass.");
  }

  static get(key: string) {
    if (!isBrowser()) {
      return null;
    }
    const instance = this.getInstance();
    return instance.get(key);
  }

  static set(key: string, item: string): void {
    if (!isBrowser()) {
      return;
    }
    const instance = this.getInstance();
    instance.set(key, item);
  }

  static remove(key: string): void {
    if (!isBrowser()) {
      return;
    }
    const instance = this.getInstance();
    instance.remove(key);
  }

  static clear(): void {
    if (!isBrowser()) {
      return;
    }
    const instance = this.getInstance();
    instance.clear();
  }
}

export default Storage;
