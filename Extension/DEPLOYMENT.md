# 🚀 WoltFlow Extension Deployment Guide

## Automated CI/CD Deployment

Your extension is configured for automatic deployment to the Chrome Web Store when you push to `dev` or `main`.

### Prerequisites

1. **Chrome Web Store Developer Account**
   - Register at [Chrome Web Store Developer Console](https://chrome.google.com/webstore/devconsole/)
   - Pay the one-time $5 registration fee

2. **Google Cloud Console Setup**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or use existing
   - Enable the Chrome Web Store API
   - Create OAuth2 credentials

3. **GitHub Secrets Configuration**
   Add these secrets to your GitHub repository settings:

   ```
   ENV=
   CHROME_EXTENSION_ID_DEV=your_dev_extension_id
   CHROME_EXTENSION_ID_PROD=your_prod_extension_id
   CHROME_CLIENT_ID=your_oauth2_client_id
   CHROME_CLIENT_SECRET=your_oauth2_client_secret
   CHROME_REFRESH_TOKEN=your_oauth2_refresh_token
   ```

### Workflow Triggers

- **Development**: Push to `dev` branch
  - Generates icons
  - Validates extension
  - **Deploys to Chrome Web Store Dev** (unpublished)
  - Creates development build artifact

- **Production**: Push to `main` branch
  - Generates icons
  - Validates extension
  - **Deploys to Chrome Web Store Prod** (published)
  - Creates GitHub release
  - Publishes automatically

### 🎯 **Workflow Process:**

```
Push to dev  → Generate Icons → Validate → Package → Deploy to Chrome Store Dev (unpublished)
Push to main → Generate Icons → Validate → Package → Deploy to Chrome Store Prod (published) → Create Release
```

### Manual Deployment

If you need to deploy manually:

```bash
# Generate icons
npm run create-icons

# Validate extension
npm run validate

# Build complete package
npm run build

# Package for distribution
npm run package-windows

# Upload woltflow-token-reviewer.zip to Chrome Web Store
```

### Getting OAuth2 Credentials

1. **Google Cloud Console**:
   - Go to APIs & Services > Credentials
   - Create OAuth2 Client ID (Desktop Application)
   - Note the Client ID and Client Secret

2. **Generate Refresh Token**:

   ```bash
   # Install chrome-webstore-upload-cli globally
   npm install -g chrome-webstore-upload-cli

   # Generate refresh token
   chrome-webstore-upload refresh-token --client-id=YOUR_CLIENT_ID --client-secret=YOUR_CLIENT_SECRET
   ```

3. **Extension IDs**:
   - Create **TWO separate extensions** in Chrome Web Store:
     - Development version (unpublished, for testing)
     - Production version (published, for users)
   - Get both Extension IDs from the Chrome Web Store URLs
   - Example: `https://chrome.google.com/webstore/detail/YOUR_EXTENSION_ID`

### Chrome Web Store Review Process

- **First submission**: Manual review (1-3 days)
- **Updates**: Usually auto-approved if no policy violations
- **Major changes**: May trigger manual review

### Troubleshooting

**Common Issues**:

- Invalid extension ID: Check Chrome Web Store dashboard
- OAuth errors: Verify client credentials and refresh token
- API quota exceeded: Wait or request quota increase
- Manifest errors: Run `npm run validate` locally first

**Support**:

- [Chrome Web Store Developer Documentation](https://developer.chrome.com/docs/webstore/)
- [Chrome Web Store API Reference](https://developer.chrome.com/docs/webstore/api_index/)

---

🌊 **WoltFlow Extension** - Automated deployment ready!
