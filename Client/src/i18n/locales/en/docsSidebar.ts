export default {
  header: {
    title: "Documentation",
    subtitle: "Setup and configuration guide",
  },
  sections: {
    introduction: {
      title: "Introduction",
      subsections: {
        "what-is-woltflow": "What is WoltFlow?",
        "how-it-works": "How It Works",
        "security-privacy": "Security & Privacy",
      },
    },
    "getting-started": {
      title: "Getting Started",
      subsections: {
        "setup-checklist": "Setup Checklist",
        "account-requirements": "Account Requirements",
        "activation-guide": "Activation Guide",
      },
    },
    "woltflow-extension": {
      title: "WoltFlow Token Reviewer",
      subsections: {
        "extension-installation": "Installation",
        "extracting-credentials": "Extracting Credentials",
        "extension-troubleshooting": "Troubleshooting",
      },
    },
    "manual-setup": {
      title: "Manual Token Setup",
      subsections: {
        "understanding-tokens": "Understanding Tokens",
        "manual-extraction": "Manual Extraction",
        "token-security": "Token Security",
      },
    },
    "email-forwarding": {
      title: "Email Forwarding",
      subsections: {
        "gmail-forwarding": "Gmail Setup",
        "email-filters": "Email Filters",
        "other-providers": "Other Providers",
      },
    },
    inbox: {
      title: "Your Inbox",
      subsections: {
        "inbox-overview": "How It Works",
        "managing-emails": "Managing Emails",
        "inbox-privacy": "Privacy & Security",
      },
    },
  },
} as const;
