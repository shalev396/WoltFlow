declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // ENV
      ENV: "dev" | "prod" | "qa";
      // AWS
      EMAIL_SUBDOMAIN: string;
      AWS_REGION: string;
      DOMAIN_NAME: string;
      // STEP FUNCTIONS
      USER_AUTOMATION_STATE_MACHINE_ARN: string;
      // S3
      S3_EMAIL_BUCKET_NAME: string;
      S3_ASSETS_BUCKET_NAME: string;
      // DATABASE
      DATABASE_URL: string;
      // APP
      ENABLED_SMS: boolean;
      ENCRYPTION_KEY: string;
      // COGNITO
      COGNITO_CLIENT_ID: string;
      COGNITO_ISSUER: string;
    }
  }
}

export {};
