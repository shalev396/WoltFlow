import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link, useParams, useLocation } from "react-router-dom";
import { authService } from "@/services";
import AuthLayout from "@/components/shared/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { getApiErrorMessage } from "@/utils/errorUtils";

export default function ResetPasswordPage() {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const location = useLocation();
  const { lng } = useParams<{ lng: string }>();

  // Get email and code from navigation state
  const stateEmail = (location.state as { email?: string; code?: string })
    ?.email;
  const stateCode = (location.state as { email?: string; code?: string })?.code;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect to forgot password if no email/code provided
  useEffect(() => {
    if (!stateEmail || !stateCode) {
      navigate(`/${lng}/auth/forgot-password`, { replace: true });
    }
  }, [stateEmail, stateCode, navigate, lng]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError(t("errors.passwordsDoNotMatch"));
      return;
    }

    // Validate password length
    if (password.length < 8) {
      setError(t("errors.passwordTooShort"));
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword(stateEmail!, stateCode!, password);
      // Success - redirect to login
      navigate(`/${lng}/auth/login`, {
        replace: true,
        state: { message: t("success.passwordResetSuccess") },
      });
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, t("errors.resetPasswordFailed")));
    } finally {
      setIsLoading(false);
    }
  };

  if (!stateEmail || !stateCode) {
    return null; // Will redirect in useEffect
  }

  return (
    <AuthLayout
      title={t("resetPassword.title")}
      subtitle={t("resetPassword.subtitle")}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Display Email (Read-only) */}
        <div className="space-y-2">
          <Label htmlFor="email">{t("resetPassword.emailLabel")}</Label>
          <Input
            id="email"
            type="email"
            value={stateEmail}
            disabled
            className="bg-muted"
          />
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <Label htmlFor="password">{t("resetPassword.passwordLabel")}</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("resetPassword.passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              disabled={isLoading}
              autoFocus
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">
            {t("resetPassword.confirmPasswordLabel")}
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t("resetPassword.confirmPasswordPlaceholder")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {t("resetPassword.passwordRequirements")}
          </p>
        </div>

        {/* Password Match Indicator */}
        {password && confirmPassword && (
          <div className="text-sm">
            {password === confirmPassword ? (
              <p className="text-green-600 dark:text-green-400">
                ✓ {t("resetPassword.passwordsMatch")}
              </p>
            ) : (
              <p className="text-destructive">
                ✗ {t("resetPassword.passwordsDoNotMatch")}
              </p>
            )}
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          disabled={
            isLoading || password !== confirmPassword || password.length < 8
          }
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("resetPassword.resetButton")}...
            </>
          ) : (
            t("resetPassword.resetButton")
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          <Link
            to={`/${lng}/auth/login`}
            className="text-primary hover:underline font-medium"
          >
            {t("resetPassword.backToLogin")}
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
