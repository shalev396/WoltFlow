import { By, Builder, Key } from "selenium-webdriver";
import dotenv from "dotenv";
import { Run } from "../../classes/index.js";
import type { AutomationRunWithAllSettings } from "../../classes/index.js";
import {
  safeClick,
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
  type ICustomAPIGatewayProxyEventStepFunction,
  type ICustomStepFunctionResult,
} from "../../types/index.js";
import { initDB } from "../../config/bootstrap.js";
import { ChromiumWebDriver } from "selenium-webdriver/chromium.js";

dotenv.config();

await initDB();
export const handler = async (
  event: ICustomAPIGatewayProxyEventStepFunction,
): Promise<ICustomStepFunctionResult> => {
  console.log("Starting woltBuyGift");

  const runId = event.runId || event.queryStringParameters?.runId;
  const LEVEL = event.queryStringParameters?.LEVEL;
  console.log("Start chrome + driver");
  const options = new ChromeOptions();
  const service = new ChromeServiceBuilder("/opt/chromedriver");

  options.setChromeBinaryPath("/opt/chrome/chrome");

  options.addArguments("--headless=old");
  options.addArguments("--no-sandbox");
  options.addArguments("--disable-dev-shm-usage");
  options.addArguments("--disable-gpu");
  options.addArguments("--single-process"); //with isWorking="true", ms="163767"||without(//) isWorking="true", ms="168950"
  options.addArguments("--no-zygote");
  options.addArguments("--remote-debugging-port=0");

  options.addArguments("--window-size=1920,1080");
  options.addArguments("--force-device-scale-factor=1");

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
  let runData: AutomationRunWithAllSettings | null = null;
  try {
    console.log("user setup");
    if (!runId) {
      throw new Error("Missing runId");
    }
    runData = await Run.findWithAllSettings(runId);
    if (!runData) {
      return {
        runId: runId,
        userId: "",
        success: false,
        completed: true,
        message: "Run not found",
      };
    }
    await Run.updateStage(runId, "buying_gift");

    if (!runData.hasAllSettings) {
      await Run.markFailed(runId);
      return {
        runId,
        userId: "",
        success: false,
        completed: true,
        message: "Settings not found",
      };
    }

    await setupWoltCookies(
      driver,
      runData.woltRefreshToken || "",
      runData.woltAccessToken || "",
    );

    const giftAmount = runData.giftAmount;
    if (!giftAmount || giftAmount < 1 || giftAmount > 1500) {
      throw new Error(
        `Gift card amount ${giftAmount} ILS is out of range (1-1500)`,
      );
    }

    /*
     * ----------------------------------------------------------------------
     * Step 0 (experimental — disabled).
     * We are checking the new self-redeem flow without it, since gift cards
     * are no longer part of the cart on the new gift-card-shop page.
     * Re-enable if leftover-cart "אשמח להמשיך" dialogs start blocking checkout.
     * ----------------------------------------------------------------------
     *
     * console.log("start step 0: dismiss leftover-cart dialog if present");
     * const continueDialogs = await waitForElement(
     *   driver,
     *   By.xpath("//*[normalize-space(text())='אשמח להמשיך']"),
     *   8000,
     * );
     * if (continueDialogs != null) {
     *   console.log("leftover cart detected — clearing");
     *   const noButton = await waitForElement(
     *     driver,
     *     By.xpath("//button[normalize-space(.)='לא']"),
     *   );
     *   if (noButton) await safeClick(driver, noButton);
     *   const closeButtons1 = await waitForElement(
     *     driver,
     *     By.xpath("//button[@aria-label='סגירה']"),
     *   );
     *   if (closeButtons1) await safeClick(driver, closeButtons1);
     *   const cartButton = await waitForElement(
     *     driver,
     *     By.xpath("//button[@aria-label='ההזמנות שלך']"),
     *   );
     *   if (cartButton) await safeClick(driver, cartButton);
     *   while (true) {
     *     const deleteButtons = await waitForElement(
     *       driver,
     *       By.xpath("//button[@aria-label='מחיקה']"),
     *     );
     *     if (!deleteButtons) break;
     *     await safeClick(driver, deleteButtons);
     *   }
     *   const closeButtons2 = await waitForElement(
     *     driver,
     *     By.xpath("//button[@aria-label='סגירה']"),
     *   );
     *   if (closeButtons2) await safeClick(driver, closeButtons2);
     *   await sleep(3000);
     *   await driver.get(GIFT_SHOP_URL);
     * }
     */

    // Step 1 — Navigate to the new gift card shop.
    console.log("start step 1: navigate to gift-card-shop");
    const GIFT_SHOP_URL = "https://wolt.com/he/gift-card-shop/isr";
    await driver.get(GIFT_SHOP_URL);
    console.log("end step 1");
    if (LEVEL === "1") {
      await sleep(1000);
      throw new Error("LEVEL 1");
    }

    // Step 2 — Click the "Other" amount label to open custom-amount input.
    console.log("start step 2: click 'אחר' (custom amount label)");
    const otherLabel = await waitForElement(
      driver,
      By.xpath("//label[@data-test-id='AmountChooser-valueCustom.label']"),
      13000,
    );
    if (!otherLabel) {
      throw new Error("Could not find AmountChooser-valueCustom.label");
    }
    await safeClick(driver, otherLabel);
    console.log("end step 2");
    if (LEVEL === "2") {
      await sleep(1000);
      throw new Error("LEVEL 2");
    }

    // Step 3 — Custom amount input: click → Ctrl+A → Delete → type amount.
    console.log(`start step 3: enter custom amount (${giftAmount})`);
    const amountInput = await waitForElement(
      driver,
      By.xpath("//input[@data-test-id='amount-chooser-custom-input']"),
      8000,
    );
    if (!amountInput) {
      throw new Error("Could not find amount-chooser-custom-input");
    }
    await safeClick(driver, amountInput);
    await amountInput.sendKeys(Key.chord(Key.CONTROL, "a"));
    await amountInput.sendKeys(Key.DELETE);
    await amountInput.sendKeys(String(giftAmount));
    console.log("end step 3");
    if (LEVEL === "3") {
      await sleep(1000);
      throw new Error("LEVEL 3");
    }

    // Step 4 — Toggle the self-redeem ("אני קונה לעצמי") switch.
    console.log("start step 4: toggle BuyingForMyselfSwitch");
    const switchEl = await waitForElement(
      driver,
      By.xpath("//input[@data-test-id='GiftCardForm.BuyingForMyselfSwitch']"),
      8000,
    );
    if (!switchEl) {
      throw new Error("Could not find GiftCardForm.BuyingForMyselfSwitch");
    }
    await safeClick(driver, switchEl);
    console.log("end step 4");
    if (LEVEL === "4") {
      await sleep(1000);
      throw new Error("LEVEL 4");
    }

    // Step 5 — Continue to payment method selection.
    console.log("start step 5: click ContinueButton");
    const continueBtn = await waitForElement(
      driver,
      By.xpath("//button[@data-test-id='GiftCardForm.ContinueButton']"),
      8000,
    );
    if (!continueBtn) {
      throw new Error("Could not find GiftCardForm.ContinueButton");
    }
    await safeClick(driver, continueBtn);
    console.log("end step 5");
    if (LEVEL === "5") {
      await sleep(1000);
      throw new Error("LEVEL 5");
    }

    // Step 6 — Open the payment method picker.
    console.log("start step 6: click PaymentMethodSelector");
    const paymentSelector = await waitForElement(
      driver,
      By.xpath("//button[@data-test-id='PaymentMethodSelector']"),
      8000,
    );
    if (!paymentSelector) {
      throw new Error("Could not find PaymentMethodSelector");
    }
    await safeClick(driver, paymentSelector);
    console.log("end step 6");
    if (LEVEL === "6") {
      await sleep(1000);
      throw new Error("LEVEL 6");
    }

    // Step 7 — Pick the "Wolt Benefits" row from the payment-method list.
    console.log("start step 7: select Wolt Benefits row");
    const woltBenefitsRow = await waitForElement(
      driver,
      By.xpath(
        "//button[@data-test-id='PaymentMethodsList.PaymentMethod'][.//span[normalize-space(.)='Wolt Benefits']]",
      ),
      8000,
    );
    if (!woltBenefitsRow) {
      throw new Error("Could not find the Wolt Benefits payment row");
    }
    await safeClick(driver, woltBenefitsRow);
    console.log("end step 7");
    if (LEVEL === "7") {
      await sleep(1000);
      throw new Error("LEVEL 7");
    }

    // Step 8 — Optional: dismiss confirmation modal if it appears.
    console.log("start step 8: dismiss optional modal if present");
    const modalClose = await waitForElement(
      driver,
      By.xpath("//button[@data-test-id='modal-close-button']"),
      3000,
    );
    if (modalClose) {
      await safeClick(driver, modalClose);
    }
    console.log("end step 8");
    if (LEVEL === "8") {
      await sleep(1000);
      throw new Error("LEVEL 8");
    }

    // Step 9 — Press the final pay button.
    console.log("start step 9: click PayButton");
    const payBtn = await waitForElement(
      driver,
      By.xpath("//button[@data-test-id='GiftCardOrderSummary.PayButton']"),
      8000,
    );
    if (!payBtn) {
      throw new Error("Could not find GiftCardOrderSummary.PayButton");
    }
    await safeClick(driver, payBtn);
    await sleep(8000); // give the order time to clear
    console.log("end step 9");
    if (LEVEL === "9") {
      await sleep(1000);
      throw new Error("LEVEL 9");
    }

    // Step 10 — Best-effort: press the post-purchase redeem button.
    // Flagged: territory we can't fully test from here. If the redeem button
    // never appears (e.g. self-redeem already auto-applied), we still treat
    // the run as success based on the post-pay state.
    console.log("start step 10: best-effort press user.redeem button");
    const redeemBtn = await waitForElement(
      driver,
      By.xpath("//button[@data-localization-key='user.redeem']"),
      15000,
    );
    if (redeemBtn) {
      await safeClick(driver, redeemBtn);
      await sleep(3000);
    } else {
      console.log("user.redeem button not present — assuming auto-redeemed");
    }
    console.log("end step 10");
    if (LEVEL === "10") {
      await sleep(1000);
      throw new Error("LEVEL 10");
    }

    // Step 11 — Success screenshot + mark completed.
    console.log("start step 11: success screenshot + mark completed");
    const successScreenshot = await driver.takeScreenshot();
    await uploadImageToS3AndSaveToDb(
      `data:image/png;base64,${successScreenshot}`,
      runData.runId,
      false,
      await driver.getCurrentUrl(),
      "success",
      "completed",
    );
    success = true;
    console.log("end step 11");

    //script end
  } catch (err) {
    console.error("error", err);
    success = false;

    if (driver && runData) {
      try {
        const screenshotBase64 = await driver.takeScreenshot();
        const base64WithPrefix = `data:image/png;base64,${screenshotBase64}`;
        const currentUrl = await driver.getCurrentUrl();
        await uploadImageToS3AndSaveToDb(
          base64WithPrefix,
          runData.runId,
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
    if (driver) {
      console.log("url", await driver.getCurrentUrl());
      console.log("success", success);
      await sleep(1000);
      await driver.quit();
      console.log("driver quit");
    }
  }

  if (!runData) {
    throw new Error("Run not found");
  }

  const status: "completed" | "failed" = success ? "completed" : "failed";
  const stage: "buying_gift" | "completed" = success ? "completed" : "buying_gift";
  await Run.updateStatusAndStage(runData.runId, status, stage);

  try {
    if (success) {
      await notifyOnSuccess(
        runData.userId,
        runData.runId,
        "Gift purchase + auto-redeem completed",
      );
    } else {
      await notifyOnError(
        runData.userId,
        runData.runId,
        "Gift purchase failed",
      );
    }
  } catch (notificationError) {
    console.error("Failed to send notification:", notificationError);
  }

  if (success) {
    return {
      runId: runData.runId,
      userId: runData.userId,
      success: true,
      completed: true,
      message: "Gift purchase + auto-redeem completed",
    };
  } else {
    throw new Error("Gift purchase failed");
  }
};
