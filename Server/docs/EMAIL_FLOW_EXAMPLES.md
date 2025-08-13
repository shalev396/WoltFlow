# Email Infrastructure Flow Examples

## High-Level Changes

### Step Functions Modification

```yaml
# Current: refreshTokens → woltBuyGift → getDailyCode → woltApplyGift
# New:     refreshTokens → woltBuyGift → extractTodayCode → woltApplyGift
```

### Code Changes

- **Remove**: Gmail API dependencies (`@googleapis/gmail`)
- **Replace**: `getDailyCode.ts` → `extractTodayCode.ts`
- **Add**: Email management functions + SES inbound handling
- **Update**: `oauthCallback.ts` to create inbox on first login

## Example Flows

### 1. First Login Flow

```
User Login (Google OAuth)
↓
oauthCallback.ts
├── Create user record
├── Generate JWT
└── → createUserInbox.ts
    ├── Generate: user-a1b2c3@codes.yourdomain.com
    ├── Save to user_inboxes table
    └── → createWoltAccount.ts (Selenium)
        └── Create Wolt account with managed email
```

### 2. Daily Automation Flow

```
Scheduler (9 AM)
↓
startUserAutomationChain.ts
└── For each user:
    ├── refreshTokens.ts (user's real Wolt account)
    ├── woltBuyGift.ts (managed email's Wolt account)
    ├── extractTodayCode.ts (parse from managed email)
    └── woltApplyGift.ts (apply to user's real account)
```

### 3. Email Ingestion Flow (Automatic)

```
Wolt sends code → user-a1b2c3@codes.yourdomain.com
↓
SES Receipt Rule
├── S3 Action: Save .eml to s3://bucket/raw/...
└── Lambda Action: → ingestEmail.ts
    ├── Download .eml from S3
    ├── Extract Hebrew + English PDFs
    ├── Save PDFs to s3://bucket/attachments/...
    └── Insert record into emails table
```

### 4. User Inbox View

```
Frontend: /inbox
↓
GET /api/emails
↓
getUserEmails.ts
├── Query emails table by user_id
├── Generate pre-signed S3 URLs
└── Return: [{subject, from, date, downloadUrls}, ...]
```

## Database Flow Examples

### User Creation

```sql
-- 1. User logs in
INSERT INTO users (...);

-- 2. Create managed inbox
INSERT INTO user_inboxes VALUES (
  'user-123',
  'user-a1b2c3',
  'user-a1b2c3@codes.yourdomain.com',
  false, -- wolt_account_created
  'active'
);
```

### Email Processing

```sql
-- 1. Email arrives, ingestEmail processes
INSERT INTO emails VALUES (
  default, -- id
  'user-123', -- user_id
  'ses-msg-123', -- message_id
  'Your Wolt Code',
  'no-reply@wolt.com',
  'user-a1b2c3@codes.yourdomain.com',
  now(),
  's3://bucket/raw/user-123/2024/01/15/ses-msg-123.eml',
  's3://bucket/attachments/user-123/2024/01/15/ses-msg-123/hebrew.pdf',
  's3://bucket/attachments/user-123/2024/01/15/ses-msg-123/english.pdf',
  null -- parsed_code (extracted later)
);

-- 2. extractTodayCode runs
UPDATE emails
SET parsed_code = 'ABC123XYZ'
WHERE user_id = 'user-123'
  AND date(sent_at) = current_date;
```

