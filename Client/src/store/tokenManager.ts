import { jwtDecode } from "jwt-decode";
import { store } from "./store";
import { refreshToken, logout } from "./slices/userSlice";
import type { JWTPayload } from "@/types";

let refreshAttempts = 0;
const MAX_REFRESH_ATTEMPTS = 3;
const RETRY_DELAY = 5000;

const handleTokenRefresh = async () => {
  try {
    await store.dispatch(refreshToken()).unwrap();
    refreshAttempts = 0; // Reset attempts on success
    initializeTokenRefresh(); // Setup next refresh
  } catch (error: any) {
    if (error?.response?.status === 401) {
      store.dispatch(logout());
      return;
    }

    if (refreshAttempts < MAX_REFRESH_ATTEMPTS) {
      refreshAttempts++;
      setTimeout(handleTokenRefresh, RETRY_DELAY);
    }
  }
};

export const initializeTokenRefresh = () => {
  const state = store.getState();
  const { accessToken } = state.user;

  if (!accessToken) return;

  try {
    const decoded = jwtDecode<JWTPayload>(accessToken);
    const expiresIn = decoded.exp * 1000 - Date.now(); // Convert to milliseconds
    const refreshDelay = Math.max(0, expiresIn - 30000); // 30 seconds before expiry

    // If token is already expired or will expire in less than 30 seconds, refresh immediately
    if (refreshDelay <= 0) {
      handleTokenRefresh();
      return;
    }

    // Set timeout for future refresh
    setTimeout(handleTokenRefresh, refreshDelay);
  } catch (error) {
    console.error("Failed to decode token:", error);
  }
};
