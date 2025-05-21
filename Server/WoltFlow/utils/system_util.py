import os
import sys
import logging

def cleanup_screenshots(directory, keep_patterns):
    """Clean up screenshots except those matching the keep patterns"""
    try:
        print(f"Cleaning up screenshots in {directory}...")
        
        # List all png files in the directory
        files = [f for f in os.listdir(directory) if f.endswith('.png')]
        print(f"Found {len(files)} screenshots")
        
        # Keep track of how many files were removed
        removed_count = 0
        
        # Check each file
        for file in files:
            # Skip files that match any of the keep patterns
            should_keep = False
            for pattern in keep_patterns:
                if pattern in file:
                    should_keep = True
                    break
            
            # Remove files that don't match any keep pattern
            if not should_keep:
                try:
                    file_path = os.path.join(directory, file)
                    os.remove(file_path)
                    removed_count += 1
                    print(f"Removed screenshot: {file}")
                except Exception as e:
                    print(f"Error removing file {file}: {e}")
        
        print(f"Screenshot cleanup complete. Removed {removed_count} files.")
    except Exception as e:
        print(f"Error during screenshot cleanup: {e}")

def setup_screenshots_dir(base_dir=None):
    """Set up screenshots directory and create it if it doesn't exist
    
    Args:
        base_dir: Base directory to create screenshots dir in. If None, uses the directory of the caller.
    
    Returns:
        str: Path to the screenshots directory
    """
    if base_dir is None:
        # Get the directory of the caller file
        import inspect
        caller_frame = inspect.stack()[1]
        caller_file = caller_frame.filename
        base_dir = os.path.dirname(os.path.abspath(caller_file))
    
    screenshots_dir = os.path.join(base_dir, 'screenshots')
    
    # Create screenshots directory if it doesn't exist
    if not os.path.exists(screenshots_dir):
        os.makedirs(screenshots_dir)
    
    return screenshots_dir

def setup_logging(logger_name, log_file=None, level=logging.INFO):
    """Configure logging with consistent format
    
    Args:
        logger_name: Name for the logger
        log_file: Optional path to log file. If None, only logs to console.
        level: Logging level to use
        
    Returns:
        Logger: Configured logger instance
    """
    # Create logger
    logger = logging.getLogger(logger_name)
    logger.setLevel(level)
    
    # Clear any existing handlers to avoid duplicates
    if logger.handlers:
        logger.handlers.clear()
    
    # Create formatter
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    
    # Add console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)
    
    # Add file handler if log_file is specified
    if log_file:
        file_handler = logging.FileHandler(log_file)
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)
    
    return logger 