# WoltFlow

WoltFlow is a full-stack solution for automating Wolt gift card purchases using WoltBenefits as a payment provider. The entire service runs as automation on AWS — it purchases Wolt gift cards through your Benefit account and applies them automatically.

> Previously, WoltFlow used **Cibus** as the payment provider. That integration has been deprecated in favor of WoltBenefit.

## Repository Structure

```
.
├── Client/      # Frontend (React + TypeScript)
├── Server/      # Backend (Serverless Framework + Express)
├── Extension/   # Chrome extension for Wolt token extraction
└── Script/      # [DEPRECATED] Local Python automation runner
```

## Client

A React single-page application built with TypeScript, Vite, Tailwind CSS, and shadcn/ui. Uses Redux Toolkit for state management, React Query for server-state, and React Hook Form with Zod for form validation.

- AWS Cognito authentication
- Dashboard, Runs, and Settings pages
- Dark/light theme support
- i18n (English and Hebrew)

## Server

A Serverless Framework application deployed to AWS Lambda. Provides REST API endpoints and automation handlers.

- AWS Cognito authentication with JWT
- PostgreSQL database via Sequelize ORM
- Automation Lambdas: token refresh, gift card purchase, gift card application
- AWS Step Functions for orchestrating automation chains

## Extension

A Chrome extension ("WoltFlow Token Reviewer") that extracts Wolt access and refresh tokens from your browser cookies. Users install it, visit wolt.com, and copy their tokens — which are then used by the server-side automation to interact with the Wolt API.

- Reads `__wtoken` and `__wrtoken` cookies from wolt.com
- All processing happens locally, no data is transmitted

## Script (Deprecated)

> **This component is deprecated.** It was built for the original Cibus-based flow and is no longer actively maintained. The current automation runs entirely on AWS through the Server.

The Script folder contains a Python-based local runner that used Selenium to automate Wolt gift card purchases via Cibus. It is kept in the repository for reference.

If you want to explore it: [Script README](Script/README.md)

## Security & npm audit

WoltFlow targets a **clean `npm audit`** for anything that ships to production. Where a transitive dependency is flagged but we cannot remove the warning without a force-downgrade or breaking change, it is documented here with the reason it is safe to leave in place.

### Known, accepted advisories

**`aws-sdk` v2 (low) — [GHSA-j965-2qgj-vjmq](https://github.com/advisories/GHSA-j965-2qgj-vjmq)**

- **Where:** `serverless-ecr-image-cleaner@1.0.7` → `aws-sdk@2.x`. Latest plugin version still depends on v2.
- **Production impact:** None. `serverless-ecr-image-cleaner` is a Serverless Framework plugin — it runs only during `npm run deploy:*` (locally or in CI). It is not bundled into any Lambda by esbuild and is not present in any production artifact.
- **Exploitability:** The advisory requires an untrusted, attacker-controlled `region` value. Ours is `process.env.AWS_REGION`, set by our CI environment / `.env.<stage>` files — never user input.
- **Why we don't `npm audit fix --force`:** It downgrades the plugin to `1.0.1` (older, broken ECR cleanup behavior). That's a regression, not a fix.
- **Action:** Re-check on every `serverless-ecr-image-cleaner` release. Move to v3-based equivalent when one exists.

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/shalev396/WoltFlow.git
   ```
2. **Client**:
   ```bash
   cd Client
   npm install
   npm run dev
   ```
3. **Server**:
   ```bash
   cd Server
   npm install
   npm run dev
   ```
