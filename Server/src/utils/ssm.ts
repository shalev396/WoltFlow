import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm";

const ssmClient = new SSMClient({
  region: process.env.AWS_REGION,
});

/** Per-stage SSM path created by the Serverless stack. */
function manualRunParameterName(): string | null {
  const stage = process.env.ENV;
  if (!stage) return null;
  return `/woltflow/${stage}/features/manualRunEnabled`;
}

/**
 * Reads the manual-run feature flag from SSM Parameter Store
 * (local offline and cloud). Missing / non-"true" → disabled.
 */
export async function isManualRunFeatureEnabled(): Promise<boolean> {
  const name = manualRunParameterName();
  if (!name) return false;

  try {
    const result = await ssmClient.send(
      new GetParameterCommand({ Name: name }),
    );
    return result.Parameter?.Value === "true";
  } catch (error) {
    console.warn(
      "Failed to read manual-run SSM parameter; treating as disabled:",
      error,
    );
    return false;
  }
}
