import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link, useParams } from "react-router-dom";
import { authService } from "@/services";
import AuthLayout from "@/components/shared/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";

export default function SignupPage() {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const { lng } = useParams<{ lng: string }>();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await authService.signup({ email, password, name });
      // Redirect to verify email page with email in state
      navigate(`/${lng}/auth/verify`, { state: { email } });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || t("errors.emailAlreadyExists"));
      } else {
        setError(t("errors.unknownError"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setIsLoading(true);

    try {
      // Get Google OAuth URL from backend
      const authUrl = await authService.getGoogleAuthUrl();
      // Redirect to Google for authentication
      window.location.href = authUrl;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || t("errors.googleAuthFailed"));
      } else {
        setError(t("errors.unknownError"));
      }
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title={t("signup.title")} subtitle={t("signup.subtitle")}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name">{t("signup.nameLabel")}</Label>
          <Input
            id="name"
            type="text"
            placeholder={t("signup.namePlaceholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">{t("signup.emailLabel")}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t("signup.emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password">{t("signup.passwordLabel")}</Label>
          <Input
            id="password"
            type="password"
            placeholder={t("signup.passwordPlaceholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">
            {t("signup.passwordRequirements")}
          </p>
        </div>

        {/* Signup Button */}
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("signup.signupButton")}...
            </>
          ) : (
            t("signup.signupButton")
          )}
        </Button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              {t("signup.orContinueWith")}
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignup}
          disabled={isLoading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="mr-2 h-5 w-5"
          >
            <path
              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
              fill="currentColor"
            />
          </svg>
          {t("signup.googleButton")}
        </Button>

        {/* Login Link */}
        <p className="text-center text-sm text-muted-foreground">
          {t("signup.haveAccount")}{" "}
          <Link
            to={`/${lng}/auth/login`}
            className="text-primary hover:underline font-medium underline-offset-4"
          >
            {t("signup.loginLink")}
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
