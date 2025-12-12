import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, Download, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Screenshot } from "@/types";

interface ScreenshotsDialogProps {
  screenshots: Screenshot[];
  runId: string;
  children: React.ReactNode;
}

export function ScreenshotsDialog({
  screenshots,
  runId,
  children,
}: ScreenshotsDialogProps) {
  const { t } = useTranslation("runs");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const currentScreenshot = screenshots[currentIndex];

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
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {t("screenshots.title")} - {t("screenshots.count", { current: currentIndex + 1, total: screenshots.length })}
          </DialogTitle>
          <DialogDescription>
            {currentScreenshot?.stage
              ? t("screenshots.stage", { stage: currentScreenshot.stage })
              : t("screenshots.description")}
          </DialogDescription>
        </DialogHeader>

        {/* Image container */}
        <div className="flex-1 relative flex items-center justify-center bg-muted/30 rounded-lg overflow-hidden">
          {currentScreenshot?.screenshotUrl ? (
            <img
              src={currentScreenshot.screenshotUrl}
              alt={`Screenshot ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              {t("screenshots.noImage")}
            </div>
          )}

          {/* Navigation arrows - Only show if more than 1 screenshot */}
          {screenshots.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2"
                onClick={handleNext}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}
        </div>

        {/* Footer with actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              {t("screenshots.download")}
            </Button>
          </div>

          {/* Thumbnail navigation for multiple screenshots */}
          {screenshots.length > 1 && (
            <div className="flex gap-2 overflow-x-auto max-w-md">
              {screenshots.map((screenshot, index) => (
                <button
                  key={screenshot.id || index}
                  onClick={() => setCurrentIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-all ${
                    index === currentIndex
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-transparent hover:border-muted-foreground/50"
                  }`}
                >
                  {screenshot.screenshotUrl ? (
                    <img
                      src={screenshot.screenshotUrl}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <X className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
            {t("screenshots.close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

