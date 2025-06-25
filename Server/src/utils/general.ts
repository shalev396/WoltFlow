export function sleep(time: number) {
  if (process.env["ENV"] === "Development" || true) {
    console.log("sleeping for", time, "ms");
  }
  return new Promise((resolve) => setTimeout(resolve, time));
}
export const PAGE_LOAD_TIME = 8000;
export const ANIMATION_TIME = 1000;
