import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "@/routers/ProtectedRoute";
import { DocsRouter } from "@/components/pages/docs";
import { LegalRouter } from "@/routers/LegalRouter";

// Page imports
import LandingPage from "../pages/LandingPage";
import DashboardPage from "../pages/DashboardPage";
import RunsPage from "../pages/RunsPage";
import SettingsPage from "../pages/SettingsPage";
import InboxPage from "../pages/InboxPage";
import NotFound from "../pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/runs",
    element: (
      <ProtectedRoute>
        <RunsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/inbox",
    element: (
      <ProtectedRoute>
        <InboxPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/legal/*",
    element: <LegalRouter />,
  },
  {
    path: "/docs/*",
    element: <DocsRouter />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
