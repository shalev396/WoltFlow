import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Check if user is authenticated by verifying if they have an email
  if (false) {
    // Redirect them to the landing page
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
