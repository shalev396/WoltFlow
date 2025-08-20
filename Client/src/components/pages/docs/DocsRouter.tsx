import { Routes, Route, Navigate } from "react-router-dom";
import { DocsLayout } from "./DocsLayout";

export function DocsRouter() {
  return (
    <Routes>
      {/* Default docs route - redirect to introduction */}
      <Route index element={<Navigate to="/docs/introduction" replace />} />

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
      <Route
        path="sms-forwarding"
        element={<DocsLayout currentSection="sms-forwarding" />}
      />
      <Route
        path="email-forwarding"
        element={<DocsLayout currentSection="email-forwarding" />}
      />
      <Route path="inbox" element={<DocsLayout currentSection="inbox" />} />

      {/* Fallback - redirect any unknown docs path to introduction */}
      <Route path="*" element={<Navigate to="/docs/introduction" replace />} />
    </Routes>
  );
}
