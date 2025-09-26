# WoltFlow Inbox System Testing Guide

## Overview

This guide provides comprehensive instructions for testing the new inbox system that processes emails sent to your custom domain and displays them in the WoltFlow application.

## 📧 How Email Processing Works

### Simple Email Flow:

1. **You get a unique email address**: `{your-user-id}@{your-domain}`
2. **Send any email to that address** with PDF attachments
3. **AWS SES receives it** automatically and triggers processing
4. **Lambda function processes it** and saves to S3 + database
5. **Frontend displays it** in your inbox within 1-2 minutes

### Example Email Test:

```
To: cd64b806-740b-4afe-aaae-57452d7c69d2@{your-domain}
Subject: Test Email with Attachments
Body: This is a test email to verify the inbox system works correctly.
Attachments: invoice.pdf, receipt.pdf
```

## System Architecture

### Backend Components

- **SES Email Receipt**: AWS SES receives emails to `{your-domain}`
- **Lambda Function** (`ingestEmail`): Processes incoming emails and stores them in S3
- **Database Models**: `Inbox` and `Emails` models store email metadata
- **API Endpoint** (`GET /api/inbox`): Returns user's inbox and emails

### Frontend Components

- **InboxService**: Handles API communication
- **React Query Hooks**: Manages email data fetching and caching
- **InboxLayout**: Main inbox interface with search and filtering
- **Email Components**: InboxList, InboxViewer, InboxToolbar

## Prerequisites for Testing

### 1. Environment Setup

The email subdomain is now configured with defaults, but you can override:

```bash
# Backend Environment Variables (Optional - defaults provided)
EMAIL_SUBDOMAIN_DEV={your-domain}
EMAIL_SUBDOMAIN_PROD={your-domain-prod}

S3_EMAIL_BUCKET_NAME_DEV=woltflow-emails-dev
S3_EMAIL_BUCKET_NAME_PROD=woltflow-emails-prod

DATABASE_URL_DEV=your_dev_database_url
DATABASE_URL_PROD=your_prod_database_url
```

### 2. AWS Services Configuration

- **SES Domain Verification**: Verify `{your-domain}` in AWS SES
- **DNS Records**: Add MX record pointing to SES for `{your-domain}`
- **S3 Bucket**: Ensure email bucket exists with proper permissions
- **Lambda Permissions**: Verify SES can invoke the email processing Lambda

### 3. Database Setup

The `Inbox` and `Emails` tables should already exist from your current setup.

## Testing Procedures

### Phase 1: Backend Testing

#### 1.1 Deploy Backend Services

```bash
cd Server
npm run build
serverless deploy --stage dev
```

**Expected Result**: Successful deployment with all Lambda functions and SES resources created.

#### 1.2 Verify SES Configuration

1. Go to AWS SES Console
2. Check "Email addresses" or "Domains" section
3. Verify your subdomain is verified and receiving emails
4. Test the SES rule by checking CloudWatch logs

#### 1.3 Test Email Processing Lambda

Send a test email manually:

```bash
# Use AWS CLI to simulate SES event (optional)
aws lambda invoke \
  --function-name woltflow-server-dev-ingestEmail \
  --payload file://test-ses-event.json \
  response.json
```

**Expected Result**: Lambda processes email, creates S3 objects, and saves to database.

### Phase 2: Database Verification

#### 2.1 Check User Inbox Creation

1. Log into your application
2. Navigate to `/inbox`
3. Check that your user gets assigned a custom email address

**Expected Database Records**:

```sql
SELECT * FROM "Inbox" WHERE "userId" = 'your-user-id';
-- Should show: id, userId, emailAddress (UUID@subdomain), sesVerificationStatus
```

#### 2.2 Verify Email Processing

After sending test emails:

```sql
SELECT * FROM "Emails" WHERE "inboxId" = 'your-inbox-id';
-- Should show: messageId, s3EmailUrl, processingStatus, attachmentCount, etc.
```

### Phase 3: Frontend Testing

#### 3.1 Build and Run Frontend

```bash
cd Client
npm install
npm run build
npm run dev
```

**Expected Result**: No build errors, application starts successfully.

#### 3.2 Inbox Page Navigation

1. Open application in browser
2. Navigate to `/inbox`
3. Authenticate if required

**Expected Behavior**:

- Loading state shows while fetching data
- User's custom email address displays at top
- Empty state shows if no emails exist
- Error handling displays if API fails

#### 3.3 Email List Display

After receiving emails:

**Expected UI Elements**:

- Email list on left panel (30% width)
- Email viewer on right panel (70% width)
- Toolbar with search and filter options
- Email metadata (sender, subject, date, status)

#### 3.4 Search and Filtering

1. Use search bar to filter emails
2. Try filtering by status/label
3. Test real-time updates

**Expected Behavior**:

- Search filters emails by subject, sender, content
- Filters work immediately (frontend filtering)
- Real-time updates every 60 seconds

### Phase 4: 📧 Simple Email Testing

#### 4.1 Quick Email Test

1. **Deploy your app** and go to `/inbox` page
2. **Copy your custom email** (looks like: `abc123-def456@{your-domain}`)
3. **Send a test email** from Gmail/Outlook:

**Example Test Email**:

```
To: [paste your custom email here]
Subject: My First Test Email
Body: Hello WoltFlow! Testing the inbox system.
Attachments: Add 1-2 PDF files (invoices, receipts, etc.)
```

#### 4.2 Watch It Process

After sending, monitor the process:

1. **Wait 1-2 minutes** (AWS SES + Lambda processing time)
2. **Refresh your `/inbox` page** - the email should appear!
3. **Check CloudWatch logs** (optional):
   ```bash
   serverless logs -f ingestEmail --stage dev --tail
   ```

#### 4.3 Verify Everything Works

✅ **Email appears in inbox list**  
✅ **Click on email to view content**  
✅ **PDF attachments are clickable links**  
✅ **Processing status shows "completed"**  
✅ **Email metadata is correct (date, sender, etc.)**

#### 4.4 Test Multiple Emails

Send 2-3 more emails to verify:

- Different subjects and content
- Various PDF attachments
- Different senders (Gmail, Outlook, etc.)

All should appear in your inbox automatically!

### Phase 5: Error Scenarios Testing

#### 5.1 Test Invalid Emails

Send emails to non-existent user IDs:

- `invalid-uuid@subdomain` - Should be ignored/fail gracefully
- `malformed-email@subdomain` - Should not crash system

#### 5.2 Test Large Attachments

Send emails with large files (>10MB) to test limits and error handling.

#### 5.3 Test Network Failures

1. Disconnect network while loading inbox
2. Verify error states display correctly
3. Test retry functionality

#### 5.4 Test Authentication Issues

1. Clear authentication cookies
2. Navigate to inbox
3. Verify redirect to login works

## Monitoring and Debugging

### CloudWatch Logs

Monitor these log groups:

- `/aws/lambda/woltflow-server-dev-ingestEmail`
- `/aws/lambda/woltflow-server-dev-getInbox`

### Key Metrics to Watch

- Email processing success rate
- API response times
- S3 storage growth
- Database query performance

### Common Issues and Solutions

#### Issue: Email address validation error (empty subdomain)

**Error**: `Validation isEmail on emailAddress failed, value: 'userId@'`

**Debug Steps**:

1. Check if `EMAIL_SUBDOMAIN_DEV` environment variable is set
2. Verify the Lambda function logs show the correct subdomain
3. Redeploy if environment variables were changed:
   ```bash
   serverless deploy --stage dev
   ```

#### Issue: Emails not appearing in inbox

**Debug Steps**:

1. Check CloudWatch logs for Lambda errors
2. Verify SES is triggering Lambda (check SES bounce/complaint notifications)
3. Confirm S3 bucket permissions
4. Check database connections

#### Issue: Frontend shows loading forever

**Debug Steps**:

1. Check browser network tab for API errors
2. Verify authentication is working
3. Check CORS configuration
4. Confirm API endpoint is deployed

#### Issue: Attachments not accessible

**Debug Steps**:

1. Verify S3 URLs are public or pre-signed
2. Check S3 bucket policies
3. Confirm Lambda has S3 permissions

## Performance Testing

### Load Testing Email Processing

Use tools like Artillery or k6 to send multiple emails simultaneously:

```javascript
// Example k6 test
import { check } from "k6";
import { sendEmail } from "./email-helper.js";

export default function () {
  const response = sendEmail({
    to: `${__VU}@{DOMAIN_NAME}`,
    subject: `Load Test Email ${__ITER}`,
    body: "Performance testing email",
  });

  check(response, {
    "email sent successfully": (r) => r.status === 200,
  });
}
```

### Frontend Performance

- Test with 100+ emails in inbox
- Verify scroll performance
- Check memory usage during long sessions

## Security Testing

### Email Content Security

- Test with potentially malicious email content
- Verify HTML sanitization works
- Test XSS prevention in email viewer

### Access Control

- Verify users can only see their own emails
- Test API authentication requirements
- Confirm S3 bucket security

## Success Criteria

### Backend Success Criteria ✅

- [ ] SES successfully receives and processes emails
- [ ] Lambda function executes without errors
- [ ] Emails stored in correct S3 structure
- [ ] Database records created accurately
- [ ] API returns proper responses

### Frontend Success Criteria ✅

- [ ] Inbox page loads without errors
- [ ] Custom email address displays correctly
- [ ] Email list populates with real data
- [ ] Email viewer displays content properly
- [ ] Search and filtering work correctly
- [ ] Real-time updates function properly

### User Experience Success Criteria ✅

- [ ] User can easily send emails to their custom address
- [ ] Emails appear in inbox within 2 minutes
- [ ] Interface is responsive and intuitive
- [ ] Error states are user-friendly
- [ ] Attachments are accessible

## Troubleshooting Checklist

If the system isn't working:

1. **Check Deployment Status**

   ```bash
   serverless info --stage dev
   ```

2. **Verify Environment Variables**

   ```bash
   serverless print --stage dev | grep EMAIL_SUBDOMAIN
   ```

3. **Test Database Connection**

   ```bash
   # Connect to database and check tables exist
   psql $DATABASE_URL -c "\dt"
   ```

4. **Monitor Lambda Logs**

   ```bash
   serverless logs -f ingestEmail --stage dev --tail
   ```

5. **Check SES Configuration**

   - Verify domain/email verification status
   - Check receipt rule is active
   - Confirm Lambda trigger is enabled

6. **Test API Endpoints**
   ```bash
   curl -X GET "https://your-api-domain/api/inbox" \
     -H "Cookie: sessionToken=your-session-token"
   ```

## Contact and Support

If you encounter issues during testing:

1. Check CloudWatch logs for specific error messages
2. Review this guide's troubleshooting section
3. Verify all prerequisites are met
4. Document the issue with steps to reproduce

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Compatible With**: WoltFlow v2.0+
