# Database Integration

This document explains how WoltFlow integrates with PostgreSQL to manage multiple user credentials and login sessions.

## Database Schema

WoltFlow uses SQLAlchemy to define and interact with the database schema:

```python
from sqlalchemy import create_engine, Column, Integer, String, MetaData, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

class User(Base):
    """User model for SQLAlchemy"""
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    gmail_email = Column(String, nullable=False)
    gmail_password = Column(String, nullable=False)
    totp_secret = Column(String, nullable=True)
    last_login = Column(String, nullable=True)
    login_status = Column(String, nullable=True)
```

The schema includes:

- `id` - Primary key
- `gmail_email` - Google account email used for login
- `gmail_password` - Google account password
- `totp_secret` - TOTP secret for two-factor authentication
- `last_login` - Timestamp of last login attempt
- `login_status` - Status of the last login attempt (SUCCESS/FAILED/ERROR)

## Database Connection

The application connects to PostgreSQL using a connection string:

```python
def create_database_connection(db_url=None):
    """Create SQLAlchemy engine and session"""
    if db_url is None:
        # Default PostgreSQL connection string
        db_url = os.getenv('DATABASE_URL', 'postgresql://postgres:postgres@localhost/woltflow')

    engine = create_engine(db_url)

    # Create tables if they don't exist
    Base.metadata.create_all(engine)

    # Create session
    Session = sessionmaker(bind=engine)
    return Session()
```

The connection URL can be provided through:

1. Command line argument (`--db-url`)
2. Environment variable (`DATABASE_URL`)
3. Default fallback value

## Lambda Function Integration

WoltFlow uses two Lambda functions to process user logins:

1. **Initializer Lambda (handler.py)**: A main Lambda function that uses a hardcoded user ID to start the process
2. **Worker Lambda (index.py)**: A worker Lambda function that processes a specific user's login

### Workflow

1. The initializer Lambda is triggered (e.g., by a scheduled event)
2. It retrieves a specific user from the PostgreSQL database
3. It processes that user's login directly or triggers a worker Lambda for each user

### Initializer Lambda (handler.py)

The handler.py file contains the AWS Lambda entry point for the initializer:

```python
def run(event, context):
    """AWS Lambda handler function"""
    current_time = datetime.datetime.now().time()
    logger.info("WoltFlow process started at " + str(current_time))

    # Parse user_id from event or use default
    user_id = 1  # Default user ID
    if event and isinstance(event, dict) and 'user_id' in event:
        user_id = event['user_id']

    # Connect to PostgreSQL database
    db_url = os.getenv('DATABASE_URL')
    engine = create_engine(db_url)
    Session = sessionmaker(bind=engine)
    session = Session()

    # Get user from database
    user = session.query(User).filter(User.id == user_id).first()

    # Process the user
    # ...
```

### Worker Lambda (index.py)

The `process_user_lambda` function in index.py processes a specific user:

```python
def process_user_lambda(event, context):
    """AWS Lambda handler for processing a single user"""
    # Extract user_id from event
    user_id = event['user_id']

    # Connect to database
    session = create_database_connection()

    # Get user from database
    user = session.query(User).filter(User.id == user_id).first()

    # Process the user
    success = process_user(user, session)

    # Return result
    return {
        'statusCode': 200 if success else 500,
        'body': json.dumps({
            'message': f"User {user_id} processed {'successfully' if success else 'with errors'}",
            'success': success,
            'user_id': user_id
        })
    }
```

## User Management

### Retrieving Users

WoltFlow can retrieve all users or a specific user by ID:

```python
# Get all users
users = session.query(User).all()

# Get a specific user
user = session.query(User).filter(User.id == user_id).first()
```

### Updating User Status

After each login attempt, the application updates the user's status:

```python
def update_user_status(session, user, status, error=None):
    """Update user's login status and timestamp"""
    user.last_login = datetime.now().isoformat()
    user.login_status = status if error is None else f"{status}: {error}"
    session.commit()
```

## Processing Multiple Users

The batch processing feature in `index.py` enables processing all users in sequence:

```python
# Process each user
for index, user in enumerate(users):
    logger.info(f"Processing user {index+1} of {len(users)}")
    process_user(user, session)

    # Wait between users if interval is specified
    if args.interval > 0 and index < len(users) - 1:
        logger.info(f"Waiting {args.interval} seconds before next user...")
        time.sleep(args.interval)
```

## Adding Users to the Database

### SQL Method

You can add users directly with SQL:

```sql
INSERT INTO users (gmail_email, gmail_password, totp_secret)
VALUES ('your.email@gmail.com', 'your_password', 'YOUR_TOTP_SECRET');
```

### Python Method

For programmatic access, you can create users with Python:

```python
def add_user(session, email, password, totp_secret=None):
    """Add a new user to the database"""
    new_user = User(
        gmail_email=email,
        gmail_password=password,
        totp_secret=totp_secret
    )
    session.add(new_user)
    session.commit()
    return new_user
```

## Migration from JSON to PostgreSQL

To migrate users from db.json to PostgreSQL:

```python
import json
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from your_module import User

def migrate_from_json(json_path, session):
    """Migrate users from a JSON file to PostgreSQL"""
    with open(json_path, 'r') as f:
        users_data = json.load(f)

    for user_data in users_data:
        # Check if user already exists
        existing = session.query(User).filter(
            User.gmail_email == user_data['gmail_email']
        ).first()

        if not existing:
            new_user = User(
                gmail_email=user_data['gmail_email'],
                gmail_password=user_data['gmail_password'],
                totp_secret=user_data.get('totp_secret')
            )
            session.add(new_user)

    session.commit()

# Example usage
db_url = os.getenv('DATABASE_URL', 'postgresql://postgres:postgres@localhost/woltflow')
engine = create_engine(db_url)
Session = sessionmaker(bind=engine)
session = Session()

migrate_from_json('db.json', session)
```

## Environment Configuration

WoltFlow uses a `.env` file to configure database connections and other settings:

```
# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@localhost/woltflow

# Docker Compose PostgreSQL Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=woltflow
```

## Security Considerations

Important security recommendations for production use:

1. **Password Encryption**: Store passwords encrypted, not in plaintext
2. **Restricted Access**: Limit database access to authorized users
3. **Connection Pooling**: Use connection pooling for better performance
4. **SSL**: Enable SSL connections to PostgreSQL
5. **Separate Credentials**: Use a separate database user with limited permissions
6. **Regular Backups**: Implement regular database backups
