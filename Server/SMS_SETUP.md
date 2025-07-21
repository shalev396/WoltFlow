# SMS Notification Setup with AWS SNS

This document explains how to set up and use SMS notifications in WoltFlow using AWS Simple Notification Service (SNS).

## Prerequisites

1. **AWS Account**: Ensure you have an AWS account with SNS permissions
2. **Phone Number Verification**: Your AWS account must be verified for SMS sending
3. **Region**: Configured for `il-central-1` (Israel Central)

## AWS SNS Setup

### 1. Phone Number Verification

Before you can send SMS messages, you need to verify phone numbers in the AWS SNS console:

1. Go to AWS SNS Console → Text messaging (SMS) → Phone numbers
2. Add and verify the phone numbers you want to send SMS to
3. For production use, you may need to request SMS spending limits increase

### 2. SMS Spending Limits

- AWS SNS has default spending limits for SMS
- For production use, you may need to request limit increases in the AWS Support Center

## AWS Shared Numbers vs Long Codes

### Shared Numbers (Default)

AWS SNS uses **shared short codes** by default for SMS delivery. These are:

- **5-6 digit numbers** shared among multiple AWS customers
- **Lower cost** but less reliable for branding
- **May have delivery issues** in some regions
- **Limited customization** options

### Long Codes (Dedicated Numbers)

For better reliability and branding, you can request **dedicated long codes**:

#### How to Request Long Codes:

1. **Open AWS Support Case**:
   - Go to AWS Support Center
   - Create a case for "Service Limit Increase"
   - Select "SNS Text Messaging"
2. **Provide Required Information**:

   - **Country**: Israel
   - **Phone Number Type**: Long code
   - **Monthly SMS Volume**: Estimated volume
   - **Use Case Description**: Business SMS notifications
   - **Opt-out Compliance**: Confirm compliance with local regulations

3. **Approval Process**:
   - AWS reviews your request (1-2 weeks)
   - May require additional documentation
   - Once approved, you'll receive dedicated number(s)

#### To Use Long Codes in Your Application:

```typescript
// After receiving your dedicated long code from AWS
const result = await sendSms({
  phoneNumber: "+972501234567",
  message: "Your message",
  senderID: "YourLongCode", // Use your dedicated number here
  smsType: "Transactional",
});
```

## SMS Attributes Explained

### senderID

**What it is**: The sender identifier displayed to recipients

- **Required**: No (optional)
- **Default**: "WoltFlow"
- **Max Length**: 11 characters for alphanumeric, 15 for numeric
- **Use Cases**:
  - **Brand Recognition**: Use your company name
  - **Department Identification**: "Support", "Orders", "Security"
  - **Campaign Tracking**: Different senders for different message types

**Important**: Not all carriers support custom Sender IDs. In Israel, most carriers display the actual phone number instead.

### MessageAttributes

**What it is**: Metadata attached to SMS messages for delivery configuration

#### AWS.SNS.SMS.SenderID

- **Purpose**: Sets the sender ID for the message
- **Required**: No
- **Values**: Any string (alphanumeric recommended)
- **Use Case**: Branding and message identification

#### AWS.SNS.SMS.SMSType

**What it is**: Defines the SMS delivery priority and cost

- **Required**: No
- **Values**:
  - **"Transactional"**:
    - Higher priority delivery
    - Higher cost
    - For critical messages (OTP, alerts, confirmations)
    - Better delivery rates
  - **"Promotional"**:
    - Lower priority delivery
    - Lower cost
    - For marketing messages
    - May be filtered by carriers

**Recommendation**: Use "Transactional" for WoltFlow notifications as they are service-related.

### Example with All Attributes:

```typescript
const result = await sendSms({
  phoneNumber: "+972501234567",
  message: "Your Wolt order is ready!",
  senderID: "WoltFlow", // Optional: Your brand name
  smsType: "Transactional", // Optional: High priority delivery
});
```

## Phone Number Format

The system automatically formats phone numbers using `formatPhoneNumber()`:

- **International format**: `+972501234567` (preferred)
- **Local format**: `0501234567` → converts to `+972501234567`
- **Digits only**: `501234567` → converts to `+972501234567`

## Usage Examples

### Basic SMS Sending:

```typescript
import { sendSms } from "../utils/smsUtil.js";

const result = await sendSms({
  phoneNumber: "0501234567", // Automatically formatted to +972501234567
  message: "Hello from WoltFlow!",
  senderID: "WoltFlow",
  smsType: "Transactional",
});
```

### Using Core Functions:

```typescript
import {
  sendSms,
  formatPhoneNumber,
  isValidPhoneNumber,
} from "../utils/smsUtil.js";

// Format and validate phone number
const formatted = formatPhoneNumber("0501234567"); // Returns "+972501234567"

// Check if phone number is valid
const isValid = isValidPhoneNumber("+972501234567"); // Returns true
```

## Cost Considerations

### SMS Pricing (Israel Region):

- **Transactional SMS**: ~$0.048 per message
- **Promotional SMS**: ~$0.035 per message
- **Failed Delivery**: No charge for failed messages
- **Invalid Numbers**: No charge for invalid phone numbers

### Monthly Cost Estimates:

- **Per User**: 20 SMS/month × $0.048 = **$0.96/month per user**
- **100 Users**: 2,000 SMS/month = **$96/month**
- **1,000 Users**: 20,000 SMS/month = **$960/month**

### Error-Related Costs:

- **No additional charges** for:
  - Invalid phone numbers
  - Failed deliveries
  - Rate limiting errors
  - Permission errors
- **Charges apply** only for successfully sent messages

### Cost Optimization Tips:

1. **Use Promotional SMS** for non-critical messages
2. **Validate phone numbers** before sending
3. **Implement rate limiting** to prevent accidental bulk sends
4. **Monitor AWS SNS metrics** for delivery rates
5. **Use message templates** to reduce development time

## Error Handling

The SMS functions return a standardized result object:

```typescript
interface SendSmsResult {
  success: boolean;
  messageId?: string; // Present when success is true
  error?: string; // Present when success is false
}
```

Common errors:

- **Invalid phone number format**
- **Phone number not verified in sandbox**
- **Insufficient permissions**
- **Rate limiting**
- **Network connectivity issues**
- **Message too long** (>1600 characters)

## Security Notes

- Phone numbers are automatically formatted and validated
- Only transactional SMS are sent by default
- Consider implementing rate limiting for production use
- Store phone numbers securely and comply with data protection regulations
- **GDPR/Privacy Compliance**: Ensure users consent to receiving SMS notifications
