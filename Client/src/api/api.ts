import axios from "axios";
import { responseInterceptor, errorInterceptor } from "@/utils/authInterceptor";
import { isTokenExpired, refreshTokens } from "@/utils/tokenUtil";

const isLocal = import.meta.env.VITE_ENV === "local";
const baseURL = isLocal
  ? "http://localhost:3000/api"
  : `${window.location.origin}/api`;

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials removed - we don't use cookies anymore
});

// Request interceptor - check idToken expiry and refresh BEFORE each request
api.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("idToken");

    // Check if idToken exists and if it's expired or will expire soon (within 5 min)
    if (token && isTokenExpired(token)) {
      console.log(
        "🔄 idToken expired or expiring soon, refreshing BEFORE request..."
      );

      const newTokens = await refreshTokens();

      if (newTokens) {
        // Success! Use the new token
        token = newTokens.idToken;
        console.log("✅ Token refreshed successfully, proceeding with request");
      } else {
        // Refresh failed - refreshToken is invalid/expired or user deleted
        console.error("❌ Token refresh failed - User session ended");

        // Clear all tokens
        localStorage.removeItem("idToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("accessToken");

        // Logout via Redux
        import("@/store/store").then(({ store }) => {
          import("@/store/slices/userSlice").then(({ logoutSuccess }) => {
            store.dispatch(logoutSuccess());
          });
        });

        // Redirect to login
        window.location.href = "/auth/login";

        // Reject the request
        return Promise.reject(
          new Error("Token refresh failed - session ended")
        );
      }
    }

    // Add Authorization header with (possibly refreshed) token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor - handles 401s if token is invalid mid-flight
api.interceptors.response.use(responseInterceptor, errorInterceptor);
