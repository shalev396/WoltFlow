import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { formatDistanceToNow } from "date-fns";
import {
  // Star,
  Paperclip,
} from "lucide-react";
import { cn } from "@/lib/utils";
// import { Badge } from "@/components/ui/badge";
import { AvatarSimple } from "@/components/ui/avatar-simple";
import type { EmailItem } from "@/types";

interface InboxListProps {
  emails: EmailItem[];
  selectedEmailId: string | null;
  onEmailSelect: (emailId: string) => void;
  searchQuery: string;
  selectedLabel: string | null;
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

export default function InboxList({
  emails,
  selectedEmailId,
  onEmailSelect,
  searchQuery,
  selectedLabel,
}: InboxListProps) {
  const { t } = useTranslation("inbox");

  // No need to filter here - InboxLayout already handles all filtering
  const filteredEmails = useMemo(() => {
    return emails;
  }, [emails]);

  const handleKeyDown = (
    event: React.KeyboardEvent,
    emailId: string,
    index: number
  ) => {
    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        onEmailSelect(emailId);
        break;
      case "ArrowDown": {
        event.preventDefault();
        const nextIndex = Math.min(index + 1, filteredEmails.length - 1);
        if (filteredEmails[nextIndex]) {
          onEmailSelect(filteredEmails[nextIndex].id);
        }
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        const prevIndex = Math.max(index - 1, 0);
        if (filteredEmails[prevIndex]) {
          onEmailSelect(filteredEmails[prevIndex].id);
        }
        break;
      }
    }
  };

  return (
    <div className="h-full overflow-hidden">
      <div className="p-3 border-b bg-muted/30">
        <h2 className="font-semibold text-sm text-muted-foreground">
          {t("list.header", { count: filteredEmails.length })}
        </h2>
      </div>

      <div
        className="h-full overflow-y-auto"
        role="listbox"
        aria-label={t("list.accessibility.emailList")}
      >
        {filteredEmails.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground text-sm">
              {t("list.noEmails")}
            </p>
            {(searchQuery || selectedLabel) && (
              <p className="text-xs text-muted-foreground mt-2">
                {t("list.adjustFilters")}
              </p>
            )}
          </div>
        ) : (
          filteredEmails.map((email, index) => (
            <div
              key={email.id}
              role="option"
              aria-selected={email.id === selectedEmailId}
              tabIndex={0}
              onClick={() => onEmailSelect(email.id)}
              onKeyDown={(e) => handleKeyDown(e, email.id, index)}
              className={cn(
                "p-3 border-b cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset",
                email.id === selectedEmailId
                  ? "bg-primary/10 border-primary/20"
                  : "hover:bg-muted/50"
                //   ,
                // !email.isRead && "bg-blue-50/50 dark:bg-blue-950/20"
              )}
            >
              <div className="space-y-2">
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <AvatarSimple
                      name={email.fromName || ""}
                      className="h-8 w-8 text-xs flex-shrink-0"
                    />
                    <div className="min-w-0 flex items-center gap-2">
                      <div className="text-sm font-medium text-foreground truncate">
                        {email.fromName || ""}
                      </div>
                      {email.attachmentUrls &&
                        email.attachmentUrls.length > 0 && (
                          <Paperclip className="h-3 w-3 text-gray-500 flex-shrink-0" />
                        )}
                      {/* {email.isStarred && (
                        <Star className="h-3 w-3 text-yellow-500 fill-current flex-shrink-0" />
                      )}
                      {!email.isRead && (
                        <div className="h-2 w-2 bg-blue-600 rounded-full flex-shrink-0" />
                      )} */}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground flex-shrink-0">
                    {formatDistanceToNow(new Date(email.createdAt), {
                      addSuffix: true,
                    })}
                  </div>
                </div>

                {/* Subject */}
                <div
                  className={cn(
                    "text-sm truncate",
                    // !email.isRead
                    //   ? "font-semibold text-foreground"
                    //   :
                    "font-normal text-muted-foreground"
                  )}
                >
                  {email.subject}
                </div>

                {/* Labels
                {email.labels.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {email.labels.map((label: string) => (
                      <Badge
                        key={label}
                        variant="secondary"
                        className={cn(
                          "text-xs h-5 px-1.5",
                          labelColors[label] ||
                            "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300"
                        )}
                      >
                        {label}
                      </Badge>
                    ))}
                  </div>
                )} */}

                {/* Preview - subject line */}
                <div className="text-xs text-muted-foreground line-clamp-2">
                  {email.subject}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
