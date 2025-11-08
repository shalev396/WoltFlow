# Email Forward-Only Architecture Flow Examples

## High-Level Changes

### Step Functions Modification

```yaml
# Old: refreshTokens → woltBuyGift → getDailyCode → woltApplyGift
# New: refreshTokens → woltBuyGift → extractTodayCode → woltApplyGift
```

### Key Architecture Changes

- **Remove**: Gmail API dependencies (`@googleapis/gmail`)
- **Remove**: Selenium Wolt account creation
- **Replace**: `getDailyCode.ts` → `extractTodayCode.ts`
- **Add**: SES email capture + Lambda processing
- **Update**: `oauthCallback.ts` to create receive-only inbox
- **New**: User manually updates Wolt email to managed address

## Example Flows

### 1. First Login Flow

```
User Login (Google OAuth)
↓
oauthCallback.ts
├── Create user record in Users table
├── Generate JWT
└── → createUserInbox.ts
    ├── Generate: user-{userId}@users.woltflow.com
    ├── Save to Inbox table
    └── Return inbox details to frontend
        └── Frontend shows: "Update your Wolt email to: user-123@users.woltflow.com"
```

### 2. User Wolt Setup Flow

```
User Settings Page
↓
User enters Wolt credentials
├── Store in WoltSettings table (encrypted)
├── Verify credentials work
└── Show instructions:
    "Go to Wolt → Profile → Email Settings"
    "Change email to: user-123@users.woltflow.com"
    "This will forward all Wolt emails to our system"
```

### 3. Daily Automation Flow

```
Scheduler (9 AM)
↓
startUserAutomationChain.ts
└── For each user:
    ├── refreshTokens.ts (user's REAL Wolt account)
    ├── woltBuyGift.ts (using user's REAL Wolt credentials)
    │   └── Gift card sent to user-123@users.woltflow.com
    ├── extractTodayCode.ts (parse from captured emails)
    └── woltApplyGift.ts (apply to user's REAL account)
```

### 4. Email Capture Flow (Automatic)

```
Wolt sends gift card email → user-123@users.woltflow.com
↓
SES Receipt Rule (matches *@users.woltflow.com)
├── S3 Action: Save .eml to s3://bucket/raw/{ses-message-id}.eml
└── Lambda Action: → ingestEmail.ts
    ├── Parse recipient: user-123@users.woltflow.com → userId: 123
    ├── Find user's inbox in database
    ├── Download .eml from S3
    ├── Extract Hebrew + English PDFs
    ├── Save PDFs to s3://bucket/processed/123/...
    └── Insert record into Emails table
```

### 5. Code Extraction Flow

```
Daily automation calls extractTodayCode.ts
↓
For each user:
├── Query Emails table for today's emails
├── Download and parse PDF attachments
├── Extract gift card codes using OCR/patterns
├── Save codes to Codes table
└── Update Emails.processingStatus = 'completed'
```

### 6. User Inbox View

```
Frontend: /inbox
↓
GET /api/emails
↓
getUserEmails.ts
├── Query Emails table by inboxId
├── Join with Inbox table to get user's emails
├── Generate pre-signed S3 URLs for PDFs
└── Return: [{messageId, s3PdfUrls, processingStatus, createdAt}, ...]
```

## Database Flow Examples

### 1. User Registration & Inbox Creation

```sql
-- 1. User logs in via Google OAuth
INSERT INTO "Users" (
  "googleId",
  "googleRefreshToken",
  "name",
  "email",
  "createdAt",
  "updatedAt"
) VALUES (
  'google-oauth-id-123',
  'google-refresh-token-abc',
  'John Doe',
  'john@gmail.com',
  NOW(),
  NOW()
) RETURNING "id";
-- Returns userId: 123

-- 2. Create main settings record
INSERT INTO "Settings" (
  "userId",
  "createdAt",
  "updatedAt"
) VALUES (
  123,
  NOW(),
  NOW()
) RETURNING "id";

-- 3. Create managed inbox (receive-only)
INSERT INTO "Inbox" (
  "userId",
  "emailAddress",
  "sesVerificationStatus",
  "createdAt",
  "updatedAt"
) VALUES (
  123,
  'user-123@users.woltflow.com',
  'pending',
  NOW(),
  NOW()
) RETURNING "id";
-- Returns inboxId: 456
```

### 2. User Wolt Settings Setup

```sql
-- 1. Create Wolt settings when user enters credentials
INSERT INTO "WoltSettings" (
  "woltRefreshToken",
  "woltAccessToken",
  "createdAt",
  "updatedAt"
) VALUES (
  'user-wolt-refresh-token',
  '{"token": "access-token", "expires": "2024-01-15T12:00:00Z"}',
  NOW(),
  NOW()
) RETURNING "id";
-- Returns woltSettingsId: 789

-- 2. Link Wolt settings to user's main settings
UPDATE "Settings"
SET "woltSettingsId" = 789,
    "updatedAt" = NOW()
WHERE "userId" = 123;
```

### 3. Email Capture Processing

```sql
-- 1. Email arrives, SES triggers Lambda ingestEmail
-- Lambda parses recipient: user-123@users.woltflow.com → userId: 123

-- First, find the user's inbox
SELECT "id" FROM "Inbox"
WHERE "emailAddress" = 'user-123@users.woltflow.com';
-- Returns inboxId: 456

-- 2. Insert captured email record
INSERT INTO "Emails" (
  "id",
  "inboxId",
  "messageId",
  "s3EmailUrl",
  "s3PdfUrls",
  "attachmentCount",
  "processingStatus",
  "createdAt",
  "updatedAt"
) VALUES (
  gen_random_uuid(),
  456,
  'ses-message-id-abc123',
  's3://woltflow-email-bucket/raw/ses-message-id-abc123.eml',
  ARRAY[
    's3://woltflow-email-bucket/processed/123/2024/01/15/ses-message-id-abc123/hebrew.pdf',
    's3://woltflow-email-bucket/processed/123/2024/01/15/ses-message-id-abc123/english.pdf'
  ],
  2,
  'completed',
  NOW(),
  NOW()
) RETURNING "id";
-- Returns emailId: 'email-uuid-456'
```

### 4. Code Extraction Processing

```sql
-- 1. Daily automation - extractTodayCode runs
-- Query today's emails for all users
SELECT
  e."id" as "emailId",
  e."s3PdfUrls",
  i."userId",
  e."createdAt"
FROM "Emails" e
JOIN "Inbox" i ON e."inboxId" = i."id"
WHERE DATE(e."createdAt") = CURRENT_DATE
  AND e."processingStatus" = 'completed'
  AND NOT EXISTS (
    SELECT 1 FROM "Codes" c
    WHERE c."emailId" = e."id"
  );

-- 2. For each email, after extracting code from PDFs
INSERT INTO "Codes" (
  "userId",
  "emailId",
  "code",
  "isUsed",
  "createdAt",
  "updatedAt"
) VALUES (
  123,
  'email-uuid-456',
  'WOLT2024ABC123',
  false,
  NOW(),
  NOW()
);

-- 3. Mark code as used after applying to user's account
UPDATE "Codes"
SET "isUsed" = true,
    "updatedAt" = NOW()
WHERE "code" = 'WOLT2024ABC123'
  AND "userId" = 123;
```

### 5. User Inbox API Queries

```sql
-- Get user's emails for frontend inbox
SELECT
  e."id",
  e."messageId",
  e."s3EmailUrl",
  e."s3PdfUrls",
  e."attachmentCount",
  e."processingStatus",
  e."createdAt",
  (
    SELECT ARRAY_AGG(c."code")
    FROM "Codes" c
    WHERE c."emailId" = e."id"
  ) as "extractedCodes"
FROM "Emails" e
JOIN "Inbox" i ON e."inboxId" = i."id"
WHERE i."userId" = 123
ORDER BY e."createdAt" DESC
LIMIT 50;
```

### 6. Run Tracking

```sql
-- 1. Start automation run
INSERT INTO "Runs" (
  "userId",
  "status",
  "stage",
  "automationMode",
  "createdAt",
  "updatedAt"
) VALUES (
  123,
  'in_progress',
  'buying_gift',
  'full-run',
  NOW(),
  NOW()
) RETURNING "id";
-- Returns runId: 789

-- 2. Update run progress
UPDATE "Runs"
SET "stage" = 'extracting_code',
    "updatedAt" = NOW()
WHERE "id" = 789;

-- 3. Complete run successfully
UPDATE "Runs"
SET "status" = 'completed',
    "stage" = 'completed',
    "updatedAt" = NOW()
WHERE "id" = 789;

-- 4. Link generated codes to run
UPDATE "Codes"
SET "runId" = 789,
    "updatedAt" = NOW()
WHERE "userId" = 123
  AND "createdAt" >= (
    SELECT "createdAt" FROM "Runs" WHERE "id" = 789
  );
```

### 7. Complex Queries for Analytics

```sql
-- Get user's automation success rate
SELECT
  u."name",
  COUNT(r."id") as "totalRuns",
  COUNT(CASE WHEN r."status" = 'completed' THEN 1 END) as "successfulRuns",
  COUNT(CASE WHEN r."status" = 'failed' THEN 1 END) as "failedRuns",
  ROUND(
    COUNT(CASE WHEN r."status" = 'completed' THEN 1 END)::DECIMAL /
    COUNT(r."id") * 100, 2
  ) as "successRate"
FROM "Users" u
LEFT JOIN "Runs" r ON u."id" = r."userId"
WHERE u."id" = 123
  AND r."createdAt" >= NOW() - INTERVAL '30 days'
GROUP BY u."id", u."name";

-- Get total codes extracted vs used
SELECT
  u."name",
  COUNT(c."id") as "totalCodes",
  COUNT(CASE WHEN c."isUsed" = true THEN 1 END) as "usedCodes",
  COUNT(CASE WHEN c."isUsed" = false THEN 1 END) as "unusedCodes"
FROM "Users" u
LEFT JOIN "Codes" c ON u."id" = c."userId"
WHERE u."id" = 123
GROUP BY u."id", u."name";
```
