export function sleep(time: number) {
  // const shouldLog = process.env.ENV === "local";
  // if (shouldLog) {
  console.log("sleeping for", time, "ms");
  // }
  return new Promise((resolve) => setTimeout(resolve, time));
}
export const PAGE_LOAD_TIME = 8000;
export const ANIMATION_TIME = 1000;
