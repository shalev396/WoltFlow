import os
import logging
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.user import Base, User

def create_database_connection(db_url=None, logger=None):
    """Create and configure a SQLAlchemy database connection.
    
    This function establishes a connection to the database, creates tables if they
    don't exist, and returns a session for database operations.
    
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
        # Only use DATABASE_URL without a default fallback
        db_url = os.getenv('DATABASE_URL')
        if not db_url:
            if logger:
                logger.error("DATABASE_URL environment variable is not set")
            raise ValueError("DATABASE_URL environment variable is required")
    
    if logger:
        logger.info(f"Connecting to database: {db_url}")
    
    engine = create_engine(db_url)
    
    # Create tables if they don't exist
    Base.metadata.create_all(engine)
    
    # Create session
    Session = sessionmaker(bind=engine)
    return Session()

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