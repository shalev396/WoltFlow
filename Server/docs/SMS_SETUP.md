# SMS Notification Setup with AWS SNS

This document explains how to set up and use SMS notifications in WoltFlow using AWS Simple Notification Service (SNS) with three different sending methods.

## Prerequisites

1. **AWS Account**: Ensure you have an AWS account with SNS permissions
2. **Phone Number Verification**: Your AWS account must be verified for SMS sending
3. **Region**: Configured for `il-central-1` (Israel Central)
4. **Sender ID Registration**: "WoltFlow" sender ID registered in AWS End User Messaging

## Available SMS Sending Methods

WoltFlow supports three different SMS sending methods, each with specific use cases:

### 1. 🏷️ Sender ID (WoltFlow) - **Recommended**

- **Use Case**: Brand recognition and professional messaging
- **Display**: Recipients see "WoltFlow" as the sender
- **Reliability**: High delivery rates in supported regions
- **Cost**: Standard SMS rates
- **Best For**: Customer notifications, order updates, important alerts

### 2. 📱 Long Code (Dedicated Phone Number)

- **Use Case**: Two-way communication and customer support
- **Display**: Recipients see your dedicated phone number
- **Reliability**: Highest delivery rates, enables replies
- **Cost**: Higher due to dedicated number rental
- **Best For**: Customer support, two-way conversations, OTP verification

### 3. 🔄 Shared Numbers (AWS Default)

- **Use Case**: High-volume, cost-effective messaging
- **Display**: Recipients see random AWS-assigned numbers
- **Reliability**: Good delivery rates but less consistent
- **Cost**: Lowest cost option
- **Best For**: Marketing messages, bulk notifications, non-critical alerts

## AWS SNS Setup

### 1. Sender ID Registration (WoltFlow)

✅ **Already Configured**: "WoltFlow" sender ID is registered in your AWS account for il-central-1 region.

To verify or add additional sender IDs:

1. Go to AWS End User Messaging Console
2. Navigate to Configuration → Sender IDs
3. Select il-central-1 region
4. Verify "WoltFlow" is listed and active

### 2. Phone Number Verification

Before you can send SMS messages, you need to verify phone numbers in the AWS SNS console:

1. Go to AWS SNS Console → Text messaging (SMS) → Phone numbers
2. Add and verify the phone numbers you want to send SMS to
3. For production use, you may need to request SMS spending limits increase

### 3. Long Code Setup (Optional)

To get a dedicated long code number:

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
   - Once approved, you'll receive dedicated number(s)

## Usage Examples

### Method 1: Sender ID (WoltFlow) - Recommended

```typescript
import { sendSmsBySenderID } from "../utils/smsUtil.js";

const result = await sendSmsBySenderID({
  phoneNumber: "0501234567", // Automatically formatted to +972501234567
  message: "Your Wolt order #12345 is ready for pickup! 🎉",
  senderID: "WoltFlow", // Optional, defaults to "WoltFlow"
  smsType: "Transactional", // Optional, defaults to "Transactional"
});

if (result.success) {
  console.log(`SMS sent via ${result.method}:`, result.messageId);
} else {
  console.error("SMS failed:", result.error);
}
```

### Method 2: Long Code (Dedicated Number)

```typescript
import { sendSmsByLongCode } from "../utils/smsUtil.js";

const result = await sendSmsByLongCode({
  phoneNumber: "0501234567",
  message: "Hi! This is WoltFlow support. How can we help you today?",
  originationNumber: "+972501111111", // Your dedicated long code
  smsType: "Transactional",
});

if (result.success) {
  console.log(`SMS sent via ${result.method}:`, result.messageId);
} else {
  console.error("SMS failed:", result.error);
}
```

### Method 3: Shared Numbers (Cost-Effective)

```typescript
import { sendSmsBySharedNumber } from "../utils/smsUtil.js";

const result = await sendSmsBySharedNumber({
  phoneNumber: "0501234567",
  message: "🍕 Special offer! 20% off your next order with code SAVE20",
  smsType: "Promotional", // Use "Promotional" for marketing messages
});

if (result.success) {
  console.log(`SMS sent via ${result.method}:`, result.messageId);
} else {
  console.error("SMS failed:", result.error);
}
```

## Testing Your SMS Setup

Use the test SMS handler to verify all three methods. Send POST requests to `/api/sms/test` with the following JSON bodies:

### Method 1: Test Sender ID (WoltFlow) - Default

**cURL Command:**

```bash
curl -X POST YOUR_API_ENDPOINT/api/sms/test \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "0501234567",
    "method": "senderID"
  }'
```

**JSON Body:**

```json
{
  "phoneNumber": "0501234567",
  "method": "senderID"
}
```

**Expected Result:**

- SMS sent from "WoltFlow" sender ID
- Message: "🎉 Test from WoltFlow! This message was sent using Sender ID. SMS notifications are working!"

### Method 2: Test Long Code (Dedicated Number)

**cURL Command:**

```bash
curl -X POST YOUR_API_ENDPOINT/api/sms/test \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "0501234567",
    "method": "longCode",
    "longCodeNumber": "+972501111111"
  }'
```

**JSON Body:**

```json
{
  "phoneNumber": "0501234567",
  "method": "longCode",
  "longCodeNumber": "+972501111111"
}
```

**Expected Result:**

- SMS sent from your dedicated long code number
- Message: "📱 Test from WoltFlow! This message was sent using a dedicated Long Code number. SMS notifications are working!"
- **Note:** Replace `+972501111111` with your actual long code number

### Method 3: Test Shared Numbers (AWS Default)

**cURL Command:**

```bash
curl -X POST YOUR_API_ENDPOINT/api/sms/test \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "0501234567",
    "method": "sharedNumber"
  }'
```

**JSON Body:**

```json
{
  "phoneNumber": "0501234567",
  "method": "sharedNumber"
}
```

**Expected Result:**

- SMS sent from AWS shared numbers (random number)
- Message: "🔄 Test from WoltFlow! This message was sent using AWS Shared Numbers. SMS notifications are working!"

### Test Response Format

All test methods return the same response format:

**Success Response (200):**

```json
{
  "success": true,
  "message": "Test SMS sent successfully via Sender ID (WoltFlow)!",
  "messageId": "12345678-1234-1234-1234-123456789012",
  "phoneNumber": "+972501234567",
  "method": "senderID",
  "testDescription": "Sender ID (WoltFlow)"
}
```

**Error Response (400/500):**

```json
{
  "success": false,
  "error": "Phone number is required",
  "method": "senderID"
}
```

## Phone Number Format

The system automatically formats phone numbers using `formatPhoneNumber()`:

- **International format**: `+972501234567` (preferred)
- **Local format**: `0501234567` → converts to `+972501234567`
- **Digits only**: `501234567` → converts to `+972501234567`

## SMS Attributes Explained

### senderID (Sender ID Method)

**What it is**: The sender identifier displayed to recipients

- **Default**: "WoltFlow"
- **Max Length**: 11 characters for alphanumeric, 15 for numeric
- **Use Cases**:
  - **Brand Recognition**: Use your company name
  - **Department Identification**: "Support", "Orders", "Security"
  - **Campaign Tracking**: Different senders for different message types

### originationNumber (Long Code Method)

**What it is**: Your dedicated phone number for sending SMS

- **Format**: International format (e.g., "+972501111111")
- **Benefits**:
  - Enables two-way communication
  - Higher delivery rates
  - Professional appearance
  - Customer can reply directly

### smsType (All Methods)

**What it is**: Defines the SMS delivery priority and cost

- **Values**:
  - **"Transactional"**: Higher priority, higher cost, for critical messages
  - **"Promotional"**: Lower priority, lower cost, for marketing messages

## Cost Comparison

### Method Cost Analysis (Israel Region):

| Method             | Cost per SMS     | Use Case               | Delivery Rate |
| ------------------ | ---------------- | ---------------------- | ------------- |
| **Sender ID**      | ~$0.048          | Business notifications | High          |
| **Long Code**      | ~$0.048 + rental | Customer support       | Highest       |
| **Shared Numbers** | ~$0.035-$0.048   | Bulk messaging         | Good          |

### Monthly Cost Estimates (Per User: 20 SMS/month):

- **Sender ID**: 20 × $0.048 = **$0.96/month per user**
- **Long Code**: 20 × $0.048 + $X rental = **$0.96+ /month per user**
- **Shared Numbers**: 20 × $0.035 = **$0.70/month per user**

### Total Costs for Different User Bases:

| Users  | Sender ID    | Long Code      | Shared Numbers |
| ------ | ------------ | -------------- | -------------- |
| 100    | $96/month    | $96+ /month    | $70/month      |
| 1,000  | $960/month   | $960+ /month   | $700/month     |
| 10,000 | $9,600/month | $9,600+ /month | $7,000/month   |

## Error Handling

All SMS functions return a standardized result object:

```typescript
interface SendSmsResult {
  success: boolean;
  messageId?: string; // Present when success is true
  error?: string; // Present when success is false
  method?: "senderID" | "longCode" | "sharedNumber";
}
```

Common errors:

- **Invalid phone number format**
- **Phone number not verified in sandbox**
- **Insufficient permissions**
- **Rate limiting**
- **Network connectivity issues**
- **Message too long** (>1600 characters)
- **Invalid origination number** (Long Code method)
- **Sender ID not registered** (Sender ID method)

## Utility Functions

### Core Functions:

```typescript
// Phone number utilities
const formatted = formatPhoneNumber("0501234567"); // Returns "+972501234567"
const isValid = isValidPhoneNumber("+972501234567"); // Returns true

// SMS sending methods (3 available methods)
await sendSmsBySenderID(options); // Method 1: Sender ID (WoltFlow)
await sendSmsByLongCode(options); // Method 2: Long Code (Dedicated Number)
await sendSmsBySharedNumber(options); // Method 3: Shared Numbers (AWS Default)
```

## Best Practices

### 1. Choose the Right Method:

- **Sender ID**: Default choice for business notifications
- **Long Code**: When you need customer replies or highest delivery rates
- **Shared Numbers**: For high-volume, cost-sensitive messaging

### 2. Message Types:

- **Transactional**: Order updates, delivery notifications, security alerts
- **Promotional**: Marketing offers, newsletters, announcements

### 3. Cost Optimization:

- Use **Promotional** SMS type for marketing messages
- Validate phone numbers before sending
- Implement rate limiting to prevent accidental bulk sends
- Monitor AWS SNS metrics for delivery rates

### 4. Error Handling:

- Always check the `success` field in the result
- Log `messageId` for successful sends for tracking
- Handle errors gracefully and provide user feedback
- Implement retry logic for transient errors

### 5. Compliance:

- Ensure users consent to receiving SMS notifications
- Provide easy opt-out mechanisms
- Comply with local regulations (Israel privacy laws)
- Store phone numbers securely

## Security Notes

- Phone numbers are automatically formatted and validated
- Only send necessary notifications to reduce costs and spam
- Consider implementing rate limiting for production use
- Store phone numbers securely and comply with data protection regulations
- **GDPR/Privacy Compliance**: Ensure users consent to receiving SMS notifications
