import { Navigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { isValidLanguage } from "@/i18n/config";
import LoadingScreen from "../components/shared/LoadingScreen";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, isInitialized } = useSelector(
    (state: RootState) => state.user
  );
  const { lng } = useParams<{ lng: string }>();

  // Show loading screen while checking authentication
  if (!isInitialized || isLoading) {
    return <LoadingScreen message="Verifying authentication..." />;
  }

  // If not authenticated, redirect to landing page with current language
  if (!isAuthenticated) {
    const language = lng && isValidLanguage(lng) ? lng : "en";
    return <Navigate to={`/${language}`} replace />;
  }

  // If authenticated, render the protected content
  return <>{children}</>;
}
