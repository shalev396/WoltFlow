# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

WoltFlow is a small open-source service that automates **gift-card purchases from meal benefits** so end users get their daily benefit without doing anything. The current payment provider is **Wolt Benefits**; the older **Cibus** integration is deprecated (kept only in the `Script/` Python runner and Legacy branches).

Real people depend on this service for their daily food budget. Two policies are non-negotiable:

1. **Zero-vulnerability policy** — keep `npm audit` clean. The `Server/package.json` `overrides` block exists for this reason; if you add a dep that pulls in a vulnerable transitive, pin it there rather than ignoring the audit.
2. **Ship working code, not "should-work" code** — if the automation breaks on a deployment day, users lose money. Verify changes end-to-end against the real Wolt UI before merging anything in the automation chain (`Server/src/handlers/automation/` + `Server/src/utils/automation.ts`). Type-check + lint passing is not enough.

## Repository layout

| Path         | What it is                                                                                                                                                               |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Server/`    | Serverless Framework backend on AWS Lambda — REST API + automation chain.                                                                                                |
| `Client/`    | React 19 + Vite SPA (dashboard, runs, settings, auth).                                                                                                                   |
| `Extension/` | Chrome extension "WoltFlow Token Reviewer" — reads `__wtoken` / `__wrtoken` from `wolt.com` cookies so users can copy them into Settings. Pure local; no network egress. |
| `Script/`    | **Deprecated.** Python + Selenium local runner for the old Cibus flow. Kept for reference; do not extend.                                                                |
| `temp/`      | Gitignored scratch space. Ignore.                                                                                                                                        |

## Commands

Run from the repo root:

```powershell
npm run format         # prettier write — also runs in pre-commit hook
npm run format:check   # CI-style check
```

**Server** (`cd Server`):

```powershell
npm run dev            # serverless offline, stage=dev, uses DATABASE_URL_LOCAL when local=true
npm run dev:qa         # same against .env.qa
npm run build          # tsc --noEmit (type-check only; esbuild does the actual bundling)
npm run build:selenium # esbuild bundle of C_woltBuyGift.ts → build/automation/*.mjs (for the ECR image)
npm run lint           # eslint .
npm run deploy:dev     # build + build:selenium + serverless deploy --stage dev
npm run deploy:qa
npm run deploy:prod
npm run test:local     # postman CLI against ../postman/collections + Local env
npm run test:qa
```

**Client** (`cd Client`):

```powershell
npm run dev            # vite --host (port 5173)
npm run build          # tsc -b && vite build
npm run lint
npm run preview
```

**Pre-commit** (`.husky/pre-commit`) runs `npm run format`, re-stages formatted files, then for any staged `client/*` or `server/*` files runs `npm run build` and `npx eslint . --max-warnings 0` in that folder. Do not bypass with `--no-verify`; fix the cause.

## How the backend is wired (the part that needs reading multiple files to grok)

### Lambdas

`Server/serverless.yml` defines these functions. Note the handler paths reference a public/private/dev split that is in the middle of being introduced — the current source has `auth-handler.ts` and `user-handler.ts` instead. If you touch routing, reconcile with `serverless.yml` before deploying.

- **`publicApi`** — unauthenticated API (`/api/public/*`). Express via `serverless-http`.
- **`privateApi`** — authenticated API (`/api/private/*`). Same shape, but the express app uses `expressAuth` middleware that verifies the Cognito JWT via `jwks-rsa`. Timeout 120s, 1024 MB — sized for export-ZIP creation and bulk delete.
- **`devApi`** — DB sync / reset endpoints. **Only mounted on `dev` and `qa`** via `custom.enableDevToolsByStage`; on `prod` no HTTP event is attached.
- **`syncDb`** — no HTTP event. Invoked manually / by CI to run `sequelize.sync({ alter: true })`.
- **`startUserAutomationChain`** — cron-only, no HTTP. Triggers Step Functions.
- **`refreshTokens`** — invoked by Step Functions only.
- **`woltBuyGift`** — **Docker image-based Lambda** (ECR), not a zip bundle. The Selenium + Chrome + ChromeDriver layout is in `Server/Dockerfile`. Invoked by Step Functions only. `memorySize: 1536`, `ephemeralStorageSize: 1536`, `timeout: 300`. Do not change this config — it's the only sized combo that runs Chrome reliably in Lambda.

### Automation chain (`Server/src/handlers/automation/`)

The flow is: **cron → A → Step Functions Map (parallel per user) → B → C → success/fail Pass states**.

- **`A_startUserAutomationChain.ts`** — runs on cron `cron(0 10 ? * SUN,MON,TUE,WED,THU *)` via **EventBridge Scheduler** with `timezone: Asia/Jerusalem`, so it fires at **10:00 Israel local year-round** (DST handled by AWS). Loads all users with `runSettings.automationEnabled = true`, creates a `Run` row per user, then `StartExecution` on the `userAutomationChain` state machine (`MaxConcurrency: 10`). Manual invoke accepts `{ "userId": "<internal-id-or-cognitoSub>" }` — `User.resolveToInternalId` handles both.
- **`B_refreshTokens.ts`** — POSTs to Wolt's `wauth2/access_token`, updates the user's `WoltSettings`, advances `Run.stage`.
- **`C_woltBuyGift.ts`** — the Selenium flow. **Read `automation.md` in the same folder** before changing it; every step, XPath, and pause tier is documented there with HTML snippets pulled from the live Wolt UI.

Pause constants live in `Server/src/utils/general.ts` (`SHORT_PAUSE` / `MEDIUM_PAUSE` / `LONG_PAUSE`) and correspond to the three categories in `automation.md`: UI animation / API response / page navigation. Don't sprinkle ad-hoc `sleep(2500)` calls; pick the right tier.

### Data model

Sequelize models in `Server/src/models/`, relationships defined in `models/index.ts`:

- `User` 1:1 `Settings` (hub) — `Settings` belongs-to `NotificationSettings`, `WoltSettings`, `RunSettings` (all 1:1).
- `NotificationSettings` 1:N `TwoFactorAuthentication`.
- `User` 1:N `Run` 1:N `Screenshot`.

`Run.stage` enum: `triggered | refreshing_tokens | buying_gift | completed`. Old values (`getting_code_from_email`, `applying_gift`) belonged to the deprecated email-forwarding pipeline.

### One-shot schema cleanup

`Server/src/config/bootstrap.ts` contains `cleanupObsoleteSchema()` guarded by a big ⚠️ banner. It drops legacy tables (`Codes`, `Emails`, `Inbox`) and the `automationMode` columns/enums left over from the email-forwarding flow. **It is intentionally idempotent and intentionally temporary** — delete the whole function and its call site once every environment (`dev` → `qa` → `prod`) has run it successfully. Don't extend it for new migrations; use a real migration step instead.

### Database connectivity (the local-dev gotcha)

The Postgres DB lives **inside the private VPC** alongside the Lambdas; there is no public endpoint. The Lambdas reach it directly because they're configured with `LAMBDA_SECURITY_GROUP_ID` + `LAMBDA_SUBNET_ID` (private subnet with NAT Gateway).

For local development, the repo owner runs an **EC2 bastion / SSH port-forward** that exposes the DB on `localhost`. The `Server/.env.dev` file has both `DATABASE_URL` (cloud endpoint, used in Lambda) and `DATABASE_URL_LOCAL` (forwarded endpoint, used when `serverless-offline` is running). Both are wired through `serverless.yml`. If you don't have bastion access you cannot run `npm run dev` against the real DB — that's expected. Don't try to "fix" it by punching a public hole.

## Frontend notes

- React 19 + Vite 7. State: **Redux Toolkit** for auth/user, **React Query** for server state, **React Hook Form + Zod** for forms.
- Routing in `Client/src/routers/Router.tsx` — every route is prefixed with `/:lng`; root path redirects to a language-prefixed version. i18n supports **English and Hebrew (RTL)**.
- shadcn/ui under `components/ui/`, app components under `components/pages/` and `components/shared/`.
- Auth uses **AWS Cognito** directly from the browser (see `Client/docs/COGNITO_AUTH.md`).

## CI/CD

Three workflows in `.github/workflows/`: `Backend-CICD.yml`, `Frontend-CICD.yml`, `Extension-CICD.yml`. Push to `dev` / `qa` / `main` deploys to that environment via AWS OIDC (`role/my-github-actions-role`). The backend job runs `npm ci`, `npm run build`, then `npm run deploy:<stage>` which also handles the ECR image build for `woltBuyGift`.

## Where it's going: Elytra migration

The user maintains an open-source full-stack template at **[`shalev396/Elytra`](https://github.com/shalev396/Elytra)** (React + Lambda + Cognito + S3 + CloudFront + Route 53, with Playwright E2E tests and Postman API tests baked in). The plan is to **migrate WoltFlow onto Elytra's structure** so that:

- The unique parts of WoltFlow are the automation chain (`A_/B_/C_` handlers, Selenium image, Wolt token plumbing) and the `Extension`. Everything else (auth, settings hub, S3+CloudFront, CICD) should converge onto Elytra's layout.
- Tests come for free: Playwright on the client, Postman on the server. The "ship working code" policy gets enforced by tests instead of by hope.
- Naming conventions in Elytra: `client/` / `server/` lowercased (vs current `Client/` / `Server/`), `client/src/data/app.ts` as the single source of branding truth, `custom.appName` + `APP_NAME` GitHub variable kept in sync.

When in doubt about file layout or wiring, check Elytra first (use the GitHub MCP) and prefer its convention.

## Branches

- `main` — production.
- `dev` — current development.
- `qa` — staging / QA deploys.
- `Legacy/V0.1`, `Legacy/V0.2`, `Legacy/V0.3-wolt-benefits-email-forwarding` — frozen older approaches (Cibus, then email-forwarded daily codes). Useful for historical context; do not target with PRs.

## Things to be careful about

- **Don't change `woltBuyGift` Lambda config** in `serverless.yml` — memory/ephemeral storage/timeout are tuned for Chrome.
- **Selectors are fragile.** Wolt's HTML uses generated class names like `lcw7leb`. Use `data-test-id` and the documented XPaths in `automation.md`; if a selector breaks, update `automation.md` in the same PR.
- **Pause tiers, not arbitrary sleeps.** Use `SHORT_PAUSE` / `MEDIUM_PAUSE` / `LONG_PAUSE` from `utils/general.ts` to match the documented step categories.
- **Cron is timezone-aware (`Asia/Jerusalem`).** The trigger uses EventBridge Scheduler with a timezone, so it fires at 10:00 Israel local time year-round — AWS handles summer/winter DST. (The old `eventBus`/`AWS::Events::Rule` path was UTC-only and drifted between 10:30 and 11:30.)
- **`dev` API surface is dev/qa only.** Anything wired through `devApi` cannot be relied on in production.
- **Husky hooks build & lint per folder.** Stage files only in `client/` or `server/` and the hook will run the right subset; large cross-folder commits do all of it.
