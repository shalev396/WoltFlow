export default {
  title: "Privacy Policy",
  description:
    "Learn how we collect, use, and protect your personal information in compliance with Israeli privacy laws.",
  lastUpdated: "Last Updated",
  contactEmail: "shalev396@gmail.com",
  sections: {
    whoWeAre: {
      title: "Who We Are",
      owner: "Owner/Operator:",
      territory: "Territory & Hosting:",
      product: "Product:",
      lastUpdated: "Last Updated:",
    },
    introduction:
      "This policy explains what we collect, why we collect it, where it's stored, how long we keep it, who we share it with, and how you can control it. It is written to meet Israeli privacy law requirements, including the transparency duties introduced with Amendment 13 to the Privacy Protection Law and the data-security regulations.",
    whatData: {
      title: "What Data We Collect (by data model)",
      intro:
        "We only collect what's needed to run the automation and optional notifications. Everything marked [enc: AES-256] is encrypted by the application before storage; it is decrypted only inside server code when needed for the automation and never returned to the client.",
      auth: {
        title: "Authentication & Account",
        user: {
          title: "User",
          items: [
            "cognitoSub (AWS Cognito unique identifier), name, email",
            "apiKey (optional; for user-initiated SMS forwarding integrations)",
            "Audit: lastLoginAt, createdAt, updatedAt",
          ],
        },
        session: {
          title: "Session (browser localStorage)",
          description:
            "Authentication tokens (idToken and refreshToken) stored in browser localStorage. No cookies used for authentication. No third-party ad cookies. Analytics is blocked by default until consent (see §7).",
        },
      },
      credentials: {
        title: "Wolt credentials / tokens",
        wolt: {
          title: "WoltSettings",
          items: [
            "woltRefreshToken [enc: AES-256]",
            "woltAccessToken [enc: AES-256] (JSON string incl. expiry)",
          ],
        },
      },
      codes: {
        title: "One-time codes (short-lived)",
        twoFactor: {
          title: "TwoFactorAuthentication (our own verification)",
          items: [
            "notificationSettingsId, method (sms/email), contact, code, purpose, expiresAt, verified",
          ],
          retention:
            "Retention: deleted in daily purge (verification codes only).",
        },
        code: {
          title: "Code (Wolt gift code purchased during a run)",
          items: [
            "userId, runId (if generated in run), emailId (if extracted from email), code, isUsed",
          ],
          retention:
            "Retention: deleted in daily purge after use or expiry window.",
        },
      },
      email: {
        title: "Email ingestion (for gift code extraction)",
        inbox: {
          title: "Inbox",
          description:
            "userId, emailAddress (unique SES-style recipient assigned per user)",
        },
        emails: {
          title: "Emails",
          items: [
            "inboxId, s3EmailUrl, attachmentUrls[], fromEmail, fromName, toEmail, toName, subject, body, emailDate",
          ],
          flow: "Flow: messages sent to your assigned recipient address are received by AWS SES → delivered to S3 → processed; we create an Emails record linked to your Inbox.",
          retention:
            "Retention: default 90 days (see §5); S3 objects follow the same retention unless required shorter.",
        },
      },
      runs: {
        title: "Automation runs & artifacts",
        runSettings: {
          title: "RunSettings",
          description:
            'automationMode ("full-run" | "buy-only" | "cross-account"), giftAmount',
        },
        run: {
          title: "Run",
          items: [
            "userId, status, stage (e.g., buying_gift, applying_gift), automationMode, errorMessage?",
          ],
          purpose: "Purpose: operational trace for your automations.",
        },
        screenshot: {
          title: "Screenshot",
          items: [
            'runId, screenshotType ("error"/"success"/"step"/"debug"/"final"), stage?, siteUrl?, screenshotUrl, isError',
          ],
          purpose:
            "Purpose: debugging/trace for the run; may be shown in the UI.",
        },
      },
      notifications: {
        title: "Notifications",
        settings: {
          title: "NotificationSettings",
          description:
            'isEnabled, notificationOnSuccess, notificationOnError, notificationMethod ("sms" | "email" | "both"), phoneNumber?, phoneVerified, email?, emailVerified',
        },
      },
    },
    whyCollect: {
      title: "Why We Collect It (purposes & legal basis)",
      service: {
        title: "Provide the service",
        description:
          "Authenticate you (AWS Cognito with email/password), run the buy/apply automation for Wolt using Wolt Benefits, ingest gift emails to extract codes, and apply them to your Wolt account.",
      },
      operate: {
        title: "Operate the product",
        description:
          "Run orchestration (jobs, queues, functions), show run history/screenshots, and send opt-in notifications on success/error.",
      },
      security: {
        title: "Security & fraud-prevention",
        description:
          "Rate-limits, anomaly/error detection, and protecting credentials/tokens.",
      },
      analytics: {
        title: "Analytics",
        description: "Opt-in only (see §7).",
      },
      legalBasis:
        "Under Israeli law the primary bases here are performance of a relationship you initiate (providing the service you asked for) and legitimate interests (technical operation and security), together with consent where required (analytics cookies/identifiers). We also follow the duty to inform about what we collect, where it's stored, retention, and sharing.",
    },
    whereProcess: {
      title: "Where We Process & Store",
      primary: {
        title: "Primary region",
        description:
          "AWS {{region}} ({{city}}) for Aurora PostgreSQL, Lambda, API Gateway, VPC, CloudWatch logs, EventBridge, Step Functions, CloudFormation, IAM, S3, SES, Certificate Manager, Route 53, CloudFront.",
      },
      global: {
        title: "Global delivery",
        description:
          "CloudFront serves static web assets and fronts API endpoints globally (edge POPs). Requests ultimately terminate to our APIs hosted in {{region}}.",
      },
      dataMovement:
        "If data must move outside Israel for CDN transit or provider operations, we rely on provider safeguards and transmit over TLS; storage location for core records is {{region}}.",
    },
    security: {
      title: "Security (how we protect data)",
      appLevel: {
        title: "Application-level encryption",
        description:
          "AES-256 for Wolt tokens. These credentials are stored encrypted in the database and are only decrypted server-side when needed for automation. They may be returned to the browser (still encrypted in transit via HTTPS) for display in Settings, but are never exposed in plaintext to the client. Cognito authentication tokens are stored in browser localStorage and transmitted securely over HTTPS.",
      },
      transport: {
        title: "Transport",
        description:
          "TLS for client⇄API and API⇄AWS services. (RDS and service links use AWS defaults; client traffic to us is always HTTPS.)",
      },
      atRest: {
        title: "At rest",
        description:
          "RDS storage encryption; S3 bucket encryption; plus our application-level AES-256 for the sensitive fields listed above.",
      },
      access: {
        title: "Access",
        description:
          "Production data access limited to the owner/operator for operational needs.",
      },
    },
    retention: {
      title: "How Long We Keep Data (retention)",
      oneTime: {
        title: "One-time codes",
        description:
          "TwoFactorAuthentication (verification codes) and Code (gift codes) – deleted in a daily purge (may be deleted earlier by rolling cleanup).",
      },
      operational: {
        title: "Operational history",
        description: "Run and Screenshot – 90 days.",
      },
      emails: {
        title: "Emails & attachments",
        description: "Up to 90 days.",
      },
      logs: {
        title: "Logs",
        description: "CloudWatch / app logs – 30 days.",
      },
      account: {
        title: "Account & settings",
        description:
          "User account, Settings, WoltSettings, RunSettings, NotificationSettings, Inbox – kept until you delete your account.",
      },
      deletion:
        "Account deletion: triggers deletion of all the above user-linked data, including runs, screenshots, emails, and stored credentials/tokens, subject only to technical delay for safe purge. (We do not keep database backups for this project.)",
    },
    controls: {
      title: "Your Controls",
      signIn: {
        title: "Sign-in & profile",
        description:
          "Email/password authentication via AWS Cognito. You can see name/email in the UI.",
      },
      delete: {
        title: "Delete account (and all data)",
        description:
          "Available in Settings. This removes your account and linked data sets listed in §5.",
      },
      edit: {
        title: "Edit data",
        description:
          "You can update notification preferences, run preferences, and (by design) you re-enter Wolt credentials when needed.",
      },
    },
    cookies: {
      title: "Cookies & Analytics",
      authToken: {
        title: "Auth tokens (localStorage)",
        description:
          "Authentication tokens (idToken and refreshToken) stored in browser localStorage (strictly necessary). Used to keep you logged in and to authorize requests to the API. No cookies are used for authentication.",
      },
      analytics: {
        title: "Analytics",
        description:
          "Google Analytics (GA4) runs only after consent. We implement Google Consent Mode V2 – Basic, which blocks Google tags until you choose on the banner. If you do not consent, GA remains off. You can change your consent anytime from the banner link in the app.",
      },
    },
    thirdParty: {
      title: "Third-party Services (categories)",
      intro:
        "We use third-party processors to operate the product. They handle data only as needed to provide their specific function:",
      aws: {
        title: "Amazon Web Services (AWS)",
        items: [
          "AWS Cognito (authentication: email/password-based user accounts, secure token management)",
          "Compute & API: Lambda, API Gateway, EC2 (as needed)",
          "Storage/Data: Aurora PostgreSQL (RDS), S3",
          "Messaging/Email: Amazon SES (receive email into S3; send outbound emails), AWS End User Messaging (for SMS/notifications, if configured)",
          "Orchestration/Monitoring: EventBridge, Step Functions, CloudWatch",
          "Network & Delivery: VPC, Route 53, CloudFront (global CDN & API edge), Certificate Manager (TLS)",
          "Platform: IAM (access control), CloudFormation (infrastructure as code)",
        ],
      },
      analytics: {
        title: "Google Analytics",
        items: [
          "Google Analytics (GA4) - only after consent; see Cookies & Analytics section",
        ],
      },
    },
    sharing: {
      title: "Sharing",
      intro: "We do not sell personal data. We share data only with:",
      items: [
        "Processors listed in §8 to operate the service; and",
        "Authorities if required by applicable law, court order, or regulator instruction.",
      ],
    },
    children: {
      title: "Children",
      description:
        "The service is not directed to children. Do not use {{productName}} if you are under the legal age to form a binding agreement.",
    },
    changes: {
      title: "Changes to this Policy",
      description:
        'If we materially change this notice, we\'ll update the "Last updated" date and surface a notice in-app.',
      lastUpdated: "Last updated: {{date}}",
    },
    questions: {
      title: "Questions?",
      description:
        "For any questions about this privacy policy or how we handle your data, feel free to contact me directly.",
    },
  },
} as const;
