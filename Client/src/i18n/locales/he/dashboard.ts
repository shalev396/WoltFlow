export default {
  "title": "לוח בקרה",
  "welcomeBack": "שלום {{name}}",
  "error": {
    "loadFailed": "טעינת נתוני לוח הבקרה נכשלה. אנא רענן את הדף."
  },
  "metrics": {
    "totalSavings": "סך החיסכון",
    "successRate": "אחוז הצלחה",
    "totalRuns": "סך הריצות",
    "analyticsPeriod": "תקופת ניתוח",
    "successfulRuns": "ריצות מוצלחות",
    "vsPreviousPeriod": "לעומת תקופה קודמת",
    "selectPeriod": "בחר תקופה"
  },
  "timeRanges": {
    "last7Days": "7 ימים אחרונים",
    "last30Days": "30 ימים אחרונים",
    "last90Days": "90 ימים אחרונים",
    "thisWeek": "השבוע",
    "thisMonth": "החודש",
    "last3Months": "3 חודשים אחרונים"
  },
  "savingsOverview": {
    "title": "סך החיסכון",
    "savedFrom": "נחסכו {{period}} מתביעות אוטומטיות",
    "successfulClaims": "תביעות מוצלחות",
    "avgPerClaim": "ממוצע לתביעה",
    "growing": "צמיחה של {{percent}}% לעומת תקופה קודמת",
    "down": "ירידה של {{percent}}% לעומת תקופה קודמת"
  },
  "savingsTrend": {
    "title": "מגמת החיסכון",
    "showingCumulative": "מציג חיסכון מצטבר ב{{period}}",
    "loadingChart": "טוען תרשים...",
    "noDataYet": "אין עדיין נתוני חיסכון זמינים",
    "completeFirstRun": "השלם את הריצה האוטומטית הראשונה שלך כדי לראות מגמות",
    "avgDailySavings": "חיסכון יומי ממוצע: ₪{{amount}}",
    "overDays": "על פני {{days}} ימים ({{period}})"
  },
  "recentRuns": {
    "title": "ריצות אחרונות",
    "viewAll": "צפה בהכל",
    "date": "תאריך",
    "status": "סטטוס",
    "amount": "סכום",
    "noRuns": "אין עדיין ריצות",
    "runsWillAppear": "הריצות האוטומטיות שלך יופיעו כאן",
    "viewDetails": "צפה בפרטים",
    "statusLabels": {
      "completed": "הושלם",
      "failed": "נכשל",
      "inProgress": "בתהליך",
      "started": "התחיל"
    }
  }
} as const;
