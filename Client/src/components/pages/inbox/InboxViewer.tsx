import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import {
  // Star,
  Reply,
  ReplyAll,
  Forward,
  Archive,
  Trash2,
  MoreHorizontal,
  Mail,
  // MailOpen,
  Paperclip,
  Download,
  FileText,
  File,
} from "lucide-react";

import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AvatarSimple } from "@/components/ui/avatar-simple";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { cn } from "@/lib/utils";
import { inboxService } from "@/services/inbox";
import type { EmailItem } from "@/types";

interface InboxViewerProps {
  email: EmailItem | undefined;
  onEmailAction: (action: string, emailId: string) => void;
}

// const labelColors: Record<string, string> = {
//   automation:
//     "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
//   "gift-card":
//     "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
//   error: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
//   alert:
//     "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
//   summary:
//     "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
//   balance:
//     "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300",
// };

export default function InboxViewer({
  email,
  onEmailAction,
}: InboxViewerProps) {
  const { t } = useTranslation("inbox");

  if (!email) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Mail className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">
            {t("viewer.noSelection.title")}
          </h3>
          <p className="text-sm">{t("viewer.noSelection.message")}</p>
        </div>
      </div>
    );
  }

  const handleAction = (action: string) => {
    onEmailAction(action, email.id);
  };

  const handleDownloadAttachment = async (
    attachmentIndex: number,
    filename: string
  ) => {
    try {
      await inboxService.downloadAndSaveAttachment(
        email.id,
        attachmentIndex,
        filename
      );
    } catch (error) {
      console.error("Failed to download attachment:", error);
      alert(`Download failed: ${error}`);
    }
  };

  const getFileIcon = (filename: string) => {
    const extension = filename.toLowerCase().split(".").pop();
    switch (extension) {
      case "pdf":
        return FileText;
      case "doc":
      case "docx":
        return FileText;
      case "xls":
      case "xlsx":
        return FileText;
      default:
        return File;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 border-b bg-background p-3 sm:p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-xl font-semibold text-foreground truncate">
                {email.subject}
              </h1>
              {/* {email.isStarred && (
                <Star className="h-4 w-4 text-yellow-500 fill-current flex-shrink-0" />
              )}
              {!email.isRead && (
                <div className="h-2 w-2 bg-blue-600 rounded-full flex-shrink-0" />
              )} */}
            </div>

            {/* Labels
            {email.labels.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {email.labels.map((label: string) => (
                  <Badge
                    key={label}
                    variant="secondary"
                    className={cn(
                      "text-xs",
                      labelColors[label] ||
                        "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300"
                    )}
                  >
                    {label}
                  </Badge>
                ))}
              </div>
            )} */}

            {/* Email details - traditional layout */}
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">
                  {t("viewer.from")}
                </span>
                <AvatarSimple
                  name={email.fromName || ""}
                  className="h-6 w-6 text-xs"
                />
                <span>{email.fromName || ""}</span>
                <span className="text-muted-foreground">
                  &lt;{email.fromEmail}&gt;
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">
                  {t("viewer.to")}
                </span>
                <span className="truncate">{email.toEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">
                  {t("viewer.date")}
                </span>
                <span>{format(new Date(email.createdAt), "PPP 'at' p")}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex-shrink-0 flex items-center gap-2">
            {/* <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                handleAction(email.isRead ? "mark-unread" : "mark-read")
              }
              className="h-8"
            >
              {email.isRead ? (
                <Mail className="h-4 w-4" />
              ) : (
                <MailOpen className="h-4 w-4" />
              )}
            </Button> */}

            {/* <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAction("star")}
              className={cn("h-8", email.isStarred && "text-yellow-500")}
            >
              <Star
                className={cn("h-4 w-4", email.isStarred && "fill-current")}
              />
            </Button> */}

            <Separator orientation="vertical" className="h-6" />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAction("reply")}
              className="h-8"
              title={t("viewer.actions.reply")}
            >
              <Reply className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAction("reply-all")}
              className="h-8"
              title={t("viewer.actions.replyAll")}
            >
              <ReplyAll className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAction("forward")}
              className="h-8"
              title={t("viewer.actions.forward")}
            >
              <Forward className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="h-6" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleAction("archive")}>
                  <Archive className="h-4 w-4 mr-2" />
                  {t("viewer.actions.archive")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleAction("delete")}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t("viewer.actions.delete")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Attachments Section */}
      {email.attachmentUrls && email.attachmentUrls.length > 0 && (
        <div className="flex-shrink-0 border-b bg-muted/20 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Paperclip className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium text-muted-foreground">
              {email.attachmentUrls.length === 1
                ? t("viewer.attachments.title", {
                    count: email.attachmentUrls.length,
                  })
                : t("viewer.attachments.title_plural", {
                    count: email.attachmentUrls.length,
                  })}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {email.attachmentUrls.map((attachment, index) => {
              const filename = attachment.split("/").pop() || attachment;
              const FileIcon = getFileIcon(filename);
              return (
                <div
                  key={attachment}
                  className="flex items-center gap-2 bg-background border rounded-lg p-2 min-w-0 max-w-xs"
                >
                  <FileIcon className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p
                      className="text-sm font-medium truncate"
                      title={filename}
                    >
                      {filename}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 flex-shrink-0"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDownloadAttachment(index, filename);
                    }}
                    title={t("viewer.attachments.download", { filename })}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Email body */}
      <div className="flex-1 overflow-y-auto p-6">
        <div
          className="prose prose-sm max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: "" }}
        />
      </div>
    </div>
  );
}
