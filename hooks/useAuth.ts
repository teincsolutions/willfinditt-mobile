import { authService } from "@/services/authService";
import { userService } from "@/services/userService";
import { LoginRequest, RegisterRequest, SocialData, User } from "@/types";
import { mmkvStorage } from "@/utils/mmkvStorage";
import { tokenManager } from "@/utils/tokenManager";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  user: User | null;
  isLoggedIn: boolean;
  lastRefreshTime: number | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  loginAsync: (credentials: LoginRequest) => Promise<void>;
  registerAsync: (userData: RegisterRequest) => Promise<void>;
  socialAuthAsync: (socialData: SocialData) => Promise<void>;
  refreshAuthAsync: () => void;
  checkUserStatus: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      lastRefreshTime: null,

      setUser: (user) => set({ user, lastRefreshTime: Date.now() }),

      clearUser: () => set({ user: null }),

      // Social authentication
      socialAuthAsync: async (socialData: SocialData) => {
        const response = await authService.socialAuth(socialData);
        // Store tokens using tokenManager
        await tokenManager.setTokens(response.access_token, response.refresh_token);
        if (response.user?.id) {
          await tokenManager.setUserId(response.user.id);
        }

        set({
          user: { ...get().user, ...response.user },
          isLoggedIn: true,
        });
      },

      loginAsync: async (credentials: LoginRequest) => {
        const response = await authService.login(credentials);
        // Store tokens using tokenManager
        await tokenManager.setTokens(response.access_token, response.refresh_token);
        if (response.user?.id) {
          await tokenManager.setUserId(response.user.id);
        }

        set({
          user: response.user,
          isLoggedIn: true,
        });
      },

      registerAsync: async (userData: RegisterRequest) => {
        const response = await authService.register(userData);
        // Store tokens using tokenManager
        await tokenManager.setTokens(response.access_token, response.refresh_token);
        if (response.user?.id) {
          await tokenManager.setUserId(response.user.id);
        }

        set({
          user: response.user,
          isLoggedIn: true,
        });
      },

      refreshAuthAsync: async () => {
        try {
          const response = await authService.refreshToken();
          // Update tokens using tokenManager
          await tokenManager.setTokens(response.access_token, response.refresh_token);
        } catch (error: any) {
          if (error.response) {
            const { data } = error.response;
            if (data.statusCode === 401) {
              await get().logout();
            } else {
              console.log("error response", data);
            }
          }
        }
      },

      // Check user status (for periodic checks)
      checkUserStatus: async () => {
        try {
          const currentUser = get().user;
          if (!currentUser) return;

          const updatedUser = await userService.getProfile();

          // Check if user data has changed significantly
          const hasChanged =
            currentUser.firstName !== updatedUser.firstName ||
            currentUser.lastName !== updatedUser.lastName ||
            currentUser.email !== updatedUser.email ||
            currentUser.phone !== updatedUser.phone ||
            currentUser.avatar !== updatedUser.avatar ||
            currentUser.isActive !== updatedUser.isActive ||
            currentUser.isVerified !== updatedUser.isVerified ||
            currentUser.emailVerified !== updatedUser.emailVerified ||
            currentUser.phoneVerified !== updatedUser.phoneVerified;

          if (hasChanged) {
            set({ user: updatedUser, lastRefreshTime: Date.now() });
          }

          // If user is no longer active, logout
          if (!updatedUser.isActive) {
            await get().logout();
          }
        } catch (error: any) {
          // Handle silently for background checks
          console.error("Error checking user status:", error);
        }
      },

      logout: async () => {
        try {
          // Clear all tokens using tokenManager
          await tokenManager.clearAllTokens();

          // Sign out from Google if applicable
          try {
            await GoogleSignin.signOut();
          } catch (error) {
            // Ignore Google sign out errors
          }

          // Clear seller data from the seller store
          const { clearSellerData } = await import("./useSellerStore").then(
            (m) => m.useSellerStore.getState()
          );
          clearSellerData();

          set({
            user: null,
            isLoggedIn: false,
          });
        } catch (error) {
          console.error("Logout error:", error);
        }
      },
    }),
    {
      name: "login-user-storage",
      storage: {
        getItem: (name: string) => {
          const value = mmkvStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name: string, value: any) => {
          mmkvStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name: string) => {
          mmkvStorage.removeItem(name);
        },
      },
    }
  )
);
