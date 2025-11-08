import { PreSignUpTriggerHandler, PreSignUpTriggerEvent } from "aws-lambda";
import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
  AdminLinkProviderForUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || "us-east-1",
});

/**
 * PreSignUp Lambda Trigger - Identity Linking
 *
 * AWS Cognito Account Linking Strategy:
 * - When a Google user signs in, check if a native user with same email exists
 * - If yes and verified: Link the federated identity to the native user
 * - After linking, both Google and email/password logins will use the SAME user account
 *
 * Key: We DON'T prevent Google_xxx creation - we link it to existing user
 * Cognito handles the rest automatically after linking
 */
export const handler: PreSignUpTriggerHandler = async (
  event: PreSignUpTriggerEvent
) => {
  console.log("PreSignUp trigger:", JSON.stringify(event, null, 2));

  const triggerSource = event.triggerSource;
  const userPoolId = event.userPoolId;
  const email = event.request.userAttributes["email"];

  try {
    // EXTERNAL PROVIDER (Google) Sign-In
    if (triggerSource === "PreSignUp_ExternalProvider") {
      console.log(`🔐 Google sign-in for: ${email}`);

      // Find ALL users with this email (both Google_xxx and native)
      const existingUsers = await cognitoClient.send(
        new ListUsersCommand({
          UserPoolId: userPoolId,
          Filter: `email = "${email}"`,
          Limit: 10,
        })
      );

      // Check if this exact Google user already exists (repeat login)
      const existingGoogleUser = existingUsers.Users?.find(
        (user) => user.Username === event.userName
      );

      if (existingGoogleUser) {
        console.log(
          `ℹ️  This Google user already exists - allowing repeat sign-in`
        );
        // Just auto-confirm and return - linking already happened
        event.response.autoConfirmUser = true;
        event.response.autoVerifyEmail = true;
        return event;
      }

      // Look for native (non-Google) user
      const nativeUser = existingUsers.Users?.find(
        (user) => !user.Username?.startsWith("Google_")
      );

      if (nativeUser && nativeUser.UserStatus === "CONFIRMED") {
        console.log(`✅ Found verified native user: ${nativeUser.Username}`);
        console.log(`🔗 Linking Google identity...`);

        try {
          // Link this Google identity to the existing native user
          await cognitoClient.send(
            new AdminLinkProviderForUserCommand({
              UserPoolId: userPoolId,
              DestinationUser: {
                ProviderName: "Cognito",
                ProviderAttributeValue: nativeUser.Username!,
              },
              SourceUser: {
                ProviderName: "Google",
                ProviderAttributeName: "Cognito_Subject",
                ProviderAttributeValue: event.userName, // Google_xxx username
              },
            })
          );

          console.log(
            `✅ Linked Google to native user: ${nativeUser.Username}`
          );
        } catch (linkError: unknown) {
          if (
            linkError instanceof Error &&
            linkError.message.includes("already linked")
          ) {
            console.log(`ℹ️  Already linked - continuing`);
          } else {
            console.error(`❌ Linking error:`, linkError);
          }
        }
      } else if (nativeUser && nativeUser.UserStatus !== "CONFIRMED") {
        console.log(
          `⚠️  Native user exists but unverified - security: no linking until verified`
        );
      } else {
        console.log(`ℹ️  No native user found - Google user will be created`);
      }

      // Auto-confirm Google users (they're verified by Google)
      event.response.autoConfirmUser = true;
      event.response.autoVerifyEmail = true;
    }

    // EMAIL/PASSWORD Sign-Up
    else if (triggerSource === "PreSignUp_SignUp") {
      console.log(`📝 Email/password signup for: ${email}`);
      // Don't auto-confirm - require email verification
      event.response.autoConfirmUser = false;
    }

    return event;
  } catch (error) {
    console.error("❌ PreSignUp error:", error);
    // Always return event - don't throw errors
    return event;
  }
};
