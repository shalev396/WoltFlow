import { By, Builder, WebElement } from "selenium-webdriver";
import { Op } from "sequelize";
import dotenv from "dotenv";
import {
  Settings,
  WoltSettings,
  CibusSettings,
  RunSettings,
  Run,
  User,
  Cibus2FA,
} from "../../models/index.js";

import {
  safeClick,
  getGiftCardUrl,
  waitForElement,
  setupWoltCookies,
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
  type RunWithUserWithWoltSettingsAndCibusSettingsAndRunSettings,
  type ICustomAPIGatewayProxyEventStepFunction,
  type ICustomStepFunctionResult,
} from "../../types/index.js";
import { initDB } from "../../config/bootstrap.js";
// Environment variables
dotenv.config();

// Connect to database
await initDB();
export const handler = async (
  event: ICustomAPIGatewayProxyEventStepFunction
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
                  model: CibusSettings,
                  as: "cibusSettings",
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
    })) as RunWithUserWithWoltSettingsAndCibusSettingsAndRunSettings;
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
    console.log("start get user id");
    const userId = run.userId;
    console.log("end get user id");
    console.log("start update run");
    // Update run stage
    await run.update({ stage: "buying_gift" });
    console.log("end update run");
    console.log("start get settings");
    const userWithSettings = run.user;
    const settings = userWithSettings?.settings;
    const woltSettings = settings?.woltSettings;
    const cibusSettings = settings?.cibusSettings;
    const runSettings = settings?.runSettings;

    if (!settings || !woltSettings || !cibusSettings || !runSettings) {
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
      woltSettings.woltAccessToken || ""
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
      8000
    );

    if (continueDialogs != null) {
      console.log("start step 2.1");
      const noButton = await waitForElement(
        driver,
        By.xpath("//button[normalize-space(.)='לא']")
      );
      await safeClick(driver, noButton as WebElement);
      const closeButtons1 = await waitForElement(
        driver,
        By.xpath("//button[@aria-label='סגירה']")
      );
      if (closeButtons1) {
        await safeClick(driver, closeButtons1);
      }

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

      const closeButtons2 = await waitForElement(
        driver,
        By.xpath("//button[@aria-label='סגירה']")
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
      13000
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
      By.xpath(`//button[.//div[normalize-space(text())="הצגת פריטים"]]`)
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
      By.xpath("//button[.//div[normalize-space(text())='מעבר לתשלום']]")
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
    const checkoutElement = await waitForElement(
      driver,
      By.xpath(
        "/html/body/div[2]/div[2]/main/div[3]/div[2]/div[1]/ul/li/a/div[2]/div[1]/span"
      ),
      8000
    );
    await safeClick(driver, checkoutElement as WebElement);
    console.log("end step 6");
    if (LEVEL === "6") {
      await sleep(1000);
      throw new Error("LEVEL 6");
    }
    console.log("start step 7");
    const cibusElement = await waitForElement(
      driver,
      By.xpath(
        `//button[@data-test-id="PaymentMethodsList.PaymentMethod"and @data-payment-method-id="cibus"]`
      )
    );
    if (cibusElement != null) {
      await safeClick(driver, cibusElement as WebElement);
      await sleep(1000);
    }
    //FIX use the cibus one
    // const modalButtons = await waitForElement(
    //   driver,
    //   By.xpath(
    //     "/html/body/div[4]/div[10]/div/div[2]/div/aside/div[2]/div/div[1]/div/div[2]/div[2]/div[1]/button/div[2]"
    //   )
    // );
    // if (modalButtons) {
    //   await safeClick(driver, modalButtons);
    // }
    console.log("end step 7");
    if (LEVEL === "7") {
      await sleep(1000);
      throw new Error("LEVEL 7");
    }
    console.log("start step 8");
    // Proceed to checkout
    const orderButton = await waitForElement(
      driver,
      By.xpath("//span[normalize-space(text())='לחצו להזמנה']")
    );
    await safeClick(driver, orderButton as WebElement);
    await sleep(3000);
    console.log("end step 8");
    // Cibus iframe
    if (LEVEL === "8") {
      await sleep(5000);
      throw new Error("LEVEL 8");
    }
    console.log("start step 9");
    // Step 1: Switch to Cibus iframe
    const iframe = await waitForElement(
      driver,
      By.xpath("//iframe[@title='cibus-challenge']"),
      20000
    );
    if (iframe) {
      await driver.switchTo().frame(iframe);
      //TODO: fix this part for cibus new UI
      // Step 2: Enter Cibus credentials
      const usernameInput = await waitForElement(
        driver,
        By.xpath("//input[@id='user']"),
        10000
      );
      if (usernameInput) {
        await usernameInput.clear();
        await usernameInput.sendKeys(cibusSettings.cibusUsername || "");
      }

      // Try to click "אישור" button after username input (may appear in some flows)
      // Try multiple xpath variations since we can't test locally
      const approvalButton = await waitForElement(
        driver,
        By.xpath("//button[contains(text(),'אישור')]"),
        5000
      );
      if (approvalButton) {
        console.log("Found 'אישור' button, clicking it");
        await safeClick(driver, approvalButton);
        await sleep(1000);
      } else {
        console.log("'אישור' button not found, trying continue button");
      }

      // Try the original continue button as fallback
      const continueButton = await waitForElement(
        driver,
        By.xpath(
          "//div[@class='login-btn-container']//button[@type='button'][contains(text(),'שנמשיך?')]"
        ),
        10000
      );
      if (continueButton) {
        console.log("Found 'שנמשיך?' button, clicking it");
        await safeClick(driver, continueButton);
      }

      const passwordInput = await waitForElement(
        driver,
        By.xpath("//input[@id='password']"),
        10000
      );
      if (passwordInput) {
        await passwordInput.clear();
        await passwordInput.sendKeys(cibusSettings.cibusPassword || "");
      }

      const companyInput = await waitForElement(
        driver,
        By.xpath("//input[@id='company-inp']"),
        10000
      );
      if (companyInput) {
        await companyInput.clear();
        await companyInput.sendKeys(cibusSettings.cibusCompany || "");
      }
      //preSS //button[contains(text(),'כניסה')]
      console.log("end step 9");
      if (LEVEL === "9") {
        await sleep(1000);
        throw new Error("LEVEL 9");
      }
      console.log("start step 10");
      // Step 3: Complete Cibus login
      const loginButton = await waitForElement(
        driver,
        By.xpath("//button[contains(text(),'כניסה')]"),
        10000
      );
      if (loginButton) {
        await safeClick(driver, loginButton);
      }
      console.log("end step 10");
      if (LEVEL === "10") {
        await sleep(1000);
        throw new Error("LEVEL 10");
      }
      console.log("start step 11");

      // handle 2FA
      const otpInput = await waitForElement(
        driver,
        By.xpath("//input[@id='otp-input-0']"),
        10000
      );
      if (otpInput) {
        await sleep(45000);

        // Fetch the most recent unused Cibus 2FA code for this user
        const cibus2FA = await Cibus2FA.findOne({
          where: {
            userId: userId,
            isUsed: false,
            expiresAt: {
              [Op.gte]: new Date(),
            },
          },
          order: [["receivedAt", "DESC"]],
        });

        if (!cibus2FA) {
          throw new Error("No valid Cibus 2FA code found");
        }

        await otpInput.clear();
        await otpInput.sendKeys(cibus2FA.code);

        // Mark the code as used
        await cibus2FA.update({ isUsed: true, usedAt: new Date() });
      }
      const loginButton2 = await waitForElement(
        driver,
        By.xpath("//button[@type='button']"),
        10000
      );
      if (loginButton2) {
        await safeClick(driver, loginButton2);
      }

      // Step 4: Confirm Cibus payment
      const paymentButton = await waitForElement(
        driver,
        By.xpath("//button[contains(text(),'אישור התשלום באמצעות סיבוס')]"),
        15000
      );
      if (paymentButton) {
        await safeClick(driver, paymentButton);
      }
      console.log("end step 11");
      if (LEVEL === "11") {
        await sleep(1000);
        throw new Error("LEVEL 11");
      }
      // Return to main content
      await driver.switchTo().defaultContent();
    }
    try {
      if (
        await waitForElement(
          driver,
          By.xpath(
            "//span[@data-localization-key='order.gift-card-tracking-title']"
          ),
          15000
        )
      ) {
        success = true;
      }
    } catch (err) {
      console.log("confirmation element not found");
      console.error("soft error", err);
      //add || true to debug script
      if (
        process.env.ENV === "local"
        // ||process.env.ENV === "dev"
        // || true
      ) {
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
          "buying_gift"
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
          "Gift purchase completed"
        );
      }
    } else {
      await notifyOnError(
        run.userId.toString(),
        run.id,
        "Gift purchase failed"
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
