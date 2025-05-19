# WoltFlow

An automated solution for Wolt.com login automation using Selenium, Chrome, and PostgreSQL.

## Overview

WoltFlow automates the process of logging into Wolt.com using Google authentication with two-factor authentication (2FA) support. The script uses Chrome's remote debugging protocol to launch a browser that Selenium can control, providing a reliable experience than traditional WebDriver approaches. User credentials are stored in a PostgreSQL database for multi-user support.

## Features

- Launches a fresh Chrome instance with a temporary profile for clean sessions
- Handles the complete Wolt login flow via Google authentication
- Supports two-factor authentication (TOTP)
- Human-like interaction (random delays, natural typing)
- Multi-language support (handles both English and Hebrew UI elements)
- PostgreSQL database integration for user credential storage
- AWS Lambda deployment with Serverless Framework
- Docker containerization for consistent execution environment

## Requirements

- Python 3.9+
- Google Chrome browser installed
- PostgreSQL database
- AWS account (for Lambda deployment)
- Python packages (see requirements.txt)

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

3. Set up the PostgreSQL database:

   ```
   cd Server/WoltFlow
   python test_local.py
   ```

   This will:

   - Create a `.env` file (edit this with your actual configuration)
   - Test your database connection
   - Verify the required schema exists

4. Test the Wolt login process:

   ```
   # The test_local.py script will prompt to test Wolt login if the database test succeeds
   python test_local.py
   ```

## Deployment to AWS

### Docker-based AWS Lambda Deployment (Recommended)

The recommended approach for deploying to AWS Lambda uses Docker to package Chrome and all dependencies:

```bash
# Windows PowerShell
cd Server/WoltFlow
./deploy.ps1

# Linux/macOS
cd Server/WoltFlow
chmod +x deploy.sh
./deploy.sh
```

This deployment creates two Lambda functions:

1. `initializeAutomation`: Scheduled to run daily at 13:00 Israel time
2. `processUser`: Processes a specific user from the database

See the [Deployment Documentation](Server/WoltFlow/docs/deployment.md) for detailed instructions.

### Manual Deployment

Alternatively, you can use the Serverless Framework directly:

```bash
cd Server/WoltFlow
serverless deploy
```

## Database Schema

The PostgreSQL database stores user credentials with the following fields:

- `id` - Primary key
- `gmail_email` - Google account email
- `gmail_password` - Google account password
- `totp_secret` - TOTP secret key for two-factor authentication
- `last_login` - Timestamp of last login attempt
- `login_status` - Status of last login attempt
- `cibus_email` - Cibus account email
- `cibus_password` - Cibus account password
- `cibus_company` - Cibus company name
- `gift_amount` - Gift amount value
- `email` - General purpose email
- `password` - General purpose password

## Security Considerations

- Store credentials securely in a properly configured PostgreSQL database
- Ensure your DATABASE_URL uses SSL/TLS for secure connections
- Configure proper AWS security groups to limit database access
- Use AWS IAM roles to control access to the Lambda functions
- Never commit your `.env` file to version control (add it to .gitignore)

## License

[MIT License](LICENSE)
