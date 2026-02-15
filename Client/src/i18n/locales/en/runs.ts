export default {
  "title": "Automation Runs",
  "description": "View and manage all your automation executions",
  "nextRunBanner": {
    "title": "Next Automation Run",
    "timeUntilRun": "Time Until Next Run",
    "calculating": "Calculating...",
    "status": "Status",
    "active": "Active",
    "schedule": "Schedule",
    "dailyTime": "Daily 30 min after Wolt opens (10:30–11:30 Israel)",
    "dailyTimeDetail": "Winter: 10:30 AM | Summer: 11:30 AM (Israel DST)",
    "runDays": "Mon-Thu & Sun",
    "automaticExecution": "Automatic execution enabled",
    "nextRun": "Next: weekday morning (10:30–11:30 Israel)"
  },
  "table": {
    "title": "All Runs",
    "totalRunsFound": "{{count}} total runs found",
    "loading": "Loading...",
    "noRuns": "No runs found.",
    "tryAgain": "Try Again",
    "failedToLoad": "Failed to load runs",
    "columns": {
      "id": "ID",
      "date": "Date",
      "status": "Status",
      "stage": "Stage",
      "amount": "Amount",
      "screenshots": "Screenshots",
      "actions": "Actions"
    },
    "filters": {
      "filterByStatus": "Filter by status",
      "filterByMode": "Filter by mode",
      "columns": "Columns"
    },
    "status": {
      "allStatuses": "All Statuses",
      "completed": "Completed",
      "failed": "Failed",
      "inProgress": "In Progress",
      "started": "Started"
    },
    "mode": {
      "allModes": "All Modes",
      "fullRun": "Full Run",
      "buyOnly": "Buy Only"
    },
    "stages": {
      "triggered": "Triggered",
      "refreshingTokens": "Refreshing Tokens",
      "buyingGift": "Buying Gift",
      "gettingCode": "Getting Code from Email",
      "applyingGift": "Applying Gift",
      "completed": "Completed"
    },
    "actions": {
      "details": "Details"
    },
    "pagination": {
      "rowsSelected": "{{selected}} of {{total}} row(s) selected.",
      "updating": "Updating...",
      "previous": "Previous",
      "next": "Next"
    },
    "accessibility": {
      "selectAll": "Select all",
      "selectRow": "Select row",
      "timeUntilNextRun": "Time until next run"
    },
    "none": "None"
  },
  "screenshots": {
    "title": "Run Screenshots",
    "description": "View screenshots captured during this run",
    "count": "{{current}} of {{total}}",
    "stage": "Stage: {{stage}}",
    "noImage": "No image available",
    "download": "Download",
    "close": "Close"
  },
  "filters": {
    "title": "Filters",
    "clear": "Clear",
    "status": "Status",
    "stage": "Stage",
    "mode": "Mode",
    "allStatuses": "All statuses",
    "allStages": "All stages",
    "allModes": "All modes",
    "activeFilters": "Active filters:",
    "statusLabel": "Status: {{status}}",
    "stageLabel": "Stage: {{stage}}",
    "modeLabel": "Mode: {{mode}}",
    "completeAutomation": "Complete Automation"
  }
} as const;
