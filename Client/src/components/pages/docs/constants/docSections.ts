import { BookOpen, Play, Globe, Settings } from "lucide-react";
import type { DocSection } from "../types";

export const docSections: DocSection[] = [
  {
    id: "introduction",
    title: "Introduction",
    icon: BookOpen,
    subsections: [
      { id: "what-is-woltflow", title: "What is WoltFlow?" },
      { id: "how-it-works", title: "How It Works" },
      { id: "security-privacy", title: "Security & Privacy" },
    ],
  },
  {
    id: "getting-started",
    title: "Getting Started",
    icon: Play,
    subsections: [
      { id: "setup-checklist", title: "Setup Checklist" },
      { id: "account-requirements", title: "Account Requirements" },
      { id: "activation-guide", title: "Activation Guide" },
    ],
  },
  {
    id: "woltflow-extension",
    title: "WoltFlow Token Reviewer",
    icon: Globe,
    subsections: [
      { id: "extension-installation", title: "Installation" },
      { id: "extracting-credentials", title: "Extracting Credentials" },
      { id: "extension-troubleshooting", title: "Troubleshooting" },
    ],
  },
  {
    id: "manual-setup",
    title: "Manual Token Setup",
    icon: Settings,
    subsections: [
      { id: "understanding-tokens", title: "Understanding Tokens" },
      { id: "manual-extraction", title: "Manual Extraction" },
      { id: "token-security", title: "Token Security" },
    ],
  },
];
