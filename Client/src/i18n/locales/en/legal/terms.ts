export default {
  title: "Terms of Service",
  description:
    "Terms and conditions governing your use of our automation service.",
  sections: {
    serviceInfo: {
      title: "Service Information",
      serviceName: "Service Name:",
      owner: "Owner/Operator:",
      territory: "Territory & Hosting:",
      product: "Product:",
      effectiveDate: "Effective Date:",
    },
    acceptance: {
      title: "Acceptance of the Terms",
      description:
        'These Terms of Service ("Terms") are a binding agreement between {{serviceName}} ("Service," "we," "us," or "our") and the person who creates an account or uses any part of the Service ("you" or "User"). By accessing or using the Service, you agree to these Terms. If you do not agree, do not use the Service.',
    },
    whatService: {
      title: "What the Service Does (Summary)",
      p1: "The Service is an automation tool that, after you configure it, runs up to once per day to (a) access your Wolt Benefits (meal benefits) and (b) purchase Wolt credit/gift card on your behalf using those benefits (when possible). The Service can also receive forwarded emails that you direct to the Service to complete verification steps. An API is available and documented for sending required messages to complete flows.",
      p2: "The Service is provided as-is, may change or stop at any time, and is currently offered as a side project with limited availability and support.",
    },
    account: {
      title: "Your Account; Eligibility",
      a: "You must be 18+ and legally capable of contracting.",
      b: "You must only use the Service for your own accounts (Wolt Benefits, Wolt, email, phone). You represent and warrant you have all rights and permissions to use automation on those accounts, and that your use complies with their terms.",
      c: "You are responsible for maintaining the confidentiality of your login methods (including API key) and for all activity under your account.",
    },
    setup: {
      title: "Initial Setup & Your Inputs",
      a: {
        title: "Configuration required.",
        description:
          "The automation runs only after you provide and save required inputs (e.g., Wolt tokens, phone/email forwarding, preferences).",
      },
      b: {
        title: "Credentials & secrets.",
        description:
          "Sensitive fields (e.g., usernames, passwords, tokens, codes) are encrypted with AES-256 in our database at rest and are transmitted encrypted in transit to the server. Decryption occurs only on the server/function at the time of use. Secrets are never sent to clients.",
      },
      c: {
        title: "Forwarded SMS & emails.",
        description:
          "You may forward your own messages to the Service or use a mobile automation/SMS-forwarder to send the one-time codes needed to complete login steps. Do not forward messages that are not yours.",
      },
      d: {
        title: "Accuracy.",
        description:
          "You are responsible for providing accurate, up-to-date information. The Service will act based on what you configure.",
      },
    },
    thirdParty: {
      title: "Third-Party Services (No Affiliation)",
      description:
        "The Service interacts with third-party services (e.g., Wolt Benefits, Wolt, email providers, mobile carriers). These are independent third parties. We do not own, control, or endorse them, and are not affiliated with them. Your use of third-party services is subject to their terms and policies, and you are solely responsible for any consequences, including account actions (e.g., suspension/ban), charges, limits, or reversals imposed by those services.",
    },
    permitted: {
      title: "Permitted Use; Prohibited Activities",
      a: {
        title: "Permitted.",
        description:
          "Use the Service solely to automate the flows described in our documentation, and solely for your own accounts. Use the API only as documented and within any rate/volume limits we set.",
      },
      b: {
        title: "Prohibited.",
        description: "You must not:",
        items: [
          "Use the Service for any unlawful purpose or to violate third-party terms.",
          "Use other people's accounts or content, or misrepresent your identity.",
          "Reverse engineer, interfere with, disrupt, overload, or bypass any access controls for the Service.",
          "Submit malware, automated attacks, or content that infringes rights or privacy.",
          "Attempt to evade verification or fraud-prevention steps of any third-party service.",
          "Do not use web scrapers, bots, or similar automated tools to access or harvest data from our Service, including the website or API. Only use the documented automation API and flows—for your own account—and follow the instructions exactly",
        ],
        footer:
          "We may suspend or terminate your access immediately for suspected violations.",
      },
    },
    running: {
      title: "Running the Automation; Frequency; Outcomes",
      a: "The automation attempts to run up to once per day (or as configured) but timing, success, and outcomes are not guaranteed.",
      b: "The automation may not complete if third-party services change flows, block automation, rate-limit, require manual steps, or experience outages.",
      c: "If the Service detects inconsistent or risky states (e.g., invalid code, payment failure, unusual prompts), it may abort or skip the run.",
    },
    payments: {
      title: "Payments, Fees, Taxes",
      a: "If we charge fees now or in the future, we will present them to you in-product before you incur them.",
      b: "You are responsible for any taxes or third-party charges (e.g., card issuer, carrier SMS/MMS/data fees).",
    },
    risk: {
      title: "Risk Allocation & Disclaimers",
      intro: "To the maximum extent permitted by law:",
      a: {
        title: "Use at your own risk.",
        description:
          "You understand and agree that using automation on Wolt Benefits/Wolt or related accounts can lead to denied transactions, account flags/bans, chargebacks, lost or frozen balances, failed purchases, or changed program rules.",
      },
      b: {
        title: "No responsibility for third-party actions.",
        description:
          "We are not responsible for actions or decisions by Wolt Benefits, Wolt, card issuers, email providers, carriers, or any other third party.",
      },
      c: {
        title: "No responsibility for value outcomes.",
        description:
          "We are not responsible for any loss of credit, gift cards, balances, vouchers, or benefits, including where:",
        items: [
          "A third party changes its terms, APIs, limits, eligibility, or availability;",
          "A purchase is declined, reversed, or misapplied;",
          "A third party bans/suspends your account(s);",
          "Funds/credits become unusable, expire, or are restricted;",
          "A payment method other than Wolt Benefits is used by the third party during checkout (including a credit card on file)",
          "Forwarded SMS/email codes fail, are delayed, or are intercepted on your device or network.",
        ],
      },
      d: {
        title: "No warranties.",
        description:
          'The Service is provided "as is" and "as available" without warranties of any kind (including uptime, accuracy, fitness, non-infringement, or compatibility with third-party rules, flows, or anti-automation measures).',
      },
    },
    liability: {
      title: "Limitation of Liability",
      p1: "To the maximum extent permitted by law, in no event will we be liable for any indirect, incidental, special, consequential, exemplary, or punitive damages, or for lost profits, lost data, lost goodwill, loss of credits/balances/gift cards, or account actions, even if foreseeable.",
      p2: "Our total aggregate liability for all claims arising out of or relating to the Service shall not exceed the greater of: (i) ₪35; or (ii) the fees you paid us for the Service in the three (3) months preceding the event giving rise to liability.",
    },
    indemnification: {
      title: "Indemnification",
      description:
        "You will defend, indemnify, and hold harmless us and our developers from and against any claims, damages, liabilities, costs, and expenses (including reasonable attorneys' fees) arising from: (a) your use of the Service; (b) your violation of these Terms; (c) your violation of any third-party terms (including Wolt Benefits/Wolt); or (d) your misuse of the API, forwarded SMS/emails, or credentials.",
    },
    privacy: {
      title: "Privacy",
      description:
        "Our handling of your information is described in the Privacy Policy for the Service (as updated from time to time). By using the Service, you consent to those practices.",
    },
    ip: {
      title: "Intellectual Property",
      description:
        "The Service (software, documentation, and all related IP) is owned by us or our licensors. These Terms do not grant you any intellectual-property rights except for a limited, revocable, non-exclusive, non-transferable license to use the Service as described herein.",
    },
    termination: {
      title: "Suspension; Termination",
      description:
        'We may suspend or terminate the Service or your access at any time with or without notice, including if we detect misuse or risk. You may stop using the Service at any time. Upon termination we may "pull the plug"—i.e., stop all automations and disable access. Sections intended to survive (e.g., Disclaimers, Limitation of Liability, Indemnification, Governing Law) will survive.',
    },
    changes: {
      title: "Changes to the Service or Terms",
      description:
        'We may modify the Service or these Terms at any time. Material changes will be indicated in-product or by updating the "Effective date." If you continue using the Service after changes become effective, you accept the changes.',
    },
    governing: {
      title: "Governing Law; Venue",
      description:
        "These Terms are governed by the laws of the State of Israel, without regard to conflict-of-laws rules. The exclusive jurisdiction and venue for any dispute shall be the competent courts in Tel-Aviv-Yafo, Israel.",
    },
    misc: {
      title: "Miscellaneous",
      a: {
        title: "No affiliation.",
        description:
          "Names of third-party services are used solely to describe interoperable services; they are trademarks of their respective owners.",
      },
      b: {
        title: "Entire agreement.",
        description:
          "These Terms constitute the entire agreement between you and us regarding the Service and supersede any prior understandings.",
      },
      c: {
        title: "Severability.",
        description:
          "If any part of these Terms is held invalid, the remainder remains in effect.",
      },
      d: {
        title: "No waiver.",
        description: "A failure to enforce a provision is not a waiver.",
      },
      e: {
        title: "Assignment.",
        description:
          "You may not assign these Terms. We may assign them in connection with a reorganization, transfer, or similar event.",
      },
    },
    questions: {
      title: "Questions?",
      description:
        "For any questions about these Terms of Service, feel free to contact me directly.",
    },
  },
} as const;
