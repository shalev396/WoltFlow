from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    """SQLAlchemy model representing a user in the WoltFlow system.
    
    This model stores user credentials and information required for automating
    the Wolt gift card purchase process using Cibus.
    
    Attributes:
        id (int): Primary key for user identification.
        gmail_email (str): User's Gmail email address for Google authentication.
        gmail_password (str): User's Gmail password.
        totp_secret (str): Time-based One-Time Password secret for 2FA.
        last_login (str): ISO format timestamp of user's last login attempt.
        login_status (str): Status of the last login attempt (SUCCESS/FAILED/ERROR).
        cibus_username (str): Username for Cibus authentication.
        cibus_password (str): Password for Cibus authentication.
        cibus_company (str): Company name for Cibus authentication.
        gift_amount (str): Desired Wolt gift card amount.
        email (str): Additional email for notifications (optional).
        password (str): Additional password field (optional).
    """
    __tablename__ = 'users'
    
    # Core user identification
    id = Column(Integer, primary_key=True)
    
    # Google authentication fields
    gmail_email = Column(String, nullable=False)
    gmail_password = Column(String, nullable=False)
    totp_secret = Column(String, nullable=True)
    
    # Login tracking
    last_login = Column(String, nullable=True)
    login_status = Column(String, nullable=True)
    
    # Cibus authentication fields
    cibus_username = Column(String, nullable=True)
    cibus_password = Column(String, nullable=True)
    cibus_company = Column(String, nullable=True)
    
    # Gift card configuration
    gift_amount = Column(String, nullable=True)
    
    # Additional fields
    email = Column(String, nullable=True)
    password = Column(String, nullable=True)
    
    def __repr__(self):
        """Return a string representation of the User instance."""
        return f"<User(id={self.id}, email={self.gmail_email})>"
