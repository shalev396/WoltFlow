import { SFNClient, StartExecutionCommand } from "@aws-sdk/client-sfn";

const sfnClient = new SFNClient({
  region: process.env.AWS_REGION,
});

export interface AutomationExecutionUser {
  userId: string;
  runId: string;
  giftAmount: number;
  isNotification: boolean;
}

export interface StartAutomationExecutionResult {
  executionArn: string | undefined;
}

/**
 * Starts the userAutomationChain Step Functions execution for the given users.
 * Shared by the cron handler (A) and the manual-run API.
 */
export async function startAutomationExecution(
  users: AutomationExecutionUser[],
  triggeredBy: string,
): Promise<StartAutomationExecutionResult> {
  const stateMachineArn = process.env.USER_AUTOMATION_STATE_MACHINE_ARN;
  if (!stateMachineArn) {
    throw new Error("USER_AUTOMATION_STATE_MACHINE_ARN not configured");
  }

  const singleUserId =
    users.length === 1 ? users[0]?.userId : undefined;

  const executionInput = {
    users,
    timestamp: new Date().toISOString(),
    triggeredBy,
  };

  const executionName = singleUserId
    ? `automation-user-${singleUserId}-${Date.now()}`
    : `automation-${Date.now()}`;

  const executionResult = await sfnClient.send(
    new StartExecutionCommand({
      stateMachineArn,
      name: executionName,
      input: JSON.stringify(executionInput),
    }),
  );

  console.log(
    `Step Functions execution started: ${executionResult.executionArn}`,
  );

  return { executionArn: executionResult.executionArn };
}
