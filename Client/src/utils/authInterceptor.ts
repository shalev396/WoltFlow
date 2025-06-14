import type { AxiosError, AxiosResponse } from "axios";

// Define protected routes that should redirect on 401
const protectedRoutes = [
  "/auth/me",
  "/setting",
  "/automation",
  "/wolt",
  "/gmail",
];

export const responseInterceptor = (response: AxiosResponse): AxiosResponse => {
  return response;
};

export const errorInterceptor = (error: AxiosError): Promise<AxiosError> => {
  if (error.response?.status === 401) {
    const requestUrl = error.config?.url || "";

    // Only redirect if this is a protected route
    const isProtectedRoute = protectedRoutes.some((route) =>
      requestUrl.includes(route)
    );

    if (isProtectedRoute) {
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
    }
  }
  return Promise.reject(error);
};
