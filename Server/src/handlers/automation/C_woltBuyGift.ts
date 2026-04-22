import { By, Builder } from "selenium-webdriver";
import dotenv from "dotenv";
import { Run } from "../../classes/index.js";
import type {
  AutomationRunWithAllSettings,
} from "../../classes/index.js";
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
    console.log("start db");
    console.log("end db");
    console.log("start get run");
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
    console.log("end get run");
    console.log("start update run");
    await Run.updateStage(runId, "buying_gift");
    console.log("end update run");
    console.log("start get settings");

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
    console.log("end get settings");
    console.log("start setup wolt cookies");
    await setupWoltCookies(
      driver,
      runData.woltRefreshToken || "",
      runData.woltAccessToken || "",
    );
    console.log("end setup wolt cookies");
    console.log("start step 1: navigate to gift-card-shop");
    const giftAmount = runData.giftAmount;
    if (!giftAmount || giftAmount < 1 || giftAmount > 1500) {
      throw new Error(
        `Gift card amount ${giftAmount} ILS is out of range (1-1500)`,
      );
    }
    const GIFT_SHOP_URL = "https://wolt.com/he/gift-card-shop/isr";
    await driver.get(GIFT_SHOP_URL);
    console.log("end step 1");
    if (LEVEL === "1") {
      await sleep(1000);
      throw new Error("LEVEL 1");
    }

    // Safety net: dismiss leftover-cart "אשמח להמשיך" dialog if it appears.
    // The new shop normally won't show it, but old carts can still trigger it.
    console.log("start step 2: dismiss leftover-cart dialog if present");
    const continueDialogs = await waitForElement(
      driver,
      By.xpath("//*[normalize-space(text())='אשמח להמשיך']"),
      8000,
    );

    if (continueDialogs != null) {
      console.log("leftover cart detected — clearing");
      const noButton = await waitForElement(
        driver,
        By.xpath("//button[normalize-space(.)='לא']"),
      );
      if (noButton) await safeClick(driver, noButton);
      const closeButtons1 = await waitForElement(
        driver,
        By.xpath("//button[@aria-label='סגירה']"),
      );
      if (closeButtons1) await safeClick(driver, closeButtons1);

      const cartButton = await waitForElement(
        driver,
        By.xpath("//button[@aria-label='ההזמנות שלך']"),
      );
      if (cartButton) await safeClick(driver, cartButton);

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
      if (closeButtons2) await safeClick(driver, closeButtons2);
      await sleep(3000);
      // Re-navigate to ensure clean state
      await driver.get(GIFT_SHOP_URL);
    }
    console.log("end step 2");
    if (LEVEL === "2") {
      await sleep(1000);
      throw new Error("LEVEL 2");
    }

    // Step 3: click "אחר" to reveal the custom amount input.
    console.log("start step 3: click 'אחר' (custom amount)");
    const otherAmountButton = await waitForElement(
      driver,
      By.xpath("//button[normalize-space(.)='אחר']"),
      13000,
    );
    if (!otherAmountButton) {
      throw new Error("Could not find the 'אחר' (other amount) button");
    }
    await safeClick(driver, otherAmountButton);
    await sleep(800);
    console.log("end step 3");
    if (LEVEL === "3") {
      await sleep(1000);
      throw new Error("LEVEL 3");
    }

    // Step 4: enter the custom amount.
    console.log(`start step 4: enter custom amount (${giftAmount})`);
    const amountInput = await waitForElement(
      driver,
      By.xpath(
        "//input[@type='number' or @inputmode='numeric' or @inputmode='decimal']",
      ),
      8000,
    );
    if (!amountInput) {
      throw new Error("Could not find the custom amount input field");
    }
    await amountInput.clear();
    await amountInput.sendKeys(String(giftAmount));
    await sleep(500);
    console.log("end step 4");
    if (LEVEL === "4") {
      await sleep(1000);
      throw new Error("LEVEL 4");
    }

    // Step 5: ensure "אני קונה לעצמי" toggle is ON.
    console.log("start step 5: toggle 'אני קונה לעצמי' ON");
    const selfRedeemSwitch = await waitForElement(
      driver,
      By.xpath(
        "//*[normalize-space(text())='אני קונה לעצמי']/ancestor::*[self::label or self::div][1]//*[@role='switch' or self::input[@type='checkbox']]",
      ),
      8000,
    );
    if (!selfRedeemSwitch) {
      throw new Error(
        "Could not find the 'אני קונה לעצמי' (buying for myself) toggle",
      );
    }
    const switchChecked =
      (await selfRedeemSwitch.getAttribute("aria-checked")) === "true" ||
      (await selfRedeemSwitch.getAttribute("checked")) === "true";
    if (!switchChecked) {
      await safeClick(driver, selfRedeemSwitch);
      await sleep(500);
    } else {
      console.log("self-redeem toggle already ON, skipping");
    }
    console.log("end step 5");
    if (LEVEL === "5") {
      await sleep(1000);
      throw new Error("LEVEL 5");
    }

    // Step 6: click "להמשיך" (continue) to proceed to payment.
    console.log("start step 6: click 'להמשיך'");
    const continueButton = await waitForElement(
      driver,
      By.xpath(
        "//button[.//*[normalize-space(text())='להמשיך'] or normalize-space(.)='להמשיך']",
      ),
      8000,
    );
    if (!continueButton) {
      throw new Error("Could not find the 'להמשיך' (continue) button");
    }
    await safeClick(driver, continueButton);
    await sleep(8000);
    console.log("end step 6");
    if (LEVEL === "6") {
      await sleep(1000);
      throw new Error("LEVEL 6");
    }

    // Step 7: ensure Wolt Benefits is the selected payment method.
    console.log("start step 7: select Wolt Benefits payment");
    // Try opening the payment-method picker if the current method isn't Wolt Benefits.
    const paymentOpener = await waitForElement(
      driver,
      By.xpath(
        "//*[normalize-space(text())='אמצעי תשלום']/ancestor::button[1]" +
          " | //button[.//div[normalize-space(text())='אמצעי תשלום']]" +
          " | //div[normalize-space(text())='אמצעי תשלום']/ancestor::button[1]",
      ),
      4000,
    );
    if (paymentOpener) {
      await safeClick(driver, paymentOpener);
      await sleep(1500);
    }
    const woltBenefitsElement = await waitForElement(
      driver,
      By.xpath("//span[normalize-space()='Wolt Benefits']"),
      6000,
    );
    if (woltBenefitsElement != null) {
      await safeClick(driver, woltBenefitsElement);
      await sleep(1500);
      // Some flows show a 'בחירה' (select) confirm button beside the row
      const selectBtn = await waitForElement(
        driver,
        By.xpath("//button[normalize-space(.)='בחירה']"),
        2000,
      );
      if (selectBtn) {
        await safeClick(driver, selectBtn);
        await sleep(1000);
      }
    }
    const closeDialogueButton = await waitForElement(
      driver,
      By.xpath("//button[@aria-label='סגירה']"),
      2000,
    );
    if (closeDialogueButton) {
      await safeClick(driver, closeDialogueButton);
      await sleep(500);
    }
    console.log("end step 7");
    if (LEVEL === "7") {
      await sleep(1000);
      throw new Error("LEVEL 7");
    }

    // Step 8: click pay/order button. Try the Wolt-Benefits-specific label first,
    // then fall back to the legacy generic "לחצו להזמנה" label.
    console.log("start step 8: click pay/order button");
    let orderButton = await waitForElement(
      driver,
      By.xpath(
        "//span[contains(normalize-space(.), 'Wolt Benefits') and (starts-with(normalize-space(.), 'שלם') or starts-with(normalize-space(.), 'שלמ'))]" +
          " | //button[.//span[contains(normalize-space(.), 'Wolt Benefits')]]",
      ),
      4000,
    );
    if (!orderButton) {
      orderButton = await waitForElement(
        driver,
        By.xpath("//span[normalize-space(text())='לחצו להזמנה']"),
        8000,
      );
    }
    if (!orderButton) {
      throw new Error("Could not find the final pay/order button");
    }
    await safeClick(driver, orderButton);
    await sleep(3000);
    console.log("end step 8");

    // Step 9: verify success.
    try {
      const trackingTitle = await waitForElement(
        driver,
        By.xpath(
          "//span[@data-localization-key='order.gift-card-tracking-title']" +
            " | //*[contains(normalize-space(.), 'תודה') and (self::h1 or self::h2 or self::h3)]" +
            " | //*[contains(normalize-space(.), 'אישור הזמנה')]",
        ),
        15000,
      );
      if (trackingTitle) {
        success = true;
      } else {
        // The new self-redeem flow lands on /me/orders/... after success.
        const currentUrl = await driver.getCurrentUrl();
        if (currentUrl.includes("/me/orders/")) {
          success = true;
        }
      }
    } catch (err) {
      console.log("confirmation element not found");
      console.error("soft error", err);
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
        "Gift purchase + redemption completed",
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
      message: "Gift purchase + redemption completed",
    };
  } else {
    throw new Error("Gift purchase failed");
  }
};
// //span[@data-localization-key='order.gift-card-tracking-title']
// //span[@data-localization-key='order.gift-card-tracking-subtitle']
// //span[@data-localization-key='order.gift-card-tracking-link']
