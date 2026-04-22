import { Routes, Route, Navigate } from "react-router-dom";
import { DocsLayout } from "../components/pages/docs/DocsLayout";
import NotFound from "@/pages/NotFoundPage";

export function DocsRouter() {
  return (
    <Routes>
      {/* Default docs route - redirect to introduction */}
      <Route index element={<Navigate to="introduction" replace />} />

      {/* Individual documentation sections */}
      <Route
        path="introduction"
        element={<DocsLayout currentSection="introduction" />}
      />
      <Route
        path="getting-started"
        element={<DocsLayout currentSection="getting-started" />}
      />
      <Route
        path="woltflow-extension"
        element={<DocsLayout currentSection="woltflow-extension" />}
      />
      <Route
        path="manual-setup"
        element={<DocsLayout currentSection="manual-setup" />}
      />

      {/* Fallback - redirect any unknown docs path to introduction */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
