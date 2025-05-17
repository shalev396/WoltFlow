# WoltFlow Documentation

Welcome to the WoltFlow documentation. This guide provides detailed information about the WoltFlow project, which automates the Wolt.com login process using Google authentication.

## Documentation Structure

This documentation is organized into the following sections:

1. [Setup Guide](1-setup.md) - Installation and configuration instructions
2. [Gmail Authentication](2-gmail-auth.md) - Details on how the Google login process works
3. [Wolt Login Steps](3-wolt-steps.md) - Step-by-step breakdown of the Wolt login process
4. [AWS Lambda Deployment](5-aws-lambda.md) - Instructions for deploying to AWS Lambda

## Project Overview

WoltFlow is an automation solution that:

- Uses Chrome's remote debugging protocol for reliable browser automation
- Automates the Wolt.com login process via Google authentication
- Handles two-factor authentication (TOTP)
- Incorporates anti-detection measures
- Saves session data for potential future use

## Key Features

- **Chrome Remote Debugging**: Uses a real Chrome instance instead of a WebDriver-controlled browser, making it more resistant to anti-bot detection
- **Human-Like Interaction**: Simulates human behavior with random delays and natural typing patterns
- **Multi-Language Support**: Works with both English and Hebrew UI elements
- **Diagnostic Screenshots**: Captures visual records of each step for debugging
- **Robust Error Handling**: Provides multiple fallback options and clear error reporting
- **Serverless Deployment**: Can be deployed as an AWS Lambda function

## Quick Start

1. Install required dependencies:

   ```
   pip install -r requirements.txt
   ```

2. Configure your credentials (see [Setup Guide](1-setup.md))

3. Run the login script:
   ```
   python wolt_login.py
   ```

## Project Structure

```
WoltFlow/
├── Server/
│   └── WoltFlow/
│       ├── docs/                # Documentation
│       ├── screenshots/         # Diagnostic screenshots (created at runtime)
│       ├── cookies/             # Saved session data (created at runtime)
│       ├── wolt_login.py        # Main script
│       ├── serverless.yml       # AWS Lambda configuration
│       ├── handler.py           # Lambda handler
│       └── requirements.txt     # Python dependencies
```

## Contributing

Contributions to WoltFlow are welcome. Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
