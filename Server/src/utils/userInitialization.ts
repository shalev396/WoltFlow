import { User } from "../classes/index.js";

/**
 * Ensure user has Settings.
 *
 * Can be called with either userId or cognitoSub.
 * Checks if Settings already exist - if yes, does nothing. If no, creates them.
 *
 * @param userIdOrSub - Either user's UUID or Cognito sub
 * @returns Promise<void>
 */
export async function ensureUserSettings(userIdOrSub: string): Promise<void> {
  try {
    await User.ensureSettings(userIdOrSub);
  } catch (error) {
    console.error(`Error in ensureUserSettings:`, error);
  }
}
