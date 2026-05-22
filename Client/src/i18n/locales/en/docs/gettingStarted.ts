export default {
  title: "Getting Started",
  description:
    "Follow this step-by-step guide to set up your WoltFlow automation in under 10 minutes. We'll walk you through everything you need to get your daily meal benefits automated.",
  setupChecklist: {
    title: "Setup Checklist",
    overview: {
      title: "Quick Setup Overview",
      description:
        "Complete these 2 main steps to activate your WoltFlow automation. Each step has detailed guides linked below.",
    },
    steps: {
      woltCredentials: {
        label: "Get Wolt credentials",
        badge: "2 options",
      },
      configureAutomation: {
        label: "Configure automation",
        badge: "Final step",
      },
    },
  },
  accountRequirements: {
    title: "Account Requirements",
    woltAccount: {
      title: "Wolt Account Setup",
      description:
        "You'll need your Wolt authentication tokens to allow our automation to apply gift cards.",
      optionsTitle: "Two Setup Options:",
      extension: {
        title: "WoltFlow Token Reviewer",
        badge: "Recommended",
        description:
          "Install our browser extension and copy credentials with one click.",
        button: "Extension Guide",
      },
      manual: {
        title: "Manual Extraction",
        badge: "Advanced",
        description: "Extract tokens manually using browser developer tools.",
        button: "Manual Guide",
      },
      deviceConsideration: {
        title: "Device Consideration",
        description:
          "Each device has unique tokens. Extract credentials from a device you won't frequently log in/out of Wolt, as this may invalidate tokens.",
      },
    },
  },
  activationGuide: {
    title: "Step-by-Step Activation",
    step1: {
      title: "Set Up Wolt Credentials",
      description:
        "Choose your preferred method to extract your Wolt authentication tokens:",
      extensionMethod: {
        title: "Extension Method",
        badge: "Recommended",
        description: "Quick and easy with our extension",
      },
      manualMethod: {
        title: "Manual Method",
        badge: "Advanced",
        description: "Extract tokens using developer tools",
      },
    },
    step2: {
      title: "Save Your Wolt Credentials",
      description:
        "Open the Settings page and paste your Wolt access + refresh tokens so the automation can sign in on your behalf.",
      quickTip: {
        title: "💡 Quick Tip:",
        description:
          "Tokens stay encrypted at rest and never leave your account.",
      },
    },
    step3: {
      title: "Activate Automation",
      description:
        "Configure your automation preferences and activate the daily process:",
      settings: {
        giftCardAmount:
          "Set gift card amount within your Wolt Benefits allowance",
        enableToggle: "Enable automation toggle",
      },
      allSet: {
        title: "You're All Set!",
        description:
          "Once activated, WoltFlow runs automatically every weekday morning at 10:00 AM Israel time. The gift card is purchased and auto-redeemed straight to your account — no email forwarding or codes needed.",
      },
    },
  },
  readyToBegin: {
    title: "Ready to Begin?",
    description:
      "Start with getting your Wolt credentials - choose the method that works best for you.",
    buttons: {
      startWithExtension: "Start with Extension",
      manualSetup: "Manual Setup Instead",
    },
  },
} as const;
