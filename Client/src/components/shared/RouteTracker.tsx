import { useRouteTracking } from "../../hooks/useRouteTracking";

/**
 * Component to track route changes for analytics
 * Should be placed inside the Router context
 */
export function RouteTracker() {
  useRouteTracking();
  return null; // This component doesn't render anything
}
