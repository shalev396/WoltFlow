# Wolt Login Process

This document details how WoltFlow automates the Wolt.com login process through Google authentication.

## Login Process Overview

WoltFlow navigates through multiple steps to authenticate with Wolt using Google credentials:

1. Launch Chrome browser with remote debugging enabled
2. Navigate to Wolt.com
3. Click the login button
4. Select Google as the authentication method
5. Enter Google credentials
6. Handle two-factor authentication (if enabled)
7. Verify successful login
8. Take a screenshot of the logged-in state

## Technical Implementation

### Browser Automation Approach

WoltFlow uses a unique approach to browser automation:

```python
# Launch Chrome with remote debugging
chrome_process, temp_profile_dir = launch_fresh_chrome(debugging_port=9222)

# Connect to Chrome using Selenium
driver = connect_to_chrome(debugging_port=9222)

# Perform login operation
success = login_to_wolt(driver, email, password, totp_secret)
```

This method offers several advantages:

- Bypass bot detection (doesn't use ChromeDriver directly)
- More stable than traditional WebDriver approaches
- Works with modern websites that have anti-automation measures

### Human-Like Interaction

To avoid detection as automation, WoltFlow simulates human-like behavior:

```python
def random_sleep(min_seconds=1, max_seconds=3):
    """Sleep for a random amount of time to mimic human behavior"""
    time.sleep(random.uniform(min_seconds, max_seconds))

def human_type(element, text):
    """Type text like a human with random delays between keystrokes"""
    for char in text:
        element.send_keys(char)
        time.sleep(random.uniform(0.05, 0.2))
```

These functions add randomized delays between actions and keystrokes.

### Two-Factor Authentication

The application handles Google's 2FA using TOTP (Time-based One-Time Password):

```python
# Generate TOTP code
totp = pyotp.TOTP(clean_totp_secret)
code = totp.now()

# Enter code in 2FA field
totp_input.clear()
human_type(totp_input, code)
```

This allows fully automated login even with 2FA enabled.

### Step-by-Step Implementation

#### 1. Launching Chrome

```python
def launch_fresh_chrome(debugging_port=9222):
    # Create a unique profile directory
    temp_profile_dir = create_temp_profile()

    # Launch Chrome with special flags
    command = [
        chrome_path,
        f"--remote-debugging-port={debugging_port}",
        f"--user-data-dir={temp_profile_dir}",
        "--disable-blink-features=AutomationControlled",
        # Additional flags for stability
        "--no-sandbox",
        "--disable-dev-shm-usage"
    ]

    chrome_process = subprocess.Popen(command)
    return chrome_process, temp_profile_dir
```

#### 2. Finding and Clicking Elements

The application uses localization-aware selectors to work with different language interfaces:

```python
# Try Hebrew text first (כניסה = login)
login_buttons = driver.find_elements(By.XPATH, "//*[contains(text(), 'כניסה')]")

# Fall back to class-based selectors if not found
if not login_buttons:
    login_buttons = driver.find_elements(By.XPATH, "//button[contains(@class, 'LoginButton')]")
```

#### 3. Safe Clicking

To improve reliability, the application uses JavaScript for clicks:

```python
def safe_click(driver, element):
    # Scroll element into view
    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", element)
    # Click using JavaScript
    driver.execute_script("arguments[0].click();", element)
```

## Multi-User Processing

WoltFlow can process multiple users from a database:

```python
def process_user(user, session):
    """Run the login process for a single user"""
    chrome_process, temp_profile_dir = launch_fresh_chrome(debugging_port)
    driver = connect_to_chrome(debugging_port)

    # Perform login with user's credentials
    success = login_to_wolt(driver, user.gmail_email, user.gmail_password, user.totp_secret)

    # Update user status in the database
    update_user_status(session, user, "SUCCESS" if success else "FAILED")

    # Cleanup
    driver.quit()
    chrome_process.terminate()
    cleanup_temp_profiles()
```

## Error Handling

The application implements robust error handling:

1. Multiple selectors for finding UI elements
2. Fallback approaches when primary methods fail
3. Screenshot capture at key points for debugging
4. Exception handling and cleanup in all processes

## Troubleshooting

When login fails, you can:

1. Check screenshots in the `screenshots` directory
2. Examine log files for error messages
3. Run with `DEBUG_CHROME=1` for more detailed logs
