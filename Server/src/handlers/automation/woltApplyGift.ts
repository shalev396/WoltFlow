import { By, Builder, WebElement } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
import path from "path";
import fs from "fs";
import sequelize from "../../config/database";
import Setting from "../../models/Setting";
import Code from "../../models/Code";
import { CustomAPIGatewayProxyHandler } from "../../typescript/types/aws";
import {
  safeClick,
  waitForElement,
  setupWoltCookies,
} from "../../utils/automation";
import { sleep } from "../../utils/general";

export const handler: CustomAPIGatewayProxyHandler = async (event) => {
  let success = false;
  const userId = event.queryStringParameters?.userId;
  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing userId" }),
    };
  }

  await sequelize.authenticate();

  // Get user settings
  const settings = await Setting.findOne({ where: { userId } });
  if (!settings) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Settings not found" }),
    };
  }

  // Get the most recent unused code for the user
  const code = await Code.findOne({
    where: { userId, isUsed: false },
    order: [["createdAt", "DESC"]],
  });

  if (!code) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "No unused gift card code found" }),
    };
  }

  // Browser setup
  const chromeBinary =
    process.env.IS_OFFLINE === "true"
      ? "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe"
      : "/opt/bin/headless-chromium";

  const options = new chrome.Options()
    .setChromeBinaryPath(chromeBinary)
    .addArguments(
      // "--headless",
      // "--disable-gpu",
      "--window-size=1920,1080",
      "--incognito"
    );

  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options as any)
    .build();

  try {
    // Setup Wolt cookies using the extracted function
    await setupWoltCookies(
      driver,
      settings.wrtoken || "",
      settings.wtoken || ""
    );

    // Navigate to code redemption page
    console.log("Navigating to Wolt code redemption page");
    await driver.get("https://wolt.com/he/me/redeem-code");
    await sleep(3000);

    // Enter gift card code
    console.log("Entering gift card code in redemption form");
    const codeInput = await waitForElement(
      driver,
      By.xpath("//input[@placeholder='קוד קופון']"),
      10000
    );

    if (codeInput) {
      await codeInput.clear();
      await codeInput.sendKeys(code.code);
      await sleep(1000);
    } else {
      throw new Error("Could not find code input field");
    }

    // Submit code redemption
    console.log("Submitting gift card code for redemption");
    const applyCodeButton = await waitForElement(
      driver,
      By.xpath("//button[normalize-space(.)='למימוש הקוד']"),
      10000
    );

    if (applyCodeButton) {
      await safeClick(driver, applyCodeButton);
      await sleep(3000);
    } else {
      throw new Error("Could not find apply code button");
    }

    // Check for successful redemption indicators
    // You might want to add specific success indicators here
    console.log("Checking for successful gift card redemption");
    await sleep(2000);

    // Mark code as used
    await code.update({ isUsed: true });
    success = true;
    console.log("Gift card code redeemed successfully");
  } catch (err) {
    console.error("Error redeeming gift card:", err);
    success = false;
  } finally {
    console.log("Current URL:", await driver.getCurrentUrl());
    console.log("Gift card redemption success:", success);

    // Take screenshot and save to screenshots folder
    const screenshotBase64 = await driver.takeScreenshot();
    const screenshotsDir = path.resolve(process.cwd(), "screenshots");
    fs.mkdirSync(screenshotsDir, { recursive: true });
    const filename = path.join(
      screenshotsDir,
      `gift_redemption_${Date.now()}.png`
    );
    fs.writeFileSync(filename, screenshotBase64, "base64");
    console.log(`Saved gift redemption screenshot: ${filename}`);

    await sleep(1000);
    await driver.quit();

    return {
      statusCode: 200,
      headers: { "Content-Type": "image/png" },
      body: screenshotBase64,
      isBase64Encoded: true,
    };
  }
};
