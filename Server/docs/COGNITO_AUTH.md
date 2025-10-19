# AWS Cognito Authentication - Backend Guide

**Last Updated**: November 5, 2025  
**Region**: il-central-1  
**Status**: ✅ Deployed and Operational

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Deployment Guide](#deployment-guide)
3. [API Routes Reference](#api-routes-reference)
4. [Authentication Flows](#authentication-flows)
5. [Account Linking](#account-linking)
6. [Local Development](#local-development)
7. [Environment Variables](#environment-variables)
8. [Troubleshooting](#troubleshooting)

---

## Overview

WoltFlow uses AWS Cognito for authentication, supporting both **email/password** and **Google OAuth** login methods. The system automatically links accounts when the same email is used across different authentication providers.

### Key Features

- ✅ Email/password registration with email verification
- ✅ Google OAuth integration via Cognito Hosted UI
- ✅ Automatic account linking (same email = same user)
- ✅ JWT-based authentication with httpOnly cookies
- ✅ Middleware-based auth (works both locally and on cloud)
- ✅ Secure token storage and refresh mechanism

---

## Deployment Guide

### ⚠️ IMPORTANT: Two-Stage Deployment Process

Cognito resources must be deployed **TWICE** because we need the resource IDs before we can use them in environment variables.

### Prerequisites

Before starting, ensure you have:

1. **Google OAuth Credentials** from [Google Cloud Console](https://console.cloud.google.com/)

   - Client ID
   - Client Secret
   - Authorized redirect URI configured

2. **PostgreSQL Database** with the User table schema updated:
   ```sql
   -- Run this migration first
   psql $DATABASE_URL < src/migrations/add-cognito-sub.sql
   ```

---

### Step 1: First Deployment (Create Resources)

#### 1.1 Prepare Environment Variables

Create/update your `.env.dev` file with **PLACEHOLDER** values:

```bash
# Google OAuth Credentials (REQUIRED - get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cognito (use placeholders for first deployment)
COGNITO_USER_POOL_ID=il-central-1_PLACEHOLDER
COGNITO_CLIENT_ID=placeholder-client-id
COGNITO_ISSUER=https://cognito-idp.il-central-1.amazonaws.com/il-central-1_PLACEHOLDER

# Database & Domain
DATABASE_URL=your-postgres-connection-string
DOMAIN_NAME_LOCAL=localhost:3000
DOMAIN_NAME_CLOUD=your-app-domain.com
IS_LOCAL=false
```

**Why placeholders?** Serverless Framework validates environment variables at deployment time, so we need valid-looking values even though we don't have the real ones yet.

#### 1.2 Deploy to AWS

```bash
# For dev environment
npm run deploy:dev

# For QA environment
npm run deploy:qa

# For production environment
npm run deploy:prod
```

**Expected Output**: Deployment succeeds and creates:

- Cognito User Pool
- Cognito User Pool Client
- Cognito User Pool Domain
- Google Identity Provider
- PreAuthentication Lambda Trigger
- All authentication Lambda functions

#### 1.3 Retrieve Resource IDs from CloudFormation

After successful deployment:

1. Go to [AWS CloudFormation Console](https://console.aws.amazon.com/cloudformation)
2. Select your stack: `woltflow-server-dev` (or qa/prod)
3. Click on **Outputs** tab
4. **Copy these values**:

   | Output Key           | Example Value                                                           | Purpose              |
   | -------------------- | ----------------------------------------------------------------------- | -------------------- |
   | `CognitoUserPoolId`  | `il-central-1_fhKSJRFnE`                                                | User Pool identifier |
   | `CognitoClientId`    | `3gitribvlqj593pe7j0pbvdtrk`                                            | App Client ID        |
   | `CognitoIssuer`      | `https://cognito-idp.il-central-1.amazonaws.com/il-central-1_fhKSJRFnE` | JWT issuer URL       |
   | `CognitoHostedUIUrl` | `https://woltflow-server-dev.auth.il-central-1.amazoncognito.com`       | OAuth URL            |

---

### Step 2: Configure Google OAuth Redirect URI

#### 2.1 Update Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Under **Authorized redirect URIs**, add:
   ```
   https://woltflow-server-dev.auth.il-central-1.amazoncognito.com/oauth2/idpresponse
   ```
   _(Replace `dev` with `qa` or `prod` for other environments)_
5. Click **Save**
6. Wait 5 minutes for Google to propagate changes

---

### Step 3: Second Deployment (With Real Values)

#### 3.1 Update Environment Variables

Replace the placeholder values in `.env.dev` with the **REAL** values from CloudFormation:

```bash
# Google OAuth Credentials (same as before)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cognito (REAL values from CloudFormation Outputs)
COGNITO_USER_POOL_ID=il-central-1_fhKSJRFnE
COGNITO_CLIENT_ID=3gitribvlqj593pe7j0pbvdtrk
COGNITO_ISSUER=https://cognito-idp.il-central-1.amazonaws.com/il-central-1_fhKSJRFnE

# Database & Domain (same as before)
DATABASE_URL=your-postgres-connection-string
DOMAIN_NAME_LOCAL=localhost:3000
DOMAIN_NAME_CLOUD=your-app-domain.com
IS_LOCAL=false
```

#### 3.2 Redeploy

```bash
npm run deploy:dev  # or qa/prod
```

**This deployment will**:

- Update Lambda functions with correct Cognito resource references
- Ensure all endpoints can validate tokens properly
- Complete the authentication setup

---

### Step 4: Verify Deployment

Test that everything works:

```bash
# Test signup
curl -X POST https://your-api-domain.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234!","name":"Test User"}'

# Expected: {"success":true,"message":"User created successfully. Please check your email for verification code.","data":{"userSub":"xxx","userConfirmed":false}}
```

---

## API Routes Reference

### Authentication Endpoints

| Route                | Method | Auth Required | Purpose                               |
| -------------------- | ------ | ------------- | ------------------------------------- |
| `/api/auth/signup`   | POST   | No            | Register new user with email/password |
| `/api/auth/confirm`  | POST   | No            | Verify email with 6-digit code        |
| `/api/auth/login`    | POST   | No            | Login with email/password             |
| `/api/auth/callback` | GET    | No            | OAuth callback handler (Google)       |
| `/api/auth/me`       | GET    | **Yes**       | Get current authenticated user        |
| `/api/auth/logout`   | POST   | **Yes**       | Clear authentication cookies          |

### Protected Endpoints

All these require authentication (JWT token in httpOnly cookie):

| Route                                | Method  | Purpose                  |
| ------------------------------------ | ------- | ------------------------ |
| `/api/dashboard`                     | GET     | Get dashboard data       |
| `/api/runs`                          | GET     | List automation runs     |
| `/api/runs/{id}`                     | GET     | Get specific run details |
| `/api/settings/cibus`                | GET/PUT | Cibus credentials        |
| `/api/settings/wolt`                 | GET/PUT | Wolt credentials         |
| `/api/settings/run`                  | GET/PUT | Run schedule settings    |
| `/api/settings/notification`         | GET/PUT | Notification preferences |
| `/api/user/export`                   | GET     | Export user data         |
| `/api/user/delete`                   | DELETE  | Delete user account      |
| `/api/inbox`                         | GET     | List emails              |
| `/api/inbox/{id}`                    | GET     | Get email details        |
| `/api/inbox/{id}/attachment/{index}` | GET     | Download attachment      |

---

## Authentication Flows

### 1️⃣ Email/Password Registration Flow

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       │ 1. POST /api/auth/signup
       │    { email, password, name }
       ▼
┌─────────────────────┐
│  signup Lambda      │
│                     │
│  • Validate input   │
│  • Call Cognito     │
│    SignUp API       │
└──────┬──────────────┘
       │
       │ 2. Cognito sends
       │    verification email
       ▼
┌─────────────┐
│ User's Inbox│
│             │
│ Code: 123456│
└──────┬──────┘
       │
       │ 3. POST /api/auth/confirm
       │    { email, code }
       ▼
┌──────────────────────┐
│ confirmSignup Lambda │
│                      │
│  • Verify code       │
│  • Activate account  │
└──────┬───────────────┘
       │
       │ 4. POST /api/auth/login
       │    { email, password }
       ▼
┌─────────────────────┐
│   login Lambda      │
│                     │
│  • Authenticate     │
│  • Get JWT tokens   │
│  • Create/update DB │
│  • Set httpOnly     │
│    cookies          │
└──────┬──────────────┘
       │
       │ 5. Tokens in cookies
       │    User authenticated!
       ▼
┌─────────────┐
│   Client    │
│ (Logged in) │
└─────────────┘
```

### 2️⃣ Email/Password Login Flow

```
Client                    Backend                   Cognito                Database
  │                         │                         │                      │
  │  POST /api/auth/login   │                         │                      │
  │  { email, password }    │                         │                      │
  ├────────────────────────>│                         │                      │
  │                         │  InitiateAuth API       │                      │
  │                         ├────────────────────────>│                      │
  │                         │                         │  Validate            │
  │                         │                         │  credentials         │
  │                         │  idToken, refreshToken  │                      │
  │                         │<────────────────────────┤                      │
  │                         │                                                │
  │                         │  Find/Create user by cognitoSub               │
  │                         ├───────────────────────────────────────────────>│
  │                         │                                                │
  │                         │  User record                                   │
  │                         │<───────────────────────────────────────────────┤
  │  Set-Cookie:            │                                                │
  │  - idToken (httpOnly)   │                                                │
  │  - refreshToken         │                                                │
  │<────────────────────────┤                                                │
  │                         │                                                │
  │  { success, user }      │                                                │
  │<────────────────────────┤                                                │
  │                         │                                                │
```

### 3️⃣ Google OAuth Flow

```
Client                    Cognito Hosted UI         Backend                 Database
  │                              │                      │                      │
  │  Click "Login with Google"   │                      │                      │
  │  Redirect to Hosted UI       │                      │                      │
  ├─────────────────────────────>│                      │                      │
  │                              │                      │                      │
  │  User signs in with Google   │                      │                      │
  │  (Google OAuth popup)        │                      │                      │
  │                              │  Authenticate        │                      │
  │                              │  with Google         │                      │
  │                              │                      │                      │
  │  Redirect with code          │                      │                      │
  │  /api/auth/callback?code=xxx │                      │                      │
  │<─────────────────────────────┤                      │                      │
  │                              │                      │                      │
  │  GET /api/auth/callback      │                      │                      │
  │  ?code=xxx                   │                      │                      │
  ├──────────────────────────────┴─────────────────────>│                      │
  │                                                     │  Exchange code       │
  │                                                     │  for tokens          │
  │                                                     ├──────────────>       │
  │                                                     │  (Cognito API)       │
  │                                                     │<─────────────        │
  │                                                     │  idToken,            │
  │                                                     │  refreshToken        │
  │                                                     │                      │
  │                                                     │  Decode token        │
  │                                                     │  Extract email, name │
  │                                                     │                      │
  │                                                     │  Find/Create user    │
  │                                                     ├─────────────────────>│
  │                                                     │                      │
  │                                                     │  User record         │
  │                                                     │<─────────────────────┤
  │  Set-Cookie: idToken, refreshToken                 │                      │
  │  Redirect to /dashboard                            │                      │
  │<───────────────────────────────────────────────────┤                      │
  │                                                     │                      │
```

---

## Account Linking

### Automatic Merging of Identity Providers

**Scenario**: A user signs up with email/password, then later tries to log in with Google using the **same email address**.

**Result**: The accounts are automatically merged into a single Cognito user.

### How It Works

```
User Signs Up                PreAuthentication Trigger           Cognito
     │                                  │                           │
     │  1. POST /api/auth/signup        │                           │
     │  email: user@example.com         │                           │
     ├─────────────────────────────────────────────────────────────>│
     │                                  │  User created             │
     │                                  │  Provider: "Cognito"      │
     │<─────────────────────────────────────────────────────────────┤
     │                                  │                           │
     │  2. Verifies email               │                           │
     │  3. Uses app normally            │                           │
     │                                  │                           │
     │  --- Later ---                   │                           │
     │                                  │                           │
     │  4. Clicks "Login with Google"   │                           │
     │  email: user@example.com         │                           │
     ├─────────────────────────────────────────────────────────────>│
     │                                  │                           │
     │                                  │  PreAuthentication        │
     │                                  │  Lambda triggered         │
     │                                  │<──────────────────────────┤
     │                                  │                           │
     │                                  │  Check: email exists?     │
     │                                  │  YES - same email found!  │
     │                                  │                           │
     │                                  │  AdminLinkProviderForUser │
     │                                  │  Link Google → Cognito    │
     │                                  ├──────────────────────────>│
     │                                  │                           │
     │                                  │  Accounts merged!         │
     │                                  │<──────────────────────────┤
     │                                  │                           │
     │  User now has BOTH login methods │                           │
     │  • email/password                │                           │
     │  • Google OAuth                  │                           │
     │<─────────────────────────────────────────────────────────────┤
     │                                  │                           │
```

### Implementation Details

The linking logic is in `Server/src/handlers/auth/preAuthentication.ts`:

```typescript
// Simplified version
if (triggerSource === "PreAuthentication_Authentication") {
  const email = event.request.userAttributes["email"];

  // Check if user with this email already exists
  const existingUsers = await cognito.listUsers({
    UserPoolId: userPoolId,
    Filter: `email = "${email}"`,
  });

  if (existingUsers.Users && existingUsers.Users.length > 0) {
    const existingUser = existingUsers.Users[0];

    // Link the Google identity to existing user
    await cognito.adminLinkProviderForUser({
      UserPoolId: userPoolId,
      DestinationUser: {
        ProviderName: "Cognito",
        ProviderAttributeValue: existingUser.Username,
      },
      SourceUser: {
        ProviderName: "Google",
        ProviderAttributeName: "Cognito_Subject",
        ProviderAttributeValue: event.userName,
      },
    });
  }
}
```

### Key Points

- ✅ **Automatic**: No user action required
- ✅ **Email-based**: Uses email as the unique identifier
- ✅ **Bidirectional**: Works whether user starts with email or Google first
- ✅ **Database**: Single user record in PostgreSQL (one `cognitoSub`)
- ✅ **Seamless**: User doesn't notice - just works!

---

## Local Development

### Setup for serverless-offline

#### 1. Update `.env.dev` for Local Mode

```bash
# Set local flag
IS_LOCAL=true
DOMAIN_NAME_LOCAL=localhost:3000

# Use real Cognito values (from CloudFormation)
COGNITO_USER_POOL_ID=il-central-1_fhKSJRFnE
COGNITO_CLIENT_ID=3gitribvlqj593pe7j0pbvdtrk
COGNITO_ISSUER=https://cognito-idp.il-central-1.amazonaws.com/il-central-1_fhKSJRFnE

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database
DATABASE_URL=your-postgres-connection-string
```

#### 2. Start Local Server

```bash
npm run dev
```

Server runs at `http://localhost:3000`

#### 3. How Authentication Works Locally

**Cloud (Production)**:

- API Gateway validates JWT automatically
- Lambda receives pre-validated request
- Fast and efficient

**Local (serverless-offline)**:

- API Gateway authorizers are NOT available
- `authMiddleware` manually validates JWT
- Uses JWKS from Cognito to verify signatures
- Functionally identical to cloud

### Testing Locally

```bash
# 1. Sign up
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234!","name":"Test User"}'

# 2. Check email for code (check your inbox)

# 3. Verify email
curl -X POST http://localhost:3000/api/auth/confirm \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","code":"123456"}'

# 4. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234!"}' \
  -c cookies.txt

# 5. Test protected endpoint
curl -X GET http://localhost:3000/api/auth/me \
  -b cookies.txt
```

---

## Environment Variables

### Required Variables

```bash
# AWS Cognito
COGNITO_USER_POOL_ID=il-central-1_XXXXXXXXX     # From CloudFormation
COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx    # From CloudFormation
COGNITO_ISSUER=https://cognito-idp.il-central-1.amazonaws.com/il-central-1_XXXXXXXXX

# Google OAuth
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxx

# Database
DATABASE_URL=postgresql://user:pass@host:port/db

# Domain Configuration
DOMAIN_NAME_LOCAL=localhost:3000
DOMAIN_NAME_CLOUD=your-app-domain.com
IS_LOCAL=false  # true when running serverless-offline
```

### Where to Get Values

| Variable               | Source                 | Example                       |
| ---------------------- | ---------------------- | ----------------------------- |
| `COGNITO_USER_POOL_ID` | CloudFormation Outputs | `il-central-1_fhKSJRFnE`      |
| `COGNITO_CLIENT_ID`    | CloudFormation Outputs | `3gitribvlqj593pe7j0pbvdtrk`  |
| `COGNITO_ISSUER`       | CloudFormation Outputs | Full URL                      |
| `GOOGLE_CLIENT_ID`     | Google Cloud Console   | `.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google Cloud Console   | Secret string                 |

---

## Troubleshooting

### Issue: "Circular dependency" during first deployment

**Cause**: IAM role tried to reference Cognito resources before they were created.

**Solution**: ✅ Already fixed! We use wildcard ARNs:

```yaml
Resource:
  - Fn::Sub: "arn:aws:cognito-idp:${AWS::Region}:${AWS::AccountId}:userpool/*"
```

---

### Issue: "Invalid token" errors locally

**Symptoms**:

- `authMiddleware` rejects requests
- 401 Unauthorized responses

**Solutions**:

1. **Check token expiration**:

   - ID tokens expire after 1 hour
   - Login again to get fresh token

2. **Verify COGNITO_ISSUER**:

   ```bash
   echo $COGNITO_ISSUER
   # Should be: https://cognito-idp.il-central-1.amazonaws.com/il-central-1_XXXXXXXXX
   ```

3. **Check cookies**:
   ```bash
   # Make sure idToken cookie exists
   curl -v http://localhost:3000/api/auth/me -b cookies.txt
   ```

---

### Issue: Google OAuth redirect_uri_mismatch

**Symptoms**:

- Google OAuth fails with "redirect_uri_mismatch" error
- Can't complete Google sign-in

**Solutions**:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** → **Credentials**
3. Click your OAuth 2.0 Client ID
4. Add EXACT redirect URI:
   ```
   https://woltflow-server-dev.auth.il-central-1.amazoncognito.com/oauth2/idpresponse
   ```
5. Save and wait 5 minutes

---

### Issue: Accounts not linking

**Symptoms**:

- User has two separate accounts with same email
- One for email/password, one for Google

**Debug Steps**:

1. **Check CloudWatch Logs**:

   - Find log group: `/aws/lambda/woltflow-server-dev-preAuthentication`
   - Look for errors during Google sign-in

2. **Verify email matches**:

   ```sql
   -- Check database
   SELECT email, "cognitoSub" FROM "Users" WHERE email = 'user@example.com';
   ```

3. **Ensure PreAuthentication trigger is connected**:
   - AWS Console → Cognito → User Pool → Triggers
   - Should see: PreAuthentication → `preAuthentication` Lambda

---

### Issue: Deployment fails with stack in UPDATE_ROLLBACK_COMPLETE_CLEANUP_IN_PROGRESS

**Cause**: Previous deployment failed and CloudFormation is cleaning up.

**Solution**:

1. Wait for cleanup to complete (2-5 minutes)
2. Check stack status in CloudFormation console
3. Redeploy once status is `UPDATE_ROLLBACK_COMPLETE`

---

## Security Notes

### Token Storage

- ✅ **httpOnly cookies**: Prevents XSS attacks
- ✅ **Secure flag** (cloud only): HTTPS only
- ✅ **SameSite=Strict**: CSRF protection

### Token Expiration

- **ID Token**: 1 hour
- **Refresh Token**: 30 days
- Auto-refresh handled by frontend

### Password Requirements

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

### Best Practices

- ✅ Never log tokens
- ✅ Always use HTTPS in production
- ✅ Rotate Google OAuth credentials regularly
- ✅ Monitor CloudWatch logs for suspicious activity
- ✅ Enable MFA for AWS Console access

---

## Quick Reference

### Useful AWS Console Links

- **CloudFormation**: Monitor deployments
- **Cognito User Pools**: Manage users
- **CloudWatch Logs**: Debug Lambda functions
- **Lambda**: View function code and settings

### Common Commands

```bash
# Deploy
npm run deploy:dev

# View logs
serverless logs -f login --stage dev -t

# Remove stack (DANGER!)
serverless remove --stage dev
```

---

## Summary

✅ **Two-stage deployment** required (placeholders → real values)  
✅ **Middleware-based auth** works both locally and cloud  
✅ **Automatic account linking** for same email  
✅ **Secure token storage** with httpOnly cookies  
✅ **Complete API documentation** for all routes

**Backend authentication is fully operational and ready for production!** 🚀
