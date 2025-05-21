import time
import random
from selenium.webdriver.common.keys import Keys

def random_sleep(min_seconds=1, max_seconds=3):
    """Sleep for a random amount of time to mimic human behavior"""
    time.sleep(random.uniform(min_seconds, max_seconds))

def human_type(element, text):
    """Type text like a human with random delays between keystrokes"""
    for char in text:
        element.send_keys(char)
        time.sleep(random.uniform(0.05, 0.2))

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