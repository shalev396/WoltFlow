import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation, Link, useParams } from "react-router-dom";
import { authService } from "@/services";
import Layout from "@/components/shared/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Check, AlertCircle } from "lucide-react";

export default function VerifyEmailPage() {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const location = useLocation();
  const { lng } = useParams<{ lng: string }>();
  const emailFromState = (location.state as { email?: string })?.email;

  const [email] = useState(emailFromState || "");
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
      await authService.confirmSignup({ email, code });
      setSuccess(true);
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate(`/${lng}/auth/login`);
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || t("errors.invalidCode"));
      } else {
        setError(t("errors.unknownError"));
      }
    } finally {
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
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t("errors.unknownError"));
      }
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
    <Layout>
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
        <Card className="w-full max-w-md shadow-lg border-border/50">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t("verify.title")}
            </CardTitle>
            <CardDescription className="text-base">
              {t("verify.subtitle")}
            </CardDescription>
            {email && (
              <p className="text-sm font-medium text-primary pt-2">{email}</p>
            )}
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                size="lg"
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
              <div className="text-center space-y-2 pt-2">
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
              <p className="text-center text-sm text-muted-foreground pt-4">
                <Link
                  to={`/${lng}/auth/login`}
                  className="text-primary hover:underline font-medium"
                >
                  {t("verify.backToLogin")}
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
