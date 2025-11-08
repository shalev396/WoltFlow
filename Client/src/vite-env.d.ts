/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_ANALYTICS_ID: string; // G-0000000000
  readonly VITE_ENV: string; // dev, prod, local
  readonly VITE_DOMAIN_NAME: string; // example.com
  readonly VITE_EMAIL_SUBDOMAIN: string; // email.example.com
  readonly VITE_AWS_REGION: string; // il-central-1
  readonly VITE_AWS_REGION_CITY: string; // Tel-Aviv
  readonly VITE_S3_EMAIL_BUCKET_NAME: string; // email-bucket-name
  // Cognito Configuration
  readonly VITE_COGNITO_CLIENT_ID: string; // 2abcdefghijklmnopqrstuv
  readonly VITE_COGNITO_ISSUER: string; // https://cognito-idp.il-central-1.amazonaws.com/il-central-1_XXXXXXXXX
  readonly VITE_COGNITO_HOSTED_UI_URL: string; // https://woltflow-server-dev.auth.il-central-1.amazoncognito.com
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
