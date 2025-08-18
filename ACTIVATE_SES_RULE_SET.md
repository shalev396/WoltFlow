# 🚨 **MANUAL STEP REQUIRED: Activate SES Receipt Rule Set**

## ❌ **Why Manual?**

AWS CloudFormation **does not support** activating SES receipt rule sets. The `AWS::SES::ReceiptRuleSet` resource creates rule sets but cannot set them as active - there's no `Active: true` property.

## 🔧 **Manual Activation Steps:**

1. Go to **AWS SES Console**: https://console.aws.amazon.com/ses/
2. Select region: **il-central-1**
3. Navigate to **Email receiving** → **Receipt rules**
4. Find rule set: `woltflow-server-dev-email-rules`
5. Click **"Set as active"** button
6. ✅ **Done!**
