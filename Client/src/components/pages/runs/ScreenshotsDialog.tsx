import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { ScreenshotItem } from "@/types";

interface ScreenshotsDialogProps {
  screenshots: ScreenshotItem[];
  runId: string;
  children?: React.ReactNode;
  /** Controlled open (e.g. from run details image click). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Start at this index when opening. */
  initialIndex?: number;
}

export function ScreenshotsDialog({
  screenshots,
  runId,
  children,
  open: controlledOpen,
  onOpenChange,
  initialIndex = 0,
}: ScreenshotsDialogProps) {
  const { t } = useTranslation("runs");
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;
  const setIsOpen = (next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const currentScreenshot = screenshots[currentIndex];

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(
        Math.min(Math.max(0, initialIndex), Math.max(0, screenshots.length - 1)),
      );
    }
  }, [isOpen, initialIndex, screenshots.length]);

  useEffect(() => {
    setImageLoading(true);
    setImageError(false);
  }, [currentIndex, currentScreenshot?.screenshotUrl]);

  useEffect(() => {
    if (!isOpen || screenshots.length <= 1) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrentIndex((prev) =>
          prev > 0 ? prev - 1 : screenshots.length - 1,
        );
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setCurrentIndex((prev) =>
          prev < screenshots.length - 1 ? prev + 1 : 0,
        );
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, screenshots.length]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : screenshots.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < screenshots.length - 1 ? prev + 1 : 0));
  };

  const handleDownload = async () => {
    if (!currentScreenshot?.screenshotUrl) return;

    try {
      const response = await fetch(currentScreenshot.screenshotUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `run-${runId}-screenshot-${currentIndex + 1}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download screenshot:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
      <DialogContent
        showCloseButton={false}
        className="fixed inset-0 top-0 left-0 z-50 flex h-[100dvh] w-screen max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none border-0 bg-black p-0 shadow-none sm:max-w-none"
      >
        <DialogTitle className="sr-only">
          {t("screenshots.title")} —{" "}
          {t("screenshots.count", {
            current: currentIndex + 1,
            total: screenshots.length,
          })}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {t("screenshots.description")}
        </DialogDescription>

        {/* Top bar — prominent Back so it can’t be missed */}
        <div className="relative z-20 flex shrink-0 items-center justify-between gap-3 bg-black/90 px-3 py-3 sm:px-5">
          <Button
            type="button"
            size="lg"
            onClick={() => setIsOpen(false)}
            className="h-12 gap-2 bg-white px-5 text-base font-semibold text-black hover:bg-white/90 sm:h-14 sm:px-6 sm:text-lg"
          >
            <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            {t("screenshots.back")}
          </Button>

          <div className="hidden text-sm text-white/80 sm:block">
            {t("screenshots.count", {
              current: currentIndex + 1,
              total: screenshots.length,
            })}
            {currentScreenshot?.screenshotType
              ? ` · ${t("screenshots.stage", { stage: currentScreenshot.screenshotType })}`
              : null}
          </div>

          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="h-12 bg-white/15 text-white hover:bg-white/25 sm:h-14"
            onClick={handleDownload}
            disabled={!currentScreenshot?.screenshotUrl || imageError}
          >
            <Download className="h-5 w-5 sm:mr-2" />
            <span className="hidden sm:inline">{t("screenshots.download")}</span>
          </Button>
        </div>

        {/* Image stage */}
        <div className="relative flex min-h-0 flex-1 items-center justify-center bg-black px-2 pb-2 sm:px-4">
          {imageLoading && currentScreenshot?.screenshotUrl && !imageError && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 text-white/80">
              <Loader2 className="h-10 w-10 animate-spin" />
              <p className="text-sm">{t("screenshots.loading")}</p>
            </div>
          )}

          {currentScreenshot?.screenshotUrl && !imageError ? (
            <img
              key={currentScreenshot.screenshotUrl}
              src={currentScreenshot.screenshotUrl}
              alt={`Screenshot ${currentIndex + 1}`}
              className={`max-h-full max-w-full object-contain transition-opacity duration-200 ${
                imageLoading ? "opacity-0" : "opacity-100"
              }`}
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageLoading(false);
                setImageError(true);
              }}
            />
          ) : (
            <div className="text-center text-white/70">
              {t("screenshots.noImage")}
            </div>
          )}

          {screenshots.length > 1 && (
            <>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute left-2 top-1/2 z-10 h-12 w-12 -translate-y-1/2 rounded-full bg-white/90 text-black hover:bg-white sm:left-4 sm:h-14 sm:w-14"
                onClick={handlePrevious}
                aria-label={t("screenshots.previous")}
              >
                <ChevronLeft className="h-7 w-7" />
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute right-2 top-1/2 z-10 h-12 w-12 -translate-y-1/2 rounded-full bg-white/90 text-black hover:bg-white sm:right-4 sm:h-14 sm:w-14"
                onClick={handleNext}
                aria-label={t("screenshots.next")}
              >
                <ChevronRight className="h-7 w-7" />
              </Button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {screenshots.length > 1 && (
          <div className="shrink-0 border-t border-white/10 bg-black/90 px-3 py-3 sm:px-5">
            <div className="flex justify-center gap-2 overflow-x-auto pb-1">
              {screenshots.map((screenshot, index) => (
                <button
                  key={screenshot.id || index}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  className={`h-14 w-14 shrink-0 overflow-hidden rounded-md border-2 transition-all sm:h-16 sm:w-16 ${
                    index === currentIndex
                      ? "border-white ring-2 ring-white/40"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  {screenshot.screenshotUrl ? (
                    <img
                      src={screenshot.screenshotUrl}
                      alt={`Thumbnail ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
