import { useState, useMemo } from "react";
import { Mail, Loader2, AlertCircle, Inbox } from "lucide-react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import Navbar from "@/components/shared/Navbar";
import InboxList from "@/components/pages/inbox/InboxList";
import InboxViewer from "@/components/pages/inbox/InboxViewer";
import InboxToolbar from "@/components/pages/inbox/InboxToolbar";
import { useInboxQuery } from "@/queries/inbox";
import { inboxService, type InboxFilters } from "@/services/inbox";
import type { Email } from "@/data/dummyEmails";

interface InboxLayoutFilters {
  status?: "pending" | "processing" | "completed" | "failed" | "skipped";
  searchQuery?: string;
  selectedLabel?: string | null;
}

export default function InboxLayout() {
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const page = 1; // For now, we'll implement pagination later
  const filters: InboxLayoutFilters = {}; // For now, status filtering will be done on frontend

  // Build API filters based on UI state
  const apiFilters = useMemo(() => {
    const result: InboxFilters = { page, limit: 20 };

    if (filters.status) result.status = filters.status;
    // Note: Search filtering is done on frontend for now

    return result;
  }, [page, filters.status]);

  // Fetch inbox data
  const {
    data: inboxData,
    isLoading,
    isError,
    error,
    refetch,
  } = useInboxQuery(apiFilters, {
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Data is fresh for 30 seconds
  });

  // Transform backend emails to frontend format
  const transformedEmails: Email[] = useMemo(() => {
    if (!inboxData?.data?.emails) return [];

    return inboxData.data.emails.map((email) => {
      const transformed = inboxService.transformEmailForUI(email);
      // Add user's email address as 'to' field
      if (inboxData.data.inbox) {
        transformed.to = inboxData.data.inbox.emailAddress;
      }
      return transformed;
    });
  }, [inboxData]);

  // Filter emails by search query and label on frontend
  const filteredEmails = useMemo(() => {
    let result = transformedEmails;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (email) =>
          email.subject.toLowerCase().includes(query) ||
          email.from.name.toLowerCase().includes(query) ||
          email.from.email.toLowerCase().includes(query) ||
          email.body.toLowerCase().includes(query)
      );
    }

    // Filter by label
    if (selectedLabel) {
      result = result.filter((email) => email.labels.includes(selectedLabel));
    }

    return result;
  }, [transformedEmails, searchQuery, selectedLabel]);

  // Set initial selected email
  useMemo(() => {
    if (filteredEmails.length > 0 && !selectedEmailId) {
      setSelectedEmailId(filteredEmails[0].id);
    }
  }, [filteredEmails, selectedEmailId]);

  const selectedEmail = filteredEmails.find(
    (email) => email.id === selectedEmailId
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="h-screen pt-16 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
            <h2 className="text-xl font-semibold">Loading your inbox...</h2>
            <p className="text-muted-foreground">
              Fetching your emails and settings
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="h-screen pt-16 flex items-center justify-center">
          <div className="text-center space-y-4 max-w-md">
            <AlertCircle className="h-8 w-8 mx-auto text-red-600" />
            <h2 className="text-xl font-semibold">Unable to load inbox</h2>
            <p className="text-muted-foreground">
              {error?.message ||
                "There was a problem loading your emails. Please try again."}
            </p>
            <button
              onClick={() => refetch()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="h-screen pt-16">
        <div className="container mx-auto px-4 py-8 max-w-7xl h-full">
          <header className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight flex items-center gap-3">
              <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              Inbox
            </h1>
            <div className="mt-2 space-y-1">
              <p className="text-muted-foreground">
                Automation notifications and email summaries
              </p>
              {inboxData?.data?.inbox?.emailAddress && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">
                    Your custom email:
                  </span>
                  <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                    {inboxData.data.inbox.emailAddress}
                  </code>
                </div>
              )}
            </div>
          </header>

          {/* Show empty state if no emails */}
          {filteredEmails.length === 0 && !isLoading && (
            <div className="flex items-center justify-center h-[60vh]">
              <div className="text-center space-y-4">
                <Inbox className="h-16 w-16 mx-auto text-muted-foreground/50" />
                <h2 className="text-xl font-semibold text-muted-foreground">
                  No emails yet
                </h2>
                <p className="text-muted-foreground max-w-md">
                  {searchQuery || selectedLabel
                    ? "No emails match your current filters. Try adjusting your search or filters."
                    : inboxData?.data?.inbox?.emailAddress
                    ? `Send an email to ${inboxData.data.inbox.emailAddress} to see it appear here.`
                    : "Your inbox is empty. Emails sent to your custom address will appear here."}
                </p>
              </div>
            </div>
          )}

          {/* Show inbox content when emails exist */}
          {filteredEmails.length > 0 && (
            <>
              {/* Toolbar */}
              <InboxToolbar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedLabel={selectedLabel}
                onLabelChange={setSelectedLabel}
              />

              {/* Resizable panels for Outlook-like layout */}
              <div className="h-[calc(100vh-280px)] mt-4">
                <ResizablePanelGroup
                  direction="horizontal"
                  className="rounded-lg border bg-background"
                >
                  {/* Email list panel */}
                  <ResizablePanel defaultSize={30} minSize={25} maxSize={50}>
                    <div className="h-full">
                      <InboxList
                        emails={filteredEmails}
                        selectedEmailId={selectedEmailId}
                        onEmailSelect={setSelectedEmailId}
                        searchQuery={searchQuery}
                        selectedLabel={selectedLabel}
                      />
                    </div>
                  </ResizablePanel>

                  <ResizableHandle withHandle />

                  {/* Email viewer panel */}
                  <ResizablePanel defaultSize={70} minSize={50}>
                    <div className="h-full">
                      <InboxViewer
                        email={selectedEmail}
                        onEmailAction={(action, emailId) => {
                          console.log(
                            `Email action ${action} triggered for ${emailId}`
                          );
                          // TODO: Implement email actions (mark as read, star, delete, etc.)
                        }}
                      />
                    </div>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
