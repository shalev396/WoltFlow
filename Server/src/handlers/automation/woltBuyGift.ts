import { By, Builder, WebElement } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
import sequelize from "../../config/database";
import Setting from "../../models/Setting";
import { CustomAPIGatewayProxyHandler } from "../../typescript/types/aws";
import {
  safeClick,
  getGiftCardUrl,
  waitForElement,
} from "../../utils/automation";
import { sleep } from "../../utils/general";

export const handler: CustomAPIGatewayProxyHandler = async (event) => {
  const userId = event.queryStringParameters?.userId;
  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing userId" }),
    };
  }

  await sequelize.authenticate();
  const settings = await Setting.findOne({ where: { userId } });
  if (!settings) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Settings not found" }),
    };
  }

  const chromeBinary =
    process.env.IS_OFFLINE === "true"
      ? "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe"
      : "/opt/bin/headless-chromium";

  const options = new chrome.Options()
    .setChromeBinaryPath(chromeBinary)
    .addArguments("--headless", "--disable-gpu", "--window-size=1920,1080");

  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options as any)
    .build();

  try {
    // 1️⃣ Navigate so we can set cookies on the correct domain
    await driver.get("https://wolt.com/he/discovery");

    // 2️⃣ Parse cookies JSON into an array
    let cookieArray: any[] = [];
    try {
      cookieArray = JSON.parse(settings.cookies || "[]");
      if (!Array.isArray(cookieArray)) {
        cookieArray = [];
      }
    } catch {
      cookieArray = [];
    }
    // console.log(cookieArray);
    // 3️⃣ Sanitizer to ensure valid sameSite values
    const sanitize = (cookie: any) => {
      const c = { ...cookie };

      // 1. Normalize invalid sameSite values to "None"
      if (!["Lax", "Strict", "None"].includes(c.sameSite)) {
        c.sameSite = "None";
      }

      // 2. Per spec and Selenium requirement, SameSite=None must be Secure
      if (c.sameSite === "None") {
        c.secure = true;
      }

      return c;
    };

    // 4️⃣ Inject each cookie in turn
    for (const rawCookie of cookieArray) {
      await driver.manage().addCookie(sanitize(rawCookie));
    }

    // 5️⃣ Reload to apply cookies, then wait for the page to render
    await driver.get("https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards");
    //script start

    // Clear existing cart if the “אשמח להמשיך” dialog appears
    const continueDialogs = await waitForElement(
      driver,
      By.xpath("//h2[normalize-space(text())='אשמח להמשיך']"),
      2000
    );

    if (continueDialogs) {
      console.log("continueDialogs", continueDialogs);
      // Click “לא” on the save-order dialog
      const noButton = await waitForElement(
        driver,
        By.xpath("//button[normalize-space(.)='לא']")
      );
      await safeClick(driver, noButton as WebElement);

      // Open the cart
      const cartButton = await waitForElement(
        driver,
        By.xpath("//button[@aria-label='ההזמנות שלך']")
      );
      await safeClick(driver, cartButton as WebElement);

      // Remove all items in the cart
      while (true) {
        const deleteButtons = await waitForElement(
          driver,
          By.xpath("//button[@aria-label='מחיקה']")
        );
        if (!deleteButtons) break;
        await safeClick(driver, deleteButtons);
      }

      // Close the cart
      const closeButtons = await waitForElement(
        driver,
        By.xpath("//button[@aria-label='סגירה']")
      );
      if (closeButtons) {
        await safeClick(driver, closeButtons);
      }
    }

    // Select and navigate to the chosen gift card URL
    const giftAmount = Number(settings.giftAmount);
    const giftUrl = getGiftCardUrl(giftAmount);
    if (!giftUrl) {
      throw new Error(`Gift card amount ${giftAmount} ILS not available`);
    }
    await driver.get(giftUrl);
    await sleep(2000);
    //script end

    // 6️⃣ Capture screenshot
    const screenshotBase64 = await driver.takeScreenshot();
    // 7️⃣ Get all cookies for wolt.com
    const allCookies = await driver.manage().getCookies();

    // 8️⃣ Save them back to the DB
    settings.cookies = JSON.stringify(allCookies);
    await settings.save();
    return {
      statusCode: 200,
      headers: { "Content-Type": "image/png" },
      body: screenshotBase64,
      isBase64Encoded: true,
    };
  } finally {
    await driver.quit();
  }
};
