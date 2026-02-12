export default {
  title: "Email Forwarding",
  description:
    "Email forwarding ensures that gift card codes sent to your email are automatically forwarded to your WoltFlow inbox for processing. This enables our automation to extract codes and apply them to your Wolt account.",
  howItWorks: {
    title: "How Email Forwarding Works",
    description:
      "When you purchase a gift card using Wolt Benefits, the confirmation email with the redemption code is automatically forwarded from your Gmail to your personal WoltFlow inbox. Our system then extracts the code and applies it to your Wolt account.",
  },
  gmailForwarding: {
    title: "Gmail Forwarding Setup",
    description:
      "Gmail natively supports email forwarding, making it the perfect solution for WoltFlow automation. Currently, we have verified support for Gmail, though other email providers may work similarly.",
    nativeGmailForwarding: {
      title: "Native Gmail Forwarding",
      description:
        "Gmail's built-in forwarding feature automatically sends copies of incoming emails to another address.",
      benefitsTitle: "Benefits:",
      benefits: [
        "Instant forwarding",
        "No additional apps needed",
        "Reliable and secure",
        "Works with filters",
      ],
    },
    yourWoltFlowInbox: {
      title: "Your WoltFlow Inbox",
      description:
        "Each WoltFlow user gets a unique email address for receiving forwarded emails.",
      addressNote:
        "This address is automatically generated and linked to your account",
      viewInboxButton: "View Your Inbox",
    },
    stepByStepTitle: "Step-by-Step Gmail Setup",
    steps: {
      "1": {
        title: "Open Gmail Settings",
        description:
          'Log into your Gmail account and click the gear icon in the top-right corner, then select "See all settings" from the dropdown menu.',
        button: "Open Gmail Settings",
      },
      "2": {
        title: "Navigate to Forwarding Tab",
        description:
          'In the Gmail settings page, click on the "Forwarding and POP/IMAP" tab at the top of the settings panel.',
      },
      "3": {
        title: "Add Forwarding Address",
        description:
          'Click "Add a forwarding address" and enter your WoltFlow inbox email address. Gmail will send a verification email to confirm the forwarding setup.',
        note: "Your WoltFlow address: Check your WoltFlow inbox page to find your unique email address for forwarding setup.",
      },
      "4": {
        title: "Verify Forwarding",
        description:
          "Gmail will send a verification code to your WoltFlow inbox. Check your WoltFlow inbox for the verification email and click the confirmation link or enter the code.",
      },
      "5": {
        title: "Enable Forwarding",
        description:
          'After verification, return to Gmail settings and select "Forward a copy of incoming mail to" and choose your WoltFlow address. You can choose to keep Gmail\'s copy or delete it.',
        recommendation:
          'Recommendation: Choose "keep Gmail\'s copy in the Inbox" to maintain your email backups while enabling forwarding.',
      },
    },
  },
  emailFilters: {
    title: "Email Filters for Targeted Forwarding",
    description:
      "Instead of forwarding all emails, you can create Gmail filters to forward only specific emails (like gift card confirmations) to your WoltFlow inbox. This keeps your WoltFlow inbox clean and focused on automation-related emails.",
    creatingFilterTitle: "Creating a Wolt Gift Card Filter",
    steps: {
      "1": {
        title: "Access Gmail Filters",
        description:
          'In Gmail settings, go to "Filters and Blocked Addresses" tab',
      },
      "2": {
        title: "Create New Filter",
        description:
          'Click "Create a new filter" and set up criteria to match Wolt gift card emails',
      },
      "3": {
        title: "Set Filter Criteria",
        from: "From:",
        fromValue: "info@wolt.com",
        subject: "Subject:",
        subjectValue: "הגיפט קארד של Wolt הגיע ומחכה לשליחה :)",
      },
      "4": {
        title: "Set Forward Action",
        description:
          'Choose "Forward it to" and select your WoltFlow email address',
      },
    },
    importantWarning: {
      title: "Important: Filter Setup Required",
      description:
        "If no specific filter is set up or applied properly, all emails from your Gmail will be forwarded to your WoltFlow inbox. We strongly recommend setting up the exact filter criteria shown above to ensure only Wolt gift card emails are forwarded.",
    },
  },
  otherProviders: {
    title: "Other Email Providers",
    gmailRecommended: {
      title: "Gmail Recommended",
      description:
        "While other email providers may support similar forwarding features, we have thoroughly tested and verified the setup process with Gmail. For the most reliable experience, we recommend using Gmail for WoltFlow automation.",
    },
    outlook: {
      title: "Outlook/Hotmail",
      badge: "Untested",
      description:
        "Microsoft Outlook supports email forwarding through rules and may work with WoltFlow, but we haven't verified the complete setup process.",
      note: "If you need to use Outlook, the general process should be similar to Gmail's forwarding setup, but specific steps may vary.",
    },
    otherProvidersCard: {
      title: "Other Providers",
      badge: "Possible",
      description:
        "Most modern email providers (Yahoo, ProtonMail, etc.) offer forwarding features that should be compatible with WoltFlow.",
      note: 'Look for "Email Forwarding" or "Mail Rules" in your provider\'s settings. The setup should follow similar principles to Gmail.',
    },
  },
  complete: {
    title: "Email Forwarding Complete!",
    description:
      "With email forwarding configured, gift card codes will automatically arrive in your WoltFlow inbox for processing. You can now view your WoltFlow inbox and complete your automation setup.",
    viewInboxButton: "View Your Inbox",
    completeSetupButton: "Complete Setup",
  },
} as const;
