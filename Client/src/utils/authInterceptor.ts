import type { AxiosError, AxiosResponse } from "axios";

// Define public page routes that don't require authentication
const publicPageRoutes = ["/legal/*", "/docs/*", "/auth/*"];

// Helper function to check if current page is public
const isOnPublicRoute = (): boolean => {
  const currentPath = window.location.pathname;
  return publicPageRoutes.some((route) => {
    if (route.endsWith("/*")) {
      return currentPath.startsWith(route.replace("/*", ""));
    }
    return currentPath === route || currentPath === "/";
  });
};

export const responseInterceptor = (response: AxiosResponse): AxiosResponse => {
  return response;
};

export const errorInterceptor = async (
  error: AxiosError
): Promise<AxiosError> => {
  if (error.response?.status === 401) {
    console.log("🚫 401 Unauthorized - Token invalid or user terminated");

    // Clear all tokens and logout via Redux
    await handleAuthFailure();
  }
  return Promise.reject(error);
};

const handleAuthFailure = async (): Promise<void> => {
  console.log("🔴 Authentication failed - Logging out user");

  // Clear localStorage
  localStorage.removeItem("idToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("accessToken");

  // Dynamic import to avoid circular dependency
  try {
    const { store } = await import("@/store/store");
    const { logoutSuccess } = await import("@/store/slices/userSlice");

    // Dispatch logout action to clear Redux state
    store.dispatch(logoutSuccess());

    // Only redirect if we're not already on login/auth pages
    if (!isOnPublicRoute()) {
      console.log("↩️  Redirecting to login...");
      window.location.href = "/auth/login";
    }
  } catch (err) {
    console.error("Error during logout:", err);
    // Fallback redirect
    if (!isOnPublicRoute()) {
      window.location.href = "/auth/login";
    }
  }
};
