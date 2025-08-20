import {
  BookOpen,
  Play,
  Chrome,
  Settings,
  MessageCircle,
  Mail,
  Inbox,
} from "lucide-react";
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
    icon: Chrome,
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
  {
    id: "sms-forwarding",
    title: "SMS Forwarding",
    icon: MessageCircle,
    subsections: [
      { id: "sms-api-setup", title: "API Setup" },
      { id: "android-setup", title: "Android Configuration" },
      { id: "ios-setup", title: "iOS Configuration" },
    ],
  },
  {
    id: "email-forwarding",
    title: "Email Forwarding",
    icon: Mail,
    subsections: [
      { id: "gmail-forwarding", title: "Gmail Setup" },
      { id: "email-filters", title: "Email Filters" },
      { id: "other-providers", title: "Other Providers" },
    ],
  },
  {
    id: "inbox",
    title: "Your Inbox",
    icon: Inbox,
    subsections: [
      { id: "inbox-overview", title: "How It Works" },
      { id: "managing-emails", title: "Managing Emails" },
      { id: "inbox-privacy", title: "Privacy & Security" },
    ],
  },
];
