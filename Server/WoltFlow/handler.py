import datetime
import logging
import json
from models import UserModel
from wolt_login import login_to_wolt, launch_fresh_chrome, connect_to_chrome, cleanup_temp_profiles

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

def run(event, context):
    current_time = datetime.datetime.now().time()
    logger.info("WoltFlow process started at " + str(current_time))
    
    # Get user credentials from db.json using the model
    user_model = UserModel()
    user = user_model.get_user_by_id(1)  # Get the first user
    
    if not user:
        error_msg = "No user found in database"
        logger.error(error_msg)
        return {
            'statusCode': 500,
            'body': json.dumps({
                'message': error_msg,
                'timestamp': str(current_time)
            })
        }
    
    # Extract user credentials
    gmail_email = user.get('gmail_email')
    gmail_password = user.get('gmail_password')
    totp_secret = user.get('totp_secret')
    
    try:
        # Launch Chrome browser with remote debugging
        chrome_process, temp_profile_dir = launch_fresh_chrome()
        if not chrome_process:
            error_msg = "Failed to launch Chrome browser"
            logger.error(error_msg)
            return {
                'statusCode': 500,
                'body': json.dumps({
                    'message': error_msg,
                    'timestamp': str(current_time)
                })
            }
        
        # Connect to Chrome with Selenium
        driver = connect_to_chrome()
        if not driver:
            error_msg = "Failed to connect to Chrome browser"
            logger.error(error_msg)
            return {
                'statusCode': 500,
                'body': json.dumps({
                    'message': error_msg,
                    'timestamp': str(current_time)
                })
            }
        
        # Perform the login process
        logger.info("Starting Wolt login process...")
        success = login_to_wolt(driver, gmail_email, gmail_password, totp_secret)
        
        result_message = "Login successful" if success else "Login failed"
        status_code = 200 if success else 500
        
        logger.info(result_message)
        
        # Clean up temporary profiles before returning
        cleanup_temp_profiles()
        
        return {
            'statusCode': status_code,
            'body': json.dumps({
                'message': result_message,
                'timestamp': str(current_time)
            })
        }
        
    except Exception as e:
        error_msg = f"Error during login process: {str(e)}"
        logger.error(error_msg)
        
        # Make sure we clean up even if there's an error
        try:
            cleanup_temp_profiles()
        except:
            logger.error("Failed to clean up temporary profiles")
            
        return {
            'statusCode': 500,
            'body': json.dumps({
                'message': error_msg,
                'timestamp': str(current_time)
            })
        }

if __name__ == "__main__":
    # This allows testing from command line
    run(None, None)
