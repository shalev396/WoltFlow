# WoltFlow - Local Runner

This version of WoltFlow is configured to run locally.

## Automation Flow Diagram

For a visual overview of the end-to-end automation steps, open `plan.drawio` in a diagram editor or view it here: [plan.drawio](plan.drawio)

## Database Configuration

Create a file named `db.json` in the `Script/` folder with the following content:

```json
{
  "users": [
    {
      "id": 1,
      "gmail_email": "myemail@gmail.com",
      "gmail_password": "0000000000",
      "totp_secret": "xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx xxxx",
      "cibus_username": "name",
      "cibus_password": "Password",
      "cibus_company": "My Company",
      "gift_amount": "35" // or what ever gift card you want
    }
  ]
}
```

## Chrome Setup

In `Script/utils/chrome_util.py`, update the default Chrome executable path or place your installed `chrome.exe` into `Script/chrome/`. Common installation paths on Windows:

- `C:\Program Files\Google\Chrome\Application\chrome.exe`
- `C:\Program Files (x86)\Google\Chrome\Application\chrome.exe`

Alternatively, copy `chrome.exe` (with the version folder "138.0.xxxx.xxx") into `Script/chrome/chrome.exe`.

## Virtual Environment and Dependencies

It is recommended to use a Python virtual environment for isolation:

1. Create and activate a virtual environment:
   ```powershell
   python -m venv .env
   .env\Scripts\Activate.ps1   # PowerShell
   # or
   .env\Scripts\activate       # cmd.exe
   ```
2. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```

## Running the Application

You can start the runner using the provided batch script:

```powershell
.\run_index.bat
```

Or run directly in your environment:

```powershell
python index.py
```

## Task Scheduler Setup

To automate execution via Windows Task Scheduler:

1. Open **Task Scheduler**.
2. Right-click **Task Scheduler Library** → **Import Task...**
3. Select `Script\WoltFlow.xml`.
4. In the **Actions** tab, set **Start in (optional)** to the full path of the `Script` directory (e.g., `C:\Projects\My GitHub\WoltFlow\Script`).
5. Under **General**, enable **Run with highest privileges**.
6. Adjust triggers as needed.

## BIOS Wake Settings

To power on your PC automatically before the scheduled task:

1. Reboot and enter BIOS/UEFI setup (keys vary by manufacturer, e.g., F2, DEL, F12).
2. Locate **Power Management** or **Wake Up** settings.
3. Enable **RTC Alarm**, **Resume By Alarm**, or **Wake on RTC**.
4. Schedule the wake time just before your Task Scheduler trigger.
5. Save changes and exit.

## Timezone Considerations

- The system clock in BIOS/UEFI is stored in **UTC** on many motherboards.
- Windows Task Scheduler uses your **local time** settings.
- Ensure the scheduled task time in Task Scheduler corresponds to your local timezone relative to the UTC BIOS clock.

### Command Line Options

- Process a specific user:

  ```
  python index.py --user-id 1
  ```

## Troubleshooting

- Check the `woltflow.log` file for detailed logs
- Verify Chrome is installed and accessible

- Screenshots of the login process are saved in the `screenshots` directory
