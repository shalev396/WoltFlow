# WoltFlow Documentation

Welcome to the WoltFlow documentation. This guide provides detailed information about the WoltFlow project, an automated solution for Wolt.com login using Google Authentication with PostgreSQL database integration.

## Overview

WoltFlow automates the process of logging into Wolt.com using Google authentication with two-factor authentication (2FA) support. The application uses Chrome's remote debugging protocol to launch and control a browser, providing a reliable experience for maintaining active sessions. User credentials are stored in a PostgreSQL database for multi-user support and deployment on AWS Lambda.

## Features

- Automated login to Wolt.com via Google authentication
- Support for two-factor authentication (TOTP)
- Human-like interaction with random delays and natural typing
- Multi-language support (handles both English and Hebrew interfaces)
- PostgreSQL database integration for user credential management
- Docker containerization for consistent execution
- AWS Lambda deployment with Serverless Framework
- Comprehensive logging and error handling

## Documentation Sections

- [Setup and Requirements](setup.md) - Installation and dependencies
- [Wolt Login Process](wolt-login.md) - How the login automation works
- [Database Integration](database.md) - Working with PostgreSQL user data
- [Docker Deployment](docker.md) - Running in Docker containers
- [Serverless Deployment](deployment.md) - AWS Lambda deployment options

## Quick Start

1. Install dependencies:

   ```
   pip install -r requirements.txt
   ```

2. Set up your database connection:

   ```
   # Create/configure .env file and test connection
   python test_local.py
   ```

3. Test the login flow:

   ```
   # Choose 'y' when prompted to test Wolt login
   python test_local.py
   ```

4. Deploy to AWS:
   ```
   python run_serverless.py
   ```

## Project Structure

```
WoltFlow/
├── Server/
│   └── WoltFlow/
│       ├── docs/                # Documentation
│       ├── screenshots/         # Login screenshots (created at runtime)
│       ├── chrome_profiles/     # Browser profiles (created at runtime)
│       ├── wolt_login.py        # Core login automation logic
│       ├── index.py             # Main entry point with PostgreSQL support
│       ├── handler.py           # AWS Lambda handler
│       ├── test_local.py        # Local testing script
│       ├── run_serverless.py    # AWS deployment script
│       ├── serverless.yml       # Serverless Framework configuration
│       ├── Dockerfile           # Docker configuration
│       └── requirements.txt     # Python dependencies
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

## Development and Contribution

Contributions to WoltFlow are welcome. Please feel free to submit a Pull Request with improvements or bug fixes.

## License

This project is licensed under the MIT License.
