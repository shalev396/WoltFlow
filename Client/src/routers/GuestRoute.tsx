import { Navigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

interface GuestRouteProps {
  children: React.ReactNode;
}

/**
 * GuestRoute - Redirects authenticated users away from public routes
 *
 * Used for login, signup, etc. pages that should only be accessible
 * when the user is NOT logged in.
 */
export function GuestRoute({ children }: GuestRouteProps) {
  const { lng } = useParams<{ lng: string }>();
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  if (isAuthenticated) {
    // User is logged in, redirect to dashboard
    return <Navigate to={`/${lng}/dashboard`} replace />;
  }

  // User is not logged in, allow access
  return <>{children}</>;
}
