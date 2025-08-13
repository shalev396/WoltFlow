# Email Infrastructure Conversion

## User Perspective

### What Each User Gets

- **Managed Email**: `user-{uuid}@codes.yourdomain.com` (e.g., `user-7b3c9f@codes.yourdomain.com`)
- **Wolt Account**: Auto-created using the managed email via Selenium
- **Inbox View**: Frontend displays emails received at their managed address

### User Flow

1. **First Login**: System creates managed email + Wolt account
2. **Daily Automation**: Uses managed email's Wolt account to buy gift cards
3. **Code Extraction**: Parses codes from emails sent to managed address
4. **Code Application**: Applies codes to user's real Wolt account
5. **Inbox Access**: User sees all emails via frontend inbox

## Database Schema

```sql
-- New tables
CREATE TABLE user_inboxes (
  user_id           UUID PRIMARY KEY REFERENCES users(id),
  inbox_local_part  TEXT UNIQUE NOT NULL,             -- "user-7b3c9f"
  inbox_address     TEXT UNIQUE NOT NULL,             -- "user-7b3c9f@codes.yourdomain.com"
  wolt_account_created BOOLEAN DEFAULT FALSE,
  status            TEXT NOT NULL DEFAULT 'active',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE emails (
  id               BIGSERIAL PRIMARY KEY,
  user_id          UUID NOT NULL REFERENCES users(id),
  message_id       TEXT NOT NULL,
  subject          TEXT,
  from_addr        TEXT,
  to_addr          TEXT,
  sent_at          TIMESTAMPTZ,
  s3_eml_key       TEXT NOT NULL,
  s3_pdf_he_key    TEXT,
  s3_pdf_en_key    TEXT,
  parsed_code      TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## New Lambda Functions

### 1. `createUserInbox`

- **Trigger**: Auth callback (first login)
- **Purpose**: Create `user-{uuid}@codes.yourdomain.com` + Wolt account
- **Updates**: `user_inboxes` table

### 2. `ingestEmail`

- **Trigger**: SES → S3 → Lambda (automatic)
- **Purpose**: Store emails in S3, extract PDFs, save metadata to DB
- **Updates**: `emails` table

### 3. `extractTodayCode`

- **Trigger**: Daily automation (replaces current `getDailyCode`)
- **Purpose**: Parse code from today's email
- **Updates**: `emails.parsed_code`

### 4. `getUserEmails` (API)

- **Trigger**: Frontend inbox
- **Purpose**: List user emails + pre-signed S3 URLs
- **Returns**: Email list with download links

## Infrastructure Setup

### SES Configuration

- **Domain**: `codes.yourdomain.com`
- **MX Record**: `10 inbound-smtp.il-central-1.amazonaws.com`
- **Receipt Rule**: S3 → Lambda chain

### S3 Structure

```
email-bucket/
├── raw/{user-id}/{yyyy}/{MM}/{dd}/{messageId}.eml
└── attachments/{user-id}/{yyyy}/{MM}/{dd}/{messageId}/
    ├── hebrew.pdf
    └── english.pdf
```

## Frontend Changes

- **New Page**: Inbox (`/inbox`)
- **Features**: Email list, PDF viewer, code display
- **API**: GET `/api/emails` and GET `/api/emails/{id}/download`

