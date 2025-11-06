import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import VerifyEmailPage from "@/pages/VerifyEmailPage";
import AuthCallbackPage from "@/pages/AuthCallbackPage";

export function AuthRouter() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route path="verify" element={<VerifyEmailPage />} />
      <Route path="callback" element={<AuthCallbackPage />} />
      <Route path="success" element={<AuthCallbackPage />} />
      {/* Redirect /auth to /auth/login */}
      <Route path="/" element={<Navigate to="login" replace />} />
      {/* 404 for unknown auth routes */}
      <Route path="*" element={<Navigate to="login" replace />} />
    </Routes>
  );
}
