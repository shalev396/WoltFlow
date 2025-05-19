# Serverless Deployment

This document explains how to deploy WoltFlow as a serverless application using AWS Lambda.

## Docker-based Lambda Deployment (Recommended)

The recommended approach for deploying WoltFlow to AWS Lambda is using Docker containers. This allows packaging the Chrome browser and all dependencies into a single deployable unit.

### Prerequisites for Docker Deployment

- AWS account with appropriate permissions
- [AWS CLI](https://aws.amazon.com/cli/) installed and configured
- [Docker](https://www.docker.com/) installed
- [Serverless Framework](https://www.serverless.com/) installed
- Chrome executable in the `Server/WoltFlow/chrome` directory

### Docker Deployment Process

1. **Set up environment variables**

   Create a `.env` file with your database credentials:

   ```
   DATABASE_URL=postgresql://username:password@host/database
   POSTGRES_USER=username
   POSTGRES_PASSWORD=password
   POSTGRES_DB=database
   POSTGRES_HOST=host
   POSTGRES_PORT=5432
   ```

2. **Deploy using provided script**

   On Windows (PowerShell):

   ```
   cd Server/WoltFlow
   .\deploy.ps1
   ```

   On Linux/macOS:

   ```
   cd Server/WoltFlow
   chmod +x deploy.sh
   ./deploy.sh
   ```

   The script will:

   - Check for dependencies and environment variables
   - Build Docker images for both Lambda functions
   - Push images to AWS ECR
   - Deploy the Lambda functions via Serverless Framework

3. **Verify Deployment**

   After deployment completes, check the AWS Lambda console to ensure:

   - Both functions (`initializeAutomation` and `processUser`) are properly deployed
   - `initializeAutomation` has a CloudWatch Events trigger for daily execution
   - The HTTP endpoint is available for manual triggering

### Lambda Function Architecture

The deployment creates two separate Lambda functions:

1. **initializeAutomation**

   - Entry point: `handler.run`
   - Triggers: CloudWatch Events (cron scheduler) and HTTP endpoint
   - Purpose: Runs daily at 13:00 Israel time (10:00 UTC)
   - Function: Retrieves user information and invokes the `processUser` function

2. **processUser**
   - Entry point: `index.process_user_lambda`
   - Triggers: Invoked by the `initializeAutomation` function
   - Purpose: Performs the actual login automation for a specific user
   - Function: Launches Chrome, performs login process, updates user status

### Docker Container Contents

Each Lambda function uses a Docker container with:

- Base image: Amazon Linux with Python 3.9
- Chrome browser installed from local `chrome` directory
- Required Linux libraries for Chrome operation
- Python dependencies installed from `requirements.txt`
- Temporary directories configured for Chrome profiles and screenshots

## Serverless Overview

Serverless deployment allows WoltFlow to run without maintaining dedicated servers, with automatic scaling and pay-as-you-go pricing.

## AWS Lambda Deployment

WoltFlow can be deployed to AWS Lambda using the Serverless Framework or direct AWS deployment.

### Prerequisites

- AWS account with appropriate permissions
- [AWS CLI](https://aws.amazon.com/cli/) installed and configured
- [Serverless Framework](https://www.serverless.com/) (optional)

### Deployment Options

There are two main approaches for deploying WoltFlow to AWS Lambda:

1. **Direct Lambda deployment** with a custom container image
2. **Serverless Framework deployment** using a configuration file

## Custom Container Approach

The preferred method is to deploy WoltFlow as a container image to Lambda.

### 1. Create an ECR Repository

```bash
aws ecr create-repository --repository-name woltflow
```

### 2. Build and Push the Docker Image

```bash
# Get ECR login credentials
aws ecr get-login-password | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Build the image
docker build -t woltflow .

# Tag the image
docker tag woltflow:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/woltflow:latest

# Push to ECR
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/woltflow:latest
```

### 3. Create Lambda Function

```bash
aws lambda create-function \
  --function-name woltflow \
  --package-type Image \
  --code ImageUri=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/woltflow:latest \
  --role arn:aws:iam::$AWS_ACCOUNT_ID:role/lambda-execution-role \
  --timeout 900 \
  --memory-size 2048 \
  --environment Variables="{DATABASE_URL=postgresql://user:password@host/woltflow}"
```

## Serverless Framework Approach

For a more managed deployment experience, use the Serverless Framework.

### 1. Create serverless.yml Configuration

```yaml
service: woltflow

provider:
  name: aws
  runtime: python3.9
  region: us-east-1
  memorySize: 2048
  timeout: 900
  environment:
    DATABASE_URL: ${env:DATABASE_URL}

functions:
  login:
    handler: handler.run
    events:
      # Run once per day at 6 AM
      - schedule: cron(0 6 * * ? *)
```

### 2. Deploy with Serverless Framework

```bash
serverless deploy
```

## Lambda Handler

The `handler.py` file contains the AWS Lambda entry point:

```python
import json
import datetime
import logging
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from index import User, process_user

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def run(event, context):
    """AWS Lambda handler function"""
    current_time = datetime.datetime.now().isoformat()
    logger.info(f"WoltFlow serverless process started at {current_time}")

    try:
        # Connect to database
        db_url = os.environ.get('DATABASE_URL')
        if not db_url:
            raise ValueError("DATABASE_URL environment variable is required")

        engine = create_engine(db_url)
        Session = sessionmaker(bind=engine)
        session = Session()

        # Get users to process
        user_id = event.get('user_id') if event and isinstance(event, dict) else None

        if user_id:
            # Process specific user
            user = session.query(User).filter(User.id == user_id).first()
            if not user:
                return {
                    'statusCode': 404,
                    'body': json.dumps({
                        'message': f"User with ID {user_id} not found",
                        'timestamp': current_time
                    })
                }
            users = [user]
        else:
            # Process all users
            users = session.query(User).all()

        logger.info(f"Processing {len(users)} users")

        results = []
        for user in users:
            success = process_user(user, session)
            results.append({
                'user_id': user.id,
                'success': success,
                'timestamp': datetime.datetime.now().isoformat()
            })

        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': f"Processed {len(users)} users",
                'results': results,
                'timestamp': current_time
            })
        }

    except Exception as e:
        logger.exception(f"Error in Lambda handler: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({
                'message': f"Error: {str(e)}",
                'timestamp': current_time
            })
        }
```

## Environment Variables

Set these environment variables in the Lambda configuration:

- `DATABASE_URL`: PostgreSQL connection string
- `DEBUG_CHROME`: Set to `1` to enable verbose Chrome debugging

## Important Considerations for Lambda

### 1. Memory and Timeout

AWS Lambda has limitations:

- Maximum memory: 10GB (select at least 2GB for Chrome)
- Maximum execution time: 15 minutes (900 seconds)

### 2. Network Configuration

For database access, configure:

- VPC settings with appropriate subnets
- Security groups allowing outbound database connections

### 3. Chrome in Lambda

The containerized approach includes Chrome, but be aware:

- Chrome runs headless with Xvfb
- Use the `--no-sandbox` flag for Chrome
- Increase `/tmp` directory allocation (`ephemeralStorage` in Lambda)

### 4. Scheduled Execution

Configure Lambda to run on a schedule with EventBridge:

```yaml
events:
  # Run daily at 6 AM UTC
  - schedule: cron(0 6 * * ? *)

  # Run weekdays at 9 AM UTC
  - schedule: cron(0 9 ? * MON-FRI *)
```

## AWS Parameter Store for Secrets

Securely store database credentials in AWS Parameter Store:

```bash
# Store credentials
aws ssm put-parameter --name /woltflow/database-url --type SecureString --value "postgresql://user:password@host/woltflow"

# Reference in Lambda environment
aws lambda update-function-configuration \
  --function-name woltflow \
  --environment "Variables={DATABASE_URL=/woltflow/database-url}"
```

Then update the handler to retrieve the actual value:

```python
import boto3

def get_parameter(name):
    """Get a parameter from AWS Parameter Store"""
    ssm = boto3.client('ssm')
    response = ssm.get_parameter(Name=name, WithDecryption=True)
    return response['Parameter']['Value']

# In the handler:
parameter_name = os.environ.get('DATABASE_URL')
db_url = get_parameter(parameter_name)
```

## Troubleshooting

- **Timeout errors**: Increase the Lambda timeout setting
- **Memory errors**: Increase the Lambda memory allocation
- **Cold start issues**: Implement provisioned concurrency
- **Database connectivity**: Check VPC and security group settings
