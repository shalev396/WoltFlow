import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "@/routers/ProtectedRoute";
import { LanguageLayout } from "@/routers/LanguageLayout";
import { RootRedirect } from "@/routers/RootRedirect";
import { DocsRouter } from "@/components/pages/docs";
import { LegalRouter } from "@/routers/LegalRouter";
import { AuthRouter } from "@/routers/AuthRouter";

// Page imports
import LandingPage from "../pages/LandingPage";
import DashboardPage from "../pages/DashboardPage";
import RunsPage from "../pages/RunsPage";
import SettingsPage from "../pages/SettingsPage";
import InboxPage from "../pages/InboxPage";
import NotFound from "../pages/NotFoundPage";

export const router = createBrowserRouter([
  // All routes with language prefix
  {
    path: "/:lng",
    element: <LanguageLayout />,
    children: [
      // Landing page
      {
        index: true,
        element: <LandingPage />,
      },
      // Auth routes
      {
        path: "auth/*",
        element: <AuthRouter />,
      },
      // Protected routes
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "runs",
        element: (
          <ProtectedRoute>
            <RunsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "inbox",
        element: (
          <ProtectedRoute>
            <InboxPage />
          </ProtectedRoute>
        ),
      },
      // Legal routes
      {
        path: "legal/*",
        element: <LegalRouter />,
      },
      // Docs routes
      {
        path: "docs/*",
        element: <DocsRouter />,
      },
      // 404 for language-prefixed routes
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  // Catch-all: redirect any path without language to language-prefixed version
  // This must be AFTER the /:lng routes so it doesn't match first
  {
    path: "*",
    element: <RootRedirect />,
  },
]);
