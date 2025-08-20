import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { DocsRouter } from "@/components/pages/docs";

// Page imports
import LandingPage from "./LandingPage";
import DashboardPage from "./DashboardPage";
import RunsPage from "./RunsPage";
import SettingsPage from "./SettingsPage";
import InboxPage from "./InboxPage";
import PrivacyPage from "./PrivacyPage";
import ExtensionPrivacyPage from "./ExtensionPrivacyPage";
import TermsOfService from "./TermsOfService";
import NotFound from "./NotFound";

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
    path: "/privacy-policy",
    element: <PrivacyPage />,
  },
  {
    path: "/extension-privacy-policy",
    element: <ExtensionPrivacyPage />,
  },
  {
    path: "/terms-of-service",
    element: <TermsOfService />,
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
