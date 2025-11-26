import AsyncStorage from "@react-native-async-storage/async-storage";

// Storage keys
const STORAGE_KEYS = {
  HAS_OPENED_APP: "@app:hasOpenedApp",
  IS_AUTHENTICATED: "@app:isAuthenticated",
} as const;

// Check if user has opened the app before
export const hasOpenedApp = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.HAS_OPENED_APP);
    return value === "true";
  } catch (error) {
    console.error("Error reading hasOpenedApp:", error);
    return false;
  }
};

// Set that user has opened the app
export const setHasOpenedApp = async (value: boolean = true): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.HAS_OPENED_APP, String(value));
  } catch (error) {
    console.error("Error setting hasOpenedApp:", error);
  }
};

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED);
    return value === "true";
  } catch (error) {
    console.error("Error reading isAuthenticated:", error);
    return false;
  }
};

// Set authentication status
export const setAuthenticated = async (value: boolean): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, String(value));
  } catch (error) {
    console.error("Error setting isAuthenticated:", error);
  }
};

// Clear all storage
export const clearAllStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error("Error clearing storage:", error);
  }
};
