/// <reference types="vite/client" />

interface ImportMetaEnv {
  // # Non-sensitive configuration from environment variables
  // ## Global repository variables

  //## Per environment variables
  readonly VITE_SMS_ENABLED: string;
  //# Sensitive data from secrets (automatically masked in logs)
  //## Global repository secrets
  readonly AWS_ACCOUNT_ID: string;
  readonly STACK_BASE_NAME: string;
  //## Per environment secrets
  readonly VITE_GOOGLE_ANALYTICS_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
