import { By, Builder, WebElement } from "selenium-webdriver";
import dotenv from "dotenv";
import {
  Settings,
  WoltSettings,
  RunSettings,
  Run,
  User,
} from "../../models/index.js";

import {
  safeClick,
  getGiftCardUrl,
  waitForElement,
  setupWoltCookies,
  applyBrowserTimezone,
} from "../../utils/automation.js";
import { sleep } from "../../utils/general.js";
import { uploadImageToS3AndSaveToDb } from "../../utils/s3Util.js";
import {
  notifyOnError,
  notifyOnSuccess,
} from "../../utils/notificationUtil.js";
import {
  Options as ChromeOptions,
  ServiceBuilder as ChromeServiceBuilder,
} from "selenium-webdriver/chrome.js";
import {
  type RunWithUserWithWoltSettingsAndRunSettings,
  type ICustomAPIGatewayProxyEventStepFunction,
  type ICustomStepFunctionResult,
} from "../../types/index.js";
import { initDB } from "../../config/bootstrap.js";
import { ChromiumWebDriver } from "selenium-webdriver/chromium.js";
// Environment variables
dotenv.config();

// Connect to database
await initDB();
export const handler = async (
  event: ICustomAPIGatewayProxyEventStepFunction,
): Promise<ICustomStepFunctionResult> => {
  console.log("Starting woltBuyGift");

  // Extract runId and LEVEL from event (Step Functions or API Gateway(Debug))
  const runId = event.runId || event.queryStringParameters?.runId;
  const LEVEL = event.queryStringParameters?.LEVEL;
  console.log("Start chrome + driver");
  const options = new ChromeOptions();
  const service = new ChromeServiceBuilder("/opt/chromedriver");

  options.setChromeBinaryPath("/opt/chrome/chrome");

  // Essential Chrome flags for Lambda
  options.addArguments("--headless=old");
  options.addArguments("--no-sandbox");
  options.addArguments("--disable-dev-shm-usage");
  options.addArguments("--disable-gpu");
  options.addArguments("--single-process"); //with isWorking="true", ms="163767"||without(//) isWorking="true", ms="168950"
  options.addArguments("--no-zygote");
  options.addArguments("--remote-debugging-port=0");

  // Set exact window size
  options.addArguments("--window-size=1920,1080");
  options.addArguments("--force-device-scale-factor=1");

  // Basic optimizations
  options.addArguments("--disable-extensions");
  options.addArguments("--disable-plugins");
  options.addArguments("--no-first-run");
  options.addArguments("--disable-default-apps");

  console.log("Building Chrome driver...");
  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .setChromeService(service)
    .build();

  console.log("Applying browser timezone override...");
  await applyBrowserTimezone(driver as ChromiumWebDriver, "Asia/Jerusalem");

  console.log("End chrome + driver");

  let success = false;
  let run = null;
  try {
    console.log("user setup");
    if (!runId) {
      throw new Error("Missing runId");
    }
    console.log("start db");
    console.log("end db");
    // Get the run with user and all settings in one optimized query
    console.log("start get run");
    run = (await Run.findByPk(runId, {
      include: [
        {
          model: User,
          as: "user",
          include: [
            {
              model: Settings,
              as: "settings",
              include: [
                {
                  model: WoltSettings,
                  as: "woltSettings",
                },
                {
                  model: RunSettings,
                  as: "runSettings",
                },
              ],
            },
          ],
        },
      ],
    })) as RunWithUserWithWoltSettingsAndRunSettings;
    if (!run) {
      return {
        runId,
        userId: "",
        success: false,
        completed: true,
        message: "Run not found",
      };
    }
    console.log("end get run");
    console.log("start update run");
    // Update run stage
    await run.update({ stage: "buying_gift" });
    console.log("end update run");
    console.log("start get settings");
    const userWithSettings = run.user;
    const settings = userWithSettings?.settings;
    const woltSettings = settings?.woltSettings;
    const runSettings = settings?.runSettings;

    if (!settings || !woltSettings || !runSettings) {
      await run.update({ status: "failed" });
      return {
        runId,
        userId: "",
        success: false,
        completed: true,
        message: "Settings not found",
      };
    }
    console.log("end get settings");
    console.log("start setup wolt cookies");
    // Setup Wolt cookies using the extracted function
    await setupWoltCookies(
      driver,
      woltSettings.woltRefreshToken || "",
      woltSettings.woltAccessToken || "",
    );
    console.log("end setup wolt cookies");
    console.log("start step 1");
    // script start
    const giftAmount = Number(runSettings.giftAmount);
    const giftUrl = getGiftCardUrl(giftAmount);
    if (!giftUrl) {
      throw new Error(`Gift card amount ${giftAmount} ILS not available`);
    }

    await driver.get(giftUrl);
    console.log("end step 1");
    if (LEVEL === "1") {
      await sleep(1000);
      throw new Error("LEVEL 1");
    }
    console.log("start step 2");
    const continueDialogs = await waitForElement(
      driver,
      By.xpath("//*[normalize-space(text())='אשמח להמשיך']"),
      8000,
    );

    if (continueDialogs != null) {
      console.log("start step 2.1");
      const noButton = await waitForElement(
        driver,
        By.xpath("//button[normalize-space(.)='לא']"),
      );
      await safeClick(driver, noButton as WebElement);
      const closeButtons1 = await waitForElement(
        driver,
        By.xpath("//button[@aria-label='סגירה']"),
      );
      if (closeButtons1) {
        await safeClick(driver, closeButtons1);
      }

      // Open the cart
      const cartButton = await waitForElement(
        driver,
        By.xpath("//button[@aria-label='ההזמנות שלך']"),
      );
      await safeClick(driver, cartButton as WebElement);

      // Remove all items in the cart
      while (true) {
        const deleteButtons = await waitForElement(
          driver,
          By.xpath("//button[@aria-label='מחיקה']"),
        );
        if (!deleteButtons) break;
        await safeClick(driver, deleteButtons);
      }

      const closeButtons2 = await waitForElement(
        driver,
        By.xpath("//button[@aria-label='סגירה']"),
      );
      if (closeButtons2) {
        await safeClick(driver, closeButtons2);
      }
      await sleep(5000);
      console.log("end step 2.1");
    }

    console.log("end step 2");
    if (LEVEL === "2") {
      await sleep(1000);
      throw new Error("LEVEL 2");
    }
    console.log("start step 3");
    await driver.get(giftUrl);
    const addOrderButton = await waitForElement(
      driver,
      By.xpath("//span[normalize-space(text())='להוסיף להזמנה']"),
      13000,
    );
    await safeClick(driver, addOrderButton as WebElement);
    console.log("end step 3");
    if (LEVEL === "3") {
      await sleep(1000);
      throw new Error("LEVEL 3");
    }
    // Proceed to checkout
    console.log("start step 4");
    // const checkoutUrl =
    //   "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/checkout";
    // await driver.get(checkoutUrl);
    // using button attempt
    const cartButton = await waitForElement(
      driver,
      By.xpath(`//button[.//div[normalize-space(text())="הצגת פריטים"]]`),
    );
    await safeClick(driver, cartButton as WebElement);
    console.log("end step 4");
    if (LEVEL === "4") {
      await sleep(1000);
      throw new Error("LEVEL 4");
    }
    console.log("start step 5");
    const checkoutButton = await waitForElement(
      driver,
      By.xpath("//button[.//div[normalize-space(text())='מעבר לתשלום']]"),
    );

    await safeClick(driver, checkoutButton as WebElement);
    await sleep(8000);
    console.log("end step 5");
    if (LEVEL === "5") {
      await sleep(1000);
      throw new Error("LEVEL 5");
    }
    console.log("start step 6");
    await sleep(1000);
    // Open delivery-item dialogue (use the selector that worked for your DOM).
    const checkoutElement = await waitForElement(
      driver,
      By.xpath(
        "/html[1]/body[1]/div[2]/div[2]/main[1]/div[1]/div[2]/div[1]/ul[1]/li[1]/div[1]/div[2]/div[1]",
      ),
      8000,
    );
    if (checkoutElement) {
      await safeClick(driver, checkoutElement as WebElement);
    }
    console.log("end step 6");
    if (LEVEL === "6") {
      await sleep(1000);
      throw new Error("LEVEL 6");
    }
    console.log("start step 7");
    // Select Wolt Benefits payment method (semantic: button in payment section, avoid React id _r_e4_).
    const woltBenefitsElement = await waitForElement(
      driver,
      By.xpath("//span[normalize-space()='Wolt Benefits']"),
      8000,
    );
    if (woltBenefitsElement != null) {
      await safeClick(driver, woltBenefitsElement as WebElement);
      await sleep(2000);
    }
    // If a dialogue stayed open (e.g. payment picker), close it with the X button.
    const closeDialogueButton = await waitForElement(
      driver,
      By.xpath("//button[@aria-label='סגירה']"),
      2000,
    );
    if (closeDialogueButton) {
      await safeClick(driver, closeDialogueButton as WebElement);
      await sleep(500);
    }
    console.log("end step 7");
    if (LEVEL === "7") {
      await sleep(1000);
      throw new Error("LEVEL 7");
    }
    console.log("start step 8");
    // Proceed to checkout
    const orderButton = await waitForElement(
      driver,
      By.xpath("//span[normalize-space(text())='לחצו להזמנה']"),
    );
    await safeClick(driver, orderButton as WebElement);
    await sleep(3000);
    console.log("end step 8");
    try {
      if (
        await waitForElement(
          driver,
          By.xpath(
            "//span[@data-localization-key='order.gift-card-tracking-title']",
          ),
          15000,
        )
      ) {
        success = true;
      }
    } catch (err) {
      console.log("confirmation element not found");
      console.error("soft error", err);
      //add || true to debug script
      if (process.env.ENV === "dev") {
        console.log("dev mode override success");
        success = true;
      } else {
        throw err;
      }
    }

    //script end
  } catch (err) {
    console.error("error", err);
    success = false;

    // Take error screenshot and upload to S3
    if (driver && run) {
      try {
        const screenshotBase64 = await driver.takeScreenshot();
        const base64WithPrefix = `data:image/png;base64,${screenshotBase64}`;
        const currentUrl = await driver.getCurrentUrl();
        await uploadImageToS3AndSaveToDb(
          base64WithPrefix,
          run.id,
          true,
          currentUrl,
          "error",
          "buying_gift",
        );
        console.log("Error screenshot uploaded to S3 and saved to database");
      } catch (screenshotError) {
        console.error("Failed to upload error screenshot:", screenshotError);
      }
    }
  } finally {
    // Clean up driver
    if (driver) {
      console.log("url", await driver.getCurrentUrl());
      console.log("success", success);
      await sleep(1000);
      await driver.quit();
      console.log("driver quit");
    }
  }

  // Handle case where run is not found
  if (!run) {
    throw new Error("Run not found");
  }

  // Determine status and stage based on success and automation mode
  let status: string;
  let stage: string;

  if (success) {
    if (run.automationMode === "buy-only") {
      status = "completed";
      stage = "completed";
    } else {
      // Full-run mode: continue to next step
      status = "in_progress";
      stage = "buying_gift";
    }
  } else {
    // Always mark as failed when success is false, regardless of automation mode
    status = "failed";
    stage = "buying_gift";
  }
  await run.update({
    status: status,
    stage: stage,
  });

  // Send single notification
  try {
    if (success) {
      if (run.automationMode === "buy-only") {
        await notifyOnSuccess(
          run.userId.toString(),
          run.id,
          "Gift purchase completed",
        );
      }
    } else {
      await notifyOnError(
        run.userId.toString(),
        run.id,
        "Gift purchase failed",
      );
    }
  } catch (notificationError) {
    console.error("Failed to send notification:", notificationError);
  }

  // Return appropriate response based on success and mode
  if (success) {
    if (run.automationMode === "buy-only") {
      // Buy-only mode: stop the chain
      return {
        runId: run.id,
        userId: run.userId.toString(),
        success: true,
        completed: true,
        message:
          "Buy-only mode: Gift purchase completed, stopping automation chain",
        automationMode: "buy-only",
      };
    } else {
      // Full-run mode: continue to next step
      return {
        runId: run.id,
        userId: run.userId.toString(),
        success: true,
        completed: false,
        message: "Gift purchase completed",
      };
    }
  } else {
    // Failed: return error response for Step Functions
    throw new Error("Gift purchase failed");
  }
};
// //span[@data-localization-key='order.gift-card-tracking-title']
// //span[@data-localization-key='order.gift-card-tracking-subtitle']
// //span[@data-localization-key='order.gift-card-tracking-link']
