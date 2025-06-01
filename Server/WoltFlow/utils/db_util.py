import os
import logging
from datetime import datetime
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError
from models.user import Base, User
from models.base import Base

def create_database_connection(db_url=None, logger=None):
    """Create and configure a SQLAlchemy database connection.
    
    This function establishes a connection to the database and returns a session for database operations.
    
    Args:
        db_url (str, optional): Database connection URL. If None, reads from DATABASE_URL
            environment variable.
        logger (logging.Logger, optional): Logger instance for connection logging.
            If None, logging is disabled.
        
    Returns:
        sqlalchemy.orm.Session: Configured database session for operations.
    
    Raises:
        ValueError: If DATABASE_URL environment variable is not set when db_url is None.
    """
    if db_url is None:
        db_url = os.getenv('DATABASE_URL')
        if not db_url:
            if logger:
                logger.error("DATABASE_URL environment variable is not set")
            raise ValueError("DATABASE_URL environment variable is required")
    
    if logger:
        logger.info(f"Connecting to database: {db_url}")
    
    try:
        # Create engine with proper connection settings
        engine = create_engine(
            db_url,
            pool_size=5,
            max_overflow=10,
            pool_timeout=30,
            pool_recycle=1800,
            echo=False
        )
        
        # Test connection
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
            conn.commit()
        
        # Create session
        Session = sessionmaker(bind=engine)
        session = Session()
        
        return session
        
    except SQLAlchemyError as e:
        if logger:
            logger.error(f"Database connection error: {str(e)}")
        raise

def update_user_status(session, user, status, error=None, logger=None):
    """Update a user's login status and timestamp in the database.
    
    Records the result of a login attempt for tracking and monitoring purposes.
    
    Args:
        session (sqlalchemy.orm.Session): Active database session.
        user (models.User): User instance to update.
        status (str): Status of the login attempt (SUCCESS/FAILED/ERROR).
        error (str, optional): Error message if the login failed.
        logger (logging.Logger, optional): Logger instance for status updates.
            If None, logging is disabled.
    """
    user.last_login = datetime.now().isoformat()
    user.login_status = status if error is None else f"{status}: {error}"
    session.commit()
    
    if logger:
        logger.info(f"Updated status for user {user.id}: {status}")

def update_run_status(session, run, status, error=None, logger=None):
    """Update a run's status in the database.
    
    Args:
        session (sqlalchemy.orm.Session): Active database session.
        run (models.Run): Run instance to update.
        status (str): Status to set ('failed', 'in progress', 'success').
        error (str, optional): Error message if the run failed.
        logger (logging.Logger, optional): Logger instance for status updates.
    """
    try:
        run.status = status
        run.updated_at = datetime.utcnow()
        session.commit()
        
        if logger:
            logger.info(f"Updated status for run {run.id} to {status}")
            
    except SQLAlchemyError as e:
        if logger:
            logger.error(f"Failed to update run status: {str(e)}")
        session.rollback()
        raise

def create_screenshot(session, run_id, url, is_error=False, logger=None):
    """Create a new screenshot record in the database.
    
    Args:
        session (sqlalchemy.orm.Session): Active database session.
        run_id (int): ID of the associated run.
        url (str): URL/path to the screenshot.
        is_error (bool): Whether this is an error screenshot.
        logger (logging.Logger, optional): Logger instance for logging.
        
    Returns:
        models.Screenshot: Created screenshot instance.
    """
    from models.screenshot import Screenshot
    
    try:
        screenshot = Screenshot(
            run_id=run_id,
            url=url,
            is_error=is_error
        )
        session.add(screenshot)
        session.commit()
        
        if logger:
            logger.info(f"Created screenshot record for run {run_id}: {url}")
            
        return screenshot
        
    except SQLAlchemyError as e:
        if logger:
            logger.error(f"Failed to create screenshot record: {str(e)}")
        session.rollback()
        raise 