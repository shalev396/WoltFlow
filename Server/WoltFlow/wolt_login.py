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
from utils.wolt_util import get_gift_card_url

# Configure logging
logger = setup_logging("WoltLogin")

# Setup screenshots directory
screenshots_dir = setup_screenshots_dir()
logger.info(f"Using screenshots directory: {screenshots_dir}")

# Track temporary profiles for cleanup
temp_profiles = []
chrome_processes = []

def login_to_wolt(driver, email=None, password=None, totp_secret=None, cibus_username=None, cibus_password=None, cibus_company=None,gift_amount=None):
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
        
        print("===========Starting 'Google auth' step ===========")

        #Step:1
        # Go to Wolt's Israeli site
        print("Navigating to Wolt...")
        driver.get("https://wolt.com/he/isr")
        random_sleep(3, 5)

        #Step:2
        # Click login button
        print("Clicking login button")
        login_buttons = driver.find_elements(By.XPATH, "//*[contains(text(), 'כניסה')]")
        safe_click(driver, login_buttons[0])  
        random_sleep(2, 4)

        #Step:3
        # click Google login option 
        print("Selecting Google login option (כניסה דרך גוגל)...")
        google_buttons = driver.find_elements(By.XPATH, "//*[contains(text(), 'גוגל')]")
        safe_click(driver, google_buttons[0])
        random_sleep(5, 8)

        #Step:4
        # Enter email
        print("entering email...")
        email_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "identifierId"))
        )
        email_input.clear()
        human_type(email_input, email)

        #Step:5
        # Click Next
        next_buttons = driver.find_elements(By.XPATH, "//span[text()='הבא']")
        print("Clicking Next button after email...")
        safe_click(driver, next_buttons[0])
        random_sleep(2, 4)

        #Step:6
        # enter password
        password_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//input[@type='password']"))
        )
        print("Found password field, entering password...")
        password_input.clear()
        human_type(password_input, password)

        #Step:7
        # Click Next
        next_buttons = driver.find_elements(By.XPATH, "//span[text()='הבא']")
        print("Clicking Next button after password...")
        safe_click(driver, next_buttons[0])
        random_sleep(3, 5)

        #Step:8
        # Click another way
        print("Looking for 'דרך אחרת' (another way) button...")
        other_way_buttons = driver.find_elements(By.XPATH, "//span[contains(text(),'דרך אחרת')]")
        if other_way_buttons:
            safe_click(driver, other_way_buttons[0])
            random_sleep(2, 4)
        else:
            print("'Another way' button not found, skipping step...")

        #Step:9
        # Click Get verification code from application
        print("Looking for 'קבל קוד אימות מאפליקציית' (Get verification code) option...")
        verify_app_options = driver.find_elements(By.XPATH, "//*[contains(text(), 'קוד אימות')]")
        safe_click(driver, verify_app_options[0])
        random_sleep(2, 4)
        # Handle 2FA 
        print("Checking for 2FA prompt...")
        random_sleep(3, 5)
        totp_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//input[@type='tel']"))
        )
        # Generate TOTP code
        print("Generating TOTP code...")
        code = totp.now()
        print(f"Generated code: {code}")
        # enter code
        totp_input.clear()
        human_type(totp_input, code)
        random_sleep(1, 2)
        
        #Step:10
        # Click next
        random_sleep(10, 20)
        next_button = driver.find_elements(By.XPATH, "//span[text()='הבא']")
        safe_click(driver, next_button[0])
        random_sleep(3, 5)
        print("Logged in successfully")
        # Check if login was successful after automation
        print("Verifying login status...")
        random_sleep(3, 5)
        
        # Define login success indicators
        logged_in_indicators = "//img[@alt='פרופיל']" # Hebrew "Profile" image - most reliable indicator
        # Check if login was successful
        if driver.find_elements(By.XPATH, logged_in_indicators)[0].is_displayed():
            print("Login successful")
        else:
            print("Login failed")
            return False
        
        print("===========Completed 'Google auth' step ===========")

        # Start Wolt Flow steps
        print("=================Starting 'Wolt Flow' step=================")
        # Step:1
        #Go to Wolt Wolt gift cards page
        print("Navigating to Wolt Gift Cards page...")
        gift_card_url = "https://wolt.com/he/isr/%D7%AA%D7%B4%D7%90,%20%D7%94%D7%A8%D7%A6%D7%9C%D7%99%D7%94%20%D7%95%D7%94%D7%A1%D7%91%D7%99%D7%91%D7%94/venue/woltilgiftcards"
        driver.get(gift_card_url)
        random_sleep(5, 8)
        #Step:2
        #clear cart
        print("clearing cart...")
        # Handle save order dialog if present
        save_order_dialogs = driver.find_elements(By.XPATH, "//h2[normalize-space(text())='אשמח להמשיך']")
        if save_order_dialogs and save_order_dialogs[0].is_displayed():
            safe_click(driver, driver.find_elements(By.XPATH, "//button[normalize-space(.)='לא']")[0])
            random_sleep(1, 2)
            
            # Open cart
            cart_buttons = driver.find_elements(By.XPATH, "//button[@aria-label='ההזמנות שלך']")
            if cart_buttons:
                safe_click(driver, cart_buttons[0])
                random_sleep(1, 2)
                
                # Delete all items
                while True:
                    delete_buttons = driver.find_elements(By.XPATH, "//button[@aria-label='מחיקה']")
                    if not delete_buttons:
                        break
                    safe_click(driver, delete_buttons[0])
                    random_sleep(1, 2)
                
                # Close cart
                close_buttons = driver.find_elements(By.XPATH, "//button[@aria-label='סגירה']")
                if close_buttons:
                    safe_click(driver, close_buttons[0])
                    random_sleep(1, 2)
        #Step:3
        # Redirect to gift card with {gift_amount} ils
        print(f"redirecting to {gift_amount} gift card option...")
        gift_card_url = get_gift_card_url(int(gift_amount))
        if gift_card_url==None:
            print(f"No gift card option found for {gift_amount}")
            return False
        driver.get(gift_card_url)
        random_sleep(5, 8)
        #Step:4
        # Add to gift card cart
        print("clicking 'Add to Order' button...")
        add_order_button = WebDriverWait(driver, 15).until(
            EC.element_to_be_clickable((By.XPATH,"//span[normalize-space(text())='להוסיף להזמנה']"))
        )
        safe_click(driver, add_order_button)
        random_sleep(3, 5)
        #Step:5
        # Redirect to cart page
        print("Navigating to checkout page...")
        checkout_url = "https://wolt.com/he/isr/%D7%AA%D7%B4%D7%90,%20%D7%94%D7%A8%D7%A6%D7%9C%D7%99%D7%94%20%D7%95%D7%94%D7%A1%D7%91%D7%99%D7%91%D7%94/venue/woltilgiftcards/checkout"
        driver.get(checkout_url)
        print("Waiting for checkout page to load...")
        random_sleep(5, 8)
        
        #Step:6
        # Click payment method
        print("clicking payment method...")
        checkout_element = WebDriverWait(driver, 15).until(
            EC.element_to_be_clickable((By.XPATH, "/html/body/div[2]/div[2]/main/div[4]/div[2]/div[1]/ul/li/a"))
        )
        safe_click(driver, checkout_element)
        random_sleep(3, 5)
        #Step:7
        # Click Cibus
        print("Clicking Cibus payment option...")
        cibus_element = WebDriverWait(driver, 15).until(
            EC.element_to_be_clickable((By.XPATH, "//span[normalize-space(text())='Cibus']"))
        )
        safe_click(driver, cibus_element)
        random_sleep(3, 5)
        
        #Step:8
        # Click X if needed
        print("Checking for modal popup...")
        modal_buttons = driver.find_elements(By.XPATH, "/html/body/div[4]/div[8]/div/div[2]/div/aside/div[1]/button")
        if modal_buttons:
            safe_click(driver, modal_buttons[0])
            random_sleep(2, 3)
        else:
            print("Modal not found, skipping...")
        
        #Step:9
        # Click to order
        print("Looking for 'Click to order' button (לחצו להזמנה)...")
        order_button_xpath = "//span[normalize-space(text())='לחצו להזמנה']"
        order_button = WebDriverWait(driver, 15).until(
            EC.element_to_be_clickable((By.XPATH, order_button_xpath))
        )
        print("Found 'Click to order' button, clicking...")
        safe_click(driver, order_button)
        print("'Click to order' button clicked successfully")
        random_sleep(3, 5)

        print("===========Completed 'Wolt Flow' step ===========")

        # Start Cibus iframe steps
        print("=================Starting 'Cibus iframe' step=================")

        #Step:1
        # Handle Cibus iframe form
        print("Waiting for Cibus iframe to load...")
        iframe_xpath = "//iframe[@title='cibus-challenge']"
        iframe = WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.XPATH, iframe_xpath))
        )
        print("Cibus iframe found, switching to iframe...")
        # Switch to the iframe
        driver.switch_to.frame(iframe)
        print("Successfully switched to Cibus iframe")
        random_sleep(2, 3)

        #Step:2
        # Enter Cibus username
        print("Entering Cibus username...")
        username_input = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//input[@placeholder='שם משתמש']"))
        )
        username_input.clear()
        human_type(username_input, cibus_username)
        random_sleep(1, 2)
        
        #Step:3
        # Enter Cibus password
        print("Entering Cibus password...")
        password_input = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//input[@placeholder='סיסמה']"))
        )
        password_input.clear()
        human_type(password_input, cibus_password)
        random_sleep(1, 2)
        
        #Step:4
        # Enter Cibus company
        print("Entering Cibus company...")
        company_input = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//input[@placeholder='חברה']"))
        )
        company_input.clear()
        human_type(company_input, cibus_company)
        random_sleep(1, 2)
        
        #Step:5
        # Click Login
        print("Clicking Cibus login button...")
        login_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "btnSubmit"))
        )  
        safe_click(driver, login_button)
        random_sleep(5, 8)  # Give time for login to process
        
        #Step:6
        # Click confirm payment with Cibus
        print("Looking for 'Confirm payment with Cibus' button...")
        payment_button = WebDriverWait(driver, 15).until(
            EC.element_to_be_clickable((By.ID, "btnPay"))
        )
        safe_click(driver, payment_button)
        # Wait for confirmation processing
        random_sleep(5, 8)
    
    

        #Step:7 take screenshot
        print("Switching back to main content...")
        driver.switch_to.default_content()
        print("Successfully returned to main content")
        # Take final screenshot of the checkout process
        print("Taking final screenshot of completed order process...")
        final_screenshot_path = os.path.join(screenshots_dir, 'gift_card_selected.png')
        driver.save_screenshot(final_screenshot_path)
        print(f"Final screenshot saved to: {final_screenshot_path}")
        # Clean up old screenshots that are not errors or the final screenshot
        cleanup_screenshots(screenshots_dir, ['error', 'failed', 'gift_card_selected.png'])
        return True
    
    except Exception as e:
        print(f"Login failed with error: {e}")
        driver.save_screenshot(os.path.join(screenshots_dir, 'error_screenshot.png'))
        return False
