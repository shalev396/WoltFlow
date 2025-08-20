import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { docSections } from "../constants/docSections";

interface DocsSidebarProps {
  mobile?: boolean;
  currentSection: string;
  onLinkClick?: () => void;
}

export function DocsSidebar({
  mobile = false,
  currentSection,
  onLinkClick,
}: DocsSidebarProps) {
  // Always show the current section as open
  const [openSections, setOpenSections] = useState<string[]>([currentSection]);

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const getSectionUrl = (sectionId: string) => {
    return `/docs/${sectionId}`;
  };

  return (
    <div
      className={cn(
        "flex h-full flex-col border-r bg-background",
        !mobile && "sticky top-0"
      )}
    >
      {/* Header */}
      <div className="border-b p-6">
        <div className="flex items-center gap-3">
          <BookOpen className="h-6 w-6" />
          <div>
            <h2 className="text-lg font-semibold">Documentation</h2>
            <p className="text-sm text-muted-foreground">
              Setup and configuration guide
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-2">
          {docSections.map((section) => {
            const Icon = section.icon;
            const isOpen = openSections.includes(section.id);
            const isActive = currentSection === section.id;

            return (
              <div key={section.id}>
                {/* Section Header */}
                <div className="flex">
                  <Link
                    to={getSectionUrl(section.id)}
                    onClick={onLinkClick}
                    className="flex-1"
                  >
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start h-10 px-3 hover:bg-accent/50",
                        isActive && "bg-accent text-accent-foreground"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {section.title}
                        </span>
                        {/* Badge temporarily hidden - can be re-enabled later */}
                      </div>
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-8 p-0 hover:bg-accent/50"
                    onClick={() => toggleSection(section.id)}
                  >
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        isOpen && "rotate-90"
                      )}
                    />
                  </Button>
                </div>

                {/* Subsections */}
                {isOpen && (
                  <div className="mt-1 ml-6 space-y-1">
                    {section.subsections.map((subsection) => (
                      <Link
                        key={subsection.id}
                        to={`${getSectionUrl(section.id)}#${subsection.id}`}
                        onClick={onLinkClick}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start h-8 px-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        >
                          {subsection.title}
                        </Button>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
