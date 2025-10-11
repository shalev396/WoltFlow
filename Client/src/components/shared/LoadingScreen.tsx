import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingScreen({
  message,
  fullScreen = true,
}: LoadingScreenProps) {
  const { t } = useTranslation("common");
  const containerClasses = fullScreen
    ? "fixed inset-0 bg-background z-50 flex items-center justify-center"
    : "flex items-center justify-center p-4 sm:p-8";

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 max-w-md mx-auto px-4 text-center">
        {/* Logo/Brand */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
            WoltFlow
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {t("loading.tagline")}
          </p>
        </div>

        {/* Loading Animation */}
        <div className="relative my-4 sm:my-6">
          <div className="size-12 sm:size-16 rounded-full border-3 sm:border-4 border-muted flex items-center justify-center">
            <Loader2 className="size-6 sm:size-8 text-blue-600 animate-spin" />
          </div>

          {/* Pulse Animation */}
          <div className="absolute inset-0 size-12 sm:size-16 rounded-full border-3 sm:border-4 border-blue-600/20 animate-ping" />
        </div>

        {/* Loading Message */}
        <div className="space-y-1 sm:space-y-2">
          <p className="text-base sm:text-lg font-medium text-foreground">
            {message || t("loading.defaultMessage")}
          </p>
          {fullScreen && (
            <p className="text-xs sm:text-sm text-muted-foreground">
              {t("loading.initializingSession")}
            </p>
          )}
        </div>

        {/* Progress Dots */}
        <div className="flex space-x-1.5 sm:space-x-2 mt-4">
          <div className="size-1.5 sm:size-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="size-1.5 sm:size-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="size-1.5 sm:size-2 bg-blue-600 rounded-full animate-bounce" />
        </div>

        {/* Optional Background Pattern for Large Screens */}
        {fullScreen && (
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl" />
          </div>
        )}
      </div>
    </div>
  );
}
