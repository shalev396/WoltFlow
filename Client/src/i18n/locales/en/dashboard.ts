export default {
  "title": "Dashboard",
  "welcomeBack": "Welcome back, {{name}}",
  "error": {
    "loadFailed": "Failed to load dashboard data. Please refresh the page."
  },
  "metrics": {
    "totalSavings": "Total Savings",
    "successRate": "Success Rate",
    "totalRuns": "Total Runs",
    "analyticsPeriod": "Analytics Period",
    "successfulRuns": "successful runs",
    "vsPreviousPeriod": "vs previous period",
    "selectPeriod": "Select period"
  },
  "timeRanges": {
    "last7Days": "Last 7 days",
    "last30Days": "Last 30 days",
    "last90Days": "Last 90 days",
    "thisWeek": "this week",
    "thisMonth": "this month",
    "last3Months": "last 3 months"
  },
  "savingsOverview": {
    "title": "Total Savings",
    "savedFrom": "Saved {{period}} from automated claims",
    "successfulClaims": "Successful claims",
    "avgPerClaim": "Average per claim",
    "growing": "Growing {{percent}}% vs previous period",
    "down": "Down {{percent}}% vs previous period"
  },
  "savingsTrend": {
    "title": "Savings Trend",
    "showingCumulative": "Showing cumulative savings over {{period}}",
    "loadingChart": "Loading chart...",
    "noDataYet": "No savings data available yet",
    "completeFirstRun": "Complete your first automated run to see trends",
    "avgDailySavings": "Average daily savings: ₪{{amount}}",
    "overDays": "Over {{days}} days ({{period}})"
  },
  "recentRuns": {
    "title": "Recent Runs",
    "viewAll": "View All",
    "date": "Date",
    "status": "Status",
    "amount": "Amount",
    "noRuns": "No runs yet",
    "runsWillAppear": "Your automation runs will appear here",
    "viewDetails": "View details",
    "statusLabels": {
      "completed": "Completed",
      "failed": "Failed",
      "inProgress": "In Progress",
      "started": "Started"
    }
  }
} as const;
