import { useState } from "react";
import { Mail } from "lucide-react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import Navbar from "@/components/shared/Navbar";
import InboxList from "@/components/pages/inbox/InboxList";
import InboxViewer from "@/components/pages/inbox/InboxViewer";
import InboxToolbar from "@/components/pages/inbox/InboxToolbar";
import { dummyEmails } from "@/data/dummyEmails";

export default function InboxLayout() {
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(
    dummyEmails[0].id
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  const selectedEmail = dummyEmails.find(
    (email) => email.id === selectedEmailId
  );

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
            <p className="text-muted-foreground mt-2">
              Automation notifications and email summaries
            </p>
          </header>

          {/* Toolbar */}
          <InboxToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedLabel={selectedLabel}
            onLabelChange={setSelectedLabel}
          />

          {/* Resizable panels for Outlook-like layout */}
          <div className="h-[calc(100vh-250px)] mt-4">
            <ResizablePanelGroup
              direction="horizontal"
              className="rounded-lg border bg-background"
            >
              {/* Email list panel */}
              <ResizablePanel defaultSize={30} minSize={25} maxSize={50}>
                <div className="h-full">
                  <InboxList
                    emails={dummyEmails}
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
                    onEmailAction={() => {
                      // Handle email actions (mark as read, star, etc.)
                      console.log("Email action triggered");
                    }}
                  />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      </main>
    </div>
  );
}
