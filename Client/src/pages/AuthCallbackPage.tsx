import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/store/slices/userSlice";
import AuthLayout from "@/components/shared/AuthLayout";
import { Loader2, Check, XCircle } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export default function AuthCallbackPage() {
  const { t } = useTranslation("auth");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { language } = useLanguage();
  const [status, setStatus] = useState<"processing" | "success" | "error">(
    "processing"
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    if (error) {
      setStatus("error");
      setErrorMessage(errorDescription || error);
      setTimeout(() => {
        navigate(`/${language}/auth/login`);
      }, 3000);
      return;
    }

    // Check if we're at /auth/success with tokens in URL fragment
    // Backend redirects to /auth/success#idToken=...&refreshToken=...
    const hash = window.location.hash.substring(1); // Remove #
    if (hash) {
      const params = new URLSearchParams(hash);
      const idToken = params.get("idToken");
      const refreshToken = params.get("refreshToken");
      const userId = params.get("userId");
      const email = params.get("email");
      const name = params.get("name");
      const expiresIn = params.get("expiresIn");

      if (idToken && refreshToken && userId) {
        // Store tokens and dispatch login success
        const user = {
          id: userId,
          email: email || "",
          name: name || "",
        };

        const tokens = {
          idToken,
          refreshToken,
          expiresIn: parseInt(expiresIn || "3600"),
        };

        dispatch(loginSuccess({ user, tokens }));
        setStatus("success");

        // Clear URL fragment for security
        window.history.replaceState(null, "", window.location.pathname);

        setTimeout(() => {
          navigate(`/${language}/dashboard`);
        }, 1500);
      } else {
        setStatus("error");
        setErrorMessage("Missing authentication data");
        setTimeout(() => {
          navigate(`/${language}/auth/login`);
        }, 3000);
      }
    } else {
      setStatus("error");
      setErrorMessage("No authentication data received");
      setTimeout(() => {
        navigate(`/${language}/auth/login`);
      }, 3000);
    }
  }, [searchParams, navigate, dispatch, language, t]);

  return (
    <AuthLayout>
      <div className="text-center space-y-4">
        {status === "processing" && (
          <>
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t("callback.processing")}
            </h1>
            <p className="text-muted-foreground">{t("callback.redirecting")}</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <Check className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {t("callback.success")}
            </h1>
            <p className="text-muted-foreground">{t("callback.redirecting")}</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-center">
              <XCircle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
              Authentication Failed
            </h1>
            <p className="text-muted-foreground">
              {errorMessage || t("errors.unknownError")}
            </p>
            <p className="text-sm text-muted-foreground">
              Redirecting to login...
            </p>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
