import {
  PreAuthenticationTriggerHandler,
  PreAuthenticationTriggerEvent,
} from "aws-lambda";
import {
  CognitoIdentityProviderClient,
  AdminLinkProviderForUserCommand,
  ListUsersCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || "us-east-1",
});

/**
 * PreAuthentication Lambda Trigger for Account Linking
 *
 * This trigger runs BEFORE authentication completes.
 * If a user signs in with Google and there's already a Cognito user with that email,
 * this will automatically link the Google identity to the existing account.
 *
 * Flow:
 * 1. User signs in with Google
 * 2. This trigger runs
 * 3. Check if there's an existing user with same email
 * 4. If yes, link the Google identity to existing user
 * 5. Authentication continues with linked account
 */
export const handler: PreAuthenticationTriggerHandler = async (
  event: PreAuthenticationTriggerEvent
) => {
  console.log(
    "PreAuthentication trigger event:",
    JSON.stringify(event, null, 2)
  );

  const userPoolId = event.userPoolId;
  const email = event.request.userAttributes["email"];
  const username = event.userName;

  // Only handle Google sign-ins (username starts with "Google_")
  if (!username.startsWith("Google_")) {
    console.log("Not a Google sign-in, skipping account linking");
    return event;
  }

  try {
    // Check if there's an existing Cognito user with this email
    const listUsersResponse = await cognitoClient.send(
      new ListUsersCommand({
        UserPoolId: userPoolId,
        Filter: `email = "${email}"`,
        Limit: 2, // We only need to know if there's another user
      })
    );

    console.log(
      `Found ${listUsersResponse.Users?.length || 0} users with email ${email}`
    );

    // If there's more than one user (Google user + email/password user)
    if (listUsersResponse.Users && listUsersResponse.Users.length > 1) {
      // Find the non-Google user (the existing email/password account)
      const existingUser = listUsersResponse.Users.find(
        (user) => !user.Username?.startsWith("Google_")
      );

      if (existingUser && existingUser.Username) {
        console.log(
          `Linking Google identity to existing user: ${existingUser.Username}`
        );

        // Get the provider name and user ID from the Google username
        // Format: Google_<googleUserId>
        const providerUserId = username.replace("Google_", "");

        // Link the Google identity to the existing Cognito user
        await cognitoClient.send(
          new AdminLinkProviderForUserCommand({
            UserPoolId: userPoolId,
            DestinationUser: {
              ProviderName: "Cognito",
              ProviderAttributeValue: existingUser.Username,
            },
            SourceUser: {
              ProviderName: "Google",
              ProviderAttributeName: "Cognito_Subject",
              ProviderAttributeValue: providerUserId,
            },
          })
        );

        console.log("Successfully linked Google identity to existing user");

        // IMPORTANT: Modify the event to use the existing user's username
        // This ensures authentication continues with the linked account
        event.userName = existingUser.Username;
      }
    }

    return event;
  } catch (error) {
    console.error("Error in PreAuthentication trigger:", error);
    // Don't throw error - let authentication continue
    // This prevents blocking users from signing in if linking fails
    return event;
  }
};
