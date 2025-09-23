# Cookie Consent System (Simplified)

A simple cookie consent system for WoltFlow with Google Analytics integration.

## Overview

Simple consent system with just two choices:

- 🍪 **Accept All Cookies** - Essential + Analytics cookies
- ⚙️ **Essential Only** - Only essential cookies (Analytics disabled)

## Components

- `ConsentBanner` - Simple consent banner with two buttons
- `ConsentManager` - Handles Google Analytics integration
- `CookieSettings` - Footer link to reopen consent banner

## Usage

### Analytics Tracking (Consent-Aware)

```tsx
import { useAnalytics } from "@/hooks/useAnalytics";

function MyComponent() {
  const { trackEvent } = useAnalytics();

  const handleClick = () => {
    trackEvent("button_click", "user_action");
    // Only tracks if user accepted all cookies
  };
}
```

### Check Consent Status

```tsx
import { useConsent } from "@/hooks/useConsent";

function MyComponent() {
  const { consentState } = useConsent();

  if (consentState.preferences.analytics) {
    // User accepted analytics cookies
  }
}
```

## Technical Details

- **Analytics**: Google Analytics only loads with user consent
- **Environment Variable**: Set `VITE_GOOGLE_ANALYTICS_ID` with your GA4 tracking ID
- **Storage**: localStorage as `woltflow-consent-preferences`
- **Default**: Analytics disabled until user accepts
- **GDPR Compliant**: Clear choice, easy to change, respects decisions

## Setup

1. Create a `.env.local` file in the Client directory
2. Add your Google Analytics tracking ID:
   ```
   VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
   ```
3. The system will warn in console if the environment variable is not set

## Files

- `ConsentBanner.tsx` - Simple two-button consent banner
- `ConsentManager.tsx` - Integrates with Google Analytics
- `CookieSettings.tsx` - Reopens consent banner from footer
- `useConsent.ts` - Hook for consent functionality
- `analytics.ts` - Google Analytics service with consent checks
