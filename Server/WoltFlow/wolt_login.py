# Standard library imports
import time
import os
import pyotp
import subprocess
import psutil

# Third-party imports
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys

# Local application imports
from utils.system_util import cleanup_screenshots, setup_screenshots_dir, setup_logging
from utils.stealth_util import random_sleep, human_type, safe_click
from utils.chrome_util import kill_chrome_process, cleanup_temp_profiles, launch_fresh_chrome, connect_to_chrome
from utils.db_util import create_database_connection
from models.user import User, Base
from utils.wolt_util import get_gift_card_url

# Initialize logging configuration
logger = setup_logging("WoltLogin")

# Configure screenshots directory
screenshots_dir = setup_screenshots_dir()
logger.info(f"Screenshots will be saved to: {screenshots_dir}")

# Resource tracking for cleanup
temp_profiles = []
chrome_processes = []

def login_to_wolt(driver, email=None, password=None, totp_secret=None, cibus_username=None, cibus_password=None, cibus_company=None, gift_amount=None):
    """Execute the complete Wolt gift card purchase workflow.
    
    This function performs the following major steps:
    1. Google Authentication:
       - Navigate to Wolt
       - Login with Google credentials
       - Handle 2FA if enabled
    2. Wolt Gift Card Selection:
       - Navigate to gift cards page
       - Clear existing cart
       - Select specified gift card amount
    3. Cibus Payment Process:
       - Complete checkout process
       - Handle Cibus authentication
       - Confirm payment
    
    Args:
        driver (selenium.webdriver.remote.webdriver.WebDriver): Active WebDriver instance.
        email (str): Google account email for authentication.
        password (str): Google account password.
        totp_secret (str): TOTP secret key for 2FA (spaces allowed).
        cibus_username (str): Cibus account username.
        cibus_password (str): Cibus account password.
        cibus_company (str): Cibus company identifier.
        gift_amount (str): Desired gift card amount in ILS.
    
    Returns:
        bool: True if the entire workflow completes successfully, False otherwise.
    
    Note:
        The function takes screenshots at critical points and during errors.
        Screenshots are saved to the configured screenshots directory.
    """
    try:
        # Initialize TOTP generator if 2FA is enabled
        totp = None
        if totp_secret:
            # Remove spaces and non-base32 characters from secret
            clean_totp_secret = totp_secret.replace(' ', '').replace('-', '').upper()
            totp = pyotp.TOTP(clean_totp_secret)
        
        logger.info("Starting Google authentication workflow")
        print("===========Starting 'Google auth' step ===========")

        # Step 1: Navigate to Wolt Israel
        logger.info("Navigating to Wolt homepage")
        driver.get("https://wolt.com/he/isr")
        random_sleep(3, 5)

        # Step 2: Initiate login process
        logger.info("Clicking login button")
        login_buttons = driver.find_elements(By.XPATH, "//*[contains(text(), 'כניסה')]")
        safe_click(driver, login_buttons[0])  
        random_sleep(2, 4)

        # Step 3: Select Google authentication
        logger.info("Selecting Google authentication method")
        google_buttons = driver.find_elements(By.XPATH, "//*[contains(text(), 'גוגל')]")
        safe_click(driver, google_buttons[0])
        random_sleep(5, 8)

        # Step 4: Enter Google email
        logger.info("Entering Google email")
        email_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "identifierId"))
        )
        email_input.clear()
        human_type(email_input, email)

        # Step 5: Proceed to password
        logger.info("Proceeding to password entry")
        next_buttons = driver.find_elements(By.XPATH, "//span[text()='הבא']")
        safe_click(driver, next_buttons[0])
        random_sleep(2, 4)

        # Step 6: Enter Google password
        logger.info("Entering Google password")
        password_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//input[@type='password']"))
        )
        password_input.clear()
        human_type(password_input, password)

        # Step 7: Submit password
        logger.info("Submitting password")
        next_buttons = driver.find_elements(By.XPATH, "//span[text()='הבא']")
        safe_click(driver, next_buttons[0])
        random_sleep(3, 5)

        # Step 8: Handle alternative 2FA method selection
        logger.info("Checking for alternative 2FA options")
        other_way_buttons = driver.find_elements(By.XPATH, "//span[contains(text(),'דרך אחרת')]")
        if other_way_buttons:
            logger.info("Selecting alternative 2FA method")
            safe_click(driver, other_way_buttons[0])
            random_sleep(2, 4)
        else:
            logger.info("No alternative 2FA selection needed")

        # Step 9: Select and complete 2FA verification
        logger.info("Initiating 2FA verification")
        verify_app_options = driver.find_elements(By.XPATH, "//*[contains(text(), 'קוד אימות')]")
        safe_click(driver, verify_app_options[0])
        random_sleep(2, 4)
        
        logger.info("Handling 2FA code entry")
        random_sleep(3, 5)
        totp_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//input[@type='tel']"))
        )
        
        logger.info("Generating TOTP code")
        code = totp.now()
        logger.debug(f"Generated TOTP code: {code}")
        
        totp_input.clear()
        human_type(totp_input, code)
        random_sleep(1, 2)
        
        # Step 10: Complete 2FA verification
        logger.info("Completing 2FA verification")
        random_sleep(10, 20)
        next_button = driver.find_elements(By.XPATH, "//span[text()='הבא']")
        safe_click(driver, next_button[0])
        random_sleep(3, 5)
        
        # Verify successful login
        logger.info("Verifying login status")
        random_sleep(3, 5)
        
        logged_in_indicators = "//img[@alt='פרופיל']"  # Profile image indicator
        if driver.find_elements(By.XPATH, logged_in_indicators)[0].is_displayed():
            logger.info("Google authentication successful")
        else:
            logger.error("Google authentication failed")
            return False
        
        logger.info("Google authentication workflow completed")
        print("===========Completed 'Google auth' step ===========")

        # Begin gift card selection workflow
        logger.info("Starting gift card selection workflow")
        print("=================Starting 'Wolt Flow' step=================")
        
        # Step 1: Navigate to gift cards page
        logger.info("Navigating to gift cards page")
        gift_card_url = "https://wolt.com/he/isr/%D7%AA%D7%B4%D7%90,%20%D7%94%D7%A8%D7%A6%D7%9C%D7%99%D7%94%20%D7%95%D7%94%D7%A1%D7%91%D7%99%D7%91%D7%94/venue/woltilgiftcards"
        driver.get(gift_card_url)
        random_sleep(5, 8)
        
        # Step 2: Clear existing cart
        logger.info("Clearing existing cart items")
        save_order_dialogs = driver.find_elements(By.XPATH, "//h2[normalize-space(text())='אשמח להמשיך']")
        if save_order_dialogs and save_order_dialogs[0].is_displayed():
            logger.info("Handling save order dialog")
            safe_click(driver, driver.find_elements(By.XPATH, "//button[normalize-space(.)='לא']")[0])
            random_sleep(1, 2)
            
            cart_buttons = driver.find_elements(By.XPATH, "//button[@aria-label='ההזמנות שלך']")
            if cart_buttons:
                logger.info("Opening cart")
                safe_click(driver, cart_buttons[0])
                random_sleep(1, 2)
                
                logger.info("Removing cart items")
                while True:
                    delete_buttons = driver.find_elements(By.XPATH, "//button[@aria-label='מחיקה']")
                    if not delete_buttons:
                        break
                    safe_click(driver, delete_buttons[0])
                    random_sleep(1, 2)
                
                logger.info("Closing cart")
                close_buttons = driver.find_elements(By.XPATH, "//button[@aria-label='סגירה']")
                if close_buttons:
                    safe_click(driver, close_buttons[0])
                    random_sleep(1, 2)
        
        # Step 3: Select specific gift card amount
        logger.info(f"Selecting {gift_amount} ILS gift card")
        gift_card_url = get_gift_card_url(int(gift_amount))
        if gift_card_url is None:
            logger.error(f"Gift card amount {gift_amount} ILS not available")
            return False
        driver.get(gift_card_url)
        random_sleep(5, 8)
        
        # Step 4: Add gift card to cart
        logger.info("Adding gift card to cart")
        add_order_button = WebDriverWait(driver, 15).until(
            EC.element_to_be_clickable((By.XPATH,"//span[normalize-space(text())='להוסיף להזמנה']"))
        )
        safe_click(driver, add_order_button)
        random_sleep(3, 5)
        
        # Step 5: Proceed to checkout
        logger.info("Proceeding to checkout")
        checkout_url = "https://wolt.com/he/isr/%D7%AA%D7%B4%D7%90,%20%D7%94%D7%A8%D7%A6%D7%9C%D7%99%D7%94%20%D7%95%D7%94%D7%A1%D7%91%D7%99%D7%91%D7%94/venue/woltilgiftcards/checkout"
        driver.get(checkout_url)
        random_sleep(5, 8)
        
        # Step 6: Select payment method
        logger.info("Opening payment method selection")
        checkout_element = WebDriverWait(driver, 15).until(
            EC.element_to_be_clickable((By.XPATH, "/html/body/div[2]/div[2]/main/div[4]/div[2]/div[1]/ul/li/a"))
        )
        safe_click(driver, checkout_element)
        random_sleep(3, 5)
        
        # Step 7: Select Cibus payment
        logger.info("Selecting Cibus payment method")
        cibus_element = WebDriverWait(driver, 15).until(
            EC.element_to_be_clickable((By.XPATH, "//span[normalize-space(text())='Cibus']"))
        )
        safe_click(driver, cibus_element)
        random_sleep(3, 5)
        
        # Step 8: Handle modal popup if present
        logger.info("Checking for modal popup")
        modal_buttons = driver.find_elements(By.XPATH, "/html/body/div[4]/div[8]/div/div[2]/div/aside/div[1]/button")
        if modal_buttons:
            logger.info("Closing modal popup")
            safe_click(driver, modal_buttons[0])
            random_sleep(2, 3)
        else:
            logger.info("No modal popup found")
        
        # Step 9: Confirm order
        logger.info("Initiating order confirmation")
        order_button_xpath = "//span[normalize-space(text())='לחצו להזמנה']"
        order_button = WebDriverWait(driver, 15).until(
            EC.element_to_be_clickable((By.XPATH, order_button_xpath))
        )
        safe_click(driver, order_button)
        random_sleep(3, 5)

        logger.info("Gift card selection workflow completed")
        print("===========Completed 'Wolt Flow' step ===========")

        # Begin Cibus payment workflow
        logger.info("Starting Cibus payment workflow")
        print("=================Starting 'Cibus iframe' step=================")

        # Step 1: Switch to Cibus iframe
        logger.info("Locating Cibus payment iframe")
        iframe_xpath = "//iframe[@title='cibus-challenge']"
        iframe = WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.XPATH, iframe_xpath))
        )
        driver.switch_to.frame(iframe)
        logger.info("Switched to Cibus payment iframe")
        random_sleep(2, 3)

        # Step 2: Enter Cibus credentials
        logger.info("Entering Cibus username")
        username_input = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//input[@placeholder='שם משתמש']"))
        )
        username_input.clear()
        human_type(username_input, cibus_username)
        random_sleep(1, 2)
        
        logger.info("Entering Cibus password")
        password_input = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//input[@placeholder='סיסמה']"))
        )
        password_input.clear()
        human_type(password_input, cibus_password)
        random_sleep(1, 2)
        
        logger.info("Entering Cibus company")
        company_input = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//input[@placeholder='חברה']"))
        )
        company_input.clear()
        human_type(company_input, cibus_company)
        random_sleep(1, 2)
        
        # Step 3: Complete Cibus login
        logger.info("Submitting Cibus credentials")
        login_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "btnSubmit"))
        )  
        safe_click(driver, login_button)
        random_sleep(5, 8)
        
        # Step 4: Confirm Cibus payment
        logger.info("Confirming Cibus payment")
        payment_button = WebDriverWait(driver, 15).until(
            EC.element_to_be_clickable((By.ID, "btnPay"))
        )
        safe_click(driver, payment_button)
        random_sleep(5, 8)
        
        # Return to main content and capture final state
        logger.info("Returning to main content")
        driver.switch_to.default_content()
        
        # Capture final screenshot
        logger.info("Capturing final workflow screenshot")
        final_screenshot_path = os.path.join(screenshots_dir, 'gift_card_selected.png')
        driver.save_screenshot(final_screenshot_path)
        logger.info(f"Final screenshot saved: {final_screenshot_path}")
        
        # Cleanup old screenshots
        logger.info("Cleaning up old screenshots")
        cleanup_screenshots(screenshots_dir, ['error', 'failed', 'gift_card_selected.png'])
        
        logger.info("Workflow completed successfully")
        return True
    
    except Exception as e:
        logger.error(f"Workflow failed: {str(e)}")
        error_screenshot_path = os.path.join(screenshots_dir, 'error_screenshot.png')
        driver.save_screenshot(error_screenshot_path)
        logger.info(f"Error screenshot saved: {error_screenshot_path}")
        return False
