import os
import sys
import logging
import time
import json
import argparse
from datetime import datetime
from dotenv import load_dotenv
from sqlalchemy import create_engine, Column, Integer, String, MetaData, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Load environment variables from .env file
load_dotenv()

# Import the wolt_login module
from wolt_login import login_to_wolt, launch_fresh_chrome, connect_to_chrome, cleanup_temp_profiles

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'woltflow.log'))
    ]
)

logger = logging.getLogger("WoltFlow")

# Initialize SQLAlchemy
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
    # New fields
    cibus_email = Column(String, nullable=True)
    cibus_password = Column(String, nullable=True)
    cibus_company = Column(String, nullable=True)
    gift_amount = Column(String, nullable=True)
    email = Column(String, nullable=True)
    password = Column(String, nullable=True)
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.gmail_email})>"

def create_database_connection(db_url=None):
    """Create SQLAlchemy engine and session"""
    if db_url is None:
        # Only use DATABASE_URL without a default fallback
        db_url = os.getenv('DATABASE_URL')
        if not db_url:
            logger.error("DATABASE_URL environment variable is not set")
            raise ValueError("DATABASE_URL environment variable is required")
    
    logger.info(f"Connecting to database: {db_url}")
    engine = create_engine(db_url)
    
    # Create tables if they don't exist
    Base.metadata.create_all(engine)
    
    # Create session
    Session = sessionmaker(bind=engine)
    return Session()

def update_user_status(session, user, status, error=None):
    """Update user's login status and timestamp"""
    user.last_login = datetime.now().isoformat()
    user.login_status = status if error is None else f"{status}: {error}"
    session.commit()
    logger.info(f"Updated status for user {user.id}: {status}")

def process_user(user, session):
    """Run the login process for a single user"""
    logger.info(f"Processing user ID: {user.id}, Email: {user.gmail_email}")
    
    chrome_process = None
    driver = None
    debugging_port = 9222
    success = False
    
    try:
        # Launch Chrome
        chrome_process, temp_profile_dir = launch_fresh_chrome(debugging_port)
        if not chrome_process:
            error_msg = "Failed to launch Chrome browser"
            logger.error(error_msg)
            update_user_status(session, user, "FAILED", error_msg)
            return False
        
        # Connect to Chrome
        time.sleep(3)  # Give Chrome time to initialize
        driver = connect_to_chrome(debugging_port)
        if not driver:
            error_msg = "Failed to connect to Chrome browser"
            logger.error(error_msg)
            update_user_status(session, user, "FAILED", error_msg)
            return False
        
        # Perform login
        logger.info(f"Starting login process for user {user.id}")
        success = login_to_wolt(driver, user.gmail_email, user.gmail_password, user.totp_secret)
        
        # Update user status
        status = "SUCCESS" if success else "FAILED"
        update_user_status(session, user, status)
        
        if success:
            logger.info(f"Login successful for user {user.id}")
        else:
            logger.error(f"Login failed for user {user.id}")
        
        return success
        
    except Exception as e:
        logger.exception(f"Error processing user {user.id}: {str(e)}")
        update_user_status(session, user, "ERROR", str(e))
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
    parser.add_argument("--db-url", help="Database connection URL")
    parser.add_argument("--user-id", type=int, help="Process only a specific user ID")
    parser.add_argument("--interval", type=int, default=60, help="Time interval between processing users in seconds (default: 60)")
    args = parser.parse_args()
    
    logger.info("Starting WoltFlow batch processor")
    start_time = datetime.now()
    
    try:
        # Connect to database
        session = create_database_connection(args.db_url)
        
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
            
            # Wait between users if interval is specified and there are more users to process
            if args.interval > 0 and index < len(users) - 1:
                logger.info(f"Waiting {args.interval} seconds before next user...")
                time.sleep(args.interval)
        
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