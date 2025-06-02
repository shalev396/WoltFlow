# WoltFlow Server

A serverless Node.js backend for WoltFlow using AWS Lambda, Sequelize, and PostgreSQL.

## Project Structure

```
Server/
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── handlers/
│   │   ├── auth/
│   │   │   ├── login.ts
│   │   │   ├── register.ts
│   │   │   └── refresh-token.ts
│   │   ├── run/
│   │   │   └── get-runs.ts
│   │   └── screenshot/
│   │       ├── get-screenshots.ts
│   │       └── delete-screenshot.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Run.ts
│   │   └── Screenshot.ts
│   ├── types/
│   │   └── index.ts
│   └── utils/
│       ├── auth.ts
│       └── middleware.ts
├── .env
├── package.json
├── serverless.yml
└── tsconfig.json
```

## Environment Variables

Create a `.env` file with the following variables:

```
DATABASE_URL=your_database_url
ENV=Development
REGISTERABLE=true
JWT_SECRET=your_jwt_secret
PASSWORD_SECRET=your_password_secret
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

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

#### POST `/auth/register`

Register a new user.

Request:

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

Response (201):

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "in_notification": false,
    "total_saved": 0
  }
}
```

#### POST `/auth/login`

Login with existing credentials.

Request:

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

Response (200):

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "in_notification": false,
    "total_saved": 0
  }
}
```

#### POST `/auth/refresh-token`

Get a new access token using a refresh token.

Request:

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

Response (200):

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Runs

#### GET `/run/{userId}`

Get all runs for a user. Requires authentication.

Response (200):

```json
[
  {
    "id": 1,
    "user_id": 1,
    "created_at": "2024-03-14T12:00:00Z",
    "updated_at": "2024-03-14T12:30:00Z",
    "status": "success",
    "amount": 150.5,
    "is_notify": false
  }
]
```

### Screenshots

#### GET `/screenshot/{runId}`

Get all screenshots for a run. Requires authentication.

Response (200):

```json
[
  {
    "id": 1,
    "run_id": 1,
    "url": "https://example.com/screenshot1.jpg",
    "is_error": false
  }
]
```

#### DELETE `/screenshot/{id}`

Delete a specific screenshot. Requires authentication.

Response (204):

```
No content
```

## Error Responses

### Validation Error (400)

```json
{
  "message": "Email and password are required",
  "statusCode": 400
}
```

### Authentication Error (401)

```json
{
  "message": "Invalid token",
  "statusCode": 401
}
```

### Authorization Error (403)

```json
{
  "message": "Unauthorized access",
  "statusCode": 403
}
```

### Not Found Error (404)

```json
{
  "message": "Resource not found",
  "statusCode": 404
}
```

### Conflict Error (409)

```json
{
  "message": "Email already exists",
  "statusCode": 409
}
```

## Security Features

- Access tokens expire in 20 minutes
- Refresh tokens expire in 7 days
- All endpoints require authentication except login and register
- Users can only access their own data
- Registration can be disabled via REGISTERABLE environment variable
- Passwords are hashed with bcrypt + additional secret
- All endpoints support CORS
- SSL enabled for database connection
