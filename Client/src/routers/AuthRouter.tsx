import { Routes, Route, Navigate } from "react-router-dom";
import { GuestRoute } from "@/routers/GuestRoute";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import VerifyEmailPage from "@/pages/VerifyEmailPage";
import GoogleCallbackPage from "@/pages/GoogleCallbackPage";

export function AuthRouter() {
  return (
    <Routes>
      <Route
        path="login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
        path="signup"
        element={
          <GuestRoute>
            <SignupPage />
          </GuestRoute>
        }
      />
      {/* Verify page doesn't need GuestRoute - accessible when coming from signup */}
      <Route path="verify" element={<VerifyEmailPage />} />
      {/* Callback page doesn't need GuestRoute - it processes OAuth and redirects */}
      <Route path="callback" element={<GoogleCallbackPage />} />
      {/* Redirect /auth to /auth/login */}
      <Route path="/" element={<Navigate to="login" replace />} />
      {/* 404 for unknown auth routes */}
      <Route path="*" element={<Navigate to="login" replace />} />
    </Routes>
  );
}
