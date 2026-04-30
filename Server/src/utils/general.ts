export function sleep(time: number) {
  console.log("sleeping for", time, "ms");
  return new Promise((resolve) => setTimeout(resolve, time));
}
export const PAGE_LOAD_TIME = 8000;
export const ANIMATION_TIME = 1000;

// Automation pause tiers — see Server/src/handlers/automation/automation.md
export const SHORT_PAUSE = 1000; // UI animation after a click
export const MEDIUM_PAUSE = 3000; // API response after a click
export const LONG_PAUSE = 8000; // Full page navigation
