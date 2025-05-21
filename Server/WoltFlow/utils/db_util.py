import os
import logging
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.user import Base, User

def create_database_connection(db_url=None, logger=None):
    """Create SQLAlchemy engine and session
    
    Args:
        db_url: Database URL. If None, takes from DATABASE_URL environment variable
        logger: Logger instance to use. If None, doesn't log anything
        
    Returns:
        Session: SQLAlchemy session
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
    """Update user's login status and timestamp
    
    Args:
        session: SQLAlchemy session
        user: User instance to update
        status: Status string
        error: Optional error message
        logger: Logger instance. If None, doesn't log
    """
    user.last_login = datetime.now().isoformat()
    user.login_status = status if error is None else f"{status}: {error}"
    session.commit()
    
    if logger:
        logger.info(f"Updated status for user {user.id}: {status}") 