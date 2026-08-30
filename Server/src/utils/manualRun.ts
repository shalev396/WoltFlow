import { User, Run } from "../classes/index.js";
import { MANUAL_RUN_COOLDOWN_MS } from "./general.js";
import { isManualRunFeatureEnabled } from "./ssm.js";

export type ManualRunIssueCode =
  | "missing_wolt_refresh_token"
  | "missing_wolt_access_token"
  | "missing_gift_amount"
  | "automation_disabled"
  | "run_in_progress"
  | "cooldown_active";

export interface ManualRunIssue {
  code: ManualRunIssueCode;
}

export interface ManualRunCooldown {
  active: boolean;
  retryAfterSeconds: number;
  endsAt: string;
}

export interface ManualRunStatus {
  featureEnabled: boolean;
  eligible: boolean;
  issues: ManualRunIssue[];
  cooldown: ManualRunCooldown | null;
  /** Present when gift amount is valid; used by the fire endpoint. */
  giftAmount: number | null;
  isNotificationEnabled: boolean;
}

const MIN_GIFT_AMOUNT = 1;
const MAX_GIFT_AMOUNT = 1500;

function isValidGiftAmount(amount: number | null | undefined): amount is number {
  if (amount === null || amount === undefined) return false;
  const n = Number(amount);
  return Number.isFinite(n) && n >= MIN_GIFT_AMOUNT && n <= MAX_GIFT_AMOUNT;
}

/**
 * Shared eligibility for GET and POST /api/user/runs/manual.
 * Collects every failing check so the UI can list all issues at once.
 */
export async function evaluateManualRun(
  userId: string,
): Promise<ManualRunStatus> {
  const featureEnabled = await isManualRunFeatureEnabled();
  const issues: ManualRunIssue[] = [];

  const [woltResult, runResult, latestRun] = await Promise.all([
    User.getWoltSettings(userId),
    User.getRunSettings(userId),
    Run.findLatestForUser(userId),
  ]);

  const refreshToken = woltResult.woltSettings?.woltRefreshToken?.trim() ?? "";
  const accessToken = woltResult.woltSettings?.woltAccessToken?.trim() ?? "";
  const automationEnabled =
    runResult.runSettings?.automationEnabled === true;
  const rawGiftAmount = runResult.runSettings?.giftAmount;
  const giftAmountNum =
    rawGiftAmount !== null && rawGiftAmount !== undefined
      ? Number(rawGiftAmount)
      : null;

  // Notification flag for the fire path (not an eligibility requirement).
  let isNotificationEnabled = false;
  try {
    const notification = await User.getNotificationSettings(userId);
    isNotificationEnabled =
      notification.notificationSettings?.isEnabled === true;
  } catch {
    isNotificationEnabled = false;
  }

  if (!refreshToken) {
    issues.push({ code: "missing_wolt_refresh_token" });
  }
  if (!accessToken) {
    issues.push({ code: "missing_wolt_access_token" });
  }
  if (!isValidGiftAmount(giftAmountNum)) {
    issues.push({ code: "missing_gift_amount" });
  }
  if (!automationEnabled) {
    issues.push({ code: "automation_disabled" });
  }

  let cooldown: ManualRunCooldown | null = null;

  if (latestRun) {
    if (
      latestRun.status === "started" ||
      latestRun.status === "in_progress"
    ) {
      issues.push({ code: "run_in_progress" });
    }

    const endsAtMs = latestRun.createdAt.getTime() + MANUAL_RUN_COOLDOWN_MS;
    const remainingMs = endsAtMs - Date.now();
    if (remainingMs > 0) {
      issues.push({ code: "cooldown_active" });
      cooldown = {
        active: true,
        retryAfterSeconds: Math.ceil(remainingMs / 1000),
        endsAt: new Date(endsAtMs).toISOString(),
      };
    }
  }

  const eligible = featureEnabled && issues.length === 0;

  return {
    featureEnabled,
    eligible,
    issues,
    cooldown,
    giftAmount: isValidGiftAmount(giftAmountNum) ? giftAmountNum : null,
    isNotificationEnabled,
  };
}
