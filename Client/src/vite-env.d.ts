/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Feature flags
  readonly VITE_SMS_ENABLED: string;
  // Analytics
  readonly VITE_GOOGLE_ANALYTICS_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
