# WoltFlow Server

A serverless Node.js backend for WoltFlow using AWS Lambda, Sequelize, PostgreSQL, and Google OAuth2 authentication.

## Project Structure

```
Server/
├── src/
│   ├── config/
│   │   └── database.ts              # Sequelize/Postgres setup
│   ├── handlers/
│   │   ├── auth/                         # OAuth and session endpoints
│   │   │   ├── oauthStart.ts
│   │   │   ├── oauthCallback.ts
│   │   │   ├── authMeHandler.ts
│   │   │   └── logout.ts
│   │   ├── automation/               # Core automation Lambdas
│   │   │   ├── refreshTokens.ts
│   │   │   ├── startAllRuns.ts
│   │   │   ├── woltApplyGift.ts
│   │   │   └── woltBuyGift.ts
│   │   ├── gmail/                    # Email code retrieval
│   │   │   └── getDailyCode.ts
│   │   ├── runs/                     # User runs API
│   │   │   └── getUserRuns.ts
│   │   └── setting/                  # User settings API
│   │       ├── getusersettings.ts
│   │       └── setusersettings.ts
│   ├── middlewares/
│   │   └── auth.ts                   # JWT cookie authentication
│   ├── models/                       # Sequelize models
│   │   ├── User.ts
│   │   ├── Setting.ts
│   │   ├── Code.ts
│   │   ├── Run.ts
│   │   └── Screenshot.ts
│   └── typescript/                   # TS interfaces and types
│       ├── interfaces/
│       └── types/
├── .env                             # Env vars placeholder
├── package.json                     # Scripts: build, dev, deploy,
├── serverless.yml                   # Serverless Framework config
└── tsconfig.json                    # TypeScript config
```

## Environment Variables

Create a `.env` file with:

```
#AWS
AWS_ACCESS_CONNECT_KEY=""
AWS_ACCESS_SECRET=""


S3_ASSETS_BUCKET_NAME_DEV=""
S3_ASSETS_BUCKET_NAME_PROD=""
S3_BUCKET_NAME_DEV=""
S3_BUCKET_NAME_PROD=""

CLOUDFRONT_DISTRIBUTION_ID_DEV=""
CLOUDFRONT_DISTRIBUTION_ID_PROD=""

AWS_REGIONS=""

DOMAIN_NAME_DEV=""
DOMAIN_NAME_PROD=""

CERTIFICATE_ARN_DEV=""
CERTIFICATE_ARN_PROD=""


HOSTED_ZONE_ID=""

#Serverless
SLS_ACCESS_KEY=""

#Database
DATABASE_URL_LOCAL=""
DATABASE_URL_DEV=""
DATABASE_URL_PROD=""

#JWT
JWT_SECRET=""

#Google
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
OAUTH_REDIRECT_URI_LOCAL=""
OAUTH_REDIRECT_URI_DEV=""
OAUTH_REDIRECT_URI_PROD=""

#Function names
REFRESH_TOKENS_FUNCTION_NAME=""
WOLT_BUY_GIFT_FUNCTION_NAME=""
GET_DAILY_CODE_FUNCTION_NAME=""
WOLT_APPLY_GIFT_FUNCTION_NAME=""
#Developmrnt
DEVELOPMENT_DATE=""
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Run locally (Serverless Offline):

```bash
npm run dev
```

3. Deploy to AWS:

```bash
npm run deploy
```

## API Documentation

### Authentication

The application uses Google OAuth2 for authentication. All authenticated endpoints require a session token cookie.

#### GET `/api/oauth2/start`

Initiates OAuth2 flow; redirects to Google's consent screen.

#### GET `/api/oauth2/callback`

Handles OAuth2 callback; sets session cookie; redirects to frontend/dashboard.

#### GET `/api/auth/me`

Returns authenticated user info.

Response (200):

```json
{ "email": "user@example.com", "name": "User Name", "picture": "https://..." }
```

#### POST `/api/auth/logout`

Clears session cookie.

Response (200): `{ "message": "Logged out successfully" }`

### Gmail Integration

#### GET `/api/gmail/daily-code?runId=<number>`

Triggers code extraction for a specific run.

Response (200): `{ "success": true }`

### User Settings

#### GET `/api/setting`

Retrieves current user's settings.

Response (200):

```json
{
  "settingsId": 1,
  "userId": "google-user-id",
  "isNotification": false,
  "woltAccessToken": "token",
  "woltRefreshToken": "token",
  "cibusName": "username",
  "cibusPassword": "password",
  "cibusCompany": "company",
  "giftAmount": 50.0
}
```

#### POST `/api/setting`

Updates settings (body fields optional).

Request Body:

```json
{
  "isNotification": true,
  "woltAccessToken": "token",
  "woltRefreshToken": "token",
  "cibusName": "username",
  "cibusPassword": "password",
  "cibusCompany": "company",
  "giftAmount": 50.0
}
```

### Runs

#### GET `/api/runs` (requires auth cookie)

Query params: `page`, `limit`, `status`, `stage`, `minAmount`, `maxAmount`, `isNotify`.

Response (200): runs list with pagination and optional screenshot data.

## Database Models

### User

- `userId` (PK): Google user ID
- `refreshToken`: Google OAuth refresh token
- `createdAt`, `updatedAt`: Timestamps

### Setting

- `settingsId` (PK): Auto-incrementing ID
- `userId` (FK): Reference to User
- `isNotification`: Boolean
- `woltAccessToken`: String
- `woltRefreshToken`: String
- `cibusName`: String
- `cibusPassword`: String
- `cibusCompany`: String
- `giftAmount`: Decimal
- `createdAt`, `updatedAt`: Timestamps

### Code

- `codeId` (PK): Auto-incrementing ID
- `userId` (FK): Reference to User
- `code`: String
- `isUsed`: Boolean
- `createdAt`, `updatedAt`: Timestamps

### Run

- `id` (PK): Auto-incrementing ID
- `user_id` (FK): Reference to User
- `status`: Enum ('failed', 'in progress', 'success')
- `amount`: Float
- `is_notify`: Boolean
- `created_at`, `updated_at`: Timestamps

### Screenshot

- `id` (PK): Auto-incrementing ID
- `run_id` (FK): Reference to Run
- `url`: String
- `is_error`: Boolean

## Error Responses

### Authentication Error (401)

```json
{
  "error": "Not authenticated"
}
```

### Not Found Error (404)

```json
{
  "error": "Resource not found"
}
```

### Server Error (500)

```json
{
  "error": "Internal error"
}
```

## Development Features

- Uses `serverless-offline` for local development
- TypeScript support with `serverless-plugin-typescript`
- Environment variables support with `serverless-dotenv-plugin`
- CORS configured for local development (`http://localhost:5173`)
- Database connection pooling with Sequelize
- Automatic table creation/updates in development mode

## Build Process

This project uses a dual-build system with TypeScript compilation and Webpack bundling:

### 1. TypeScript Compilation

```bash
npm run build      # runs tsc
```

Compiles TypeScript files to JavaScript in the `dist/` directory with type definitions.

### 2. Webpack Bundling

```bash
npm run build:webpack
```

Creates optimized, minified bundles for each handler with all dependencies included:

- Automatically discovers all handlers in `src/handlers/`
- Bundles each handler with its dependencies
- Minifies and optimizes for production
- Outputs to `dist/handlers/` maintaining directory structure

### 3. Complete Build

```bash
npm run build
```

Runs both TypeScript compilation and webpack bundling in sequence.

## Deployment Targets

The build system supports both deployment targets:

### Lambda Functions

- Uses webpack bundles for optimized cold start performance
- Each handler is self-contained with minimal dependencies
- Configured via `serverless.yml` to reference `dist/handlers/`

### Docker Container

- Uses the same webpack bundles from `dist/handlers/`
- All handlers available in consistent directory structure
- Optimized bundle sizes reduce container size

## Development

```bash
npm run dev        # Start serverless offline
npm run deploy     # Deploy to AWS
```

## Handler Structure

All handlers are automatically discovered from:

```
src/handlers/
├── auth/
├── automation/
├── gmail/
├── runs/
└── setting/
```

Each handler is compiled to:

```
dist/handlers/
├── auth/
├── automation/
├── gmail/
├── runs/
└── setting/
```
