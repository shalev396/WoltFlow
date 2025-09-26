import { useState, useMemo } from "react";
import { Mail, Loader2, AlertCircle, Inbox, ArrowLeft } from "lucide-react";
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
import { type InboxFilters } from "@/types/inbox";

export default function InboxLayout() {
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "viewer">("list"); // Mobile view state
  const page = 1; // For now, we'll implement pagination later
  // Frontend-only filtering is done with searchQuery and selectedLabel state

  // Build API filters based on UI state
  const apiFilters = useMemo(() => {
    const result: InboxFilters = { page, limit: 20 };

    // Note: Search filtering is done on frontend for now

    return result;
  }, [page]);

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

  // Filter emails by search query and label on frontend
  const filteredEmails = useMemo(() => {
    let result = inboxData?.data?.emails || [];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (email) =>
          email.subject.toLowerCase().includes(query) ||
          email.fromName?.toLowerCase().includes(query) ||
          email.fromEmail.toLowerCase().includes(query) ||
          email.body?.toLowerCase().includes(query)
      );
    }

    // // Filter by label
    // if (selectedLabel) {
    //   result = result.filter((email) => email.labels?.includes(selectedLabel));
    // }

    return result;
  }, [searchQuery, selectedLabel]);

  // Set initial selected email
  useMemo(() => {
    if (filteredEmails.length > 0 && !selectedEmailId) {
      setSelectedEmailId(filteredEmails[0].id);
    }
  }, [filteredEmails, selectedEmailId]);

  const selectedEmail = filteredEmails.find(
    (email) => email.id === selectedEmailId
  );

  // Handle email selection on mobile - switch to viewer
  const handleEmailSelect = (emailId: string) => {
    setSelectedEmailId(emailId);
    setMobileView("viewer"); // Switch to viewer on mobile
  };

  // Handle back to list on mobile
  const handleBackToList = () => {
    setMobileView("list");
  };

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
        <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4 max-w-7xl h-full">
          <header className="mb-3 sm:mb-4">
            {/* Responsive header layout */}
            <div className="flex flex-col gap-3">
              {/* Title and description row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex flex-col gap-1">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight flex items-center gap-2">
                    <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    Inbox
                  </h1>
                  {/* Description - only on larger screens */}
                  <p className="text-muted-foreground text-sm hidden lg:block">
                    Automation notifications and email summaries
                  </p>
                </div>
              </div>

              {/* Email address - full width on mobile/tablet */}
              {inboxData?.data?.inbox?.emailAddress && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-sm text-muted-foreground font-medium">
                    Your custom email:
                  </span>
                  <code className="bg-muted px-3 py-2 rounded-md text-sm font-mono text-blue-600 break-all sm:max-w-none lg:max-w-lg xl:max-w-xl">
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
              {/* Mobile Navigation Bar */}
              <div className="lg:hidden mb-2">
                <div className="flex items-center">
                  {mobileView === "viewer" && (
                    <button
                      onClick={handleBackToList}
                      className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to emails
                    </button>
                  )}
                </div>
              </div>

              {/* Compact Toolbar - hidden on mobile when viewing email */}
              <div
                className={`transition-all duration-200 ${
                  mobileView === "viewer" ? "hidden lg:block" : "block"
                }`}
              >
                <InboxToolbar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  selectedLabel={selectedLabel}
                  onLabelChange={setSelectedLabel}
                />
              </div>

              {/* Responsive Layout */}
              <div className="h-[calc(100vh-200px)] sm:h-[calc(100vh-220px)] lg:h-[calc(100vh-280px)] mt-2 lg:mt-4">
                {/* Desktop: Resizable panels */}
                <div className="hidden lg:block h-full">
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

                {/* Mobile: Single panel at a time */}
                <div className="lg:hidden h-full">
                  <div className="rounded-lg border bg-background h-full overflow-hidden">
                    {mobileView === "list" ? (
                      <InboxList
                        emails={filteredEmails}
                        selectedEmailId={selectedEmailId}
                        onEmailSelect={handleEmailSelect}
                        searchQuery={searchQuery}
                        selectedLabel={selectedLabel}
                      />
                    ) : (
                      <InboxViewer
                        email={selectedEmail}
                        onEmailAction={(action, emailId) => {
                          console.log(
                            `Email action ${action} triggered for ${emailId}`
                          );
                          // TODO: Implement email actions (mark as read, star, delete, etc.)
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
