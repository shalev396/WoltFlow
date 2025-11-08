# Email Infrastructure - Forward-Only Architecture

## User Perspective

### What Each User Gets

- **Managed Email**: `user-{userId}@users.woltflow.com` (e.g., `user-123@users.woltflow.com`) - **RECEIVE ONLY**
- **Real Wolt Account**: User keeps using their existing Wolt account with their real email
- **Email Forwarding**: Only user emails captured (no spam/random emails)
- **Inbox View**: Frontend displays emails received at their managed address

### User Flow

1. **First Login**: System creates managed email address (receive-only)
2. **User Sets Wolt Email**: User updates their Wolt account email to the managed address
3. **Daily Automation**: Uses user's REAL Wolt account credentials to buy gift cards
4. **Gift Card Delivery**: Wolt sends gift cards to managed email address
5. **Email Capture**: Our system captures and stores all emails sent to managed address
6. **Code Extraction**: Parse codes from captured emails
7. **Code Application**: Apply codes to user's real Wolt account
8. **Inbox Access**: User sees all captured emails via frontend

## Database Schema

### Complete Table Definitions

```sql
-- Users table (existing)
CREATE TABLE "Users" (
  "id" SERIAL PRIMARY KEY,
  "googleId" VARCHAR(255) UNIQUE NOT NULL,
  "googleRefreshToken" TEXT NOT NULL,
  "name" VARCHAR(255),
  "email" VARCHAR(255),
  "apiKey" VARCHAR(255) UNIQUE,
  "lastLoginAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Settings table (existing)
CREATE TABLE "Settings" (
  "id" SERIAL PRIMARY KEY,
  "userId" INTEGER UNIQUE NOT NULL REFERENCES "Users"("id") ON DELETE CASCADE,
  "notificationSettingsId" INTEGER REFERENCES "NotificationSettings"("id") ON DELETE SET NULL,
  "woltSettingsId" INTEGER REFERENCES "WoltSettings"("id") ON DELETE SET NULL,
  "cibusSettingsId" INTEGER REFERENCES "CibusSettings"("id") ON DELETE SET NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Wolt Settings table (existing) - stores user's REAL Wolt credentials
CREATE TABLE "WoltSettings" (
  "id" SERIAL PRIMARY KEY,
  "woltRefreshToken" TEXT,
  "woltAccessToken" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Inbox table - managed email addresses for receiving only
CREATE TABLE "Inbox" (
  "id" SERIAL PRIMARY KEY,
  "userId" INTEGER UNIQUE NOT NULL REFERENCES "Users"("id") ON DELETE CASCADE,
  "emailAddress" VARCHAR(255) UNIQUE NOT NULL, -- e.g., "user-123@users.woltflow.com"
  "sesIdentityArn" VARCHAR(255),
  "sesVerificationStatus" VARCHAR(50) NOT NULL DEFAULT 'pending',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Emails table - stores all captured emails
CREATE TABLE "Emails" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "inboxId" INTEGER NOT NULL REFERENCES "Inbox"("id") ON DELETE CASCADE,
  "messageId" VARCHAR(255) NOT NULL,
  "s3EmailUrl" VARCHAR(500) NOT NULL,
  "s3PdfUrls" TEXT[],
  "attachmentCount" INTEGER NOT NULL DEFAULT 0,
  "processingStatus" VARCHAR(50) NOT NULL DEFAULT 'pending',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE("inboxId", "messageId")
);

-- Codes table - extracted gift codes from emails
CREATE TABLE "Codes" (
  "id" SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES "Users"("id") ON DELETE CASCADE,
  "runId" INTEGER REFERENCES "Runs"("id") ON DELETE SET NULL,
  "emailId" UUID REFERENCES "Emails"("id") ON DELETE SET NULL,
  "code" VARCHAR(255) UNIQUE NOT NULL,
  "isUsed" BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Runs table - automation run tracking
CREATE TABLE "Runs" (
  "id" SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES "Users"("id") ON DELETE CASCADE,
  "status" VARCHAR(50) NOT NULL DEFAULT 'started',
  "stage" VARCHAR(50) NOT NULL DEFAULT 'triggered',
  "automationMode" VARCHAR(50) NOT NULL DEFAULT 'full-run',
  "errorMessage" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX "idx_inbox_user_id" ON "Inbox"("userId");
CREATE INDEX "idx_inbox_email_address" ON "Inbox"("emailAddress");
CREATE INDEX "idx_emails_inbox_id" ON "Emails"("inboxId");
CREATE INDEX "idx_emails_processing_status" ON "Emails"("processingStatus");
CREATE INDEX "idx_codes_user_id" ON "Codes"("userId");
CREATE INDEX "idx_codes_email_id" ON "Codes"("emailId");
CREATE INDEX "idx_codes_is_used" ON "Codes"("isUsed");
CREATE INDEX "idx_runs_user_id" ON "Runs"("userId");
CREATE INDEX "idx_runs_status" ON "Runs"("status");
```

## Lambda Functions

### 1. `createUserInbox`

- **Trigger**: Auth callback (first login)
- **Purpose**: Create managed email address `user-{userId}@users.woltflow.com` (receive-only)
- **Updates**: `Inbox` table
- **Note**: Does NOT create Wolt account - user keeps their real Wolt account

### 2. `ingestEmail`

- **Trigger**: SES Receipt Rule → S3 → Lambda (automatic)
- **Purpose**: Process incoming emails to managed addresses
- **Actions**:
  - Save raw email to S3
  - Extract PDF attachments
  - Parse recipient email to identify user
  - Store email metadata in database
- **Updates**: `Emails` table

### 3. `extractTodayCode`

- **Trigger**: Daily automation (replaces `getDailyCode`)
- **Purpose**: Parse gift codes from captured emails
- **Updates**: `Emails.processingStatus`, `Codes` table

### 4. `getUserEmails` (API)

- **Trigger**: Frontend inbox request
- **Purpose**: List user's captured emails + pre-signed S3 URLs
- **Returns**: Email list with download links

### 5. `updateUserWoltEmail` (API)

- **Trigger**: User settings update
- **Purpose**: Help users update their Wolt account email to managed address
- **Returns**: Instructions or automation to change Wolt email

## Infrastructure Setup

### Prerequisites

1. **Domain**: You need a domain (e.g., `woltflow.com`)
2. **Subdomain**: You'll use `users.woltflow.com` for email capture
3. **AWS Account**: With SES, S3, Lambda, and Route53 access
4. **SES Region**: Choose a region that supports SES (us-east-1, us-west-2, eu-west-1, etc.)

### SES Capabilities Verification ✅

**Q: Can SES handle per-user email addresses with wildcards on subdomain?**
**A: YES** - SES Receipt Rules support pattern matching like `*@users.woltflow.com`

**Q: Can each email trigger a Lambda with user-specific data?**
**A: YES** - Lambda receives full email content including recipient address

**Q: Can we differentiate users from email addresses?**
**A: YES** - Parse recipient email (e.g., `user-123@users.woltflow.com` → userId: 123)

**Q: Does subdomain approach prevent spam/unwanted emails?**
**A: YES** - Only emails to `@users.woltflow.com` are captured, no random emails

---

## Setup Methods

### Method 1: Serverless Framework (Recommended)

#### 1. Domain Setup

```yaml
# serverless.yml
service: woltflow-email-infrastructure

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1 # SES must be in supported region

custom:
  domain: woltflow.com
  emailSubdomain: users.woltflow.com
  emailBucket: ${self:service}-email-bucket-${self:provider.stage}

resources:
  Resources:
    # S3 Bucket for email storage
    EmailBucket:
      Type: AWS::S3::Bucket
      Properties:
        BucketName: ${self:custom.emailBucket}
        VersioningConfiguration:
          Status: Enabled
        LifecycleConfiguration:
          Rules:
            - Status: Enabled
              ExpirationInDays: 365

    # SES Domain Identity - for subdomain
    SESIdentity:
      Type: AWS::SES::IdentitySet
      Properties:
        Identity: ${self:custom.emailSubdomain}

    # SES Receipt Rule Set
    SESRuleSet:
      Type: AWS::SES::ReceiptRuleSet
      Properties:
        RuleSetName: ${self:service}-email-rules

    # SES Receipt Rule - captures only user emails on subdomain
    SESRule:
      Type: AWS::SES::ReceiptRule
      Properties:
        RuleSetName: !Ref SESRuleSet
        Rule:
          Name: capture-user-emails
          Recipients:
            - ${self:custom.emailSubdomain} # Captures *@users.woltflow.com
          Enabled: true
          Actions:
            - S3Action:
                BucketName: !Ref EmailBucket
                ObjectKeyPrefix: raw/
            - LambdaAction:
                FunctionArn: !GetAtt IngestEmailLambdaFunction.Arn

    # Lambda permission for SES
    SESLambdaPermission:
      Type: AWS::Lambda::Permission
      Properties:
        FunctionName: !Ref IngestEmailLambdaFunction
        Action: lambda:InvokeFunction
        Principal: ses.amazonaws.com
        SourceAccount: !Ref AWS::AccountId

functions:
  ingestEmail:
    handler: src/lambda/ingestEmail.handler
    events:
      # Will be triggered by SES Receipt Rule
    environment:
      EMAIL_BUCKET: ${self:custom.emailBucket}
      DATABASE_URL: ${env:DATABASE_URL}

  createUserInbox:
    handler: src/lambda/createUserInbox.handler
    events:
      - http:
          path: /user/inbox
          method: post
          cors: true
    environment:
      DOMAIN: ${self:custom.domain}
      DATABASE_URL: ${env:DATABASE_URL}
```

#### 2. Deploy Infrastructure

```bash
# Install dependencies
npm install -g serverless
npm install serverless-ses-template

# Deploy
serverless deploy --stage prod

# Verify SES domain (see output for DNS records to add)
```

#### 3. DNS Configuration

After deployment, add these DNS records to your domain:

```txt
# MX Record (for receiving emails to subdomain)
users.woltflow.com MX 10 inbound-smtp.us-east-1.amazonaws.com

# TXT Records (for SES verification - get from AWS Console)
users.woltflow.com TXT "amazon-ses-verification-token-here"

# DKIM Records (optional but recommended)
_amazonses.users.woltflow.com TXT "dkim-verification-token-here"
```

---

### Method 2: AWS Console GUI (Manual Setup)

#### Step 1: SES Domain Verification

1. **Open SES Console**: Go to AWS SES in us-east-1 region
2. **Add Subdomain**:

   - Click "Identities" → "Create Identity"
   - Choose "Domain"
   - Enter your subdomain: `users.woltflow.com`
   - Leave "Assign a default configuration set" unchecked
   - Click "Create Identity"

3. **Verify Domain**:
   - SES will show DNS records to add
   - Add the TXT record to your DNS provider
   - Wait for verification (can take up to 72 hours)

#### Step 2: Create S3 Bucket

1. **Open S3 Console**
2. **Create Bucket**:

   - Name: `woltflow-email-bucket`
   - Region: Same as SES (us-east-1)
   - Default settings are fine
   - Enable versioning (recommended)

3. **Set Bucket Policy**:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowSESPuts",
      "Effect": "Allow",
      "Principal": {
        "Service": "ses.amazonaws.com"
      },
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::woltflow-email-bucket/*",
      "Condition": {
        "StringEquals": {
          "aws:Referer": "YOUR_AWS_ACCOUNT_ID"
        }
      }
    }
  ]
}
```

#### Step 3: Create Lambda Function

1. **Open Lambda Console**
2. **Create Function**:

   - Name: `woltflow-ingest-email`
   - Runtime: Node.js 18.x
   - Create new role with basic Lambda permissions

3. **Add Permissions**:
   - Attach policy for S3 read access
   - Attach policy for RDS/Aurora access (for database)

#### Step 4: Create SES Receipt Rule

1. **Back to SES Console**
2. **Create Rule Set**:

   - Go to "Email receiving" → "Receipt rule sets"
   - Create new rule set: `woltflow-email-rules`
   - Set as active rule set

3. **Create Receipt Rule**:
   - Name: `capture-all-emails`
   - Recipients: Leave empty (captures all emails to verified domain)
   - Actions:
     - **S3 Action**:
       - Bucket: `woltflow-email-bucket`
       - Object key prefix: `raw/`
     - **Lambda Action**:
       - Function: `woltflow-ingest-email`

#### Step 5: Configure DNS

Add MX record to your subdomain:

```
users.woltflow.com MX 10 inbound-smtp.us-east-1.amazonaws.com
```

---

### S3 Storage Structure

```
woltflow-email-bucket/
├── raw/
│   └── {ses-message-id}.eml                    # Raw email files
└── processed/
    └── {user-id}/
        └── {yyyy}/{MM}/{dd}/
            └── {message-id}/
                ├── email-metadata.json         # Parsed email data
                ├── hebrew.pdf                  # Hebrew attachment
                └── english.pdf                 # English attachment
```

### Lambda Function Example

```javascript
// src/lambda/ingestEmail.js
exports.handler = async (event) => {
  console.log("SES Event:", JSON.stringify(event, null, 2));

  for (const record of event.Records) {
    if (record.eventSource === "aws:ses") {
      const sesMessage = record.ses.mail;
      const recipients = sesMessage.destination;

      // Parse user ID from recipient email
      // e.g., "user-123@users.woltflow.com" → userId: 123
      const userEmails = recipients.filter((email) =>
        email.endsWith("@users.woltflow.com")
      );

      for (const userEmail of userEmails) {
        const userId = parseUserIdFromEmail(userEmail);

        if (userId) {
          await processEmailForUser(sesMessage, userId);
        }
      }
    }
  }
};

function parseUserIdFromEmail(email) {
  // Extract user ID from email like "user-123@users.woltflow.com"
  const match = email.match(/^user-(\d+)@users\.woltflow\.com$/);
  return match ? parseInt(match[1]) : null;
}
```

### Testing the Setup

#### 1. Send Test Email

```bash
# Using AWS CLI
aws ses send-email \
  --source test@yourdomain.com \
  --destination ToAddresses=user-123@users.woltflow.com \
  --message Subject.Data="Test Email",Body.Text.Data="Test message"
```

#### 2. Verify Email Capture

1. Check S3 bucket for new `.eml` file
2. Check CloudWatch logs for Lambda execution
3. Check database for new email record

#### 3. Test User Creation

```bash
# Create a user inbox
curl -X POST https://your-api.com/user/inbox \
  -H "Content-Type: application/json" \
  -d '{"userId": 123}'
```

### Troubleshooting

#### Common Issues:

1. **MX Record Not Working**

   - Verify DNS propagation: `dig MX users.woltflow.com`
   - Ensure MX record points to correct SES endpoint

2. **SES Not Triggering Lambda**

   - Check SES receipt rule is active
   - Verify Lambda permissions for SES
   - Check CloudWatch logs

3. **Emails Not Reaching S3**

   - Verify S3 bucket policy allows SES
   - Check receipt rule configuration

4. **Domain Not Verified**
   - Add TXT verification record to DNS
   - Wait up to 72 hours for propagation

### Frontend Integration

- **New Page**: Inbox (`/inbox`)
- **Features**: Email list, PDF viewer, code display
- **API Endpoints**:
  - `GET /api/emails` - List user emails
  - `GET /api/emails/{id}/download` - Download email attachments
  - `POST /api/user/inbox` - Create user inbox
  - `PUT /api/user/wolt-email` - Update Wolt account email
