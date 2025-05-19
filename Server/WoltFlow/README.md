# WoltFlow - Local Runner

This version of WoltFlow is configured to run locally without AWS Lambda deployment.

## Setup

1. Install dependencies:

   ```
   pip install -r requirements.txt
   ```

2. Set up your database connection using environment variables in a `.env` file:

   ```
   DATABASE_URL=postgresql://username:password@hostname/database
   POSTGRES_USER=username
   POSTGRES_PASSWORD=password
   POSTGRES_DB=database
   POSTGRES_HOST=hostname
   POSTGRES_PORT=5432
   ```

3. Make sure Google Chrome is installed on your system.

## Running the Application

Run the application with default settings (processes all users with a 60-second interval):

```
python index.py
```

### Command Line Options

- Process a specific user:

  ```
  python index.py --user-id 1
  ```

- Specify a different database URL:

  ```
  python index.py --db-url "postgresql://username:password@hostname/database"
  ```

- Change the interval between processing users:
  ```
  python index.py --interval 30  # 30 seconds between users
  ```

## Database Configuration

The application requires a PostgreSQL database with the following schema:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    gmail_email VARCHAR NOT NULL,
    gmail_password VARCHAR NOT NULL,
    totp_secret VARCHAR,
    last_login VARCHAR,
    login_status VARCHAR,
    cibus_email VARCHAR,
    cibus_password VARCHAR,
    cibus_company VARCHAR,
    gift_amount VARCHAR,
    email VARCHAR,
    password VARCHAR
);
```

Add users to the database with:

```sql
INSERT INTO users (
    gmail_email,
    gmail_password,
    totp_secret
) VALUES (
    'your.gmail@gmail.com',
    'your_password',
    'YOUR_TOTP_SECRET'
);
```

## Troubleshooting

- Check the `woltflow.log` file for detailed logs
- Verify Chrome is installed and accessible
- Ensure your database connection string is correct
- Screenshots of the login process are saved in the `screenshots` directory
