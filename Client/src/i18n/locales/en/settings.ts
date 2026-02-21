export default {
  title: "Settings",
  description: "Manage your account settings and automation preferences",
  dataManagement: {
    title: "Data Management",
  },
  woltForm: {
    title: "Wolt Settings",
    description:
      "Configure your Wolt account tokens for automated gift card application",
    helpAlert:
      "You'll need to obtain these tokens from your Wolt account. Tokens are required for automated gift card application.",
    refreshToken: {
      label: "Refresh Token",
      description: "Long-term token used to obtain new access tokens",
      placeholder: "Enter your Wolt refresh token...",
      show: "Show refresh token",
      hide: "Hide refresh token",
    },
    accessToken: {
      label: "Access Token",
      description:
        "Short-term token used for API requests (optional - will be generated from refresh token)",
      placeholder: "Enter your Wolt access token (optional)...",
      show: "Show access token",
      hide: "Hide access token",
    },
    saveChanges: "Save Changes",
  },
  automationForm: {
    title: "Automation Settings",
    description: "Configure your automation preferences and gift card amounts",
    giftAmount: {
      label: "Gift Card Amount (₪)",
      description:
        "Choose the amount for each automated gift card purchase. Higher amounts may require more Wolt Benefits balance.",
      placeholder: "Select amount",
    },
    highAmountWarning:
      "Higher gift card amounts require sufficient Wolt Benefits balance. Make sure your account can cover ₪{{amount}} per purchase.",
    note: "Note:",
    saveChanges: "Save Changes",
    savingChanges: "Saving Changes...",
  },
  notificationsForm: {
    title: "Notification Settings",
    description:
      "Configure when and how you receive notifications about automation runs",
    enableNotifications: {
      label: "Enable Notifications",
      description: "Receive notifications about automation runs and results",
    },
    successfulRuns: {
      label: "Successful Runs",
      description: "Notify when automation completes successfully",
    },
    failedRuns: {
      label: "Failed Runs",
      description: "Notify when automation encounters errors or fails",
    },
    contactMethod: {
      label: "Contact Method",
      description: "Choose how you want to receive notifications",
      placeholder: "Choose how to receive notifications...",
      none: "None",
    },
    phoneNumber: {
      label: "Phone Number",
      description:
        "Enter your phone number (Israeli format: 0XX-XXX-XXXX or international: +972XXXXXXXXX)",
      placeholder: "+972XXXXXXXXX or 0XX-XXX-XXXX",
    },
    email: {
      label: "Email Address",
      description:
        "Enter the email address where you want to receive notifications",
      placeholder: "your.email@example.com",
    },
    verificationStatus: {
      label: "Verification Status",
      verified: "Verified",
      notVerified: "Not Verified",
      verify: "Verify",
    },
    enterCode: {
      title: "Enter Verification Code",
      subtitle: "Code sent to {{contact}}",
      placeholder: "Enter code",
      verify: "Verify",
    },
    verificationSuccess: "{{method}} verified successfully!",
    verificationWarning:
      "You need to verify your {{type}} before notifications can be sent.",
    saveChanges: "Save Changes",
    toast: {
      invalidContact: "Please enter a valid {{type}}",
      phoneNumber: "phone number",
      emailAddress: "email address",
      codeSent: "Verification code sent to your {{method}}",
      phone: "phone",
      email: "email",
      sendFailed: "Failed to send verification code",
      enterCode: "Please enter the verification code",
      invalidCode: "Invalid verification code",
    },
  },
  exportForm: {
    title: "Export Your Data",
    description:
      "Download a complete copy of all your WoltFlow data including files in a ZIP archive",
    infoAlert:
      "This export includes all your account data: settings, automation runs, emails, codes, screenshots, and more. The data will be downloaded as a ZIP file containing a CSV with database records plus all your files organized in folders.",
    whatsIncluded: {
      title: "What's included:",
      accountInfo: "Account information and settings (CSV format)",
      runHistory: "All automation run history (CSV format)",
      emails: "Email inbox and message files (original formats)",
      attachments: "Email attachments (original formats)",
      screenshots: "Screenshots from automation runs (PNG/JPG)",
      codes: "Generated gift codes (CSV format)",
      twoFactor: "Two-factor authentication records (CSV format)",
    },
    export: {
      title: "Export Your Data",
      description:
        "Click the button below to generate and download your complete data export as a ZIP file. This may take a few moments to process as we collect all your files.",
      button: "Download ZIP Archive",
      creating: "Creating ZIP Archive...",
    },
    success: {
      title: "Export Completed!",
      message:
        "Your data ZIP archive has been successfully downloaded to your computer.",
    },
    exportAgain: {
      title: "Need another copy?",
      description:
        "You can export your data again at any time. Each export creates a fresh ZIP archive with current data.",
      button: "Export Again",
    },
  },
  deleteForm: {
    title: "Delete Account",
    description:
      "Permanently delete your WoltFlow account and all associated data",
    dangerZone: {
      title: "Danger Zone:",
      message:
        "This action cannot be undone. Once deleted, your account and all data will be permanently removed from our systems.",
    },
    whatWillBeDeleted: {
      title: "What will be deleted:",
      account: "Your account and profile information",
      settings: "All automation settings and credentials",
      runs: "Complete run history and screenshots",
      inbox: "Email inbox and all received messages",
      codes: "Generated gift codes and 2FA records",
      apiKeys: "API keys and integration settings",
      personalData: "All personal data and usage history",
    },
    timeline: {
      message:
        "Account deletion is processed immediately and cannot be reversed. Per our privacy policy, some data may be retained in encrypted backups for up to 90 days for security and legal compliance.",
    },
    deleteButton: "Delete My Account",
    confirmDialog: {
      title: "Confirm Account Deletion",
      description:
        "This action will permanently delete your account and all associated data. This cannot be undone.",
      instruction:
        'To confirm, please type "DELETE MY ACCOUNT" in the field below:',
      inputLabel: 'Type "DELETE MY ACCOUNT" to confirm',
      placeholder: "DELETE MY ACCOUNT",
      cancel: "Cancel",
      delete: "Delete Account",
      deleting: "Deleting Account...",
    },
  },
  woltCredentialsHelp: {
    title: "How to Get Your Wolt Credentials",
    description:
      "Use our extension to easily extract your Wolt tokens for automated gift card purchases",
    importantNotice: {
      title: "Important:",
      message:
        "These tokens are device-specific and will log you out of Wolt on the device you're using. It's recommended to do this on a device you don't mind being logged out of Wolt from.",
    },
    steps: {
      title: "Step-by-Step Instructions:",
      step1: {
        title: "Install WoltFlow Token Reviewer",
        description:
          "First, you need to install our browser extension that will help you extract the tokens automatically.",
        button: "Install Extension",
      },
      step2: {
        title: "Go to Wolt.com and Log In",
        description:
          "Open your web browser and go to wolt.com. Make sure you're logged in to your Wolt account.",
      },
      step3: {
        title: "Use the Extension",
        description:
          "Once you're logged in, click on the WoltFlow Token Reviewer extension icon in your browser toolbar. The extension will automatically extract your tokens.",
      },
      step4: {
        title: "Copy the Tokens",
        description:
          "The extension will display your refresh token and access token. Copy both tokens from the extension popup.",
      },
      step5: {
        title: "Paste and Save",
        description:
          'Return to this settings page and paste the refresh token in the "Wolt Refresh Token" field and the access token in the "Wolt Access Token" field. Then click "Save Changes".',
      },
    },
    tips: {
      title: "💡 Tips:",
      tip1: "Make sure you're logged in to Wolt before using the extension",
      tip2: "If the extension doesn't show tokens, try refreshing the Wolt page and try again",
      tip3: "These tokens are device-specific, so you might want to do this on a device you don't use frequently for Wolt",
      tip4: "These tokens will expire eventually, so you may need to repeat this process periodically",
      tip5: "Keep your tokens secure and don't share them with anyone",
    },
  },
  automationToggle: {
    label: "Automation",
    enabledDescription: "Automation is enabled and ready to run",
    disabledDescription: "Enable automation to start scheduled runs",
  },
  automationModeSelector: {
    label: "Automation Mode",
    description: "Choose automation behavior",
    placeholder: "Select automation mode",
    options: {
      fullRun: {
        label: "Full Auto",
        description: "Buy & apply auto",
      },
      buyOnly: {
        label: "Buy Only",
        description: "Purchase only",
      },
    },
  },
  automationModesHelp: {
    accessibilityLabel: "Help with automation modes",
    title: "Automation Modes Explained",
    description:
      "Choose between complete automation or purchase-only mode based on your preferences",
    quickGuide: {
      title: "Quick Guide:",
      message:
        "Complete Automation handles everything automatically including gift code redemption, while Purchase Only stops after buying the gift card and lets you manually apply codes.",
    },
    modes: {
      fullRun: {
        name: "Complete Automation",
        description:
          "Fully automated process from purchase to redemption - no manual steps required",
        flow: {
          step1: "🔐 Securely log into your Wolt account",
          step2: "💳 Purchase gift card using your Wolt Benefits",
          step3: "📧 Extract gift code from your WoltFlow inbox",
          step4: "🎁 Automatically apply the code to your Wolt account",
        },
        pros: {
          pro1: "Completely hands-off daily automation",
          pro2: "Maximum time savings",
          pro3: "No manual intervention needed",
        },
        cons: {
          con1: "Requires email forwarding setup",
        },
        requirements: {
          req1: "Wolt account credentials",
          req3: "Email forwarding to WoltFlow inbox",
        },
        bestFor:
          "Users who want complete automation and don't mind setting up email forwarding",
      },
      buyOnly: {
        name: "Purchase Only",
        description:
          "Automate the purchase but manually apply gift codes yourself",
        flow: {
          step1: "🔐 Securely log into your Wolt account",
          step2: "💳 Purchase gift card using your Wolt Benefits",
          step3: "✋ Automation stops - you receive email with gift code",
          step4: "👤 You manually apply the code to your Wolt account",
        },
        pros: {
          pro1: "No email forwarding setup required",
          pro2: "Still saves time on daily purchases",
          pro3: "You maintain control over gift code application",
        },
        cons: {
          con1: "Requires daily manual step to apply codes",
        },
        requirements: {
          req1: "Wolt account credentials",
        },
        bestFor:
          "Users who prefer not to set up email forwarding or want to manually control gift code redemption",
      },
    },
    card: {
      howItWorks: "How it works:",
      pros: "Pros",
      cons: "Cons",
      requirements: "Requirements:",
      bestFor: "Best for:",
    },
  },
  notificationDialog: {
    title: "Notification Settings",
    description: {
      setup: "Configure your notification preferences",
      verify: "Enter the verification code sent to your {{method}}",
    },
    devMode: {
      badge: "DEV MODE",
      alert:
        "Development Mode: API calls are disabled. Any 6-digit code will work for verification.",
    },
    primaryMethod: {
      label: "Primary Notification Method",
      placeholder: "Select notification method",
      sms: "SMS",
      email: "Email",
      disabled: "Disabled",
    },
    preferences: {
      title: "Notification Preferences",
      success: {
        label: "Success Notifications",
        description: "Get notified when automation runs complete successfully",
      },
      error: {
        label: "Error Notifications",
        description:
          "Get notified when automation runs fail or encounter errors",
      },
    },
    smsNotifications: {
      title: "SMS Notifications",
      primary: "Primary",
      disabled: "Disabled",
      disabledMessage:
        "SMS functionality is currently disabled by the administrator.",
      placeholder: "+972501234567 or 050-123-4567",
      verify: "Verify",
      verified: "Verified",
      remove: "Remove",
    },
    emailNotifications: {
      title: "Email Notifications",
      primary: "Primary",
      placeholder: "your.email@example.com",
      verify: "Verify",
      verified: "Verified",
      remove: "Remove",
    },
    verification: {
      title: "Verification Code",
      devModeMessage: "Development mode: Any 6-digit code will work",
      productionMessage:
        "We sent a 6-digit verification code to {{contact}} via {{method}}",
      devModePrompt: "Development mode: Any 6-digit code will work",
      productionPrompt: "Enter the 6-digit code sent to your contact",
      placeholder: "000000",
      cancel: "Cancel",
      resend: "Resend",
      sending: "Sending...",
      verify: "Verify Code",
      verifying: "Verifying...",
    },
    buttons: {
      cancel: "Cancel",
      save: "Save Settings",
      saving: "Saving...",
    },
    validation: {
      atLeastOne:
        "Please verify at least one notification method ({{methods}})",
      smsDisabled:
        "SMS functionality is currently disabled. Please select Email as primary method.",
      phoneRequired: "Please enter a phone number for SMS notifications",
      phoneInvalid: "Please enter a valid phone number",
      phoneNotVerified:
        "Please verify your phone number before setting it as primary",
      emailRequired: "Please enter an email address for email notifications",
      emailInvalid: "Please enter a valid email address",
      emailNotVerified:
        "Please verify your email address before setting it as primary",
    },
  },
} as const;
