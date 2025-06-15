# WoltFlow Backend Production Deployment Guide

## Overview

This guide will help you deploy your WoltFlow backend from local development to production on AWS Lambda using the Serverless Framework.

## ✅ Changes Made for Production

### 1. CORS Configuration Updated

- All CORS origins have been updated to use `https://woltflow.shalev396.com` in production
- Development origins still use `http://localhost:5173`
- Updated in both serverless.yml and all handler files

### 2. Scheduled Events Added

- Added automatic triggering of `startAllRuns` on weekdays (Sun-Thu) at 10:00 UTC (12:00 Israel time)
- Cron expression: `cron(0 10 ? * SUN,MON,TUE,WED,THU *)`

### 3. Database SSL Configuration

- Production uses SSL for PostgreSQL connections
- Development bypasses SSL for local connections

## 🔧 Environment Variables for Production

Create a `.env` file in your Server directory for production deployment:

```env
# Database Configuration
DATABASE_URL=""
DATABASE_URL_DEV=""
JWT_SECRET=""
ENV="Production"

# Google OAuth - Production
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
OAUTH_REDIRECT_URI="/api/oauth2/callback"

# Lambda Function Names (Production - adjust stage as needed)
IS_OFFLINE=false
REFRESH_TOKENS_FUNCTION_NAME=""
WOLT_BUY_GIFT_FUNCTION_NAME=""
GET_DAILY_CODE_FUNCTION_NAME=""
WOLT_APPLY_GIFT_FUNCTION_NAME=""

# AWS Configuration
AWS_REGION=""
ASSETS_BUCKET_NAME=""
AWS_ACCESS_CONNECT_KEY=""
AWS_ACCESS_SECRET=""

# Development Only (leave empty for production)
DEVELOPMENT_DATE=""
```

## 🚀 Deployment Steps

### 1. Prerequisites

- Serverless Framework installed globally: `npm install -g serverless`
- AWS CLI configured with your credentials
- Chrome Lambda layers available in your AWS account

### 2. Google OAuth Setup

Update your Google OAuth configuration:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services > Credentials
3. Find your OAuth 2.0 Client
4. Add the production redirect URI: `https://woltflow.shalev396.com/api/oauth2/callback`
5. Add your production domain to authorized origins: `https://woltflow.shalev396.com`

### 3. Deploy to Production

```bash
cd Server
# Set environment to production
export ENV=Production

# Deploy to production stage
serverless deploy --stage prod

# Or deploy to a specific stage
serverless deploy --stage production
```

### 4. Database Migration

Make sure your production database is ready:

- The application will automatically sync tables in development
- For production, consider running manual migrations if needed

## 📋 Post-Deployment Checklist

### API Endpoints (replace with your actual API Gateway URL)

- [ ] Test OAuth flow: `https://your-api-gateway-url/api/oauth2/start`
- [ ] Test authentication: `https://your-api-gateway-url/api/auth/me`
- [ ] Test settings: `https://your-api-gateway-url/api/setting`
- [ ] Test runs: `https://your-api-gateway-url/api/runs`

### Scheduled Events

- [ ] Verify EventBridge rule is created for startAllRuns
- [ ] Check CloudWatch logs for scheduled executions
- [ ] Test manual trigger: `https://your-api-gateway-url/api/automation/start-all-runs`

### Security

- [ ] Verify CORS origins are correctly configured
- [ ] Test that development endpoints are not accessible
- [ ] Verify SSL connections to database
- [ ] Check IAM permissions for Lambda functions

## 🔍 Monitoring and Troubleshooting

### CloudWatch Logs

Monitor these log groups:

- `/aws/lambda/woltflow-server-prod-startAllRuns`
- `/aws/lambda/woltflow-server-prod-refreshTokens`
- `/aws/lambda/woltflow-server-prod-woltBuyGift`
- `/aws/lambda/woltflow-server-prod-getDailyCode`
- `/aws/lambda/woltflow-server-prod-woltApplyGift`

### Common Issues

1. **CORS Errors**: Verify your frontend domain matches the CORS settings
2. **Database Connection**: Check SSL configuration and connection string
3. **OAuth Redirect**: Ensure Google OAuth callback URL is correctly configured
4. **Lambda Timeouts**: Monitor function execution times and adjust timeout settings

## 🔄 Environment Switching

To switch back to development:

```bash
export ENV=Development
serverless offline
```

To deploy to different stages:

```bash
# Staging
serverless deploy --stage staging

# Production
serverless deploy --stage prod
```

## 📱 Frontend Configuration

Make sure your frontend (likely at `https://woltflow.shalev396.com`) is configured to:

- Use the production API Gateway URLs
- Handle the production OAuth flow
- Use HTTPS for all API calls

## 🎯 Automated Deployment (Optional)

Consider setting up GitHub Actions or similar CI/CD for automated deployments:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install -g serverless
      - run: cd Server && npm install
      - run: cd Server && serverless deploy --stage prod
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

---

Your backend is now ready for production deployment! 🎉
