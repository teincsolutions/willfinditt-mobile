
import { createMMKV } from "react-native-mmkv";

/**
 * MMKV Storage Instance
 * High-performance, encrypted storage for React Native
 */
export const storage = createMMKV({
  id: "willfinditt-storage"
});

/**
 * Storage utility functions for common operations
 */
export const mmkvStorage = {
  setItem: (key: string, value: string) => {
    storage.set(key, value);
  },
  
  getItem: (key: string): string | undefined => {
    return storage.getString(key);
  },
  
  removeItem: (key: string) => {
    storage.remove(key);
  },
  
  clear: () => {
    storage.clearAll();
  },
  
  // JSON helpers
  setJSON: <T>(key: string, value: T) => {
    storage.set(key, JSON.stringify(value));
  },
  
  getJSON: <T>(key: string): T | null => {
    const value = storage.getString(key);
    return value ? JSON.parse(value) : null;
  },
  
  // Boolean helpers
  setBoolean: (key: string, value: boolean) => {
    storage.set(key, value);
  },
  
  getBoolean: (key: string): boolean | undefined => {
    return storage.getBoolean(key);
  },
  
  // Number helpers
  setNumber: (key: string, value: number) => {
    storage.set(key, value);
  },
  
  getNumber: (key: string): number | undefined => {
    return storage.getNumber(key);
  },

  // App-specific helpers
  isFirstLaunch: (): boolean => {
    const hasLaunched = storage.getBoolean("hasLaunchedBefore");
    return hasLaunched === undefined || !hasLaunched;
  },

  setFirstLaunchComplete: () => {
    storage.set("hasLaunchedBefore", true);
  },
};
