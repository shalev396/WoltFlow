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
  },
} as const;
