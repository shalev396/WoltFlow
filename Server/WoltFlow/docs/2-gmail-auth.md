# Gmail Authentication Flow

## How WoltFlow Handles Google Authentication

The WoltFlow script uses a sophisticated approach to authenticate with Google while avoiding detection mechanisms that might block automated login attempts. Here's how the process works:

## Authentication Process

### 1. Initial Login Steps

1. The script connects to a Chrome instance using remote debugging protocol
2. It navigates to Wolt.com and clicks the login button
3. It selects the Google login option, which opens Google's authentication flow
4. It enters the email address and clicks Next
5. It enters the password and clicks Next

### 2. Two-Factor Authentication (2FA)

After entering credentials, the script handles Google's 2FA verification:

1. It looks for the "Another way" (דרך אחרת) option and clicks it
2. It selects the "Google Authenticator" verification option
3. It generates a TOTP code using the provided secret key
4. It enters the code in the verification field
5. It submits the code to complete authentication

## Anti-Detection Techniques

To avoid being detected as an automated script, WoltFlow implements several key strategies:

### Chrome Remote Debugging

Instead of using the standard WebDriver approach, the script:

- Launches a regular Chrome browser with remote debugging enabled
- Connects to this browser using Selenium's remote debugging capabilities
- Appears to websites as a regular Chrome browser, not a WebDriver instance

### Human-Like Behavior

The script simulates human behavior by:

- Adding random delays between actions (`random_sleep`)
- Typing text character by character with varied timing (`human_type`)
- Using JavaScript for clicks instead of WebDriver's click method
- Scrolling elements into view before interacting with them

### Multi-Language Support

The script handles both English and Hebrew UI elements to ensure it works regardless of the interface language:

- Looks for Hebrew text like "כניסה" (login) and "גוגל" (Google)
- Falls back to English text and class-based selectors if Hebrew elements aren't found

## Handling Login Edge Cases

### Manual Intervention

If automated login fails, the script:

1. Keeps the browser open for manual intervention
2. Waits for up to 90 seconds for manual login completion
3. Periodically checks for login success indicators
4. Takes screenshots to document the process

### Login Verification

The script confirms successful login by checking for these indicators:

- User avatar elements
- User menu buttons
- Profile buttons
- Text containing "Account" or "חשבון" (Hebrew for Account)

## Security Considerations

- Credentials should be stored securely, preferably as environment variables
- The TOTP secret is sensitive information and should be protected
- Temporary Chrome profiles are used to isolate each session
- Cookies are saved after successful login for potential reuse
