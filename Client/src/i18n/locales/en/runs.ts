export default {
  title: "Automation Runs",
  description: "View and manage all your automation executions",
  nextRunBanner: {
    title: "Next Automation Run",
    timeUntilRun: "Time Until Next Run",
    calculating: "Calculating...",
    status: "Status",
    active: "Active",
    schedule: "Schedule",
    dailyTime: "Every morning at 10:00 AM",
    dailyTimeDetail: "Israel time",
    runDays: "Mon-Thu & Sun",
    automaticExecution: "Automatic execution enabled",
    nextRun: "Next: weekday morning at 10:00 AM",
  },
  manualRun: {
    enabled: {
      title: "Try it now",
      description:
        "Don't want to wait for the next scheduled run? Start an automation for your account right now.",
    },
    disabled: {
      title: "On-demand runs unavailable",
      description:
        "This feature is currently disabled. You'll still get your scheduled automation at 10:00 AM Israel time on weekdays.",
    },
    runNow: "Run now",
    starting: "Starting…",
    requirementsNotMet: "Requirements not met",
    cooldown: "Available again in {{time}}",
    loadError: "Could not load on-demand run status.",
    requirementsHelp: {
      title: "Why can't I run now?",
      description:
        "Fix the items below in Settings, then come back to start a run.",
      notice:
        "Your Wolt tokens, gift amount, and automation toggle must be set before an on-demand run can start.",
      openSettings: "Open Settings",
    },
    issues: {
      missing_wolt_refresh_token: {
        title: "Missing Wolt refresh token",
        fix: "Paste your Wolt refresh token (__wrtoken) on the Settings page.",
      },
      missing_wolt_access_token: {
        title: "Missing Wolt access token",
        fix: "Paste your Wolt access token (__wtoken) on the Settings page.",
      },
      missing_gift_amount: {
        title: "Gift amount not set",
        fix: "Choose a gift amount between ₪1 and ₪1500 in Automation settings.",
      },
      automation_disabled: {
        title: "Automation is off",
        fix: "Enable automation in Settings so runs are allowed for your account.",
      },
      run_in_progress: {
        title: "A run is already in progress",
        fix: "Wait for the current run to finish before starting another.",
      },
      cooldown_active: {
        title: "Cooldown active",
        fix: "Wait a few minutes before requesting another on-demand run.",
      },
    },
  },
  table: {
    title: "All Runs",
    totalRunsFound: "{{count}} total runs found",
    loading: "Loading...",
    noRuns: "No runs found.",
    tryAgain: "Try Again",
    failedToLoad: "Failed to load runs",
    columns: {
      id: "ID",
      date: "Date",
      status: "Status",
      stage: "Stage",
      amount: "Amount",
      screenshots: "Screenshots",
      actions: "Actions",
    },
    filters: {
      filterByStatus: "Status",
      filterByStage: "Stage",
      clear: "Clear",
      activeFilters: "Active filters:",
      statusChip: "Status: {{status}}",
      stageChip: "Stage: {{stage}}",
    },
    status: {
      allStatuses: "All statuses",
      completed: "Completed",
      failed: "Failed",
      inProgress: "In Progress",
      started: "Started",
    },
    stages: {
      allStages: "All stages",
      triggered: "Triggered",
      refreshingTokens: "Refreshing Tokens",
      buyingGift: "Buying Gift",
      completed: "Completed",
    },
    actions: {
      details: "Details",
    },
    pagination: {
      showing: "Showing {{from}}–{{to}} of {{total}}",
      updating: "Updating...",
      previous: "Previous",
      next: "Next",
    },
    accessibility: {
      timeUntilNextRun: "Time until next run",
    },
    none: "None",
  },
  screenshots: {
    title: "Run Screenshots",
    description: "View screenshots captured during this run",
    count: "{{current}} of {{total}}",
    stage: "Stage: {{stage}}",
    noImage: "No image available",
    download: "Download",
    close: "Close",
    back: "Back",
    loading: "Loading image…",
    previous: "Previous screenshot",
    next: "Next screenshot",
  },
} as const;
