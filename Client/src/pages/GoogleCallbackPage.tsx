import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/store/slices/userSlice";
import { authService } from "@/services";
import { useTranslation } from "react-i18next";
import Layout from "@/components/shared/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";

/**
 * Google OAuth Callback Handler
 *
 * Handles the redirect from Google OAuth and exchanges the authorization code for tokens.
 */
export default function GoogleCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation("auth");
  const { lng } = useParams<{ lng: string }>();

  const [error, setError] = useState<string | null>(null);
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent double execution in StrictMode
    if (hasProcessed.current) {
      return;
    }
    hasProcessed.current = true;

    const handleCallback = async () => {
      try {
        const code = searchParams.get("code");
        const errorParam = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");

        // Handle errors from Cognito
        if (errorParam) {
          throw new Error(
            errorDescription || `Authentication failed: ${errorParam}`
          );
        }

        // Validate code exists
        if (!code) {
          throw new Error("No authorization code received");
        }

        // Exchange code for tokens
        const response = await authService.handleGoogleCallback(code);

        // Store tokens and user data
        dispatch(loginSuccess(response));

        // Redirect to dashboard
        navigate(`/${lng}/dashboard`, { replace: true });
      } catch (err: unknown) {
        console.error("Google OAuth callback error:", err);

        const message =
          err instanceof Error
            ? err.message
            : "An error occurred during authentication";
        setError(message);
      }
    };

    handleCallback();
  }, [searchParams, navigate, dispatch, lng]);

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
          <Card className="w-full max-w-md shadow-lg border-border/50">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-foreground">
                    {t("callback.authenticationFailed")}
                  </h1>
                  <Alert variant="destructive" className="text-left">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </div>
                <Button
                  onClick={() =>
                    navigate(`/${lng}/auth/login`, { replace: true })
                  }
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {t("callback.backToLogin")}
                </Button>
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
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t("callback.processingGoogle")}
              </h1>
              <p className="text-muted-foreground">
                {t("callback.pleaseWait")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
