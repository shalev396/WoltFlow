# Setup and Requirements

This guide explains how to set up WoltFlow and install all required dependencies.

## Prerequisites

- Python 3.9 or higher
- PostgreSQL database (AWS RDS recommended for production use)
- Google Chrome browser (or Linux Chrome in Docker)
- Google account with 2FA enabled (TOTP authenticator app)
- AWS account (for deployment to Lambda)

## Installation

### 1. Clone or download the repository

```bash
git clone https://github.com/yourusername/WoltFlow.git
cd WoltFlow/Server/WoltFlow
```

### 2. Create a virtual environment (recommended)

```bash
# Windows
python -m venv .venv
.venv\Scripts\activate

# macOS/Linux
python -m venv .venv
source .venv/bin/activate
```

### 3. Install required dependencies

```bash
pip install -r requirements.txt
```

## Database Configuration

### PostgreSQL Setup

1. Install PostgreSQL if you're running locally, or use AWS RDS:

   ```bash
   # Debian/Ubuntu
   sudo apt install postgresql postgresql-contrib

   # macOS with Homebrew
   brew install postgresql

   # Windows
   # Download from https://www.postgresql.org/download/windows/
   ```

2. Create a database and user:

   ```sql
   CREATE DATABASE woltflow;
   CREATE USER woltuser WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE woltflow TO woltuser;
   GRANT ALL PRIVILEGES ON SCHEMA public TO woltuser;
   ```

3. Configure the database connection in your `.env` file:

   ```
   # The test_local.py script will help you create/edit this file
   python test_local.py
   ```

   Or manually set:

   ```bash
   # Unix/macOS
   export DATABASE_URL="postgresql://woltuser:your_password@localhost/woltflow"

   # Windows PowerShell
   $env:DATABASE_URL="postgresql://woltuser:your_password@localhost/woltflow"
   ```

### Database Schema

The PostgreSQL schema will be created automatically by SQLAlchemy with these fields:

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

### Adding Users to the Database

You can add users manually using SQL:

```sql
INSERT INTO users (
    gmail_email,
    gmail_password,
    totp_secret,
    cibus_email,
    cibus_password,
    cibus_company,
    gift_amount,
    email,
    password
) VALUES (
    'your.email@gmail.com',
    'your_password',
    'YOUR_TOTP_SECRET',
    'cibus_email@example.com',
    'cibus_password',
    'Company Name',
    '35',
    'general_email@example.com',
    'general_password'
);
```

## Local Testing

Test your configuration before deploying:

```bash
python test_local.py
```

This script will:

1. Create/verify your `.env` file
2. Test the database connection
3. Optionally test the Wolt login flow

## AWS Deployment

Deploy to AWS Lambda with:

```bash
python run_serverless.py
```

This deploys two Lambda functions:

- `initializeAutomation`: Runs daily at 13:00 Israel time
- `processUser`: Processes a specific user

## Chrome Configuration

### Local Chrome

The application will attempt to find Chrome installed on your system automatically.

### Docker Chrome

When running in Docker, the container includes a Linux version of Chrome. No additional setup is needed.

## Obtaining Your TOTP Secret

If you already have Google 2FA set up but don't have your TOTP secret:

1. Visit your Google Account Security settings
2. Temporarily disable 2FA
3. Re-enable 2FA and choose "Authenticator app"
4. When shown the QR code, select "Can't scan it?"
5. Copy the displayed secret key

## Configuration Options

### Environment Variables

- `DATABASE_URL` - PostgreSQL connection string (required)

### Command Line Options for Local Testing

```bash
python test_local.py --help
```

Available options:

- `--skip-env-check` - Skip loading .env file
