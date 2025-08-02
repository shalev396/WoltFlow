# 🌊 WoltFlow Token Reviewer

A Chrome extension to review access and refresh tokens from Wolt.com.

## 🚀 Features

- **Token Extraction**: Review access and refresh tokens from Wolt.com cookies
- **Streamlined Interface**: Clean, focused UI matching your design system

- **Copy to Clipboard**: Easy copying of token values
- **Secure**: All processing happens locally, no data transmission
- **Design System Integration**: Matches your app's color scheme and styling

## 📦 Installation

### For Development/Testing

1. **Enable Developer Mode**:

   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" toggle in the top-right corner

2. **Load the Extension**:

   - Click "Load unpacked"
   - Select the `Extension` folder from this project
   - The extension should appear in your extensions list

3. **Pin the Extension**:
   - Click the puzzle piece icon in Chrome toolbar
   - Find "WoltFlow Token Reviewer" and click the pin icon

### For Production Use

Follow the publishing steps below to create a packaged extension.

## 🛠️ Usage

1. **Visit wolt.com** and log in
2. **Click extension icon** in Chrome toolbar
3. **Copy tokens** using the copy buttons

**That's it!** Tokens load automatically.

## 🏗️ Development

### Project Structure

```
Extension/
├── manifest.json          # Extension configuration
├── popup.html            # Main UI
├── popup.css             # Styling
├── popup.js              # Core functionality
├── background.js         # Service worker
├── icons/                # Extension icons
├── privacy-policy.md     # Privacy policy
└── README.md            # This file
```

### Building Icons

You'll need to create icons in the following sizes and place them in the `icons/` folder:

- `icon16.png` (16x16px)
- `icon32.png` (32x32px)
- `icon48.png` (48x48px)
- `icon128.png` (128x128px)

You can use any icon design tool or generate simple placeholder icons.

## 📦 Publishing to Chrome Web Store

### Prerequisites

1. **Chrome Web Store Developer Account**:

   - Visit [Chrome Web Store Developer Console](https://chrome.google.com/webstore/devconsole/)
   - Pay one-time $5 registration fee
   - Verify your identity

2. **Create Icons**:
   ```bash
   # Create placeholder icons (you can replace with custom designs)
   cd Extension/icons
   # Create 16x16, 32x32, 48x48, and 128x128 PNG files
   ```

### Building for Chrome Web Store

1. **Package Extension**:

   ```powershell
   # Windows
   npm run package-windows

   # macOS/Linux
   npm run package
   ```

2. **Prepare Assets**:
   - Screenshots: 1280x800px of extension in use
   - Store icon: 128x128px PNG
   - Promotional images: 440x280px (optional)

### Store Listing Information

**Title**: WoltFlow Token Reviewer

**Description**:

```
A developer tool for viewing authentication tokens from Wolt.com cookies.

Features:
• Extract access and refresh tokens
• Auto-detect potential token cookies
• Copy tokens to clipboard
• Secure local processing only
• Clean, developer-friendly interface

⚠️ For authorized developers only. Tokens are sensitive - use responsibly.

This extension processes all data locally and never transmits tokens or personal data.
```

**Category**: Developer Tools

**Keywords**: WoltFlow, wolt, tokens, debugging, authentication, developer, cookies

### Submission Process

1. **Upload Package**:

   - Go to Chrome Web Store Developer Console
   - Click "New Item"
   - Upload your ZIP file

2. **Fill Store Listing**:

   - Add title, description, screenshots
   - Upload store icon and promotional images
   - Set category and keywords

3. **Privacy Practices**:

   - Indicate data usage (cookies, storage)
   - Upload privacy policy
   - Declare no data transmission

4. **Submit for Review**:
   - Review all information
   - Submit for Chrome Web Store review
   - Review typically takes 1-3 business days

## 🔧 Troubleshooting

### Common Issues

**"No host permissions for cookies"**:

- Visit wolt.com first to establish permissions
- Ensure the extension has proper host permissions

**"Tokens not found"**:

- Verify you're logged in to Wolt
- Try auto-detection to find cookie names
- Check all cookies view to see available cookies

**Extension won't load**:

- Verify all files are present
- Check Developer Tools console for errors
- Ensure manifest.json is valid

### Development Debugging

1. **Inspect Popup**:

   - Right-click extension icon → "Inspect popup"
   - Use Chrome DevTools to debug

2. **View Background Script**:

   - Go to `chrome://extensions/`
   - Click "Details" on your extension
   - Click "Inspect views: background page"

3. **Check Permissions**:
   - Go to extension details
   - Verify site permissions are granted

## ⚠️ Security & Legal

- **Local Only**: All processing happens on your device
- **No Data Transmission**: Tokens never leave your browser

- **Privacy Policy**: See `privacy-policy.md` for details

---

**Handle tokens responsibly.**
