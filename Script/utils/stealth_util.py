import time
import random
from selenium.webdriver.common.keys import Keys

def random_sleep(min_seconds=1, max_seconds=3):
    """Pause execution for a random duration to simulate human behavior.
    
    Introduces random delays between actions to make automation less detectable.
    
    Args:
        min_seconds (float, optional): Minimum sleep duration in seconds. Defaults to 1.
        max_seconds (float, optional): Maximum sleep duration in seconds. Defaults to 3.
    """
    time.sleep(random.uniform(min_seconds, max_seconds))

def human_type(element, text):
    """Simulate human typing with random delays between keystrokes.
    
    Types text into a web element with variable delays between characters
    to mimic natural human typing patterns.
    
    Args:
        element (selenium.webdriver.remote.webelement.WebElement): Target element to type into.
        text (str): Text to type into the element.
    """
    for char in text:
        element.send_keys(char)
        time.sleep(random.uniform(0.05, 0.2))

def safe_click(driver, element):
    """Perform a safe click operation using JavaScript.
    
    Clicks an element using JavaScript execution to avoid potential
    mouse movement tracking and ensure reliable interaction.
    
    Args:
        driver (selenium.webdriver.remote.webdriver.WebDriver): WebDriver instance.
        element (selenium.webdriver.remote.webelement.WebElement): Element to click.
    
    Returns:
        bool: True if click was successful, False otherwise.
    """
    try:
        # Ensure element is visible and centered in viewport
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", element)
        random_sleep(0.5, 1)
        
        # Execute click via JavaScript
        driver.execute_script("arguments[0].click();", element)
        return True
    except Exception as e:
        print(f"Click operation failed: {e}")
        return False 