# Standard library imports
import os
import time
import json
import argparse
from datetime import datetime

# Third-party imports
from dotenv import load_dotenv
from sqlalchemy.exc import SQLAlchemyError

# Local application imports
from wolt_login import login_to_wolt
from utils.chrome_util import cleanup_temp_profiles, launch_fresh_chrome, connect_to_chrome
from utils.system_util import setup_logging
from utils.db_util import create_database_connection, update_run_status, create_screenshot
from models.base import Base
from models.user import User
from models.run import Run
from models.screenshot import Screenshot

# Load environment configuration
load_dotenv()

# Configure application logging
current_dir = os.path.dirname(os.path.abspath(__file__))
log_file = os.path.join(current_dir, 'woltflow.log')
logger = setup_logging("WoltFlow", log_file)

def load_user_data():
    """Load user data from db.json file."""
    json_path = os.path.join(current_dir, 'db.json')
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return data.get('users', [])
    except FileNotFoundError:
        logger.error(f"db.json not found at {json_path}")
        return []
    except json.JSONDecodeError as e:
        logger.error(f"Error parsing db.json: {str(e)}")
        return []

def process_user(user_data, session):
    """Process a single user's Wolt gift card purchase workflow."""
    logger.info(f"Starting process for user Email: {user_data['gmail_email']}")
    chrome_process = None
    driver = None
    debugging_port = 9222
    run = None
    
    try:
        # Create a new run record
        run = Run(
            user_id=user_data['id'],
            amount=0.0,  # Initialize with 0
            status='in progress'
        )
        session.add(run)
        session.commit()
        logger.info(f"Created new run record: {run.id}")
        
        # Initialize Chrome browser
        chrome_process = launch_fresh_chrome(debugging_port)
        if not chrome_process:
            error_msg = "Failed to launch Chrome browser"
            logger.error(error_msg)
            update_run_status(session, run, 'failed', error_msg, logger)
            return False
            
        # Connect to Chrome instance
        time.sleep(3)  # Allow Chrome initialization
        driver = connect_to_chrome(debugging_port)
        if not driver:
            error_msg = "Failed to connect to Chrome browser"
            logger.error(error_msg)
            update_run_status(session, run, 'failed', error_msg, logger)
            return False
            
        # Execute Wolt login and purchase workflow
        logger.info(f"Starting Wolt workflow for user {user_data['gmail_email']}")
        success = login_to_wolt(
            driver, 
            user_data['gmail_email'],
            user_data['gmail_password'],
            user_data['totp_secret'],
            user_data['cibus_username'],
            user_data['cibus_password'],
            user_data['cibus_company'],
            user_data['gift_amount']
        )
        
        # Update run status and amount
        status = 'success' if success else 'failed'
        update_run_status(session, run, status, logger=logger)
        
        if success:
            run.amount = float(user_data['gift_amount'])
            session.commit()
            logger.info(f"Workflow completed successfully for user {user_data['gmail_email']}")
        else:
            logger.error(f"Workflow failed for user {user_data['gmail_email']}")
            
        return success
        
    except Exception as e:
        logger.exception(f"Error processing user {user_data['gmail_email']}: {str(e)}")
        if run:
            update_run_status(session, run, 'failed', str(e), logger)
        return False
        
    finally:
        # Cleanup browser resources
        if driver:
            try:
                driver.quit()
                logger.info("Browser session closed")
            except Exception as driver_err:
                logger.error(f"Failed to close browser: {str(driver_err)}")
                
        if chrome_process:
            try:
                chrome_process.terminate()
                logger.info("Chrome process terminated")
            except Exception as proc_err:
                logger.error(f"Failed to terminate Chrome process: {str(proc_err)}")
                
        # Final cleanup of temporary files
        cleanup_temp_profiles()

def ensure_user_exists(session, user_data):
    """Ensure user exists in database, create if not."""
    try:
        user = session.query(User).filter_by(id=user_data['id']).first()
        if not user:
            user = User(
                id=user_data['id'],
                email=user_data['gmail_email'],
                password='hashed_password'  # You should implement proper password hashing
            )
            session.add(user)
            session.commit()
            logger.info(f"Created new user record for {user_data['gmail_email']}")
        return True
    except SQLAlchemyError as e:
        logger.error(f"Database error while ensuring user exists: {str(e)}")
        return False

def main():
    """Main entry point for the WoltFlow batch processor."""
    # Parse command line arguments
    parser = argparse.ArgumentParser(description="WoltFlow Batch Login Processor")
    parser.add_argument("--user-id", type=int, help="Process only a specific user ID")
    args = parser.parse_args()
    
    logger.info("Starting WoltFlow batch processor")
    start_time = datetime.now()
    
    try:
        # Initialize database connection
        session = create_database_connection(None, logger)
        
        # Load user data from JSON
        users_data = load_user_data()
        if not users_data:
            logger.error("No users found in db.json")
            return
            
        # Filter by user ID if specified
        if args.user_id:
            users_data = [u for u in users_data if u['id'] == args.user_id]
            if not users_data:
                logger.error(f"User with ID {args.user_id} not found in db.json")
                return
        
        logger.info(f"Found {len(users_data)} users to process")
        
        # Process users and track results
        successful_logins = 0
        failed_logins = 0
        
        for index, user_data in enumerate(users_data):
            logger.info(f"Processing user {index+1} of {len(users_data)} - Email: {user_data['gmail_email']}")
            
            # Ensure user exists in database
            if not ensure_user_exists(session, user_data):
                logger.error(f"Failed to ensure user exists in database: {user_data['gmail_email']}")
                continue
                
            result = process_user(user_data, session)
            if result:
                successful_logins += 1
            else:
                failed_logins += 1
        
        # Log execution summary
        elapsed_time = (datetime.now() - start_time).total_seconds()
        logger.info("=========== Batch Processing Summary ===========")
        logger.info(f"Total users processed: {len(users_data)}")
        logger.info(f"Successful logins: {successful_logins}")
        logger.info(f"Failed logins: {failed_logins}")
        logger.info(f"Total execution time: {elapsed_time:.2f} seconds")
        logger.info("=============================================")
        
    except Exception as e:
        logger.exception(f"Critical error in main process: {str(e)}")
    finally:
        logger.info("WoltFlow batch processor completed")

if __name__ == "__main__":
    main() 