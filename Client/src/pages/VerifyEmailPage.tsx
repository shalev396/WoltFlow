import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation, Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/store/slices/userSlice";
import { authService } from "@/services";
import AuthLayout from "@/components/shared/AuthLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Check, AlertCircle } from "lucide-react";
import { getApiErrorMessage } from "@/utils/errorUtils";
import Layout from "@/components/shared/Layout";

export default function VerifyEmailPage() {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { lng } = useParams<{ lng: string }>();
  const emailFromState = (
    location.state as { email?: string; password?: string }
  )?.email;
  const passwordFromState = (
    location.state as { email?: string; password?: string }
  )?.password;

  const [email] = useState(emailFromState || "");
  const [password] = useState(passwordFromState || "");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate(`/${lng}/auth/signup`);
    }
  }, [email, navigate, lng]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Step 1: Verify the email
      await authService.confirmSignup({ email, code });
      setSuccess(true);

      // Step 2: Auto-login if we have the password
      if (password) {
        try {
          const loginResponse = await authService.login({ email, password });
          dispatch(loginSuccess(loginResponse));

          // Redirect to dashboard
          setTimeout(() => {
            navigate(`/${lng}/dashboard`);
          }, 1500);
        } catch (loginError) {
          console.error("Auto-login failed:", loginError);
          // If auto-login fails, redirect to login page
          setTimeout(() => {
            navigate(`/${lng}/auth/login`);
          }, 2000);
        }
      } else {
        // No password available, redirect to login
        setTimeout(() => {
          navigate(`/${lng}/auth/login`);
        }, 2000);
      }
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, t("errors.invalidCode")));
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError("");
    setIsLoading(true);

    try {
      // TODO: Implement resend code logic if needed
      // For now, Cognito automatically resends on signup
      setError(t("success.signupSuccess"));
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, t("errors.unknownError")));
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
          <Card className="w-full max-w-md shadow-lg border-border/50">
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <Check className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {t("success.emailVerified")}
                </h1>
                <p className="text-muted-foreground">
                  {t("callback.redirecting")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* Header with Icon */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t("verify.title")}
          </h1>
          <p className="text-muted-foreground text-balance">
            {t("verify.subtitle")}
          </p>
          {email && (
            <p className="text-sm font-medium text-primary pt-2">{email}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Code Field */}
          <div className="space-y-2">
            <Label htmlFor="code">{t("verify.codeLabel")}</Label>
            <Input
              id="code"
              type="text"
              placeholder={t("verify.codePlaceholder")}
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              className="text-center text-2xl tracking-widest font-mono"
              required
              disabled={isLoading}
              maxLength={6}
              pattern="\d{6}"
            />
          </div>

          {/* Verify Button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={isLoading || code.length !== 6}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("verify.verifyButton")}...
              </>
            ) : (
              t("verify.verifyButton")
            )}
          </Button>

          {/* Resend Code */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              {t("verify.resendCode")}
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleResendCode}
              disabled={isLoading}
              className="text-primary"
            >
              {t("verify.resendButton")}
            </Button>
          </div>

          {/* Back to Login */}
          <p className="text-center text-sm text-muted-foreground">
            <Link
              to={`/${lng}/auth/login`}
              className="text-primary hover:underline font-medium underline-offset-4"
            >
              {t("verify.backToLogin")}
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
