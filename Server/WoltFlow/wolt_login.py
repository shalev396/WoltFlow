#python imports
import time
import os
import pyotp
import subprocess
import psutil
#libraries imports
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
#project imports
from utils.system_util import cleanup_screenshots, setup_screenshots_dir, setup_logging
from utils.stealth_util import random_sleep, human_type, safe_click
from utils.chrome_util import kill_chrome_process, cleanup_temp_profiles, launch_fresh_chrome, connect_to_chrome
from utils.db_util import create_database_connection
from models.user import User, Base

# Configure logging
logger = setup_logging("WoltLogin")

# Setup screenshots directory
screenshots_dir = setup_screenshots_dir()
logger.info(f"Using screenshots directory: {screenshots_dir}")

# Track temporary profiles for cleanup
temp_profiles = []
chrome_processes = []

def login_to_wolt(driver, email=None, password=None, totp_secret=None, cibus_username=None, cibus_password=None, cibus_company=None):
    """Navigate to Wolt and log in with Google
    
    Args:
        driver: Selenium WebDriver instance
        email: Google account email address
        password: Google password
        totp_secret: TOTP secret for 2FA (can include spaces)
        cibus_username: Cibus username for payment
        cibus_password: Cibus password for payment
        cibus_company: Cibus company name for payment
        
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
                gift_card_url = "https://wolt.com/he/isr/%D7%AA%D7%B4%D7%90,%20%D7%94%D7%A8%D7%A6%D7%9C%D7%99%D7%94%20%D7%95%D7%94%D7%A1%D7%91%D7%99%D7%91%D7%94/venue/woltilgiftcards/itemid-5e2ea8c56e2b3eeaebb62d78"
                # gift_card_url = "https://wolt.com/he/isr/%D7%AA%D7%B4%D7%90,%20%D7%94%D7%A8%D7%A6%D7%9C%D7%99%D7%94%20%D7%95%D7%94%D7%A1%D7%91%D7%99%D7%91%D7%94/venue/woltilgiftcards"
                driver.get(gift_card_url)
                print("Waiting for gift card page to load...")
                random_sleep(5, 8)  # Give more time for page to load
                
                # 2. Click on the 35.00₪ gift card option
                print("Looking for 35.00₪ gift card option...")
                gift_card_xpath = "/html/body/div[2]/div[2]/div[1]/div[1]/main/div[3]/div/div/div[2]/div/div/div[3]/div[4]"
                
                # Wait for the element to be clickable
                try:

                    # Step 1: Wait for "Add to Order" button to appear and click it
                    print("Waiting for 'Add to Order' button (להוסיף להזמנה)...")
                    add_order_xpath = "//span[normalize-space(text())='להוסיף להזמנה']"
                    try:
                        add_order_button = WebDriverWait(driver, 15).until(
                            EC.element_to_be_clickable((By.XPATH, add_order_xpath))
                        )
                        print("Found 'Add to Order' button, clicking...")
                        safe_click(driver, add_order_button)
                        print("'Add to Order' button clicked successfully")
                        random_sleep(3, 5)
                    except Exception as add_err:
                        print(f"Error clicking 'Add to Order' button: {add_err}")
                        driver.save_screenshot(os.path.join(screenshots_dir, 'add_order_error.png'))
                    
                    # Step 2: Navigate to checkout page
                    print("Navigating to checkout page...")
                    checkout_url = "https://wolt.com/he/isr/%D7%AA%D7%B4%D7%90,%20%D7%94%D7%A8%D7%A6%D7%9C%D7%99%D7%94%20%D7%95%D7%94%D7%A1%D7%91%D7%99%D7%91%D7%94/venue/woltilgiftcards/checkout"
                    driver.get(checkout_url)
                    print("Waiting for checkout page to load...")
                    random_sleep(5, 8)
                    
                    # Step 3: Click the specified element on checkout page
                    print("Attempting to click element on checkout page...")
                    checkout_element_xpath = "/html/body/div[2]/div[2]/main/div[4]/div[2]/div[1]/ul/li/a"
                    try:
                        checkout_element = WebDriverWait(driver, 15).until(
                            EC.element_to_be_clickable((By.XPATH, checkout_element_xpath))
                        )
                        print("Found checkout element, clicking...")
                        safe_click(driver, checkout_element)
                        print("Checkout element clicked successfully")
                        random_sleep(3, 5)
                    except Exception as checkout_err:
                        print(f"Error clicking checkout element: {checkout_err}")
                        driver.save_screenshot(os.path.join(screenshots_dir, 'checkout_element_error.png'))
                    
                    # Step 4: Click on Cibus payment option
                    print("Looking for Cibus payment option...")
                    cibus_xpath = "//span[normalize-space(text())='Cibus']"
                    try:
                        cibus_element = WebDriverWait(driver, 15).until(
                            EC.element_to_be_clickable((By.XPATH, cibus_xpath))
                        )
                        print("Found Cibus payment option, clicking...")
                        safe_click(driver, cibus_element)
                        print("Cibus payment option clicked successfully")
                        random_sleep(3, 5)
                        
                        # Step 5: Handle potential modal/popup if shown
                        print("Checking for modal popup...")
                        modal_button_xpath = "/html/body/div[4]/div[8]/div/div[2]/div/aside/div[1]/button"
                        try:
                            # Use a shorter timeout for the modal since it may not appear
                            modal_button = WebDriverWait(driver, 5).until(
                                EC.element_to_be_clickable((By.XPATH, modal_button_xpath))
                            )
                            print("Modal popup found, closing it...")
                            safe_click(driver, modal_button)
                            print("Modal closed successfully")
                            random_sleep(2, 3)
                        except Exception as modal_err:
                            print(f"Modal either not present or not clickable: {modal_err}")
                            print("Continuing with the flow...")
                        
                        # Step 6: Click on "Click to order" button
                        print("Looking for 'Click to order' button (לחצו להזמנה)...")
                        order_button_xpath = "//span[normalize-space(text())='לחצו להזמנה']"
                        try:
                            order_button = WebDriverWait(driver, 15).until(
                                EC.element_to_be_clickable((By.XPATH, order_button_xpath))
                            )
                            print("Found 'Click to order' button, clicking...")
                            safe_click(driver, order_button)
                            print("'Click to order' button clicked successfully")
                            random_sleep(3, 5)
                            
                            # Step 7: Handle Cibus iframe form
                            print("Waiting for Cibus iframe to load...")
                            iframe_xpath = "//iframe[@title='cibus-challenge']"
                            try:
                                # Wait for iframe to be available
                                iframe = WebDriverWait(driver, 20).until(
                                    EC.presence_of_element_located((By.XPATH, iframe_xpath))
                                )
                                print("Cibus iframe found, switching to iframe...")
                                
                                # Switch to the iframe
                                driver.switch_to.frame(iframe)
                                print("Successfully switched to Cibus iframe")
                                random_sleep(2, 3)
                                
                                # Check if we have Cibus credentials
                                if cibus_username and cibus_password and cibus_company:
                                    print("Cibus credentials found, filling form...")
                                    
                                    # Fill in username
                                    print("Entering Cibus username...")
                                    username_input = WebDriverWait(driver, 10).until(
                                        EC.element_to_be_clickable((By.XPATH, "//input[@placeholder='שם משתמש']"))
                                    )
                                    username_input.clear()
                                    human_type(username_input, cibus_username)
                                    random_sleep(1, 2)
                                    
                                    # Fill in password
                                    print("Entering Cibus password...")
                                    password_input = WebDriverWait(driver, 10).until(
                                        EC.element_to_be_clickable((By.XPATH, "//input[@placeholder='סיסמה']"))
                                    )
                                    password_input.clear()
                                    human_type(password_input, cibus_password)
                                    random_sleep(1, 2)
                                    
                                    # Fill in company
                                    print("Entering Cibus company...")
                                    company_input = WebDriverWait(driver, 10).until(
                                        EC.element_to_be_clickable((By.XPATH, "//input[@placeholder='חברה']"))
                                    )
                                    company_input.clear()
                                    human_type(company_input, cibus_company)
                                    random_sleep(1, 2)
                                    
                                    # Click login button
                                    print("Clicking Cibus login button...")
                                    try:
                                        # Try multiple selectors with ID and class
                                        login_button = None
                                        
                                        # First try by ID
                                        try:
                                            login_button = WebDriverWait(driver, 10).until(
                                                EC.element_to_be_clickable((By.ID, "btnSubmit"))
                                            )
                                            print("Found login button by ID")
                                        except:
                                            print("Could not find login button by ID, trying other selectors")
                                        
                                        # If not found by ID, try by class
                                        if not login_button:
                                            try:
                                                login_button = WebDriverWait(driver, 10).until(
                                                    EC.element_to_be_clickable((By.CLASS_NAME, "sbmt"))
                                                )
                                                print("Found login button by class")
                                            except:
                                                print("Could not find login button by class, trying XPath")
                                        
                                        # If still not found, try by XPath with exact attributes
                                        if not login_button:
                                            try:
                                                login_button = WebDriverWait(driver, 10).until(
                                                    EC.element_to_be_clickable((By.XPATH, "//input[@id='btnSubmit' and @class='sbmt']"))
                                                )
                                                print("Found login button by XPath with attributes")
                                            except:
                                                # Last resort: try any input with submit type
                                                login_button = WebDriverWait(driver, 10).until(
                                                    EC.element_to_be_clickable((By.XPATH, "//input[@type='submit']"))
                                                )
                                                print("Found login button by type=submit")
                                        
                                        # Try multiple click methods
                                        try:
                                            print("Trying standard click method...")
                                            safe_click(driver, login_button)
                                        except Exception as click_err:
                                            print(f"Standard click failed: {click_err}")
                                            try:
                                                print("Trying JavaScript click...")
                                                driver.execute_script("arguments[0].click();", login_button)
                                            except Exception as js_err:
                                                print(f"JavaScript click failed: {js_err}")
                                                try:
                                                    print("Trying submit form...")
                                                    # Try to find the parent form and submit it
                                                    form = driver.find_element(By.XPATH, "//form[.//input[@type='submit']]")
                                                    form.submit()
                                                except Exception as form_err:
                                                    print(f"Form submit failed: {form_err}")
                                                    # Last resort - try to submit via JavaScript onclick function
                                                    try:
                                                        print("Trying to call onclick function directly...")
                                                        driver.execute_script("return hit('login');")
                                                    except Exception as onclick_err:
                                                        print(f"JavaScript onclick execution failed: {onclick_err}")
                                                        raise Exception("All click methods failed")
                                        
                                        print("Cibus login button clicked")
                                        random_sleep(5, 8)  # Give time for login to process
                                        
                                        # Step 8: Click the "Confirm payment with Cibus" button
                                        print("Looking for 'Confirm payment with Cibus' button...")
                                        try:
                                            # Try multiple selectors for the payment confirmation button
                                            payment_button = None
                                            
                                            # First try by ID
                                            try:
                                                payment_button = WebDriverWait(driver, 15).until(
                                                    EC.element_to_be_clickable((By.ID, "btnPay"))
                                                )
                                                print("Found payment confirmation button by ID")
                                            except:
                                                print("Could not find payment button by ID, trying other selectors")
                                            
                                            # If not found by ID, try by value attribute
                                            if not payment_button:
                                                try:
                                                    payment_button = WebDriverWait(driver, 15).until(
                                                        EC.element_to_be_clickable((By.XPATH, "//input[@value='אישור התשלום באמצעות סיבוס']"))
                                                    )
                                                    print("Found payment button by value text")
                                                except:
                                                    print("Could not find payment button by value, trying by class")
                                            
                                            # If still not found, try by class combination
                                            if not payment_button:
                                                try:
                                                    payment_button = WebDriverWait(driver, 15).until(
                                                        EC.element_to_be_clickable((By.XPATH, "//input[@class='sbmt colourful']"))
                                                    )
                                                    print("Found payment button by class")
                                                except:
                                                    # Last resort: try any submit input
                                                    payment_button = WebDriverWait(driver, 15).until(
                                                        EC.element_to_be_clickable((By.XPATH, "//input[@type='submit' and @name='btnPay']"))
                                                    )
                                                    print("Found payment button by type and name")
                                            
                                            # Try multiple click methods
                                            try:
                                                print("Trying standard click method...")
                                                safe_click(driver, payment_button)
                                            except Exception as click_err:
                                                print(f"Standard click failed: {click_err}")
                                                try:
                                                    print("Trying JavaScript click...")
                                                    driver.execute_script("arguments[0].click();", payment_button)
                                                except Exception as js_err:
                                                    print(f"JavaScript click failed: {js_err}")
                                                    try:
                                                        print("Trying direct onclick function...")
                                                        driver.execute_script("return hit('pay');")
                                                    except Exception as onclick_err:
                                                        print(f"JavaScript onclick execution failed: {onclick_err}")
                                                        # Try form submit as last resort
                                                        try:
                                                            form = driver.find_element(By.XPATH, "//form[.//input[@id='btnPay']]")
                                                            form.submit()
                                                        except Exception as form_err:
                                                            print(f"Form submit failed: {form_err}")
                                                            raise Exception("All payment button click methods failed")
                                            
                                            print("Payment confirmation button clicked successfully")
                                            # Wait for confirmation processing
                                            random_sleep(5, 8)
                                        
                                        except Exception as payment_err:
                                            print(f"Error with payment confirmation button: {payment_err}")
                                            driver.save_screenshot(os.path.join(screenshots_dir, 'payment_confirmation_error.png'))
                                    
                                    except Exception as btn_err:
                                        print(f"Error finding or clicking login button: {btn_err}")
                                        driver.save_screenshot(os.path.join(screenshots_dir, 'cibus_login_button_error.png'))
                                        
                                        # Try one more method - hit the Enter key
                                        try:
                                            print("Trying to submit with Enter key...")
                                            company_input = driver.find_element(By.XPATH, "//input[@placeholder='חברה']")
                                            company_input.send_keys(Keys.ENTER)
                                            print("Enter key sent")
                                            random_sleep(5, 8)
                                        except Exception as key_err:
                                            print(f"Enter key method failed: {key_err}")
                                    
                                    # Switch back to main content
                                    print("Switching back to main content...")
                                    driver.switch_to.default_content()
                                    print("Successfully returned to main content")
                                else:
                                    print("Cibus credentials are missing, cannot complete form")
                                    driver.switch_to.default_content()
                                    driver.save_screenshot(os.path.join(screenshots_dir, 'cibus_missing_credentials.png'))
                            
                            except Exception as iframe_err:
                                print(f"Error handling Cibus iframe: {iframe_err}")
                                # Try to switch back to main content in case of error
                                try:
                                    driver.switch_to.default_content()
                                except:
                                    pass
                                driver.save_screenshot(os.path.join(screenshots_dir, 'cibus_iframe_error.png'))
                        except Exception as order_btn_err:
                            print(f"Error clicking 'Click to order' button: {order_btn_err}")
                            driver.save_screenshot(os.path.join(screenshots_dir, 'order_button_error.png'))
                    
                    except Exception as cibus_err:
                        print(f"Error selecting Cibus payment option: {cibus_err}")
                        driver.save_screenshot(os.path.join(screenshots_dir, 'cibus_option_error.png'))
                    
                    # Take final screenshot of the checkout process
                    print("Taking final screenshot of completed order process...")
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
            
            session = create_database_connection(db_url, logger)
            
            # Get user with ID 1 (for standalone testing)
            user = session.query(User).filter(User.id == 1).first()
            
            if not user:
                logger.error("No user found in database")
                return False
                
            logger.info(f"Using credentials for user ID: {user.id}")
            gmail_email = user.gmail_email
            gmail_password = user.gmail_password
            totp_secret = user.totp_secret
            cibus_username = user.cibus_username
            cibus_password = user.cibus_password
            cibus_company = user.cibus_company
        except Exception as db_err:
            logger.error(f"Database error: {db_err}")
            return False
        
        # Start the login process
        success = login_to_wolt(driver, gmail_email, gmail_password, totp_secret, cibus_username, cibus_password, cibus_company)
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