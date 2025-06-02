from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from models.base import Base

class Run(Base):
    """SQLAlchemy model representing a run in the WoltFlow system."""
    __tablename__ = 'runs'
    
    id = Column(Integer, primary_key=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    status = Column(String(20), default='in progress')
    amount = Column(Float, default=0.0)
    is_notify = Column(Boolean, default=False)
    
    # Foreign Key
    user_id = Column(Integer, ForeignKey('users.id'))
    
    # Relationships
    user = relationship("User", back_populates="runs")
    screenshots = relationship("Screenshot", back_populates="run", cascade="all, delete-orphan")
    
    def __repr__(self):
        """Return a string representation of the Run instance."""
        return f"<Run(id={self.id}, user_id={self.user_id}, status={self.status})>" 