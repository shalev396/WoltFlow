import { By, until, WebDriver, WebElement } from "selenium-webdriver";
import { TimeoutError } from "sequelize";

export function getGiftCardUrl(amount: number): string | null {
  const giftCards: Array<{ amount: number; url: string }> = [
    {
      amount: 20,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5e452869307ba76c96cb9c2d",
    },
    {
      amount: 25,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5e453b79e69e3e55f1bed164",
    },
    {
      amount: 30,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5e453bac2821fce42844771f",
    },
    {
      amount: 35,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5e2ea8c56e2b3eeaebb62d78",
    },
    {
      amount: 40,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5e3a79083b902ad7f1e21024",
    },
    {
      amount: 45,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5e3a7914b0a451dbcea70d3d",
    },
    {
      amount: 50,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5c6152da1f868c000a863b24",
    },
    {
      amount: 60,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5e4665a03f009985cd78bcd3",
    },
    {
      amount: 70,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5e4665d5f83475eca775e41b",
    },
    {
      amount: 75,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-638f360e9ca2c8c8d494338d",
    },
    {
      amount: 80,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5eeb68a6beaee194b2e75ef1",
    },
    {
      amount: 85,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-62303a7c07b27ce9ed8dc8c1",
    },
    {
      amount: 90,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5d3598ef57e8026517eab7ef",
    },
    {
      amount: 100,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5c615514a4181a000b3b080e",
    },
    {
      amount: 150,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5c6156adf315f7000a3a1bd5",
    },
    {
      amount: 200,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5c61553b5d20280009b3d0dd",
    },
    {
      amount: 250,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5c6156b7b20a02000ade6e8e",
    },
    {
      amount: 300,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5c615741b79e43000a26f109",
    },
    {
      amount: 350,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5c61574c3443ed000b2de8ce",
    },
    {
      amount: 400,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5dcd469847be047afe4e1795",
    },
    {
      amount: 450,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5fe991c5c520c9604266f025",
    },
    {
      amount: 500,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5c6157acf315f7000b911da8",
    },
    {
      amount: 550,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5fe993c1e2a4535687a62352",
    },
    {
      amount: 600,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-60dc81f3599df161e8d62ca6",
    },
    {
      amount: 650,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-63d799214cc5e23606bb020f",
    },
    {
      amount: 700,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-63d79a3f4cc5e23606bb0368",
    },
    {
      amount: 800,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-6527b54def5310f71ba718cc",
    },
    {
      amount: 850,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-6527b560c0006ae00aa9806e",
    },
    {
      amount: 900,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5c7b94db63ff6e000ba917f5",
    },
    {
      amount: 1000,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5d3573e50095f06b17041caf",
    },
    {
      amount: 1500,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5d359dacea185a7c9403cb82",
    },
    {
      amount: 180,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-67c6e23a20601878d237742c",
    },
  ];

  const card = giftCards.find((c) => c.amount === amount);
  return card ? card.url : null;
}

export function safeClick(
  driver: WebDriver,
  element: WebElement,
  timeout = 10000
) {
  // wait until clickable, then click
  return driver
    .wait(until.elementIsVisible(element), timeout)
    .then(() => driver.wait(until.elementIsEnabled(element), timeout))
    .then(() => element.click());
}

/**
 * Waits up to `timeoutMs` for the locator to match an element,
 * then returns that WebElement, or `null` if not found in time.
 *
 * @param driver    your Selenium WebDriver instance
 * @param locator   a By locator (e.g. By.xpath(...) or By.css(...))
 * @param timeoutMs max milliseconds to wait (default: 1s)
 */
export async function waitForElement(
  driver: WebDriver,
  locator: By,
  timeoutMs = 1000
): Promise<WebElement | null> {
  try {
    return await driver.wait(until.elementLocated(locator), timeoutMs);
  } catch (err: any) {
    console.log(`not found: ${locator}`);
    // if (err instanceof TimeoutError) {
    return null;
    // }
    throw err;
  }
}
