import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/store/slices/userSlice";
import Layout from "@/components/shared/Layout";
import { Card, CardContent } from "@/components/ui/card";
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
    const code = searchParams.get("code");
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

    if (code) {
      // Backend handles the code exchange via the /auth/callback endpoint
      // The cookies are set by the backend, so we just need to fetch user info
      fetch(
        `${
          import.meta.env.VITE_ENV === "local" ? "http://localhost:3000" : ""
        }/api/auth/me`,
        {
          credentials: "include",
        }
      )
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch user");
          return res.json();
        })
        .then((data) => {
          if (data.success && data.data?.user) {
            dispatch(loginSuccess(data.data.user));
            setStatus("success");
            setTimeout(() => {
              navigate(`/${language}/dashboard`);
            }, 1500);
          } else {
            throw new Error("Invalid response");
          }
        })
        .catch((err) => {
          console.error("Auth callback error:", err);
          setStatus("error");
          setErrorMessage(t("errors.unknownError"));
          setTimeout(() => {
            navigate(`/${language}/auth/login`);
          }, 3000);
        });
    } else {
      setStatus("error");
      setErrorMessage("No authorization code received");
      setTimeout(() => {
        navigate(`/${language}/auth/login`);
      }, 3000);
    }
  }, [searchParams, navigate, dispatch, language, t]);

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
        <Card className="w-full max-w-md shadow-lg border-border/50">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              {status === "processing" && (
                <>
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                  </div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {t("callback.processing")}
                  </h1>
                  <p className="text-muted-foreground">
                    {t("callback.redirecting")}
                  </p>
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
                  <p className="text-muted-foreground">
                    {t("callback.redirecting")}
                  </p>
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
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
