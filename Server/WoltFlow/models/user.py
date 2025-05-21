from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

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
    cibus_username = Column(String, nullable=True)
    cibus_password = Column(String, nullable=True)
    cibus_company = Column(String, nullable=True)
    gift_amount = Column(String, nullable=True)
    email = Column(String, nullable=True)
    password = Column(String, nullable=True)
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.gmail_email})>"
