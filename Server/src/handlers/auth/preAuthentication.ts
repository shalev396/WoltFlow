import {
  PreAuthenticationTriggerHandler,
  PreAuthenticationTriggerEvent,
} from "aws-lambda";

/**
 * PreAuthentication Lambda Trigger
 *
 * This trigger fires BEFORE authentication completes.
 * We use it to ensure Google users authenticate with their regular Cognito account.
 *
 * Note: This should rarely trigger because Google_xxx users get converted
 * to regular users in PostConfirmation. This is a safety net.
 */
export const handler: PreAuthenticationTriggerHandler = async (
  event: PreAuthenticationTriggerEvent
) => {
  console.log("PreAuthentication trigger:", JSON.stringify(event, null, 2));

  // This trigger doesn't modify anything - just logs for monitoring
  // The actual linking happens in PreSignUp and PostConfirmation
  
  return event;
};

