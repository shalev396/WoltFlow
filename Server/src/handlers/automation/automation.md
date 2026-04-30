# `C_woltBuyGift` — Automation Flow

End-to-end map of `C_woltBuyGift.ts`, step by step.
After each click we pause; the pause tier tells us _why_ we're waiting.

> **Note:** every HTML snippet below has had its inline `<svg>` markup stripped so the elements stay readable here. The XPath / `data-test-id` selectors are unaffected.

### Pause tiers

- **Short** — wait for a UI animation after a click (~1s).
- **Medium** — wait for an API response after a click (~3s).
- **Long** — wait for a full page navigation (~8s).

---

## Step 1 — Navigate to the gift-card shop

- **Action:** `driver.get(URL)`
- **URL:** `https://wolt.com/he/gift-card-shop/isr`

_Pause: **Long** — full page navigation._

---

## Step 2 — Click "Other" amount option (אחר)

- **XPath:** `//label[@data-test-id='AmountChooser-valueCustom.label']`

```html
<label
  data-variant="border"
  for="gift-card-amountcustom"
  data-test-id="AmountChooser-valueCustom.label"
  data-multiline="false"
  class="lcw7leb"
  >אחר</label
>
```

_Pause: **Short** — custom amount input animates in._

---

## Step 3 — Enter the custom amount

- **XPath:** `//input[@data-test-id='amount-chooser-custom-input']`
- **Sequence:** click → `Ctrl+A` → `Delete` → type `giftAmount`.

```html
<input
  aria-label="סכום מותאם אישית לכרטיס מתנה"
  autocomplete="off"
  inputmode="text"
  autocorrect="off"
  spellcheck="false"
  tabindex="0"
  aria-roledescription="Number field"
  class="noRtl i1i67ax0"
  data-test-id="amount-chooser-custom-input"
  type="text"
  value="‏150&nbsp;‏"
/>
```

_Pause: **Short** — form reacts to the new value._

---

## Step 4 — Toggle "send to my own account"

- **XPath:** `//label[.//input[@data-test-id='GiftCardForm.BuyingForMyselfSwitch']]`
- **Why the label and not the input:** the underlying `<input type="checkbox">` is visually hidden by Wolt's `al-Switch` component (the `inptswtch-npt` class is literally "input switch"). Selenium's visibility check rejects it. Clicking the wrapping `<label>` toggles the same checkbox via standard a11y behavior.

```html
<input
  data-test-id="GiftCardForm.BuyingForMyselfSwitch"
  class="al-Switch-inptswtch-npt-349"
  role="switch"
  type="checkbox"
  name="buyingForMyself"
/>
```

_Pause: **Short** — toggle animation._

---

## Step 5 — Press "Continue" → goes to the payment page

- **XPath:** `//button[@data-test-id='GiftCardForm.ContinueButton']`

```html
<button
  data-test-id="GiftCardForm.ContinueButton"
  class="al-Button-rt-349 s1mh9fsa"
  data-size="large"
  data-stretch="true"
  data-variant="primary"
  type="button"
>
  <div class="al-Button-bg-349"></div>
  <div class="al-Button-cntnt-349">
    <div class="al-Button-lbl-349">
      <div class="s1bt2p8o">
        <span>להמשיך</span><span class="pyfg6nw">‏150&nbsp;‏₪</span>
      </div>
    </div>
  </div>
</button>
```

_Pause: **Long** — navigates to the payment page._

---

## Step 6 — Open the "change payment method" picker

- **XPath:** `//button[@data-test-id='PaymentMethodSelector']`

```html
<button
  type="button"
  data-test-id="PaymentMethodSelector"
  class="p8e8tuc"
  aria-labelledby="_r_1u5_ _r_1v7_"
>
  <span class="p1vry3oa"></span>
  <span id="_r_1v7_" class="p17yzjok"
    ><strong>Wolt Benefits</strong
    ><small
      ><span
        color="var(--al-color-text-subdued)"
        class="al-t-caption r1awid4i"
        style="--r1awid4i-0: var(--al-color-text-subdued);"
        ><span
          >אפשר להשתמש באמצעי תשלום זה להזמנות של עד
          <span>‏1.00&nbsp;‏₪</span> ביום ממסעדות, מאפיות, מצרכים, חנויות
          קמעונאיות נוספות וגיפט קארד ב-שני – חמישי 10:00–18:00, ראשון
          10:00–18:00.</span
        ></span
      ></small
    ></span
  >
  <span class="p1xe2cl4"></span>
</button>
```

_Pause: **Medium** — payment methods list is fetched._

---

## Step 7 — Pick the "Wolt Benefits" row

- **XPath:** `//button[@data-test-id='PaymentMethodsList.PaymentMethod'][.//span[normalize-space(.)='Wolt Benefits']]`

```html
<button
  data-test-id="PaymentMethodsList.PaymentMethod"
  aria-current="false"
  data-payment-method-id="93dbdfaa3614451ca371cc40900a15e8"
  class="r1hx5tkh r1blw54s"
  style="--r1blw54s-0: pointer; --r1blw54s-1: 1; --r1blw54s-2: unset;"
>
  <span data-test-id="PaymentMethodsList.PaymentMethod.Name" class="r1xrgvhb"
    ><span aria-current="false" class="h1f89iim">Wolt Benefits</span
    ><span
      color="var(--al-color-text-subdued)"
      class="al-t-caption r1awid4i"
      style="--r1awid4i-0: var(--al-color-text-subdued);"
      ><span
        >אפשר להשתמש באמצעי תשלום זה להזמנות של עד
        <span>‏1.00&nbsp;‏₪</span> ביום ממסעדות, מאפיות, מצרכים, חנויות
        קמעונאיות נוספות וגיפט קארד ב-שני – חמישי 10:00–18:00, ראשון
        10:00–18:00.</span
      ></span
    ></span
  >
  <div class="amwsnv4">
    <span
      data-test-id="PaymentMethodsList.PaymentMethod.FakeButton"
      class="fake-button rcrfpph"
      style="--rcrfpph-0: visible;"
      >בחירה</span
    >
  </div>
</button>
```

_Pause: **Medium** — payment method is applied to the order._

---

## Step 8 — (Optional) Close the picker if it stayed open

- **XPath:** `//button[@data-test-id='modal-close-button']`
- If "Wolt Benefits" was already the selected payment, the picker closes itself and this button is never clickable. Treat **not found** / **not clickable** as success and move on.

```html
<button
  class="cbc_IconButton_root_f04"
  data-backdrop="transparent"
  data-size="medium"
  data-variant="neutral"
  type="button"
  aria-label="סגירה"
  data-test-id="modal-close-button"
>
  <div class="cbc_IconButton_bg_f04"></div>
  <div class="cbc_IconButton_iconContainer_f04"></div>
</button>
```

_Pause: **Short** — modal close animation._

---

## Step 9 — Press the checkout button on the payment page

- **XPath:** `//button[@data-test-id='GiftCardOrderSummary.PayButton']`

```html
<button
  aria-busy="false"
  class="cbc_Button_rootClass_f04 cbc_Button_rootButtonClass_f04 s32j2un"
  data-size="medium"
  data-stretch=""
  data-variant="primary"
  type="button"
  data-test-id="GiftCardOrderSummary.PayButton"
>
  <div class="cbc_Button_bgClass_f04"></div>
  <div class="cbc_Button_spinnerContainer_f04"></div>
  <div class="cbc_Button_content_f04">
    <div class="czevamf">
      <span class="c17osrj5">לחץ כדי לשלם</span
      ><span class="p13luvrx">‏1.00&nbsp;‏₪</span>
    </div>
  </div>
</button>
```

_Pause: **Long** — payment is processed and the page navigates to the post-purchase "would you like to redeem?" view._

---

## Step 10 — Press "Redeem" on the post-purchase page

- **What this does:** despite the label, this does **not** perform the redemption — it navigates to the dedicated redeem page with the gift-card code already filled in via the URL.
- **XPath:** `//button[.//div[normalize-space(.)='למימוש הקוד']]`

```html
<button
  aria-busy="false"
  class="cbc_Button_rootClass_f04 cbc_Button_rootButtonClass_f04 r1djcdxx"
  data-size="medium"
  data-variant="primary"
  type="button"
>
  <div class="cbc_Button_bgClass_f04"></div>
  <div class="cbc_Button_spinnerContainer_f04"></div>
  <div class="cbc_Button_content_f04">למימוש הקוד</div>
</button>
```

_Pause: **Long** — navigates to the redeem page with the code in the URL._

---

## Step 11 — Press "Redeem" on the redeem page

- **What this does:** the actual redemption — credits the gift card to the account.
- **XPath:** `//button[@data-localization-key='user.redeem']`

```html
<button
  data-localization-key="user.redeem"
  class="al-Button-rt-349"
  data-size="medium"
  data-variant="primary"
  type="button"
>
  <div class="al-Button-bg-349"></div>
  <div class="al-Button-cntnt-349">
    <div class="al-Button-lbl-349">Redeem</div>
  </div>
</button>
```

_Pause: **Medium** — redemption API call._

---

## Step 12 — Capture the success message _(HTML pending)_

- **XPath:** _TBD — paste once we capture a successful run._
- **What this does:** locate the on-page success confirmation, then take the screenshot used for the "completed" run record.

```html
<!-- paste live success-message HTML here when captured -->
```

_Pause: **Medium** — wait for the success message to render before screenshotting._

---

## Outcome

**On success:** mark the run as `completed`, send the success notification.
**On failure:** capture an error screenshot, mark the run as `failed`, send the error notification.

---

## Test event (AWS)

Fire the pipeline for **one user** by invoking the `startUserAutomationChain` Lambda with this payload (omit `userId` to run for every automation-enabled user):

```json
{ "userId": "<target-user-uuid-or-cognito-sub>" }
```

`userId` accepts either the internal `User.id` or the Cognito sub — the handler resolves to the internal id automatically. The user must also have `runSettings.automationEnabled = true`, otherwise the run is skipped with a clear "exists but does not have automation enabled" message.

---

## Dialogue (currently disabled)

**Leftover-cart "אשמח להמשיך" dialog:** if it appears before Step 1, dismiss it, empty the cart, then re-enter the gift-card shop.
