import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { TokenCache } from "@clerk/expo";

const createTokenCache = (): TokenCache => {
  return {
    getToken: async (key: string) => {
      try {
        const item = await SecureStore.getItemAsync(key);
        return item ?? null;
      } catch (error) {
        console.error(`Error retrieving token for key ${key}:`, error);
        return null;
      }
    },
    saveToken: async (key: string, token: string) => {
      try {
        if (!token) {
          await SecureStore.deleteItemAsync(key); //cleanup
        } else {
          await SecureStore.setItemAsync(key, token);
        }
      } catch (error) {
        console.error(`Error saving token for key ${key}:`, error);
      }
    },
  };
};

export const tokenCache =
  Platform.OS !== "web" ? createTokenCache() : undefined;
