export default {
  title: "Welcome to WoltFlow",
  description:
    "WoltFlow is an automation solution that helps you maximize your meal benefits by automatically claiming your Wolt Benefits and converting them to Wolt gift cards every day.",
  whatIsWoltflow: {
    title: "What is WoltFlow?",
    automatedSolution: {
      title: "Automated Solution",
      description:
        "A comprehensive automation system that handles your entire meal benefit workflow, from claiming to redemption, without any manual intervention required.",
    },
    dailyBenefits: {
      title: "Daily Benefits",
      description:
        "Automatically claims your daily Wolt Benefits (meal allowance) and converts it to Wolt credits, ensuring you never miss out on your benefits.",
    },
  },
  howItWorks: {
    title: "How It Works",
    steps: {
      "1": {
        title: "Daily Automation Trigger",
        description:
          "Every weekday at 10:30 AM Israel time (30 minutes after Wolt Benefits opens at 10:00), our secure automation system initiates your personalized meal benefit process. Due to Israel's daylight saving time: in winter (UTC+2) we run at 10:30; in summer (UTC+3) we run at 11:30 Israel time—both within the allowed window.",
      },
      "2": {
        title: "Secure Account Access",
        description:
          "Using your encrypted credentials, the system securely accesses your Wolt Benefits and Wolt account to begin the transfer process.",
      },
      "3": {
        title: "Gift Card Purchase",
        description:
          "The automation purchases a Wolt gift card using your available Wolt Benefits balance, with the amount you've configured in your settings.",
      },
      "4": {
        title: "Instant Auto-Redemption",
        description:
          "Wolt's new gift-card shop applies the purchase straight to your account on checkout — no codes, no email forwarding, no manual redemption.",
      },
    },
    perfectTiming: {
      title: "Perfect Timing, Every Day",
      description:
        "We run the automation 30 minutes after Wolt Benefits opens (10:00 Israel), ensuring maximum success rates. Winter (approx. Oct–Mar): 10:30 AM Israel. Summer (approx. Mar–Oct): 11:30 AM Israel. Both are well within the 10:00–18:00 allowed window.",
    },
  },
  securityPrivacy: {
    title: "Security & Privacy",
    bankLevelEncryption: {
      title: "Bank-Level Encryption",
      features: [
        "All credentials encrypted with AES-256",
        "Secure AWS infrastructure hosting",
        "TLS 1.3 for all data transmission",
      ],
    },
    individualPrivacy: {
      title: "Individual Privacy",
      features: [
        "Complete data isolation",
        "No cross-user data mixing",
        "Single-purpose Wolt automation only",
      ],
    },
    yourDataYourControl: {
      title: "Your Data, Your Control",
      description:
        "Each user gets a completely isolated data environment. We only access the minimum information required for the automation to function, and all data is encrypted both in transit and at rest. You can delete your account and all associated data at any time.",
    },
  },
  cta: {
    getStarted: "Get Started Now",
    downloadExtension: "Download Extension",
  },
} as const;
