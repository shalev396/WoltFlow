import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link, useParams } from "react-router-dom";
import { authService } from "@/services";
import AuthLayout from "@/components/shared/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle2, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const { lng } = useParams<{ lng: string }>();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [codeSent, setCodeSent] = useState(false);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await authService.forgotPassword(email);
      setCodeSent(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || t("errors.forgotPasswordFailed"));
      } else {
        setError(t("errors.unknownError"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length < 6) {
      setError(t("errors.invalidCode"));
      return;
    }
    // Navigate to reset password page with email and code
    navigate(`/${lng}/auth/reset-password`, {
      state: { email, code },
    });
  };

  return (
    <AuthLayout
      title={t("forgotPassword.title")}
      subtitle={
        codeSent
          ? t("forgotPassword.codeSubtitle")
          : t("forgotPassword.subtitle")
      }
    >
      {!codeSent ? (
        // Step 1: Enter Email
        <form onSubmit={handleSendCode} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">{t("forgotPassword.emailLabel")}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t("forgotPassword.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              autoFocus
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("forgotPassword.sendButton")}...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                {t("forgotPassword.sendButton")}
              </>
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            <Link
              to={`/${lng}/auth/login`}
              className="text-primary hover:underline font-medium"
            >
              {t("forgotPassword.backToLogin")}
            </Link>
          </p>
        </form>
      ) : (
        // Step 2: Code Sent + Enter Verification Code
        <form onSubmit={handleVerifyCode} className="space-y-6">
          {/* Success Message */}
          <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              {t("forgotPassword.successMessage")}
            </AlertDescription>
          </Alert>

          {/* Display Email (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="email-display">
              {t("forgotPassword.emailLabel")}
            </Label>
            <Input
              id="email-display"
              type="email"
              value={email}
              disabled
              className="bg-muted"
            />
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Verification Code Input */}
          <div className="space-y-2">
            <Label htmlFor="code">{t("forgotPassword.codeLabel")}</Label>
            <Input
              id="code"
              type="text"
              placeholder={t("forgotPassword.codePlaceholder")}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              maxLength={10}
              autoFocus
              className="text-center text-lg tracking-widest"
            />
            <p className="text-xs text-muted-foreground text-center">
              {t("forgotPassword.codeHint")}
            </p>
          </div>

          {/* Continue Button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={!code || code.length < 6}
          >
            {t("forgotPassword.continueButton")}
          </Button>

          {/* Resend Code */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              {t("forgotPassword.didntReceive")}
            </p>
            <Button
              type="button"
              variant="link"
              className="text-primary"
              onClick={() => {
                setCodeSent(false);
                setCode("");
                setError("");
              }}
            >
              {t("forgotPassword.resendButton")}
            </Button>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
