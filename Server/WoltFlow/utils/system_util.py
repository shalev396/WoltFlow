import os
import sys
import logging

def cleanup_screenshots(directory, keep_patterns):
    """Clean up screenshot files while preserving specified patterns.
    
    Removes screenshot files (.png) from the specified directory except those
    matching any of the keep_patterns.
    
    Args:
        directory (str): Path to the directory containing screenshots.
        keep_patterns (list[str]): List of patterns to preserve in filenames.
    
    Note:
        Files are only removed if they don't match ANY of the keep_patterns.
        The function logs its actions for monitoring and debugging.
    """
    try:
        print(f"Starting screenshot cleanup in {directory}")
        
        # Find all PNG files in the directory
        files = [f for f in os.listdir(directory) if f.endswith('.png')]
        print(f"Found {len(files)} screenshot files")
        
        removed_count = 0
        
        # Process each file
        for file in files:
            # Check if file matches any keep pattern
            should_keep = any(pattern in file for pattern in keep_patterns)
            
            if not should_keep:
                try:
                    file_path = os.path.join(directory, file)
                    os.remove(file_path)
                    removed_count += 1
                    print(f"Removed: {file}")
                except Exception as e:
                    print(f"Failed to remove {file}: {e}")
        
        print(f"Cleanup complete - Removed {removed_count} files")
    except Exception as e:
        print(f"Screenshot cleanup error: {e}")

def setup_screenshots_dir(base_dir=None):
    """Set up and ensure existence of screenshots directory.
    
    Creates a 'screenshots' directory if it doesn't exist, either in the specified
    base directory or relative to the caller's location.
    
    Args:
        base_dir (str, optional): Base directory for screenshots folder. If None,
            uses the directory of the calling script.
    
    Returns:
        str: Absolute path to the screenshots directory.
    """
    if base_dir is None:
        # Get the directory of the calling script
        import inspect
        caller_frame = inspect.stack()[1]
        caller_file = caller_frame.filename
        base_dir = os.path.dirname(os.path.abspath(caller_file))
    
    # Create screenshots directory path
    screenshots_dir = os.path.join(base_dir, 'screenshots')
    
    # Ensure directory exists
    if not os.path.exists(screenshots_dir):
        os.makedirs(screenshots_dir)
    
    return screenshots_dir

def setup_logging(logger_name, log_file=None, level=logging.INFO):
    """Configure and initialize logging with consistent formatting.
    
    Sets up a logger with console output and optional file output. Ensures
    consistent log formatting across the application.
    
    Args:
        logger_name (str): Name identifier for the logger.
        log_file (str, optional): Path to log file. If None, logs only to console.
        level (int, optional): Logging level (e.g., logging.INFO). Defaults to INFO.
    
    Returns:
        logging.Logger: Configured logger instance.
    
    Note:
        If the logger already exists, its handlers are cleared to avoid duplicates.
        Log format: '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    """
    # Initialize logger
    logger = logging.getLogger(logger_name)
    logger.setLevel(level)
    
    # Clear existing handlers
    if logger.handlers:
        logger.handlers.clear()
    
    # Create consistent log format
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    
    # Add console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)
    
    # Add file handler if specified
    if log_file:
        file_handler = logging.FileHandler(log_file)
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)
    
    return logger 