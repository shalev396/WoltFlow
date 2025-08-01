import type { AxiosError, AxiosResponse } from "axios";

// Define API endpoints that require authentication
const protectedApiRoutes = [
  "/setting",
  "/automation",
  "/wolt",
  "/gmail",
  "/api/generate-api-key",
  "/runs",
];

// Define public page routes that don't require authentication
const publicPageRoutes = ["/", "/privacy", "/terms"];

// Helper function to check if current page is public
const isOnPublicRoute = (): boolean => {
  const currentPath = window.location.pathname;
  return publicPageRoutes.some((route) =>
    route === "/" ? currentPath === "/" : currentPath.startsWith(route)
  );
};

// Helper function to check if the user is trying to access a protected page
const isOnProtectedRoute = (): boolean => {
  const currentPath = window.location.pathname;
  const protectedPageRoutes = ["/dashboard", "/runs", "/settings"];
  return protectedPageRoutes.some((route) => currentPath.startsWith(route));
};

export const responseInterceptor = (response: AxiosResponse): AxiosResponse => {
  return response;
};

export const errorInterceptor = (error: AxiosError): Promise<AxiosError> => {
  if (error.response?.status === 401) {
    const requestUrl = error.config?.url || "";

    // Check if this is a protected API endpoint
    const isProtectedApiCall = protectedApiRoutes.some((route) =>
      requestUrl.includes(route)
    );

    // Special handling for /auth/me - it's used for auth checks
    const isAuthCheck = requestUrl.includes("/auth/me");

    if (isProtectedApiCall || (isAuthCheck && isOnProtectedRoute())) {
      // Only redirect if user is on a protected route or trying to access protected API
      handleAuthFailure();
    } else if (isAuthCheck && isOnPublicRoute()) {
      // Silent failure for auth checks on public routes
      // Just clear the auth state without redirecting
      import("@/store/store").then(({ store }) => {
        import("@/store/slices/userSlice").then(({ logoutSuccess }) => {
          store.dispatch(logoutSuccess());
        });
      });
    }
  }
  return Promise.reject(error);
};

const handleAuthFailure = (): void => {
  // Dynamic import to avoid circular dependency
  import("@/store/store").then(({ store }) => {
    import("@/store/slices/userSlice").then(({ logoutSuccess }) => {
      // Dispatch logout action to clear Redux state
      store.dispatch(logoutSuccess());
      // Only redirect if we're not already on the home page
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    });
  });
};
