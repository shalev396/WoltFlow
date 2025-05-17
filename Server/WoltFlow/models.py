import json
import os
from typing import List, Dict, Optional, Any

class UserModel:
    """Model for handling user data from db.json"""
    
    def __init__(self, db_path: str = None):
        """Initialize the user model
        
        Args:
            db_path: Path to the db.json file. If None, uses default location.
        """
        if db_path is None:
            # Get the current directory of this file
            current_dir = os.path.dirname(os.path.abspath(__file__))
            self.db_path = os.path.join(current_dir, 'db.json')
        else:
            self.db_path = db_path
    
    def _load_db(self) -> List[Dict[str, Any]]:
        """Load the database from the JSON file
        
        Returns:
            List of user dictionaries
        """
        try:
            with open(self.db_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError) as e:
            print(f"Error loading database: {e}")
            return []
    
    def get_all_users(self) -> List[Dict[str, Any]]:
        """Get all users from the database
        
        Returns:
            List of all user dictionaries
        """
        return self._load_db()
    
    def get_user_by_id(self, user_id: int) -> Optional[Dict[str, Any]]:
        """Get a user by their ID
        
        Args:
            user_id: The ID of the user to find
            
        Returns:
            User dictionary if found, None otherwise
        """
        users = self._load_db()
        for user in users:
            if user.get('id') == user_id:
                return user
        return None

# Example usage
if __name__ == "__main__":
    user_model = UserModel()
    
    # Get all users
    all_users = user_model.get_all_users()
    print(f"Found {len(all_users)} users")
    
    # Get user by ID
    user = user_model.get_user_by_id(1)
    if user:
        print(f"Found user: {user['gmail_email']}")
    else:
        print("User not found") 