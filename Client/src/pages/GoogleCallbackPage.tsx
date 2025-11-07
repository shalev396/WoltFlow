import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/store/slices/userSlice";
import { authService } from "@/services";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import Layout from "@/components/shared/Layout";

/**
 * Google OAuth Callback Page
 *
 * This page handles the OAuth redirect from Cognito after Google authentication.
 * It extracts the authorization code from the URL and exchanges it for tokens.
 *
 * Flow:
 * 1. User authenticates with Google
 * 2. Google redirects to Cognito
 * 3. Cognito redirects here with authorization code
 * 4. This page calls backend to exchange code for tokens
 * 5. Stores tokens and redirects to dashboard
 */
export default function GoogleCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { lng } = useParams<{ lng: string }>();

  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(true);

  // Use ref to prevent double-execution in React StrictMode (development)
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent double-execution (React StrictMode in dev causes useEffect to run twice)
    if (hasProcessed.current) {
      return;
    }
    hasProcessed.current = true;

    const handleCallback = async () => {
      try {
        // Get authorization code from URL
        const code = searchParams.get("code");
        const errorParam = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");

        // Check for OAuth errors from Cognito
        if (errorParam) {
          throw new Error(
            errorDescription || `Authentication failed: ${errorParam}`
          );
        }

        if (!code) {
          throw new Error("No authorization code received");
        }

        // Exchange code for tokens
        const response = await authService.handleGoogleCallback(code);

        // Store tokens and user data in Redux
        dispatch(loginSuccess(response));

        // Redirect to dashboard
        navigate(`/${lng}/dashboard`, { replace: true });
      } catch (err: unknown) {
        console.error("Google OAuth callback error:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to complete Google authentication"
        );
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [searchParams, navigate, dispatch, lng]);

  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <Card className="overflow-hidden border-border/50 shadow-2xl p-0">
            {isProcessing ? (
              /* Branded gradient background with animated blobs */
              <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 overflow-hidden">
                {/* Animated gradient orbs */}
                <div className="absolute inset-0">
                  <div className="absolute top-0 -right-4 w-48 h-48 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                  <div className="absolute top-0 -left-4 w-48 h-48 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                  <div className="absolute -bottom-8 left-20 w-48 h-48 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                </div>

                {/* Content */}
                <div className="relative flex flex-col items-center justify-center p-12 text-white">
                  {/* Spinner */}
                  <div className="mb-6">
                    <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-white border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>

                  {/* Text */}
                  <h2 className="text-2xl font-bold tracking-tight mb-2">
                    Completing Google Sign-In
                  </h2>
                  <p className="text-blue-100 text-center max-w-sm">
                    Please wait while we finalize your authentication...
                  </p>

                  {/* Brand name */}
                  <div className="mt-8 opacity-50">
                    <p className="text-sm font-semibold">WoltFlow</p>
                  </div>
                </div>
              </div>
            ) : (
              /* Error State */
              <div className="p-8 space-y-6">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>

                <div className="text-center">
                  <button
                    onClick={() => navigate(`/${lng}/auth/login`)}
                    className="text-primary hover:underline font-medium"
                  >
                    Return to Login
                  </button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Add custom CSS animations matching AuthLayout */}
        <style>{`
          @keyframes blob {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>
      </div>
    </Layout>
  );
}
