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
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys

# Setup directories
current_dir = os.path.dirname(os.path.abspath(__file__))
screenshots_dir = os.path.join(current_dir, 'screenshots')

# Create screenshots directory if it doesn't exist
if not os.path.exists(screenshots_dir):
    os.makedirs(screenshots_dir)

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
    chrome_paths = [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",  # Windows
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",  # Windows 32-bit on 64-bit
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",  # macOS
        "/usr/bin/google-chrome",  # Linux
        "/usr/bin/google-chrome-stable"  # Linux
    ]
    
    for path in chrome_paths:
        if os.path.exists(path):
            return path
    
    return None

def create_temp_profile():
    """Create a temporary Chrome profile directory"""
    # Create a unique temp directory name
    temp_dir = os.path.join(current_dir, f"temp_profile_{uuid.uuid4().hex[:8]}")
    if not os.path.exists(temp_dir):
        os.makedirs(temp_dir)
    
    # Add to the list of temp profiles to clean up later
    global temp_profiles
    temp_profiles.append(temp_dir)
    
    return temp_dir

def kill_chrome_process(pid=None):
    """Terminate Chrome processes"""
    global chrome_processes
    
    if pid:
        try:
            process = psutil.Process(pid)
            if "chrome" in process.name().lower():
                print(f"Terminating Chrome process with PID {pid}")
                process.terminate()
                process.wait(timeout=3)  # Wait for process to terminate
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.TimeoutExpired) as e:
            print(f"Error terminating Chrome process {pid}: {e}")
            try:
                if os.name == 'nt':
                    subprocess.run(f"taskkill /F /PID {pid}", shell=True)
                else:
                    os.kill(pid, signal.SIGKILL)
            except Exception as e:
                print(f"Failed to force kill process {pid}: {e}")
    else:
        # Kill all tracked Chrome processes
        for chrome_pid in chrome_processes:
            try:
                print(f"Terminating Chrome process with PID {chrome_pid}")
                if psutil.pid_exists(chrome_pid):
                    process = psutil.Process(chrome_pid)
                    process.terminate()
                    process.wait(timeout=3)
            except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.TimeoutExpired) as e:
                print(f"Error terminating Chrome process {chrome_pid}: {e}")
                try:
                    if os.name == 'nt':
                        subprocess.run(f"taskkill /F /PID {chrome_pid}", shell=True)
                    else:
                        os.kill(chrome_pid, signal.SIGKILL)
                except Exception as e:
                    print(f"Failed to force kill process {chrome_pid}: {e}")
                    
        # Additional check for Chrome processes using debugging port
        if os.name == 'nt':
            try:
                subprocess.run("taskkill /F /IM chrome.exe", shell=True)
            except Exception as e:
                print(f"Failed to kill Chrome processes: {e}")
                
        # Reset the list
        chrome_processes = []

def cleanup_temp_profiles():
    """Clean up all temporary profile directories created during this run"""
    global temp_profiles
    
    # First ensure all Chrome processes are terminated
    kill_chrome_process()
    
    # Wait a moment to ensure files are released
    time.sleep(2)
    
    # Now try to remove the profile directories
    for profile_dir in temp_profiles:
        try:
            if os.path.exists(profile_dir):
                print(f"Cleaning up temporary profile: {profile_dir}")
                shutil.rmtree(profile_dir, ignore_errors=True)
        except Exception as e:
            print(f"Error cleaning up profile {profile_dir}: {e}")
            # Try again with a delay
            try:
                time.sleep(1)
                if os.path.exists(profile_dir):
                    shutil.rmtree(profile_dir, ignore_errors=True)
            except Exception as e2:
                print(f"Second attempt failed: {e2}")
    
    # Reset the list
    temp_profiles = []

def kill_existing_chrome_debugging_sessions(port):
    """Kill any existing Chrome processes using the specified debugging port"""
    try:
        # Windows
        if os.name == 'nt':
            os.system(f'for /f "tokens=5" %a in (\'netstat -aon ^| findstr :{port}\') do taskkill /F /PID %a')
        # Linux/Mac
        else:
            os.system(f"lsof -ti tcp:{port} | xargs kill -9")
        print(f"Killed any existing Chrome processes on port {port}")
    except:
        pass  # Ignore errors

def launch_fresh_chrome(debugging_port=9222):
    """Launch a fresh Chrome instance with remote debugging enabled"""
    # Kill any existing Chrome debugging sessions
    kill_existing_chrome_debugging_sessions(debugging_port)
    
    # Create a new temporary profile directory
    temp_profile_dir = create_temp_profile()
    print(f"Created temporary profile at: {temp_profile_dir}")
    
    # Find Chrome executable
    chrome_path = get_chrome_path()
    if not chrome_path:
        raise Exception("Chrome executable not found. Please specify the path manually.")
    
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
        "--no-default-browser-check"
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
        try:
            for xpath in logged_in_indicators:
                elements = driver.find_elements(By.XPATH, xpath)
                if elements:
                    for elem in elements:
                        try:
                            if elem.is_displayed():
                                print(f"Login successful! Found indicator: {xpath}")
                                return True
                        except:
                            continue
            
            # If we get here, no login indicators were found
            print("Login verification failed: No login indicators found")
            return False
        except Exception as e:
            print(f"Error verifying login status: {e}")
            driver.save_screenshot(os.path.join(screenshots_dir, 'verification_error.png'))
            return False
            
    except Exception as e:
        print(f"Login failed with error: {e}")
        driver.save_screenshot(os.path.join(screenshots_dir, 'error_screenshot.png'))
        return False

def main():
    """Main function for standalone execution"""
    chrome_process = None
    driver = None
    debugging_port = 9222
    
    try:
        print("Starting WoltFlow login automation...")
        
        # Launch a fresh Chrome instance
        chrome_process, temp_profile_dir = launch_fresh_chrome(debugging_port)
        if not chrome_process:
            print("Failed to launch Chrome")
            return
            
        # Connect to the Chrome instance we just launched
        time.sleep(3)  # Give Chrome time to initialize
        driver = connect_to_chrome(debugging_port)
        if not driver:
            print("Failed to connect to Chrome")
            return
            
        print("Chrome driver initialized successfully")
        
        # Try to load credentials from db.json using UserModel if available
        try:
            from models import UserModel
            user_model = UserModel()
            user = user_model.get_user_by_id(1)  # Get user with ID 1
            
            if user:
                print("Using credentials from db.json")
                gmail_email = user.get('gmail_email')
                gmail_password = user.get('gmail_password')
                totp_secret = user.get('totp_secret')
            else:
                # Fall back to environment variables
                print("User not found in db.json, trying environment variables")
                gmail_email = os.environ.get("GOOGLE_EMAIL")
                gmail_password = os.environ.get("GOOGLE_PASSWORD")
                # No TOTP in environment variables, need to check secret.json
        except ImportError:
            print("UserModel not available, trying environment variables")
            gmail_email = os.environ.get("GOOGLE_EMAIL")
            gmail_password = os.environ.get("GOOGLE_PASSWORD")
            totp_secret = None
        
        # If still no credentials, try to load from secret.json as fallback
        if not gmail_email or not gmail_password or not totp_secret:
            try:
                with open(os.path.join(current_dir, 'secret.json'), 'r') as f:
                    secrets = json.load(f)
                
                print("Using credentials from secret.json")
                if not gmail_email:
                    gmail_email = secrets.get("email")
                if not gmail_password:
                    gmail_password = secrets.get("password")
                if not totp_secret:
                    totp_secret = secrets.get("totp")
            except FileNotFoundError:
                print("No secret.json file found")
        
        if not gmail_email or not gmail_password:
            print("Error: No credentials found in any source")
            return False
        
        # Start the login process
        success = login_to_wolt(driver, gmail_email, gmail_password, totp_secret)
        print(f"Login process completed. Success: {success}")
        
        # Keep the browser open for the user to continue using it
        print("Chrome will remain open for your use.")
        print("Press Ctrl+C to exit the script (Chrome will be closed).")
        while True:
            time.sleep(10)
            
    except KeyboardInterrupt:
        print("\nScript interrupted by user")
    except Exception as e:
        print(f"Unexpected error: {e}")
    finally:
        print("Shutting down Chrome...")
        if chrome_process:
            try:
                chrome_process.terminate()
                chrome_process.wait(timeout=5)
            except:
                pass
                
        kill_chrome_process()  # Make sure all Chrome processes are terminated
        
        print("Cleaning up temporary files...")
        cleanup_temp_profiles()
        print("Script finished.")

if __name__ == "__main__":
    main() 