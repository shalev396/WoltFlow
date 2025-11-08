import {
  PostConfirmationTriggerHandler,
  PostConfirmationTriggerEvent,
} from "aws-lambda";
import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
  AdminLinkProviderForUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { User } from "../../models/index.js";
import { initDB } from "../../config/bootstrap.js";
import { ensureUserSettings } from "../../utils/userInitialization.js";

await initDB();

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || "us-east-1",
});

/**
 * PostConfirmation Lambda Trigger - Database Sync & Email Verification Linking
 *
 * This trigger:
 * 1. Syncs confirmed users to database
 * 2. If email/password user just verified: Check for Google user and link if exists
 */
export const handler: PostConfirmationTriggerHandler = async (
  event: PostConfirmationTriggerEvent
) => {
  console.log("PostConfirmation trigger:", JSON.stringify(event, null, 2));

  const userAttributes = event.request.userAttributes;
  const cognitoSub = userAttributes["sub"]!; // Cognito always provides sub
  const email = userAttributes["email"];
  const name = userAttributes["name"] || email;
  const triggerSource = event.triggerSource;
  const userPoolId = event.userPoolId;
  const username = event.userName;

  try {
    let googleUserLinked = false; // Track if we linked a Google user
    let skipUpsert = false; // Track if we should skip upsert entirely

    // EMAIL/PASSWORD USER (after email verification)
    if (
      triggerSource === "PostConfirmation_ConfirmSignUp" &&
      !username.startsWith("Google_")
    ) {
      console.log(`📧 Native user verified: ${username}`);

      // Check for Google user with same email
      const existingUsers = await cognitoClient.send(
        new ListUsersCommand({
          UserPoolId: userPoolId,
          Filter: `email = "${email}"`,
          Limit: 10,
        })
      );

      const googleUser = existingUsers.Users?.find((user) =>
        user.Username?.startsWith("Google_")
      );

      if (googleUser) {
        console.log(`🔍 Found Google user: ${googleUser.Username} - linking`);

        try {
          // Get Google user's sub BEFORE linking
          const googleUserSub = googleUser.Attributes?.find(
            (attr) => attr.Name === "sub"
          )?.Value;

          // Link Google identity to this verified native user
          await cognitoClient.send(
            new AdminLinkProviderForUserCommand({
              UserPoolId: userPoolId,
              DestinationUser: {
                ProviderName: "Cognito",
                ProviderAttributeValue: username,
              },
              SourceUser: {
                ProviderName: "Google",
                ProviderAttributeName: "Cognito_Subject",
                ProviderAttributeValue: googleUser.Username!,
              },
            })
          );

          console.log(`✅ Linked Google to native user: ${username}`);

          // Update database: change Google user's sub to native sub
          if (googleUserSub) {
            console.log(
              `🔄 Migrating database: ${googleUserSub} → ${cognitoSub}`
            );

            const [affectedRows] = await User.update(
              {
                cognitoSub,
                email: email || null,
                name: name || null,
                lastLoginAt: new Date(),
              },
              { where: { cognitoSub: googleUserSub } }
            );

            if (affectedRows > 0) {
              console.log(
                `✅ Database migrated: Updated ${affectedRows} record(s)`
              );

              // Find the migrated user and ensure settings (pass actual user.id UUID)
              const migratedUser = await User.findOne({
                where: { cognitoSub },
              });

              if (migratedUser) {
                await ensureUserSettings(migratedUser.id);
                console.log(`✅ Settings ensured for migrated user`);
              }

              googleUserLinked = true; // Mark as linked - don't upsert later
            } else {
              console.log(
                `⚠️  No records updated - Google user might not exist in DB`
              );
            }
          }
        } catch (linkError: unknown) {
          if (
            linkError instanceof Error &&
            linkError.message.includes("already linked")
          ) {
            console.log(`ℹ️  Already linked - skipping`);
            googleUserLinked = true; // Still mark as linked
          } else {
            console.error(`❌ Linking error:`, linkError);
          }
        }
      }
    }
    // GOOGLE USER - Check if already linked to a native user
    else if (username.startsWith("Google_")) {
      console.log(`🔍 Google user login: ${username}`);

      // Check if this Google user is already linked to a native user
      const existingUsers = await cognitoClient.send(
        new ListUsersCommand({
          UserPoolId: userPoolId,
          Filter: `email = "${email}"`,
          Limit: 10,
        })
      );

      const nativeUser = existingUsers.Users?.find(
        (user) =>
          !user.Username?.startsWith("Google_") &&
          user.UserStatus === "CONFIRMED"
      );

      if (nativeUser) {
        console.log(
          `ℹ️  Google user is linked to native user: ${nativeUser.Username} - skipping database sync`
        );
        skipUpsert = true; // Don't create a new record - native user record exists
      } else {
        console.log(
          `ℹ️  Google user not linked yet - creating database record`
        );
      }
    } else {
      console.log(`ℹ️  User confirmed: ${username}`);
    }

    // Only upsert if we DIDN'T migrate and we're NOT a linked Google user
    if (!googleUserLinked && !skipUpsert) {
      const [user] = await User.upsert({
        cognitoSub,
        email: email || null,
        name: name || null,
        lastLoginAt: new Date(),
      });
      console.log(`✅ User upserted: ${cognitoSub}`);

      // Ensure user has settings (pass actual user.id UUID)
      await ensureUserSettings(user.id);
    } else {
      console.log(`ℹ️  Skipping upsert - user already exists`);
    }
  } catch (error) {
    console.error("❌ PostConfirmation error:", error);
    // Don't throw - allow auth to succeed
  }

  return event;
};
