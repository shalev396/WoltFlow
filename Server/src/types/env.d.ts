declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // ENV
      ENV: "dev" | "prod" | "local";
      // AWS
      AWS_ACCOUNT_ID: string;
      EMAIL_SUBDOMAIN: string;
      CLOUDFRONT_DISTRIBUTION_ID: string;
      AWS_REGION: string;
      DOMAIN_NAME: string;
      CERTIFICATE_ARN: string;
      HOSTED_ZONE_ID: string;
      // STEP FUNCTIONS
      USER_AUTOMATION_STATE_MACHINE_ARN: string;
      // S3
      S3_EMAIL_BUCKET_NAME: string;
      S3_ASSETS_BUCKET_NAME: string;
      S3_CLIENT_BUCKET_NAME: string;
      // SERVERLESS
      SERVERLESS_ACCESS_KEY: string;
      // DATABASE
      DATABASE_URL: string;
      // APP
      ENABLED_SMS: boolean;
      JWT_SECRET: string;
      // GOOGLE
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      OAUTH_REDIRECT_URI: string;
      // DEVELOPMENT
      DEVELOPMENT_DATE: string;
    }
  }
}

export {};
