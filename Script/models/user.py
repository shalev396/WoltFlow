from sqlalchemy import Column, Integer, String, Boolean, Float
from sqlalchemy.orm import relationship

from models.base import Base

class User(Base):
    """SQLAlchemy model representing a user in the WoltFlow system.
    
    This model stores user credentials and information required for automating
    the Wolt gift card purchase process using Cibus.
    
    Attributes:
        id (int): Primary key for user identification.
        email (str): Additional email for notifications (optional).
        password (str): Additional password field (optional).
        in_notification (bool): Indicates whether the user is in notification mode.
        total_saved (float): Total amount saved by the user.
    """
    __tablename__ = 'users'
    
    # Core user identification
    id = Column(Integer, primary_key=True)
 
    # Additional fields
    email = Column(String, nullable=False)
    password = Column(String, nullable=False)
    in_notification = Column(Boolean, default=False)
    total_saved = Column(Float, default=0.0)
    
    # Relationships
    runs = relationship("Run", back_populates="user", lazy="dynamic")
    
    def __repr__(self):
        """Return a string representation of the User instance."""
        return f"<User(id={self.id}, email={self.email})>"
