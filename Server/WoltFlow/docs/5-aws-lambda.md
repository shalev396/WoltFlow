# Deploying WoltFlow on AWS Lambda

This guide explains how to deploy the WoltFlow script as an AWS Lambda function using the Serverless Framework.

## Prerequisites

- AWS account with appropriate permissions
- [Serverless Framework](https://www.serverless.com/) installed
- [AWS CLI](https://aws.amazon.com/cli/) installed and configured
- Node.js and npm (to install Serverless plugins)

## Limitations and Considerations

Before deploying to AWS Lambda, be aware of these important limitations:

1. **Browser Automation**: The standard Lambda environment does not include Chrome. You'll need to use a Lambda Layer or custom container that includes Chrome binaries.

2. **UI Interaction**: Lambda has no display, so all automation must be headless.

3. **Execution Time**: Lambda has a maximum execution time (15 minutes), which should be sufficient for the login process but might be limiting for extended browsing.

4. **Memory Requirements**: Browser automation is memory-intensive. Configure your Lambda with at least 1024MB of memory, preferably 2048MB.

## Deployment Steps

### 1. Prepare the Project Structure

The provided `serverless.yml` and `handler.py` already offer a basic structure. You'll need to adapt the login script to work in a headless, Lambda-compatible environment.

### 2. Create a Lambda-compatible Handler

Modify `handler.py` to call your login function:

```python
import json
import datetime
import logging
from wolt_login import login_to_wolt, connect_to_chrome, save_cookies

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

def run(event, context):
    current_time = datetime.datetime.now().time()
    logger.info("WoltFlow Lambda started at " + str(current_time))

    try:
        # Your headless implementation that works in Lambda
        # This will need to be adapted from the current script

        # Example approach with headless Chrome
        success = lambda_login_process()

        return {
            'statusCode': 200 if success else 500,
            'body': json.dumps({
                'message': 'Login successful' if success else 'Login failed',
                'timestamp': str(current_time)
            })
        }
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({
                'message': f'Error: {str(e)}',
                'timestamp': str(current_time)
            })
        }
```

### 3. Configure `serverless.yml`

Update your `serverless.yml` with appropriate settings:

```yaml
service: woltflow

frameworkVersion: "3"

provider:
  name: aws
  runtime: python3.9
  region: eu-west-1 # Choose your preferred region
  memorySize: 2048
  timeout: 900 # 15 minutes max
  environment:
    GOOGLE_EMAIL: ${env:GOOGLE_EMAIL}
    GOOGLE_PASSWORD: ${env:GOOGLE_PASSWORD}

functions:
  login:
    handler: handler.run
    events:
      # Run once per day at 6 AM
      - schedule: cron(0 6 * * ? *)
    layers:
      - !Ref ChromeAwsLambdaLayer

layers:
  ChromeAwsLambdaLayer:
    path: layer # Point to your Chrome layer directory
```

### 4. Create a Chrome Lambda Layer

You'll need to create a Layer containing Chrome binaries that work in Lambda:

1. Use a pre-built Layer like [chrome-aws-lambda](https://github.com/alixaxel/chrome-aws-lambda) or create your own
2. If creating your own, bundle Chrome binaries compiled for Amazon Linux 2

### 5. Adapt the WoltFlow Script for Lambda

The script needs adjustments for Lambda:

1. Use headless Chrome
2. Remove filesystem dependencies or adapt them to Lambda's temporary filesystem
3. Set appropriate timeouts for the Lambda environment
4. Handle cookies and session data storage differently (consider using S3 or DynamoDB)

### 6. Deploy to AWS

```bash
# Deploy the service
serverless deploy

# To deploy a single function
serverless deploy function -f login

# To invoke the function manually
serverless invoke -f login
```

### 7. Monitor AWS CloudWatch Logs

After deployment, you can monitor the execution through AWS CloudWatch:

```bash
# View log output
serverless logs -f login
```

## Advanced Configuration

### Setting Up Secrets

For storing sensitive credentials:

1. **AWS Secrets Manager**: Store your Google credentials and TOTP secret

   ```python
   import boto3

   def get_secret():
       client = boto3.client('secretsmanager')
       response = client.get_secret_value(SecretId='woltflow/credentials')
       return json.loads(response['SecretString'])
   ```

2. **Environment Variables**: Set via Lambda console or in the `serverless.yml`

### Scheduling Options

For regular execution, configure the cron expression in `serverless.yml`:

```yaml
events:
  # Daily at 6 AM
  - schedule: cron(0 6 * * ? *)

  # Weekdays at 8 AM
  - schedule: cron(0 8 ? * MON-FRI *)

  # Every 6 hours
  - schedule: rate(6 hours)
```

## Troubleshooting

### Common Issues

1. **Timeout Errors**: If the function exceeds the 15-minute limit, optimize your code or consider a different approach like AWS Step Functions to break the process into steps.

2. **Memory Errors**: Increase the `memorySize` in `serverless.yml` if your function runs out of memory.

3. **Chrome Crashes**: Ensure your Chrome configuration is compatible with Lambda's environment. Try options like:
   ```python
   chrome_options.add_argument('--no-sandbox')
   chrome_options.add_argument('--disable-dev-shm-usage')
   chrome_options.add_argument('--disable-gpu')
   chrome_options.add_argument('--single-process')
   ```

### Debugging

For local debugging before deployment:

```bash
# Invoke locally
serverless invoke local -f login

# Run with Docker (simulates Lambda environment)
serverless invoke local -f login --docker
```
