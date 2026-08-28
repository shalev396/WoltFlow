export function sleep(time: number) {
  console.log("sleeping for", time, "ms");
  return new Promise((resolve) => setTimeout(resolve, time));
}
// Automation pause tiers — see Server/src/handlers/automation/automation.md
export const SHORT_PAUSE = 1000; // UI animation after a click
export const MEDIUM_PAUSE = 3000; // API response after a click
export const LONG_PAUSE = 8000; // Full page navigation

/** Manual "run now" cooldown between triggers (any run, scheduled or manual). */
export const MANUAL_RUN_COOLDOWN_MS = 5 * 60 * 1000;
