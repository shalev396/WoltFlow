import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAnalytics } from "./useAnalytics";

/**
 * Hook to automatically track page views when route changes
 */
export function useRouteTracking() {
  const location = useLocation();
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    // Track page view on route change
    trackPageView(location.pathname + location.search);
  }, [location, trackPageView]);
}
