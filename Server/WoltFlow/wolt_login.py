import json
import time
import os
import random
import shutil
import uuid
import pyotp
import subprocess
import signal
import psutil
import logging
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Configure logging first to avoid 'logger not defined' error
logger = logging.getLogger("WoltLogin")
logger.setLevel(logging.INFO)
if not logger.handlers:
    logger.addHandler(logging.StreamHandler())

# Setup directories
screenshots_dir = os.environ.get("SCREENSHOTS_DIR")
if not screenshots_dir:
    # For non-Lambda environments
    current_dir = os.path.dirname(os.path.abspath(__file__))
    if os.path.exists("/var/task"):
        # In Lambda, use /tmp for writable storage
        screenshots_dir = "/tmp/screenshots"
    else:
        screenshots_dir = os.path.join(current_dir, 'screenshots')

# Create screenshots directory if it doesn't exist
if not os.path.exists(screenshots_dir):
    os.makedirs(screenshots_dir)
    
logger.info(f"Using screenshots directory: {screenshots_dir}")

# SQLAlchemy Base
Base = declarative_base()

# Define User model
class User(Base):
    """User model for SQLAlchemy"""
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    gmail_email = Column(String, nullable=False)
    gmail_password = Column(String, nullable=False)
    totp_secret = Column(String, nullable=True)
    last_login = Column(String, nullable=True)
    login_status = Column(String, nullable=True)
    # New fields
    cibus_email = Column(String, nullable=True)
    cibus_password = Column(String, nullable=True)
    cibus_company = Column(String, nullable=True)
    gift_amount = Column(String, nullable=True)
    email = Column(String, nullable=True)
    password = Column(String, nullable=True)
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.gmail_email})>"

# Track temporary profiles for cleanup
temp_profiles = []
chrome_processes = []

def random_sleep(min_seconds=1, max_seconds=3):
    """Sleep for a random amount of time to mimic human behavior"""
    time.sleep(random.uniform(min_seconds, max_seconds))

def human_type(element, text):
    """Type text like a human with random delays between keystrokes"""
    for char in text:
        element.send_keys(char)
        time.sleep(random.uniform(0.05, 0.2))

def get_chrome_path():
    """Find the Chrome executable path"""
    # First check if Chrome path is set in environment variable (for Lambda)
    chrome_path_env = os.environ.get("CHROME_PATH")
    if chrome_path_env and os.path.exists(chrome_path_env):
        logger.info(f"Using Chrome from environment variable: {chrome_path_env}")
        return chrome_path_env
    
    # Get the absolute path to the current directory
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Check Lambda specific location
    lambda_chrome_path = "/opt/chrome/chrome"
    if os.path.exists(lambda_chrome_path):
        logger.info(f"Using Chrome from Lambda path: {lambda_chrome_path}")
        return lambda_chrome_path
    
    # First check standard Linux Chrome locations (higher priority in Docker)
    linux_chrome_paths = [
        "/usr/bin/google-chrome",  # Standard Debian/Ubuntu location
        "/usr/bin/google-chrome-stable",  # Alternative Linux location
        "/opt/google/chrome/chrome"  # Another possible location
    ]
    
    for path in linux_chrome_paths:
        if os.path.exists(path):
            logger.info(f"Using Chrome from Linux path: {path}")
            return path
    
    # Try several possible paths for the local Chrome installation
    local_chrome_paths = [
        os.path.join(current_dir, "chrome", "chrome.exe"),  # Direct in chrome folder - prioritize this
    ]
    
    # Look for chrome.exe in the 136.0.7103.114 folder - there might not be one there
    version_dir = os.path.join(current_dir, "chrome", "136.0.7103.114")
    if os.path.exists(version_dir):
        local_chrome_paths.append(os.path.join(version_dir, "chrome.exe"))
    
    for path in local_chrome_paths:
        if os.path.exists(path):
            logger.info(f"Using Chrome from local path: {path}")
            return path
    
    # Fallback paths if local Chrome is not found
    chrome_paths = [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",  # Windows
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",  # Windows 32-bit on 64-bit
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",  # macOS
    ]
    
    for path in chrome_paths:
        if os.path.exists(path):
            logger.info(f"Using Chrome from system path: {path}")
            return path
    
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
            profiles_dir = os.path.join(current_dir, "chrome_profiles")
    
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
        
        # Linux/Mac
        else:
            lsof_result = subprocess.run(
                f"lsof -ti tcp:{port}", 
                shell=True, 
                stdout=subprocess.PIPE, 
                stderr=subprocess.PIPE, 
                text=True
            )
            
            if lsof_result.stdout.strip():
                found_processes = True
                pids = lsof_result.stdout.strip().split('\n')
                
                for pid_str in pids:
                    try:
                        pid = int(pid_str.strip())
                        if pid > 0 and psutil.pid_exists(pid):
                            process = psutil.Process(pid)
                            if "chrome" in process.name().lower():
                                print(f"Terminating Chrome process with PID {pid}")
                                process.terminate()
                                try:
                                    process.wait(timeout=3)
                                except psutil.TimeoutExpired:
                                    print(f"Process {pid} didn't terminate in time, force killing")
                                    os.kill(pid, signal.SIGKILL)
                    except Exception as e:
                        print(f"Error terminating process {pid}: {e}")
        
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

def safe_click(driver, element):
    """Click an element safely with JavaScript to avoid mouse movement errors"""
    try:
        # First ensure element is visible and scrolled into view
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", element)
        random_sleep(0.5, 1)
        
        # Click using JavaScript (more reliable)
        driver.execute_script("arguments[0].click();", element)
        return True
    except Exception as e:
        print(f"Click failed: {e}")
        return False

def login_to_wolt(driver, email=None, password=None, totp_secret=None):
    """Navigate to Wolt and log in with Google
    
    Args:
        driver: Selenium WebDriver instance
        email: Google email address
        password: Google password
        totp_secret: TOTP secret for 2FA (can include spaces)
        
    Returns:
        bool: True if login was successful, False otherwise
    """
    try:
        # Set up TOTP generator if secret provided
        totp = None
        if totp_secret:
            # Clean the secret by removing spaces and any other non-base32 characters
            clean_totp_secret = totp_secret.replace(' ', '').replace('-', '').upper()
            totp = pyotp.TOTP(clean_totp_secret)
        
        # Go to Wolt's Israeli site
        print("Navigating to Wolt...")
        driver.get("https://wolt.com/he/isr")
        random_sleep(3, 5)  # Wait for page to load
        
        # Find and click login button - using Hebrew text "כניסה"
        print("Looking for login button (כניסה)...")
        login_buttons = driver.find_elements(By.XPATH, "//*[contains(text(), 'כניסה')]")
        
        if not login_buttons:
            print("No login button found with text 'כניסה'. Trying alternative approaches...")
            # Try different approaches
            login_buttons = driver.find_elements(By.XPATH, "//button[contains(@class, 'LoginButton')]")
            if not login_buttons:
                login_buttons = driver.find_elements(By.TAG_NAME, "button")
                print(f"Found {len(login_buttons)} buttons on page")
        
        if login_buttons:
            print(f"Found {len(login_buttons)} potential login buttons")
            for i, btn in enumerate(login_buttons):
                try:
                    print(f"Button {i}: {btn.text} - {btn.get_attribute('class')}")
                except:
                    print(f"Button {i}: [Could not get text]")
            
            # Click the first button that likely contains the login text
            login_clicked = False
            for btn in login_buttons:
                try:
                    if "כניסה" in btn.text or "LoginButton" in btn.get_attribute("class"):
                        print(f"Clicking button: {btn.text}")
                        if safe_click(driver, btn):
                            login_clicked = True
                            break
                except:
                    continue
            
            if not login_clicked:
                print("Could not click any login button")
                driver.save_screenshot(os.path.join(screenshots_dir, 'login_button_failed.png'))
                return False
        else:
            print("No login buttons found!")
            driver.save_screenshot(os.path.join(screenshots_dir, 'no_login_button.png'))
            return False
            
        random_sleep(2, 4)
        
        # Find and click Google login option - using Hebrew text "כניסה דרך גוגל"
        print("Selecting Google login option (כניסה דרך גוגל)...")
        google_buttons = driver.find_elements(By.XPATH, "//*[contains(text(), 'גוגל')]")
        
        if not google_buttons:
            print("No Google button found. Trying alternative approaches...")
            google_buttons = driver.find_elements(By.XPATH, "//button[contains(@class, 'SocialButton')]")
        
        if google_buttons:
            print(f"Found {len(google_buttons)} potential Google buttons")
            for i, btn in enumerate(google_buttons):
                try:
                    print(f"Button {i}: {btn.text} - {btn.get_attribute('class')}")
                except:
                    print(f"Button {i}: [Could not get text]")
            
            # Click the first button that likely contains Google
            google_clicked = False
            for btn in google_buttons:
                try:
                    if "גוגל" in btn.text or "Google" in btn.text or "google" in btn.get_attribute("class").lower():
                        print(f"Clicking Google button: {btn.text}")
                        if safe_click(driver, btn):
                            google_clicked = True
                            break
                except:
                    continue
                    
            if not google_clicked:
                print("Could not click any Google button")
                driver.save_screenshot(os.path.join(screenshots_dir, 'google_button_failed.png'))
                return False
        else:
            print("No Google login buttons found!")
            driver.save_screenshot(os.path.join(screenshots_dir, 'no_google_button.png'))
            return False
            
        random_sleep(5, 8)
        
        # At this point, we need to handle Google login if credentials were provided
        if email and password:
            try:
                print("Attempting to automatically log in with Google...")
                # Handle potential popup
                if len(driver.window_handles) > 1:
                    print(f"Switching to Google popup (window handles: {len(driver.window_handles)})")
                    driver.switch_to.window(driver.window_handles[-1])
                
                # Wait for and enter email
                print("Waiting for email field...")
                email_input = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.ID, "identifierId"))
                )
                print("Found email field, entering email...")
                email_input.clear()
                human_type(email_input, email)
                
                # Click Next
                next_buttons = driver.find_elements(By.XPATH, "//span[text()='Next']/parent::button")
                if next_buttons:
                    print("Clicking Next button after email...")
                    safe_click(driver, next_buttons[0])
                else:
                    print("Next button not found, pressing Enter...")
                    email_input.send_keys(Keys.ENTER)
                
                random_sleep(2, 4)
                
                # Wait for and enter password
                print("Waiting for password field...")
                password_input = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.XPATH, "//input[@type='password']"))
                )
                print("Found password field, entering password...")
                password_input.clear()
                human_type(password_input, password)
                
                # Click Next
                next_buttons = driver.find_elements(By.XPATH, "//span[text()='Next']/parent::button")
                if next_buttons:
                    print("Clicking Next button after password...")
                    safe_click(driver, next_buttons[0])
                else:
                    print("Next button not found, pressing Enter...")
                    password_input.send_keys(Keys.ENTER)
                
                random_sleep(2, 4)
                
                # Handle the alternative authentication flow
                try:
                    # Look for "דרך אחרת" (another way) button
                    print("Looking for 'דרך אחרת' (another way) button...")
                    other_way_buttons = driver.find_elements(By.XPATH, "//*[contains(text(), 'דרך אחרת')]")
                    
                    if not other_way_buttons:
                        # Try alternative text/approaches
                        other_way_buttons = driver.find_elements(By.XPATH, "//div[contains(text(), 'Another way')]")
                        if not other_way_buttons:
                            other_way_buttons = driver.find_elements(By.XPATH, "//div[contains(text(), 'another way')]")
                            if not other_way_buttons:
                                other_way_buttons = driver.find_elements(By.XPATH, "//button[contains(@class, 'VfPpkd-LgbsSe')]")
                    
                    if other_way_buttons:
                        print(f"Found 'another way' button. Clicking...")
                        for btn in other_way_buttons:
                            if "דרך אחרת" in btn.text or "Another way" in btn.text or "another way" in btn.text:
                                print(f"Clicking button with text: {btn.text}")
                                safe_click(driver, btn)
                                random_sleep(2, 4)
                                break
                        
                        # Now look for "קבל קוד אימות מאפליקציית" (Get verification code from application)
                        print("Looking for 'קבל קוד אימות מאפליקציית' (Get verification code) option...")
                        verify_app_options = driver.find_elements(By.XPATH, "//*[contains(text(), 'קוד אימות')]")
                        
                        if not verify_app_options:
                            # Try alternative text/approaches
                            verify_app_options = driver.find_elements(By.XPATH, "//*[contains(text(), 'authenticator')]")
                            if not verify_app_options:
                                verify_app_options = driver.find_elements(By.XPATH, "//*[contains(text(), 'Authenticator')]")
                                if not verify_app_options:
                                    verify_app_options = driver.find_elements(By.XPATH, "//div[contains(@class, 'vR13ke')]")
                        
                        if verify_app_options:
                            print(f"Found verification app option. Clicking...")
                            for option in verify_app_options:
                                if "קוד אימות" in option.text or "authenticator" in option.text.lower():
                                    print(f"Clicking option with text: {option.text}")
                                    safe_click(driver, option)
                                    random_sleep(2, 4)
                                    break
                        else:
                            print("Could not find verification app option")
                            driver.save_screenshot(os.path.join(screenshots_dir, 'no_verification_option.png'))
                    else:
                        print("Could not find 'another way' button")
                        driver.save_screenshot(os.path.join(screenshots_dir, 'no_another_way_button.png'))
                
                except Exception as e:
                    print(f"Error handling alternative authentication flow: {e}")
                    driver.save_screenshot(os.path.join(screenshots_dir, 'auth_flow_error.png'))
                
                # Handle 2FA if prompted
                if totp:
                    try:
                        print("Checking for 2FA prompt...")
                        # Wait a bit for the 2FA screen to load
                        random_sleep(3, 5)
                        
                        # Try multiple selectors to find the 2FA input field
                        totp_input = None
                        selectors = [
                            "//input[@autocomplete='one-time-code']",
                            "//input[@type='tel']",  # Often used for numeric inputs
                            "//input[contains(@class, 'whsOnd')]",  # Google's input class
                            "//input[contains(@class, 'VwCw')]",  # Another Google class
                            "//div[contains(@class, 'Xb9hP')]//input",  # Container with input
                            "//form//input[not(@type='hidden')]"  # Any visible form input
                        ]
                        
                        for selector in selectors:
                            print(f"Trying to find 2FA input with: {selector}")
                            try:
                                elements = driver.find_elements(By.XPATH, selector)
                                if elements:
                                    for elem in elements:
                                        try:
                                            if elem.is_displayed():
                                                totp_input = elem
                                                print(f"Found potential 2FA input field: {selector}")
                                                break
                                        except:
                                            continue
                                if totp_input:
                                    break
                            except:
                                continue
                        
                        if not totp_input:
                            print("Could not find 2FA input field with standard selectors")
                            # Try to find any input that might be relevant
                            inputs = driver.find_elements(By.TAG_NAME, "input")
                            for inp in inputs:
                                try:
                                    if inp.is_displayed():
                                        totp_input = inp
                                        print("Found fallback input field")
                                        break
                                except:
                                    continue
                        
                        if totp_input:
                            # Generate TOTP code
                            print("Generating TOTP code...")
                            code = totp.now()
                            print(f"Generated code: {code}")
                            
                            # Clear and enter code
                            totp_input.clear()
                            human_type(totp_input, code)
                            random_sleep(1, 2)
                            
                            # Find and click next/verify button using various selectors
                            next_button = None
                            next_selectors = [
                                "//span[text()='Verify']/parent::button",
                                "//span[text()='Next']/parent::button",
                                "//span[text()='Continue']/parent::button",
                                "//span[contains(text(), 'הבא')]/parent::button",  # Hebrew "Next"
                                "//span[contains(text(), 'אימות')]/parent::button",  # Hebrew "Verify"
                                "//span[contains(text(), 'המשך')]/parent::button",  # Hebrew "Continue"
                                "//button[contains(@class, 'VfPpkd-LgbsSe')]",  # Google's button class
                                "//button[@type='submit']",
                                "//div[@role='button']",
                            ]
                            
                            for selector in next_selectors:
                                print(f"Trying to find next button with: {selector}")
                                try:
                                    elements = driver.find_elements(By.XPATH, selector)
                                    if elements:
                                        for elem in elements:
                                            try:
                                                if elem.is_displayed():
                                                    next_button = elem
                                                    print(f"Found potential next button: {selector}")
                                                    break
                                            except:
                                                continue
                                    if next_button:
                                        break
                                except:
                                    continue
                            
                            if next_button:
                                print("Clicking next/verify button...")
                                safe_click(driver, next_button)
                            else:
                                print("No next button found, trying Enter key...")
                                totp_input.send_keys(Keys.ENTER)
                            
                            random_sleep(3, 5)
                            print("2FA code submitted")
                        else:
                            print("Could not find any input field for 2FA code")
                            driver.save_screenshot(os.path.join(screenshots_dir, 'no_2fa_input_found.png'))
                    except Exception as e:
                        print(f"Error handling 2FA: {e}")
                        driver.save_screenshot(os.path.join(screenshots_dir, 'error_2fa.png'))
            except Exception as e:
                print(f"Auto-login failed: {e}")
                driver.save_screenshot(os.path.join(screenshots_dir, 'auto_login_failed.png'))
                return False
        
        # Check if login was successful after automation
        print("Verifying login status...")
        
        # Make sure we're back on the main window (Wolt)
        if len(driver.window_handles) > 1:
            print(f"Multiple windows detected ({len(driver.window_handles)}), switching back to main window")
            driver.switch_to.window(driver.window_handles[0])
            
        # Give a moment for the page to refresh/load
        random_sleep(3, 5)
        
        # Define login success indicators
        logged_in_indicators = [
            "//img[@alt='פרופיל']",  # Hebrew "Profile" image - most reliable indicator
            "//div[contains(@class, 'UserAvatar')]",
            "//button[contains(@class, 'UserMenuButton')]",
            "//div[contains(@class, 'ProfileButton')]",
            "//*[contains(text(), 'Account')]",
            "//*[contains(text(), 'חשבון')]",  # Hebrew for "Account"
            "//button[contains(@class, 'ProfileLink')]",  # Additional indicator
            "//div[contains(@class, 'Header')]//button[contains(@class, 'Button')]"  # Any button in header
        ]
        
        # Check if login was successful
        driver.save_screenshot(os.path.join(screenshots_dir, 'login_verification.png'))
        login_successful = False
        try:
            for xpath in logged_in_indicators:
                elements = driver.find_elements(By.XPATH, xpath)
                if elements:
                    for elem in elements:
                        try:
                            if elem.is_displayed():
                                print(f"Login successful! Found indicator: {xpath}")
                                login_successful = True
                                break
                        except:
                            continue
                if login_successful:
                    break
            
            # If we get here and login_successful is still False, no login indicators were found
            if not login_successful:
                print("Login verification failed: No login indicators found")
                return False
                
            # Continue with gift card selection flow after successful login
            print("Starting gift card selection process...")
            
            try:
                # 1. Navigate to the gift cards page
                print("Navigating to Wolt Gift Cards page...")
                gift_card_url = "https://wolt.com/he/isr/%D7%AA%D7%B4%D7%90,%20%D7%94%D7%A8%D7%A6%D7%9C%D7%99%D7%94%20%D7%95%D7%94%D7%A1%D7%91%D7%99%D7%91%D7%94/venue/woltilgiftcards"
                driver.get(gift_card_url)
                print("Waiting for gift card page to load...")
                random_sleep(5, 8)  # Give more time for page to load
                
                # 2. Click on the 35.00₪ gift card option
                print("Looking for 35.00₪ gift card option...")
                gift_card_xpath = "(//span[contains(normalize-space(.), '35.00')])[1]"
                
                # Wait for the element to be clickable
                try:
                    gift_card_element = WebDriverWait(driver, 15).until(
                        EC.element_to_be_clickable((By.XPATH, gift_card_xpath))
                    )
                    print("Found 35.00₪ gift card element, clicking...")
                    safe_click(driver, gift_card_element)
                    print("Gift card selected successfully!")
                    
                    # Wait for any animations or page changes
                    random_sleep(3, 5)
                    
                    # Take final screenshot of the gift card selection
                    print("Taking final screenshot of gift card selection...")
                    final_screenshot_path = os.path.join(screenshots_dir, 'gift_card_selected.png')
                    driver.save_screenshot(final_screenshot_path)
                    print(f"Final screenshot saved to: {final_screenshot_path}")
                    
                    # Clean up old screenshots that are not errors or the final screenshot
                    cleanup_screenshots(screenshots_dir, ['error', 'failed', 'gift_card_selected.png'])
                    
                    return True
                except Exception as card_err:
                    print(f"Error selecting gift card: {card_err}")
                    driver.save_screenshot(os.path.join(screenshots_dir, 'gift_card_error.png'))
                    # Even though gift card selection failed, login was successful
                    return True
            
            except Exception as gift_err:
                print(f"Error in gift card process: {gift_err}")
                driver.save_screenshot(os.path.join(screenshots_dir, 'gift_card_process_error.png'))
                # Even though gift card process failed, login was successful
                return True
                
        except Exception as e:
            print(f"Error verifying login status: {e}")
            driver.save_screenshot(os.path.join(screenshots_dir, 'verification_error.png'))
            return False
            
    except Exception as e:
        print(f"Login failed with error: {e}")
        driver.save_screenshot(os.path.join(screenshots_dir, 'error_screenshot.png'))
        return False

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

def main():
    """Main function for standalone execution"""
    chrome_process = None
    driver = None
    debugging_port = 9222
    
    try:
        logger.info("Starting WoltFlow login automation...")
        
        # Launch a fresh Chrome instance
        chrome_process, temp_profile_dir = launch_fresh_chrome(debugging_port)
        if not chrome_process:
            logger.error("Failed to launch Chrome")
            return
            
        # Connect to the Chrome instance we just launched
        time.sleep(3)  # Give Chrome time to initialize
        driver = connect_to_chrome(debugging_port)
        if not driver:
            logger.error("Failed to connect to Chrome")
            return
            
        logger.info("Chrome driver initialized successfully")
        
        # Connect to database to get user credentials - ONLY use database, no fallbacks
        try:
            # Get user from PostgreSQL database
            db_url = os.getenv('DATABASE_URL')
            if not db_url:
                logger.error("DATABASE_URL environment variable is not set")
                return False
                
            logger.info(f"Connecting to database: {db_url}")
            
            engine = create_engine(db_url)
            Session = sessionmaker(bind=engine)
            session = Session()
            
            # Get user with ID 1 (for standalone testing)
            user = session.query(User).filter(User.id == 1).first()
            
            if not user:
                logger.error("No user found in database")
                return False
                
            logger.info(f"Using credentials for user ID: {user.id}")
            gmail_email = user.gmail_email
            gmail_password = user.gmail_password
            totp_secret = user.totp_secret
        except Exception as db_err:
            logger.error(f"Database error: {db_err}")
            return False
        
        # Start the login process
        success = login_to_wolt(driver, gmail_email, gmail_password, totp_secret)
        logger.info(f"Login process completed. Success: {success}")
        
        # Return the result
        if success:
            logger.info("Login successful. Script will now exit.")
            # Take a screenshot of the successful login state
            driver.save_screenshot(os.path.join(screenshots_dir, 'successful_login.png'))
            return success
        else:
            logger.error("Login failed. Script will now exit.")
            return False
            
    except KeyboardInterrupt:
        logger.info("\nScript interrupted by user")
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
    finally:
        logger.info("Shutting down Chrome...")
        if driver:
            try:
                driver.quit()
                logger.info("Selenium driver closed")
            except Exception as driver_err:
                logger.error(f"Error closing Selenium driver: {driver_err}")
                
        if chrome_process:
            try:
                # Check if process is still running before trying to terminate
                if psutil.pid_exists(chrome_process.pid):
                    logger.info(f"Terminating Chrome process with PID {chrome_process.pid}")
                    chrome_process.terminate()
                    try:
                        chrome_process.wait(timeout=5)
                        logger.info("Chrome process terminated cleanly")
                    except subprocess.TimeoutExpired:
                        logger.warning("Chrome did not terminate in time, forcing...")
                        chrome_process.kill()
                else:
                    logger.info(f"Chrome process (PID {chrome_process.pid}) already terminated")
            except Exception as proc_err:
                logger.error(f"Error terminating Chrome process: {proc_err}")
                
        # Make sure all Chrome processes related to our script are terminated
        logger.info("Making sure all Chrome processes are terminated...")
        kill_chrome_process()  
        
        logger.info("Cleaning up temporary files...")
        cleanup_temp_profiles()
        logger.info("Script finished.")

if __name__ == "__main__":
    main() 