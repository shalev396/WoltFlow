import os
import time
import uuid
import shutil
import psutil
import subprocess
import signal
import logging
import random
from selenium import webdriver

# Configure logging
logger = logging.getLogger("ChromeUtil")
logger.setLevel(logging.INFO)
if not logger.handlers:
    logger.addHandler(logging.StreamHandler())

# Global variables
temp_profiles = []
chrome_processes = []

def get_chrome_path():
    """Find the Chrome executable path"""
    # Get the absolute path to the current directory
    current_dir = os.path.dirname(os.path.abspath(__file__))

    # Try several possible paths for the local Chrome installation
    local_chrome_path = os.path.join(current_dir, "..", "chrome", "chrome.exe")

    if os.path.exists(local_chrome_path):
        logger.info(f"Using Chrome from local path: {local_chrome_path}")
        return local_chrome_path
    
    # If nothing is found, log the error
    logger.error("No Chrome installation found. Please ensure Chrome is installed.")
    return None

def create_temp_profile():
    """Create a temporary Chrome profile directory"""
    # Check if CHROME_PROFILE_DIR environment variable is set (for Lambda)
    chrome_profile_dir_env = os.environ.get("CHROME_PROFILE_DIR")
    if chrome_profile_dir_env:
        profiles_dir = chrome_profile_dir_env
    else:
        # Create a unique temp directory name
        current_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Check if we're in Lambda - use /tmp for ephemeral storage
        if os.path.exists("/var/task"):
            profiles_dir = "/tmp/chrome_profiles"
        else:
            # Create a dedicated chrome_profiles directory to keep things organized
            profiles_dir = os.path.join(current_dir, "../chrome_profiles")
    
    # Make sure the directory exists
    if not os.path.exists(profiles_dir):
        os.makedirs(profiles_dir)
    
    # Create the specific profile directory with a unique ID
    profile_id = uuid.uuid4().hex[:8]
    temp_dir = os.path.join(profiles_dir, f"profile_{profile_id}")
    if not os.path.exists(temp_dir):
        os.makedirs(temp_dir)
    
    # Add to the list of temp profiles to clean up later
    global temp_profiles
    temp_profiles.append(temp_dir)
    
    print(f"Created temporary profile at: {temp_dir}")
    return temp_dir

def kill_chrome_process(pid=None):
    """Terminate Chrome processes"""
    global chrome_processes
    
    if pid:
        # Skip invalid PIDs (like 0)
        if pid <= 0:
            print(f"Skipping invalid PID: {pid}")
            return
            
        try:
            # Check if process exists before trying to terminate it
            if psutil.pid_exists(pid):
                process = psutil.Process(pid)
                if "chrome" in process.name().lower():
                    print(f"Terminating Chrome process with PID {pid}")
                    process.terminate()
                    process.wait(timeout=3)  # Wait for process to terminate
                else:
                    print(f"Process {pid} is not a Chrome process, skipping")
            else:
                print(f"Process with PID {pid} no longer exists")
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.TimeoutExpired) as e:
            print(f"Error terminating Chrome process {pid}: {e}")
            try:
                if os.name == 'nt':
                    # Only attempt if PID is valid
                    if pid > 0:
                        subprocess.run(f"taskkill /F /PID {pid}", shell=True, stderr=subprocess.PIPE)
                else:
                    os.kill(pid, signal.SIGKILL)
            except Exception as e:
                print(f"Failed to force kill process {pid}: {e}")
    else:
        # Kill all tracked Chrome processes
        valid_processes = []
        for chrome_pid in chrome_processes:
            # Skip invalid PIDs
            if chrome_pid <= 0:
                print(f"Skipping invalid PID: {chrome_pid}")
                continue
                
            try:
                print(f"Checking Chrome process with PID {chrome_pid}")
                if psutil.pid_exists(chrome_pid):
                    process = psutil.Process(chrome_pid)
                    print(f"Terminating Chrome process with PID {chrome_pid}")
                    process.terminate()
                    valid_processes.append(chrome_pid)
                    try:
                        process.wait(timeout=3)
                    except psutil.TimeoutExpired:
                        print(f"Process {chrome_pid} didn't terminate in time")
                else:
                    print(f"Process with PID {chrome_pid} no longer exists")
            except (psutil.NoSuchProcess, psutil.AccessDenied) as e:
                print(f"Error checking Chrome process {chrome_pid}: {e}")
                try:
                    if os.name == 'nt':
                        # Only attempt if PID is valid
                        if chrome_pid > 0:
                            subprocess.run(f"taskkill /F /PID {chrome_pid}", shell=True, stderr=subprocess.PIPE)
                    else:
                        os.kill(chrome_pid, signal.SIGKILL)
                except Exception as e:
                    print(f"Failed to force kill process {chrome_pid}: {e}")
                
        # Additional check for Chrome processes using debugging port
        if os.name == 'nt':
            try:
                # Use findstr to check first if there are chrome processes before killing
                result = subprocess.run("tasklist | findstr chrome.exe", shell=True, 
                                      stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
                if "chrome.exe" in result.stdout:
                    print("Found Chrome processes still running, attempting to terminate")
                    subprocess.run("taskkill /F /IM chrome.exe", shell=True, 
                                  stderr=subprocess.PIPE)
                else:
                    print("No remaining Chrome processes found")
            except Exception as e:
                print(f"Failed to check/kill Chrome processes: {e}")
                
        # Reset the list
        chrome_processes = []

def cleanup_temp_profiles():
    """Clean up all temporary profile directories created during this run"""
    global temp_profiles
    
    # First ensure all Chrome processes are terminated
    print("Terminating Chrome processes before cleanup...")
    kill_chrome_process()
    
    # Wait a moment to ensure files are released
    time.sleep(2)
    
    # Track which profiles were successfully cleaned up
    cleaned_profiles = []
    failed_profiles = []
    
    # Now try to remove the profile directories
    for profile_dir in temp_profiles:
        try:
            if os.path.exists(profile_dir):
                print(f"Cleaning up temporary profile: {profile_dir}")
                # Try to ensure all handles to files in this directory are closed
                if os.name == 'nt':
                    try:
                        # On Windows, we can use handle.exe from SysInternals (if available)
                        # This is optional and will be skipped if not available
                        current_dir = os.path.dirname(os.path.abspath(__file__))
                        handle_path = os.path.join(current_dir, "tools", "handle.exe")
                        if os.path.exists(handle_path):
                            print(f"Using handle.exe to check for open handles to {profile_dir}")
                            subprocess.run([handle_path, profile_dir], 
                                          shell=True, 
                                          stdout=subprocess.PIPE,
                                          stderr=subprocess.PIPE)
                    except Exception as handle_err:
                        print(f"Warning: Failed to check handles: {handle_err}")
                
                # Use different deletion strategies based on errors
                try:
                    # First try a normal delete
                    shutil.rmtree(profile_dir, ignore_errors=False)
                    cleaned_profiles.append(profile_dir)
                except PermissionError:
                    print(f"Permission error when deleting {profile_dir}, trying with ignore_errors=True")
                    # If we get a permission error, try with ignore_errors=True
                    shutil.rmtree(profile_dir, ignore_errors=True)
                    # Verify if it was actually removed
                    if not os.path.exists(profile_dir):
                        cleaned_profiles.append(profile_dir)
                    else:
                        failed_profiles.append(profile_dir)
                except Exception as e:
                    print(f"First attempt to delete {profile_dir} failed: {e}")
                    failed_profiles.append(profile_dir)
            else:
                print(f"Profile directory already gone: {profile_dir}")
                cleaned_profiles.append(profile_dir)
        except Exception as e:
            print(f"Error cleaning up profile {profile_dir}: {e}")
            failed_profiles.append(profile_dir)
    
    # Try one more time for failed profiles after a longer delay
    if failed_profiles:
        print(f"{len(failed_profiles)} profile(s) could not be deleted, will retry after delay")
        time.sleep(5)  # Longer delay
        
        retry_failed = []
        for profile_dir in failed_profiles:
            try:
                if os.path.exists(profile_dir):
                    print(f"Retrying cleanup of profile: {profile_dir}")
                    shutil.rmtree(profile_dir, ignore_errors=True)
                    if not os.path.exists(profile_dir):
                        print(f"Successfully cleaned up on retry: {profile_dir}")
                    else:
                        print(f"Still could not clean up: {profile_dir}")
                        retry_failed.append(profile_dir)
                else:
                    print(f"Profile already removed during delay: {profile_dir}")
            except Exception as e2:
                print(f"Error during retry for {profile_dir}: {e2}")
                retry_failed.append(profile_dir)
        
        if retry_failed:
            print(f"WARNING: {len(retry_failed)} profile(s) could not be cleaned up")
            for failed in retry_failed:
                print(f"  - {failed}")
            print("These directories may need to be manually deleted later")
    
    # Reset the list to only include profiles we couldn't clean up
    temp_profiles = failed_profiles if failed_profiles else []
    
    # Check if chrome_profiles directory is empty, if so delete it
    current_dir = os.path.dirname(os.path.abspath(__file__))
    profiles_dir = os.path.join(current_dir, "chrome_profiles")
    
    if os.path.exists(profiles_dir):
        try:
            # Check if directory is empty
            contents = os.listdir(profiles_dir)
            if not contents:
                print(f"Removing empty chrome_profiles directory")
                os.rmdir(profiles_dir)
            else:
                print(f"chrome_profiles directory not empty, contains {len(contents)} items")
                # List the first few items for debugging
                for item in contents[:3]:
                    print(f"  - {item}")
                if len(contents) > 3:
                    print(f"  - ... and {len(contents) - 3} more")
        except Exception as e:
            print(f"Error removing chrome_profiles directory: {e}")

def kill_existing_chrome_debugging_sessions(port):
    """Kill any existing Chrome processes using the specified debugging port"""
    try:
        print(f"Checking for Chrome processes on port {port}...")
        found_processes = False
        
        # Windows
        if os.name == 'nt':
            # First check if any process is using the port
            netstat_result = subprocess.run(
                f'netstat -aon | findstr ":{port}"', 
                shell=True, 
                stdout=subprocess.PIPE, 
                stderr=subprocess.PIPE, 
                text=True
            )
            
            if netstat_result.stdout.strip():
                print(f"Found processes using port {port}")
                found_processes = True
                
                # Extract PIDs from netstat result
                pids = []
                for line in netstat_result.stdout.strip().split('\n'):
                    parts = line.strip().split()
                    if len(parts) >= 5:
                        try:
                            pid = int(parts[4])
                            if pid > 0:
                                pids.append(pid)
                        except ValueError:
                            pass
                
                # Kill each process individually
                for pid in pids:
                    try:
                        if psutil.pid_exists(pid):
                            process = psutil.Process(pid)
                            process_name = process.name().lower()
                            if "chrome" in process_name:
                                print(f"Terminating Chrome process with PID {pid}")
                                process.terminate()
                                try:
                                    process.wait(timeout=3)
                                except psutil.TimeoutExpired:
                                    print(f"Process {pid} didn't terminate in time, force killing")
                                    if os.name == 'nt':
                                        subprocess.run(f"taskkill /F /PID {pid}", shell=True, stderr=subprocess.PIPE)
                            else:
                                print(f"Process {pid} using port {port} is not Chrome ({process_name}), skipping")
                    except Exception as e:
                        print(f"Error terminating process {pid}: {e}")
            else:
                print(f"No processes found using port {port}")
        if found_processes:
            print(f"Killed existing Chrome processes on port {port}")
        else:
            print(f"No Chrome processes found on port {port}")
            
    except Exception as e:
        print(f"Error while checking for Chrome processes on port {port}: {e}")
        # Continue execution despite errors

def launch_fresh_chrome(debugging_port=9222):
    """Launch a fresh Chrome instance with remote debugging enabled"""
    # Kill any existing Chrome debugging sessions
    kill_existing_chrome_debugging_sessions(debugging_port)
    
    # Create a new temporary profile directory
    temp_profile_dir = create_temp_profile()
    
    # Find Chrome executable
    chrome_path = get_chrome_path()
    if not chrome_path:
        raise Exception("Chrome executable not found. Please ensure Chrome is installed.")
    
    # Build the command
    command = [
        chrome_path,
        f"--remote-debugging-port={debugging_port}",
        f"--user-data-dir={temp_profile_dir}",
        "--disable-blink-features=AutomationControlled",
        "--disable-extensions",
        "--start-maximized",
        "--incognito",  # Use incognito mode for a clean session
        "--no-first-run",
        "--no-default-browser-check",
        # Add additional options to make it more reliable
        "--no-sandbox",
        "--disable-dev-shm-usage"
    ]
    
    # Launch Chrome
    try:
        print(f"Launching Chrome with command: {' '.join(command)}")
        chrome_process = subprocess.Popen(command)
        print(f"Chrome launched with PID: {chrome_process.pid}")
        
        # Add to the list of Chrome processes to clean up later
        global chrome_processes
        chrome_processes.append(chrome_process.pid)
        
        time.sleep(3)  # Give Chrome time to start up
        return chrome_process, temp_profile_dir
    except Exception as e:
        print(f"Failed to launch Chrome: {e}")
        return None, temp_profile_dir

def connect_to_chrome(remote_port=9222):
    """Connect to a running Chrome instance with remote debugging enabled"""
    try:
        print(f"Connecting to Chrome on 127.0.0.1:{remote_port}")
        options = webdriver.ChromeOptions()
        options.add_experimental_option("debuggerAddress", f"127.0.0.1:{remote_port}")
        
        # Try to find chromedriver in PATH
        driver = webdriver.Chrome(options=options)
        
        print("Successfully connected to Chrome")
        return driver
    except Exception as e:
        print(f"Failed to connect to Chrome: {e}")
        return None 