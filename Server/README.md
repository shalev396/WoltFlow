# WoltFlow Server

A serverless Node.js backend for WoltFlow using AWS Lambda, Sequelize, PostgreSQL, and Google OAuth2 authentication.

## Project Structure

```
Server/
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── handlers/
│   │   ├── auth/
│   │   │   ├── oauthStart.ts
│   │   │   ├── oauthCallback.ts
│   │   │   └── authMeHandler.ts
│   │   ├── gmail/
│   │   │   └── getDailyCode.ts
│   │   └── setting/
│   │       ├── getusersettings.ts
│   │       └── setusersettings.ts
│   ├── middlewares/
│   │   └── auth.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Setting.ts
│   │   ├── Code.ts
│   │   ├── Run.ts
│   │   └── Screenshot.ts
│   └── typescript/
│       ├── interfaces/
│       └── types/
├── .env
├── package.json
├── serverless.yml
└── tsconfig.json
```

## Environment Variables

Create a `.env` file with the following variables:

```
DATABASE_URL=your_database_url
DATABASE_URL_DEV=your_development_database_url
ENV=Development
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
OAUTH_REDIRECT_URI=your_oauth_redirect_uri
JWT_SECRET=your_jwt_secret
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` file with required variables.

3. Run locally:

```bash
npm start
```

4. Deploy:

```bash
npm run deploy
```

## API Documentation

### Authentication

The application uses Google OAuth2 for authentication. All authenticated endpoints require a session token cookie.

#### GET `/api/oauth2/start`

Start the OAuth2 flow by redirecting to Google's consent screen.

Response: Redirects to Google OAuth consent screen

#### GET `/api/oauth2/callback`

OAuth2 callback endpoint that handles the response from Google.

Response: Sets session cookie and redirects to dashboard

#### GET `/api/auth/me`

Get the current authenticated user's information.

Response (200):

```json
{
  "email": "user@example.com",
  "name": "User Name",
  "picture": "https://..."
}
```

### Gmail Integration

#### GET `/api/gmail/daily-code`

Get the Wolt gift card code from the user's Gmail.

Query Parameters:

- `uid`: User ID (required)
- `date`: Target date (optional, Development only)

Response (200):

```json
{
  "success": true
}
```

### User Settings

#### GET `/api/setting`

Get user settings. Requires authentication.

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

Update user settings. Requires authentication.

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

Response (200):

```json
{
  "settingsId": 1,
  "userId": "google-user-id",
  "isNotification": true
  // ... updated fields
}
```

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
npm run build:ts
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
npm run start        # Start serverless offline
npm run deploy       # Deploy to AWS
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
