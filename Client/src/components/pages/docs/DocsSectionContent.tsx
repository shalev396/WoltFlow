import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { IntroductionContent } from "./content/IntroductionContent";
import { GettingStartedContent } from "./content/GettingStartedContent";
import { WoltFlowExtensionContent } from "./content/WoltFlowExtensionContent";
import { ManualSetupContent } from "./content/ManualSetupContent";
import { SmsForwardingContent } from "./content/SmsForwardingContent";
import { EmailForwardingContent } from "./content/EmailForwardingContent";
import { InboxContent } from "./content/InboxContent";

interface DocsSectionContentProps {
  currentSection: string;
}

export function DocsSectionContent({
  currentSection,
}: DocsSectionContentProps) {
  const location = useLocation();

  // Handle hash navigation - scroll to section when hash changes or on initial load
  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      const elementId = hash.substring(1); // Remove the '#'
      const element = document.getElementById(elementId);
      if (element) {
        // Use a timeout to ensure the content is rendered
        setTimeout(() => {
          // Calculate offset for fixed headers
          // Main navbar: 64px (h-16) + Mobile docs header: 56px (h-14) + padding: 16px
          const isMobile = window.innerWidth < 1024; // lg breakpoint
          const offset = isMobile ? 64 + 56 + 16 : 64 + 16; // navbar + mobile header + padding : navbar + padding

          const elementPosition =
            element.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }, 100);
      }
    }
  }, [location.hash, currentSection]); // Keep both dependencies for proper updates

  const renderSectionContent = () => {
    switch (currentSection) {
      case "introduction":
        return <IntroductionContent />;
      case "getting-started":
        return <GettingStartedContent />;
      case "woltflow-extension":
        return <WoltFlowExtensionContent />;
      case "manual-setup":
        return <ManualSetupContent />;
      case "sms-forwarding":
        return <SmsForwardingContent />;
      case "email-forwarding":
        return <EmailForwardingContent />;
      case "inbox":
        return <InboxContent />;
      default:
        return <IntroductionContent />;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-4xl px-4 py-8 lg:px-8">
        <div className="space-y-8">{renderSectionContent()}</div>
      </div>
    </div>
  );
}
