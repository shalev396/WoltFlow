export default {
  hero: {
    title: "WoltFlow",
    subtitle: "Automate Your Wolt Gift Card Purchases",
    description:
      "Streamline your meal benefits with automation. WoltFlow automatically purchases Wolt gift cards from your Wolt Benefits daily, saving you time and maximizing your benefits utilization.",
    getStarted: "Get Started Free",
    gotoDashboard: "Go to Dashboard",
    howItWorks: "How It Works",
  },
  howItWorks: {
    title: "How It Works",
    subtitle:
      "Four simple steps to automate your meal benefits and never lose money again",
    steps: {
      connect: {
        title: "Connect Your Accounts",
        description:
          "Link your Wolt and Wolt Benefits using the secure credentials you provide.",
        detail: "One-time setup with AES 256 encryption security",
      },
      purchase: {
        title: "Automatic Purchase",
        description:
          "WoltFlow purchases Wolt gift cards using your available Wolt Benefits.",
        detail: "Runs daily at optimal times to maximize savings",
      },
      email: {
        title: "Email Forwarding Setup",
        description:
          "Set up email forwarding from your email to WoltFlow so we can automatically retrieve gift card codes.",
        detail: "Simple Gmail forwarding configuration required",
      },
      apply: {
        title: "Apply to Wolt",
        description:
          "Gift card credits are automatically applied to your Wolt account balance.",
        detail: "Ready to use for your next food order",
      },
    },
    footer: "Fully automated • Secure • Works 24/7",
  },
  savingsHighlight: {
    title: "Maximum Savings, Zero Effort",
    subtitle:
      "Users typically save their full meal allowance every month with WoltFlow automation",
    monthlySavings: {
      title: "Average Monthly Savings",
      amount: "₪700",
      description: "Per user, per month in meal benefits automatically claimed",
      before: "Before WoltFlow:",
      beforeText:
        "Users typically lose 30-40% of meal benefits due to forgotten claims",
      with: "With WoltFlow:",
      withText: "Up to 100% automated claiming means up to 0% waste",
    },
    timeSaved: {
      title: "Time Saved",
      amount: "10 min",
      description: "Per day that you would spend manually claiming benefits",
    },
    reliability: {
      title: "Reliability",
      amount: "90%",
      description: "Success rate for automated benefit claims",
    },
  },
  features: {
    title: "Everything You Need",
    subtitle: "Designed for reliability, security, and ease of use",
    list: {
      automated: {
        title: "Fully Automated",
        description:
          "Set it and forget it. WoltFlow runs automatically every weekday at optimal times.",
        benefits: [
          "No manual intervention needed",
          "Smart scheduling",
          "Handles errors gracefully",
        ],
      },
      security: {
        title: "AES 256 Algorithm Security",
        description:
          "Your credentials are encrypted and stored using industry-standard AES 256 encryption.",
        benefits: [
          "End-to-end encryption",
          "Secure AWS infrastructure",
          "Regular security audits",
        ],
      },
      twoFactor: {
        title: "Secure Notifications",
        description:
          "Get verification codes and alerts via SMS or email. Optional verification keeps your notification preferences secure.",
        benefits: [
          "SMS and email verification",
          "No manual intervention needed for automation",
          "Works with all major carriers",
        ],
      },
      mobile: {
        title: "Works Everywhere",
        description:
          "Monitor and control your automation from any device, anywhere.",
        benefits: [
          "Responsive design",
          "Mobile optimized",
          "Cross-platform support",
        ],
      },
      notifications: {
        title: "Smart Notifications",
        description:
          "Get notified about successful runs and any issues that occur.",
        benefits: [
          "SMS and email alerts",
          "Customizable preferences",
          "Error summaries",
        ],
      },
      tracking: {
        title: "Savings Tracking",
        description:
          "See exactly how much you're saving with detailed reports and trends.",
        benefits: [
          "Monthly summaries",
          "Historical data",
          "Interactive Dashboard",
        ],
      },
    },
  },
  faq: {
    title: "Frequently Asked Questions",
    subtitle: "Everything you need to know about WoltFlow automation",
    list: [
      {
        question:
          "How does WoltFlow access my Wolt Benefits and Wolt accounts?",
        answer:
          "WoltFlow uses secure, encrypted authentication to connect with your Wolt account. We store your Wolt tokens using AES 256 algorithm encryption. Wolt Benefits does not require separate credentials. You maintain full control and can revoke access at any time.",
      },
      {
        question: "Is my personal information safe?",
        answer:
          "Absolutely. We use industry-standard encryption and store data on secure AWS infrastructure. We never access your personal emails or data beyond what's necessary for the meal benefit automation. You can read more details in our privacy policy.",
      },
      {
        question: "What happens if something goes wrong?",
        answer:
          "WoltFlow includes comprehensive error handling and will notify you immediately if any issues occur. You can disable automation at any time from your settings.",
      },
      {
        question: "How much does WoltFlow cost?",
        answer:
          "WoltFlow is currently free to use. We're focused on building the best possible experience for our users. If we introduce pricing in the future, existing users will receive advance notice and grandfathered benefits.",
      },
      {
        question: "Which meal benefit providers are supported?",
        answer:
          "Currently, WoltFlow supports Wolt Benefits with Wolt gift card purchases.",
      },
      {
        question: "Can I customize when the automation runs?",
        answer:
          "The automation runs 30 minutes after Wolt Benefits opens (10:00 Israel): 10:30 AM in winter, 11:30 AM in summer (Israel uses daylight saving). You can see a countdown to the next run on your runs page.",
      },
      {
        question: "What if I need to pause the automation?",
        answer:
          "You can easily pause or disable automation from your settings page at any time. The system will stop running until you re-enable it. You can also adjust notification preferences and other settings as needed.",
      },
      {
        question: "How do I get support if I need help?",
        answer:
          "First, check out our comprehensive documentation page where you can find detailed setup guides and troubleshooting information. If you're still having trouble, you can contact our support at shalev396@gmail.com.",
      },
    ],
    contactPrompt: "Have a different question?",
    contactLink: "Contact our support team",
  },
  cta: {
    title: "Ready to Automate Your Savings?",
    subtitle:
      "Join users who are already saving hundreds of shekels every month with WoltFlow automation.",
    button: "Start Saving Today",
    viewDashboard: "View Your Dashboard",
    learnMore: "Learn More",
    benefits: {
      free: "Free forever",
      setup: "20-minute setup",
      noCard: "No credit card required",
      cancel: "Cancel anytime",
    },
    footer: "No setup fees • No monthly charges • No hidden costs",
  },
} as const;
