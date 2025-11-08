# AWS Cognito Account Linking

## Overview

Links multiple identity providers (Google, email/password, etc.) to a single user account.
**Result:** 1 database record per user, regardless of login method.

## How It Works

1. **PreSignUp**: Links Google identities to existing verified native users
2. **PostConfirmation**: Links Google to newly verified email/password users + migrates database
3. **Database**: Always uses native user's `sub` (migrated from Google sub if needed)
4. **Cognito**: Both users exist, but linked via `identities` attribute

## Implementation

### PreSignUp (Google → Native Linking)

```typescript
// Check if this exact Google user exists (repeat login)
const existingGoogleUser = await findUserByUsername(event.userName);
if (existingGoogleUser) return event; // Already linked

// Find verified native user
const nativeUser = await findUserByEmail(email);
if (nativeUser?.UserStatus === "CONFIRMED") {
  await AdminLinkProviderForUser({
    DestinationUser: nativeUser.Username,
    SourceUser: event.userName, // Google_xxx
  });
}
event.response.autoConfirmUser = true;
return event; // Never throw errors!
```

### PostConfirmation (Native → Google Linking + DB Migration)

```typescript
// Email/password user just verified
if (!username.startsWith("Google_")) {
  const googleUser = await findGoogleUserByEmail(email);
  if (googleUser) {
    const googleSub = googleUser.sub;
    await AdminLinkProviderForUser({
      DestinationUser: username, // Native user
      SourceUser: googleUser.Username,
    });
    // Migrate DB: Google sub → Native sub
    await User.update({ cognitoSub }, { where: { cognitoSub: googleSub } });
  }
}
// Google user login
else {
  const nativeUser = await findNativeUserByEmail(email);
  if (!nativeUser) {
    await User.upsert({ cognitoSub, email, name }); // First login
  }
  // If native user exists, skip (already linked)
}
```

### Google Callback Handler

```typescript
// Don't call User.upsert() here!
// PostConfirmation already handles database sync
console.log(`✅ Google authentication successful: ${payload.sub}`);
return tokens;
```

## Test Results (Verified Working ✅)

### Flow: Google First → Email/Password Later

1. Google login → Google sub `2a43924c...` saved to DB
2. Email signup + verify → Links + migrates DB to native sub `7a53b25c...`
3. Result: **1 DB record** with native sub ✅

### Flow: Email/Password First → Google Later

1. Email signup + verify → Native user created
2. Google login → PreSignUp links to native user
3. Result: **1 DB record** with native sub ✅

## Cognito Console (After Linking)

- **Native User** (`user@example.com`): Status `CONFIRMED`, has `identities` attribute with Google
- **Google_xxx User** (`Google_112266...`): Status `EXTERNAL_PROVIDER`
- Both exist, but Google logins authenticate as native user ✅

## Adding More Identity Providers (Facebook, Amazon, etc.)

### Implementation Pattern

1. Add provider to Cognito User Pool
2. Update `PreSignUp` to handle `Facebook_xxx`, `Amazon_xxx`, etc.
3. Update `PostConfirmation` to link these providers
4. **No database changes needed** - same flow applies

### Example: Adding Facebook

```typescript
// PreSignUp
if (username.startsWith("Facebook_")) {
  // Same logic as Google - find native user, link if verified
}

// PostConfirmation
if (username.startsWith("Facebook_")) {
  // Same logic as Google - check for native user, create/link
}
```

### Edge Cases to Handle

1. **Multiple providers before email verification**: If user signs in with Google AND Facebook before verifying email, you'll have 2 federated users. Solution: Link both to native user after verification.
2. **Email changes**: If user changes email in one provider, Cognito doesn't auto-sync. Solution: Add email update logic in your app.
3. **Provider-specific attributes**: Some providers return different attributes (phone, avatar, etc.). Solution: Map attributes in `AttributeMapping` in `serverless.yml`.
4. **Account takeover risk**: Always enforce email verification before linking to prevent hijacking. ✅ Already implemented.
5. **Provider deactivation**: If user deactivates Google account, they can still log in with email/password. ✅ Already handled.

### Checklist for New Providers

- [ ] Add identity provider in `serverless.yml` (CognitoUserPoolIdentityProvider)
- [ ] Update `PreSignUp` to detect new provider prefix (e.g., `Facebook_xxx`)
- [ ] Update `PostConfirmation` to handle new provider in both branches
- [ ] Test all 3 flows: Provider first → Email, Email first → Provider, Provider → Provider → Email
- [ ] Verify 1 DB record per user across all combinations

## Key Principles

- ✅ Never throw errors in Lambda triggers (breaks auth flow)
- ✅ Always link to verified native users only (security)
- ✅ Database uses native user's sub (consistency)
- ✅ PostConfirmation handles all database operations (no duplicates)
- ✅ Cognito automatically authenticates as linked user after linking
