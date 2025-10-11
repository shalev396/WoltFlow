# Analytics & Cookie Consent System

A GDPR-compliant cookie consent system for WoltFlow with Google Analytics integration.

## Overview

Simple consent system with just two choices:

- 🍪 **Accept All Cookies** - Essential + Analytics cookies
- ⚙️ **Essential Only** - Only essential cookies (Analytics disabled)

## Components

### Consent Components

- `ConsentBanner` - Simple consent banner with two buttons
- `ConsentManager` - Handles Google Analytics initialization and consent
- `CookieSettings` - Footer link to reopen consent banner (in settings/footer)

### Analytics Hooks & Services

- `analytics.ts` - Core Google Analytics service with consent management
- `useAnalytics.ts` - React hook for tracking events with automatic consent checks
- `useRouteTracking.ts` - Automatic page view tracking on route changes
- `RouteTracker.tsx` - Component wrapper for route tracking (used in Layout)

### Context & Types

- `ConsentContext.tsx` - React context for consent preferences
- `consent.ts` - TypeScript types for consent system

## Usage

### Analytics Tracking (Consent-Aware)

```tsx
import { useAnalytics } from "@/hooks/useAnalytics";

function MyComponent() {
  const { trackEvent, trackPageView } = useAnalytics();

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

### Manual Analytics Control

```tsx
import { analytics } from "@/services/analytics";

// Check status
const isInitialized = analytics.isAnalyticsInitialized();
const hasConsent = analytics.getConsentStatus();

// Manual tracking (usually not needed - use hooks instead)
analytics.trackPageView("/my-page", "My Page Title");
analytics.trackEvent("action", "category", "label", 123);
```

## Technical Details

- **Analytics Provider**: Google Analytics 4 (GA4)
- **Environment Variable**: `VITE_GOOGLE_ANALYTICS_ID` (required)
- **Storage**: localStorage as `woltflow-consent-preferences`
- **Default**: Analytics disabled until user accepts
- **GDPR Compliant**: Clear choice, easy to change, respects user decisions
- **Script Loading**: GA script only loads after user consent
- **Automatic Tracking**: Page views tracked automatically via RouteTracker

## Setup

1. Create a `.env.local` file in the Client directory
2. Add your Google Analytics tracking ID:
   ```
   VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
   ```
3. The system will warn in console if the environment variable is not set

## Implementation Flow

1. User visits website → **ConsentBanner** shown (if no prior choice)
2. User clicks "Accept All" → Consent saved → **ConsentManager** initializes GA
3. **RouteTracker** (in Layout) → Tracks page views automatically
4. Components use **useAnalytics** hook → Track custom events

## Files Location

```
Client/src/
├── services/
│   └── analytics.ts                    # Core GA service
├── hooks/
│   ├── useAnalytics.ts                 # Event tracking hook
│   ├── useRouteTracking.ts             # Route tracking hook
│   └── useConsent.ts                   # Consent management hook
├── components/shared/
│   ├── RouteTracker.tsx                # Route tracker component
│   └── consent/
│       ├── ConsentBanner.tsx           # Consent banner UI
│       ├── ConsentManager.tsx          # GA initialization manager
│       ├── CookieSettings.tsx          # Reopen consent settings
│       └── index.ts                    # Exports
├── contexts/
│   └── ConsentContext.tsx              # Consent context provider
└── types/
    └── consent.ts                      # TypeScript types
```

## Notes

- **Development Mode**: Set `VITE_ENV=dev` to enable GA debug mode
- **Cookie Domain**: Set to "auto" for subdomain tracking
- **Consent Storage**: Preferences persist across sessions
- **Script ID**: `google-analytics-script` used to prevent duplicate loading
- **Dashboard Analytics**: Separate from Google Analytics - refers to backend metrics (runs/savings data)
