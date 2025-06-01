from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from models.base import Base

class Screenshot(Base):
    """SQLAlchemy model representing a screenshot in the WoltFlow system."""
    __tablename__ = 'screenshots'
    
    id = Column(Integer, primary_key=True)
    url = Column(String, nullable=False)
    is_error = Column(Boolean, default=False)
    
    # Foreign Key
    run_id = Column(Integer, ForeignKey('runs.id'))
    
    # Relationship
    run = relationship("Run", back_populates="screenshots")
    
    def __repr__(self):
        """Return a string representation of the Screenshot instance."""
        return f"<Screenshot(id={self.id}, url={self.url}, is_error={self.is_error})>" 