import { Card } from "@/components/ui/card";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Layout from "./Layout";

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AuthLayout({
  children,
  title,
  subtitle,
}: AuthLayoutProps) {
  const { t } = useTranslation("auth");
  const { lng } = useParams<{ lng: string }>();

  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-5xl">
          <Card className="overflow-hidden border-border/50 shadow-2xl p-0">
            <div className="grid md:grid-cols-2 h-full">
              {/* Left Side - Form Content */}
              <div className="p-6 md:p-10 space-y-6">
                {/* Header */}
                {(title || subtitle) && (
                  <div className="flex flex-col gap-2 text-center">
                    {title && (
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {title}
                      </h1>
                    )}
                    {subtitle && (
                      <p className="text-muted-foreground text-balance">
                        {subtitle}
                      </p>
                    )}
                  </div>
                )}

                {/* Form Content */}
                {children}
              </div>

              {/* Right Side - Branded Background */}
              <div className="relative hidden md:flex bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 overflow-hidden">
                {/* Animated gradient orbs with hover effect */}
                <div className="absolute inset-0 transition-transform duration-1000 hover:scale-110">
                  <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                  <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                  <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                </div>

                {/* Content */}
                <div className="relative flex flex-col items-center justify-center p-10 text-white w-full">
                  <div className="space-y-6 text-center">
                    {/* Logo/Brand */}
                    <div className="space-y-2 transform transition-transform hover:scale-105 duration-300">
                      <h2 className="text-5xl font-bold tracking-tight">
                        WoltFlow
                      </h2>
                      <p className="text-xl text-blue-100">
                        Automated Gift Card Management
                      </p>
                    </div>

                    {/* Features */}
                    <div className="mt-12 space-y-4 text-left max-w-md">
                      <div className="flex items-start gap-3 group">
                        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-white mt-2 group-hover:scale-150 transition-transform duration-300"></div>
                        <p className="text-blue-50 group-hover:text-white transition-colors">
                          Automate your Wolt gift card purchases
                        </p>
                      </div>
                      <div className="flex items-start gap-3 group">
                        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-white mt-2 group-hover:scale-150 transition-transform duration-300"></div>
                        <p className="text-blue-50 group-hover:text-white transition-colors">
                          Track and manage your automation runs
                        </p>
                      </div>
                      <div className="flex items-start gap-3 group">
                        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-white mt-2 group-hover:scale-150 transition-transform duration-300"></div>
                        <p className="text-blue-50 group-hover:text-white transition-colors">
                          Secure and reliable service
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Terms & Privacy - Below Card */}
          <p className="mt-6 text-center text-xs text-muted-foreground px-6">
            {t("login.termsPrefix")}{" "}
            <Link
              to={`/${lng}/legal/terms`}
              className="text-primary hover:underline underline-offset-4"
            >
              {t("login.termsLink")}
            </Link>{" "}
            {t("login.and")}{" "}
            <Link
              to={`/${lng}/legal/privacy`}
              className="text-primary hover:underline underline-offset-4"
            >
              {t("login.privacyLink")}
            </Link>
            .
          </p>
        </div>

        {/* Add custom CSS animations */}
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

