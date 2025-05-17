# WoltFlow Setup Guide

## Prerequisites

- Python 3.7 or higher
- Google Chrome browser installed
- Google account with 2FA enabled (TOTP authenticator app)
- Git (optional, for cloning the repository)

## Installation

1. Clone or download the repository:

   ```
   git clone https://github.com/yourusername/WoltFlow.git
   cd WoltFlow/Server/WoltFlow
   ```

2. Create a virtual environment (recommended):

   ```
   # Windows
   python -m venv .venv
   .venv\Scripts\activate

   # macOS/Linux
   python -m venv .venv
   source .venv/bin/activate
   ```

3. Install required dependencies:
   ```
   pip install -r requirements.txt
   ```

## Configuration

### Setting Up Credentials

You have two options for providing your Google credentials:

#### Option 1: Using a secret.json file (development only)

Create a `secret.json` file in the `Server/WoltFlow` directory with the following structure:

```json
{
  "email": "your.google.email@gmail.com",
  "password": "your_google_password",
  "totp": "YOUR_TOTP_SECRET_KEY"
}
```

Notes:

- The TOTP secret key is the base32 secret provided when you set up Google Authenticator
- Make sure to remove any spaces from the TOTP secret
- Never commit this file to version control (it's included in .gitignore)

#### Option 2: Using environment variables (recommended for security)

Set the following environment variables:

```bash
# For Windows PowerShell
$env:GOOGLE_EMAIL="your.google.email@gmail.com"
$env:GOOGLE_PASSWORD="your_google_password"

# For Linux/macOS
export GOOGLE_EMAIL="your.google.email@gmail.com"
export GOOGLE_PASSWORD="your_google_password"
```

The TOTP secret still needs to be in the `secret.json` file:

```json
{
  "totp": "YOUR_TOTP_SECRET_KEY"
}
```

### Obtaining Your TOTP Secret

If you already have Google 2FA set up but don't have your TOTP secret:

1. Visit your Google Account Security settings
2. Temporarily disable 2FA
3. Re-enable 2FA and choose "Authenticator app"
4. When shown the QR code, select "Can't scan it?"
5. Copy the displayed secret key
6. Continue setup in your authenticator app

## Temporary Directories

The script creates several temporary directories:

- `temp_profile_*`: Chrome user profiles (created new for each run)
- `screenshots`: Diagnostic screenshots during the login process
- `cookies`: Saved cookies after successful login

These can be safely deleted between runs if needed.

## Troubleshooting

### Chrome Driver Issues

- Ensure Chrome is installed in a standard location, or modify the `get_chrome_path()` function
- Check if the debugging port (9222) is already in use by another process

### Login Failures

- Check the screenshots in the `screenshots` directory to identify which step failed
- Verify that your credentials are correct
- If Google detects suspicious activity, you might need to manually approve the login

### TOTP Authentication Problems

- Ensure your TOTP secret is correctly formatted (no spaces, uppercase)
- Check that your computer's time is accurately synchronized
