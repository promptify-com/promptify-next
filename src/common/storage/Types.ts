export interface StorageStrategy {
  setItem(key: string, value: string): void;
  getItem(key: string): string | null;
  removeItem(key: string): void;
  clear(): void;
}
