import { User, Settings, Inbox } from "../models/index.js";
import { v4 as uuidv4 } from "uuid";

/**
 * Ensure user has Settings and Inbox
 *
 * Can be called with either userId or cognitoSub.
 * Checks if Settings already exist - if yes, does nothing. If no, creates them.
 *
 * @param userIdOrSub - Either user's UUID or Cognito sub
 * @returns Promise<void>
 */
export async function ensureUserSettings(userIdOrSub: string): Promise<void> {
  try {
    let userId: string;

    // Check if it's a UUID (user ID) or Cognito sub
    // UUID format: 8-4-4-4-12 hex characters
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        userIdOrSub
      );

    if (isUUID) {
      userId = userIdOrSub;
    } else {
      // It's a cognitoSub, get the user ID
      const user = await User.findOne({
        where: { cognitoSub: userIdOrSub },
      });

      if (!user) {
        console.error(`❌ User not found for cognitoSub: ${userIdOrSub}`);
        return;
      }

      userId = user.id;
    }

    // Check if Settings already exist
    const existingSettings = await Settings.findOne({
      where: { userId },
    });

    if (existingSettings) {
      console.log(`✅ Settings already exist for user: ${userId}`);
      return;
    }

    // Create Settings connector with null foreign keys
    const settings = await Settings.create({
      id: uuidv4(),
      userId,
      notificationSettingsId: null,
      woltSettingsId: null,
      cibusSettingsId: null,
      runSettingsId: null,
    });
    console.log(`✅ Created Settings: ${settings.id}`);

    // Check if Inbox already exists
    const existingInbox = await Inbox.findOne({
      where: { userId },
    });

    if (!existingInbox) {
      // Create Inbox
      const placeholderEmail = `user-${userId.substring(0, 8)}@pending.setup`;

      const inbox = await Inbox.create({
        id: uuidv4(),
        userId,
        emailAddress: placeholderEmail,
      });
      console.log(`✅ Created Inbox: ${inbox.id}`);
    }
  } catch (error) {
    console.error(`❌ Error in ensureUserSettings:`, error);
  }
}
