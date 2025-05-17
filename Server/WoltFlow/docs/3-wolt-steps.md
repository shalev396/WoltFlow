# Wolt Login Process

This document outlines the specific steps involved in the Wolt login process that the WoltFlow script automates.

## Overview of Wolt Login Flow

Wolt.com uses a multi-step login process that includes third-party authentication (Google). The WoltFlow script navigates this process in a way that mimics human behavior to avoid anti-automation detection.

## Detailed Login Steps

### 1. Navigate to Wolt

```python
driver.get("https://wolt.com/he/isr")
```

The script starts by navigating to the Israeli version of Wolt. This can be modified to target other regional Wolt sites as needed.

### 2. Find and Click Login Button

The script looks for the login button using various selectors, with priority given to the Hebrew text "כניסה" (Login):

```python
login_buttons = driver.find_elements(By.XPATH, "//*[contains(text(), 'כניסה')]")
```

If not found, it tries alternative approaches:

- Looks for buttons with the "LoginButton" class
- Falls back to examining all buttons on the page

### 3. Select Google Login Option

After clicking the login button, the script looks for the Google login option using the Hebrew text "גוגל" (Google):

```python
google_buttons = driver.find_elements(By.XPATH, "//*[contains(text(), 'גוגל')]")
```

It also tries alternate selectors like:

- Buttons with the "SocialButton" class
- Elements containing "Google" or "google" text or class attributes

### 4. Handle Google Authentication

The script then proceeds with the Google authentication flow as detailed in the [Gmail Auth](2-gmail-auth.md) document.

### 5. Return to Wolt

After completing Google authentication, the script:

1. Checks if multiple browser windows/tabs are open
2. Switches back to the main Wolt window if necessary
3. Waits for login to complete (up to 90 seconds)

### 6. Verify Successful Login

The script checks for several indicators that confirm successful login:

```python
logged_in_indicators = [
    "//div[contains(@class, 'UserAvatar')]",
    "//button[contains(@class, 'UserMenuButton')]",
    "//div[contains(@class, 'ProfileButton')]",
    "//*[contains(text(), 'Account')]",
    "//*[contains(text(), 'חשבון')]"  # Hebrew for "Account"
]
```

If any of these elements are found, the login is considered successful.

### 7. Save Cookies and Local Storage

Upon successful login, the script saves cookies and localStorage data for potential future use:

```python
def save_cookies(driver):
    # Save cookies
    with open(os.path.join(cookies_dir, 'wolt_cookies.json'), 'w') as f:
        json.dump(driver.get_cookies(), f)

    # Save localStorage
    local_storage = driver.execute_script("return Object.keys(localStorage).reduce((obj, k) => { obj[k] = localStorage.getItem(k); return obj }, {})")
    with open(os.path.join(cookies_dir, 'wolt_local_storage.json'), 'w') as f:
        json.dump(local_storage, f)
```

This data can potentially be used for maintaining sessions or analyzing authentication tokens.

## Diagnostic Screenshots

Throughout the process, the script captures screenshots at key points:

- Initial Wolt homepage
- After clicking login button
- After clicking Google button
- After entering email
- After entering password
- Before and after 2FA entry
- After 2FA submission
- Final login state (success or failure)

These screenshots are saved in the `screenshots` directory and provide a visual record of each step in the process, which is valuable for debugging issues.

## Error Handling

The script includes robust error handling throughout the Wolt login process:

- Multiple selector options for finding UI elements
- Fallback approaches when primary methods fail
- Clear logging of each step and any failures
- Screenshot capture at failure points
- Support for manual intervention when needed

This multi-layered approach ensures the login process completes successfully even when encountering minor UI changes or unexpected elements.
