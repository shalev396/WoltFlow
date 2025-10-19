import { PreAuthenticationTriggerEvent } from "aws-lambda";
import {
  CognitoIdentityProviderClient,
  AdminLinkProviderForUserCommand,
  ListUsersCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const cognitoClient = new CognitoIdentityProviderClient({});

export const handler = async (event: PreAuthenticationTriggerEvent) => {
  const userPoolId = event.userPoolId;
  const email = event.request.userAttributes["email"];

  console.log("PreAuth trigger:", {
    triggerSource: event.triggerSource,
    userName: event.userName,
    email,
  });

  // Only handle federated Google users
  if (event.userName.startsWith("Google_")) {
    try {
      // Find existing Cognito user with same email
      const listResult = await cognitoClient.send(
        new ListUsersCommand({
          UserPoolId: userPoolId,
          Filter: `email = "${email}"`,
          Limit: 1,
        })
      );

      if (listResult.Users && listResult.Users.length > 0) {
        const existingUser = listResult.Users[0];

        if (existingUser && existingUser.Username) {
          // Link Google account to existing Cognito user
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
                ProviderAttributeValue: event.userName.replace("Google_", ""),
              },
            })
          );

          console.log("Successfully linked Google account to existing user");
        }
      }
    } catch (error) {
      console.log("Account linking skipped or failed:", error);
      // Don't block authentication if linking fails
    }
  }

  return event;
};
