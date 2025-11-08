import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Layout from "@/components/shared/Layout";
import { DocsSidebar } from "./sidebar/DocsSidebar";
import { DocsSectionContent } from "./DocsSectionContent";

interface DocsLayoutProps {
  currentSection: string;
}

export function DocsLayout({ currentSection }: DocsLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <Layout className="relative">
      {/* Fixed Sidebar for Desktop - positioned below main navbar, overlays content */}
      <div className="hidden 2xl:block fixed left-0 top-16 z-10 h-[calc(100vh-4rem)] w-72 border-r bg-background overflow-y-auto shadow-lg">
        <DocsSidebar currentSection={currentSection} onLinkClick={() => {}} />
      </div>

      {/* Mobile Header with Hamburger Menu - positioned below main navbar */}
      <div className="sticky top-16 z-50 2xl:hidden border-b bg-background">
        <div className="flex h-14 items-center px-4">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-4 w-4" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
          <div className="flex items-center space-x-2 ml-4">
            <span className="text-sm text-muted-foreground">Navigation</span>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <div
          className={`absolute top-full left-0 right-0 z-60 bg-card border-x border-b border-border rounded-b-lg shadow-xl max-h-[calc(100vh-8rem)] overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen
              ? "opacity-100 translate-y-0 scale-y-100"
              : "opacity-0 -translate-y-2 scale-y-95 pointer-events-none"
          }`}
          style={{ transformOrigin: "top center" }}
        >
          <div className="overflow-y-auto max-h-full">
            <DocsSidebar
              mobile
              currentSection={currentSection}
              onLinkClick={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      </div>

      {/* Mobile Overlay - disables content when navigation is open */}
      <div
        className={`fixed top-0 left-0 z-10 bg-black/20 backdrop-blur-sm 2xl:hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{
          height: "100dvh", // Dynamic viewport height handles mobile browser UI
          width: "100dvw", // Dynamic viewport width
          minHeight: "100vh", // Fallback for older browsers
          minWidth: "100vw",
        }}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Main Content - no margin, sidebar overlays */}
      <div>
        <DocsSectionContent currentSection={currentSection} />
      </div>
    </Layout>
  );
}
