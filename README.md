# WoltFlow

An automated solution for Wolt.com login automation using Selenium and Chrome remote debugging.

## Overview

WoltFlow automates the process of logging into Wolt.com using Google authentication with two-factor authentication (2FA) support. The script uses Chrome's remote debugging protocol to launch a browser that Selenium can control, providing a more reliable experience than traditional WebDriver approaches.

## Features

- Launches a fresh Chrome instance with a temporary profile for clean sessions
- Handles the complete Wolt login flow via Google authentication
- Supports two-factor authentication (TOTP)
- Human-like interaction (random delays, natural typing)
- Multi-language support (handles both English and Hebrew UI elements)
- Saves cookies and localStorage after successful login
- Works around anti-automation measures

## Requirements

- Python 3.7+
- Google Chrome browser installed
- Python packages (see requirements.txt):
  - selenium
  - undetected-chromedriver
  - selenium-stealth
  - pyotp

## Setup

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/WoltFlow.git
   cd WoltFlow
   ```

2. Install dependencies:

   ```
   pip install -r Server/WoltFlow/requirements.txt
   ```

3. Configure credentials using one of these methods:

   **Option A: Use a `secret.json` file in the `Server/WoltFlow` directory:**

   ```json
   {
     "totp": "YOUR_TOTP_SECRET_KEY",
     "email": "YOUR_GOOGLE_EMAIL",
     "password": "YOUR_GOOGLE_PASSWORD"
   }
   ```

   **Option B: Set environment variables (more secure):**

   ```bash
   # For Linux/macOS
   export GOOGLE_EMAIL="your.email@gmail.com"
   export GOOGLE_PASSWORD="your_password"

   # For Windows PowerShell
   $env:GOOGLE_EMAIL="your.email@gmail.com"
   $env:GOOGLE_PASSWORD="your_password"
   ```

   > **Note:** The TOTP secret key should be obtained from your Google Authenticator or other 2FA app.

## Usage

Run the login script:

```bash
cd Server/WoltFlow
python wolt_login.py
```

The script will:

1. Launch a new Chrome browser with a fresh profile
2. Navigate to Wolt.com
3. Click the login button
4. Select Google login
5. Enter your credentials
6. Handle 2FA verification
7. Save cookies and localStorage after successful login

## How It Works

1. **Chrome Launch**: The script launches Chrome with remote debugging enabled and a temporary profile.
2. **Selenium Connection**: It connects to Chrome using the remote debugging protocol.
3. **Login Process**:
   - Navigates to Wolt
   - Finds and clicks login buttons
   - Enters Google credentials
   - Handles the "another way" verification flow
   - Generates and enters TOTP code
   - Verifies successful login
4. **Cookie Saving**: After successful login, it saves cookies and localStorage for future use.

## Troubleshooting

- **Screenshot Diagnostics**: The script saves screenshots at each step in the `Server/WoltFlow/screenshots` directory to help with debugging.
- **Chrome Not Found**: If Chrome isn't detected automatically, edit the `get_chrome_path()` function to include your Chrome installation path.
- **Login Failures**: Check the screenshot files to see where the process failed.

## Security Considerations

- Store credentials securely; consider using environment variables over the secret.json file
- The temporary profile is created in the script directory and should be cleaned up when no longer needed
- Be careful not to expose your 2FA secret key
- Never commit your secret.json file to version control (add it to .gitignore)

## License

[MIT License](LICENSE)
