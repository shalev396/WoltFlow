/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_ANALYTICS_ID: string; // G-0000000000
  readonly VITE_ENV: string; // dev, prod, local
  readonly VITE_DOMAIN_NAME: string; // example.com
  readonly VITE_EMAIL_SUBDOMAIN: string; // email.example.com
  readonly VITE_AWS_REGION: string; // il-central-1
  readonly VITE_AWS_REGION_CITY: string; // Tel-Aviv
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
