#python imports
import os
import time
import argparse
#libraries imports
from datetime import datetime
from dotenv import load_dotenv
#project imports
from wolt_login import login_to_wolt
from utils.chrome_util import cleanup_temp_profiles, launch_fresh_chrome, connect_to_chrome
from utils.system_util import setup_logging
from utils.db_util import create_database_connection, update_user_status
from models.user import User

# Load environment variables from .env file
load_dotenv()

# Configure logging with a file handler
current_dir = os.path.dirname(os.path.abspath(__file__))
log_file = os.path.join(current_dir, 'woltflow.log')
logger = setup_logging("WoltFlow", log_file)

def process_user(user, session):
    """Run the login process for a single user"""
    logger.info(f"Processing user ID: {user.id}, Email: {user.gmail_email}")
    chrome_process = None
    driver = None
    debugging_port = 9222
    success = False
    try:
        # Launch Chrome
        chrome_process = launch_fresh_chrome(debugging_port)
        if not chrome_process:
            error_msg = "Failed to launch Chrome browser"
            logger.error(error_msg)
            update_user_status(session, user, "FAILED", error_msg, logger)
            return False
        # Connect to Chrome
        time.sleep(3)  # Give Chrome time to initialize
        driver = connect_to_chrome(debugging_port)
        if not driver:
            error_msg = "Failed to connect to Chrome browser"
            logger.error(error_msg)
            update_user_status(session, user, "FAILED", error_msg, logger)
            return False
        # Perform login
        logger.info(f"Starting login process for user {user.id}")
        success = login_to_wolt(
            driver, 
            user.gmail_email, 
            user.gmail_password, 
            user.totp_secret,
            user.cibus_username,
            user.cibus_password,
            user.cibus_company,
            user.gift_amount
        )
        # Update user status
        status = "SUCCESS" if success else "FAILED"
        update_user_status(session, user, status, logger=logger)
        if success:
            logger.info(f"Login successful for user {user.id}")
        else:
            logger.error(f"Login failed for user {user.id}")
        return success
    except Exception as e:
        logger.exception(f"Error processing user {user.id}: {str(e)}")
        update_user_status(session, user, "ERROR", str(e), logger)
        return False
    finally:
        # Clean up resources
        if driver:
            try:
                driver.quit()
                logger.info("Browser closed")
            except Exception as driver_err:
                logger.error(f"Error closing browser: {str(driver_err)}")
                
        if chrome_process:
            try:
                chrome_process.terminate()
                logger.info("Chrome process terminated")
            except Exception as proc_err:
                logger.error(f"Error terminating Chrome process: {str(proc_err)}")
        # Final cleanup
        cleanup_temp_profiles()

def main():
    """Main function to process all users"""
    parser = argparse.ArgumentParser(description="WoltFlow Batch Login Processor")
    parser.add_argument("--user-id", type=int, help="Process only a specific user ID")
    args = parser.parse_args()
    logger.info("Starting WoltFlow batch processor")
    start_time = datetime.now()
    try:
        # Connect to database
        session = create_database_connection(None, logger)
        # Get users to process
        if args.user_id:
            users = session.query(User).filter(User.id == args.user_id).all()
            if not users:
                logger.error(f"User with ID {args.user_id} not found")
                return
        else:
            users = session.query(User).all()
        logger.info(f"Found {len(users)} users to process")
        # Process each user
        successful_logins = 0
        failed_logins = 0
        for index, user in enumerate(users):
            logger.info(f"Processing user {index+1} of {len(users)} - ID: {user.id}")
            result = process_user(user, session)
            if result:
                successful_logins += 1
            else:
                failed_logins += 1
        # Log summary
        elapsed_time = (datetime.now() - start_time).total_seconds()
        logger.info("=========== Batch Processing Summary ===========")
        logger.info(f"Total users processed: {len(users)}")
        logger.info(f"Successful logins: {successful_logins}")
        logger.info(f"Failed logins: {failed_logins}")
        logger.info(f"Total time: {elapsed_time:.2f} seconds")
        logger.info("===============================================")
    except Exception as e:
        logger.exception(f"Error in main process: {str(e)}")
    finally:
        logger.info("WoltFlow batch processor finished")

if __name__ == "__main__":
    main() 