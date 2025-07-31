# Email Notification Setup with AWS SES

This document explains how to set up and use email notifications in WoltFlow using AWS Simple Email Service (SES).

## Prerequisites

1. **AWS Account**: Ensure you have an AWS account with SES permissions
2. **Domain/Email Verification**: Your domain or specific email addresses must be verified in SES
3. **Region**: Configured for `il-central-1` (Israel Central)
4. **DNS Access**: Ability to add DNS records for domain verification (recommended)

## AWS SES Setup

### 1. SES Account Status

AWS SES starts in **Sandbox Mode** with restrictions:

- Can only send to verified email addresses
- Limited to 200 emails per 24-hour period
- Maximum send rate of 1 email per second

### 2. Email/Domain Verification

#### Option A: Verify Individual Email Address

1. Go to AWS SES Console → Verified identities
2. Click "Create identity" → "Email address"
3. Enter `woltflow@shalev396.com`
4. Click "Create identity"
5. Check the inbox for verification email and click the link

#### Option B: Verify Entire Domain (Recommended)

1. Go to AWS SES Console → Verified identities
2. Click "Create identity" → "Domain"
3. Enter `shalev396.com`
4. Choose **DKIM** authentication method
5. Add the provided DNS records to your domain:
   - **TXT record** for domain verification
   - **CNAME records** for DKIM authentication (3 records)
6. Wait for DNS propagation (can take up to 72 hours)

### 3. DNS Records Setup

When verifying the domain `shalev396.com`, add these DNS records:

```dns
# Domain Verification TXT Record
Name: _amazonses.shalev396.com
Type: TXT
Value: [Provided by AWS during verification]

# DKIM CNAME Records (3 records provided by AWS)
Name: [token1]._domainkey.shalev396.com
Type: CNAME
Value: [dkim-value1].dkim.amazonses.com

Name: [token2]._domainkey.shalev396.com
Type: CNAME
Value: [dkim-value2].dkim.amazonses.com

Name: [token3]._domainkey.shalev396.com
Type: CNAME
Value: [dkim-value3].dkim.amazonses.com
```

### 4. Request Production Access

To send emails to unverified addresses and increase limits:

1. **Open AWS Support Case**:
   - Go to AWS Support Center
   - Create a case for "Service Limit Increase"
   - Select "SES Sending Limits"
2. **Provide Required Information**:
   - **Use Case**: Transactional emails for web application
   - **Website URL**: Your application URL
   - **Description**: "Sending order notifications and verification emails for WoltFlow automation platform"
   - **Expected Volume**: Estimated monthly email volume
   - **Mailing List Compliance**: Confirm compliance with anti-spam regulations
3. **Approval Process**:
   - AWS reviews your request (1-2 business days)
   - May require additional information
   - Once approved, you can send to any email address

## Email Authentication Features

### DKIM (DomainKeys Identified Mail)

DKIM adds a digital signature to your emails:

- **Improves deliverability** by preventing spoofing
- **Required for production** use with most email providers
- **Automatically enabled** when you verify a domain with DKIM

### SPF (Sender Policy Framework)

Add an SPF record to authorize AWS SES to send on your behalf:

```dns
Name: shalev396.com
Type: TXT
Value: "v=spf1 include:amazonses.com ~all"
```

### DMARC (Domain-based Message Authentication)

Optional but recommended for enhanced security:

```dns
Name: _dmarc.shalev396.com
Type: TXT
Value: "v=DMARC1; p=quarantine; rua=mailto:dmarc@shalev396.com"
```

## SES Sending Limits and Quotas

### Default Limits (Sandbox Mode)

- **Daily Send Quota**: 200 emails per 24-hour period
- **Send Rate**: 1 email per second
- **Recipients**: Only verified email addresses

### Production Limits (After Approval)

- **Initial Daily Quota**: 200 emails per 24-hour period
- **Initial Send Rate**: 1 email per second
- **Automatic Increases**: AWS automatically increases limits based on sending patterns
- **Manual Requests**: Can request specific limit increases via support

### Monitoring Your Limits

```typescript
import {
  SESClient,
  GetSendStatisticsCommand,
  GetSendQuotaCommand,
} from "@aws-sdk/client-ses";

const sesClient = new SESClient({ region: "il-central-1" });

// Check current sending statistics
const stats = await sesClient.send(new GetSendStatisticsCommand({}));

// Check current sending quota
const quota = await sesClient.send(new GetSendQuotaCommand({}));
```

## Email Types and Use Cases

### Transactional Emails

- **Order confirmations**
- **Verification codes** (2FA)
- **Password reset links**
- **Account notifications**
- **System alerts**

### Best Practices for Transactional Emails

- Use clear, descriptive subject lines
- Include both HTML and text versions
- Set appropriate reply-to addresses
- Include unsubscribe links where required
- Use consistent branding

## Usage Examples

### Basic Email Sending

```typescript
import { sendEmail } from "../utils/emailUtil.js";

const result = await sendEmail({
  to: "user@example.com",
  subject: "Welcome to WoltFlow",
  htmlBody: "<h1>Welcome!</h1><p>Thanks for joining WoltFlow.</p>",
  textBody: "Welcome!\n\nThanks for joining WoltFlow.",
  replyTo: "support@shalev396.com",
});
```

### Verification Code Email

```typescript
import { sendVerificationEmail } from "../utils/emailUtil.js";

const result = await sendVerificationEmail(
  "user@example.com",
  "123456",
  "email verification"
);
```

### Order Notification Email

```typescript
import { sendOrderNotificationEmail } from "../utils/emailUtil.js";

const result = await sendOrderNotificationEmail("user@example.com", {
  status: "Completed",
  amount: "35.00",
  orderTime: "2024-01-15 14:30",
  details: "Gift card applied successfully",
});
```

### Multiple Recipients

```typescript
const result = await sendEmail({
  to: ["admin@shalev396.com", "support@shalev396.com"],
  cc: ["manager@shalev396.com"],
  subject: "System Alert",
  htmlBody: "<p>System maintenance completed.</p>",
  textBody: "System maintenance completed.",
});
```

## Email Template Best Practices

### HTML Email Structure

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Title</title>
  </head>
  <body
    style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"
  >
    <!-- Use inline CSS for better compatibility -->
    <!-- Include alt text for images -->
    <!-- Test across multiple email clients -->
  </body>
</html>
```

### Key Design Principles

- **Mobile-first responsive design**
- **Inline CSS** for better email client support
- **Alt text for images**
- **Clear call-to-action buttons**
- **Consistent branding**
- **Fallback fonts**

## Cost Analysis

### SES Pricing (Israel Region - il-central-1)

- **Email Sending**: $0.10 per 1,000 emails
- **Incoming Email**: $0.09 per 1,000 emails (if configured)
- **Dedicated IP**: $24.95 per month (optional)
- **No charges for**: Bounces, complaints, or failed sends

### Monthly Cost Estimates

#### Per User Email Volume

- **Verification emails**: 2/month
- **Order notifications**: 20/month
- **System notifications**: 3/month
- **Total per user**: ~25 emails/month

#### Cost Calculations

- **100 Users**: 2,500 emails/month = **$0.25/month**
- **1,000 Users**: 25,000 emails/month = **$2.50/month**
- **10,000 Users**: 250,000 emails/month = **$25.00/month**

### Comparison with SMS

- **Email**: $0.0001 per message
- **SMS**: $0.048 per message (480x more expensive)
- **Cost Ratio**: Email is **99.98% cheaper** than SMS

## Error Handling and Monitoring

### Common Error Types

```typescript
interface SendEmailResult {
  success: boolean;
  messageId?: string; // Present when success is true
  error?: string; // Present when success is false
}
```

### Common Errors

- **Unverified sender address** (MessageRejected)
- **Recipient email bounced** (permanently undeliverable)
- **Daily send quota exceeded** (SendingPausedException)
- **Send rate exceeded** (Throttling)
- **Invalid email address format** (InvalidParameterValue)
- **Account in sandbox mode** sending to unverified address

### Email Bounces and Complaints

AWS SES tracks:

- **Hard bounces**: Permanently undeliverable addresses
- **Soft bounces**: Temporarily undeliverable (full mailbox, etc.)
- **Complaints**: Recipients marking email as spam

Monitor these metrics to maintain good sender reputation:

- **Bounce rate**: Should be < 5%
- **Complaint rate**: Should be < 0.1%

## Security and Compliance

### Data Protection

- **Email addresses**: Store securely and comply with GDPR/privacy laws
- **Opt-out mechanisms**: Implement unsubscribe functionality
- **Consent tracking**: Record when users consent to receive emails
- **Data retention**: Implement appropriate retention policies

### Email Authentication

- **SPF**: Authorize AWS to send on your behalf
- **DKIM**: Digital signature for email authenticity
- **DMARC**: Policy for handling authentication failures

### Rate Limiting

```typescript
// Implement rate limiting to prevent abuse
const rateLimiter = new Map();

export function checkRateLimit(emailAddress: string): boolean {
  const now = Date.now();
  const key = emailAddress;
  const limit = rateLimiter.get(key);

  if (limit && now - limit < 60000) {
    // 1 minute cooldown
    return false;
  }

  rateLimiter.set(key, now);
  return true;
}
```

## Testing and Development

### Development Environment

- Use verified email addresses for testing
- Test HTML rendering across different email clients
- Validate email content and links
- Monitor bounce and complaint rates

### Email Testing Tools

- **Litmus**: Cross-client testing
- **Email on Acid**: Email testing platform
- **Gmail/Outlook**: Manual testing
- **AWS SES Simulator**: Built-in testing addresses

### SES Testing Addresses

AWS provides special test addresses:

- `success@simulator.amazonses.com` - Successful delivery
- `bounce@simulator.amazonses.com` - Hard bounce
- `complaint@simulator.amazonses.com` - Complaint

## Production Checklist

- [ ] Domain verified with DKIM enabled
- [ ] SPF record added to DNS
- [ ] DMARC policy configured (optional)
- [ ] Production access approved by AWS
- [ ] Email templates tested across clients
- [ ] Bounce/complaint handling implemented
- [ ] Rate limiting configured
- [ ] Monitoring and alerting set up
- [ ] Privacy policy updated for email collection
- [ ] Unsubscribe mechanism implemented

## Support and Troubleshooting

### AWS SES Console Monitoring

- **Sending Statistics**: Track sends, bounces, complaints
- **Reputation Metrics**: Monitor sender reputation
- **Event Publishing**: Configure SNS notifications for bounces/complaints

### Common Issues

1. **Emails going to spam**:

   - Verify DKIM, SPF, DMARC setup
   - Check sender reputation
   - Review email content for spam triggers

2. **High bounce rate**:

   - Validate email addresses before sending
   - Remove hard bounces from mailing lists
   - Monitor email quality

3. **Send rate exceeded**:
   - Implement proper rate limiting
   - Request higher send rate limits
   - Distribute sends over time

### Getting Help

- **AWS Documentation**: [AWS SES Developer Guide](https://docs.aws.amazon.com/ses/)
- **AWS Support**: Create support cases for limit increases
- **Community Forums**: AWS forums and Stack Overflow
- **Email Deliverability**: Consult email marketing best practices

---

**Note**: Email setup requires careful attention to authentication and deliverability. Take time to properly configure DNS records and monitor sending statistics to maintain good sender reputation.
