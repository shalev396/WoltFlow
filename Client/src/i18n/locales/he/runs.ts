export default {
  "title": "ריצות אוטומציה",
  "description": "צפה ונהל את כל ביצועי האוטומציה שלך",
  "nextRunBanner": {
    "title": "ריצת אוטומציה הבאה",
    "timeUntilRun": "זמן עד הריצה הבאה",
    "calculating": "מחשב...",
    "status": "סטטוס",
    "active": "פעיל",
    "schedule": "לוח זמנים",
    "dailyTime": "יומי 30 דק' אחרי פתיחת Wolt (10:30–11:30 ישראל)",
    "dailyTimeDetail": "חורף: 10:30 | קיץ: 11:30 (שעון קיץ)",
    "runDays": "ב'-ה' וא'",
    "automaticExecution": "ביצוע אוטומטי מופעל",
    "nextRun": "הבא: יום חול בבוקר (10:30–11:30 ישראל)"
  },
  "table": {
    "title": "כל הריצות",
    "totalRunsFound": "נמצאו {{count}} ריצות בסך הכל",
    "loading": "טוען...",
    "noRuns": "לא נמצאו ריצות.",
    "tryAgain": "נסה שוב",
    "failedToLoad": "טעינת הריצות נכשלה",
    "columns": {
      "id": "מזהה",
      "date": "תאריך",
      "status": "סטטוס",
      "stage": "שלב",
      "amount": "סכום",
      "screenshots": "צילומי מסך",
      "actions": "פעולות"
    },
    "filters": {
      "filterByStatus": "סנן לפי סטטוס",
      "columns": "עמודות"
    },
    "status": {
      "allStatuses": "כל הסטטוסים",
      "completed": "הושלם",
      "failed": "נכשל",
      "inProgress": "בתהליך",
      "started": "התחיל"
    },
    "stages": {
      "triggered": "הופעל",
      "refreshingTokens": "מרענן אסימונים",
      "buyingGift": "רוכש מתנה",
      "completed": "הושלם"
    },
    "actions": {
      "details": "פרטים"
    },
    "pagination": {
      "rowsSelected": "{{selected}} מתוך {{total}} שורות נבחרו.",
      "updating": "מעדכן...",
      "previous": "הקודם",
      "next": "הבא"
    },
    "accessibility": {
      "selectAll": "בחר הכל",
      "selectRow": "בחר שורה",
      "timeUntilNextRun": "זמן עד הריצה הבאה"
    },
    "none": "אין"
  },
  "screenshots": {
    "title": "צילומי מסך של הריצה",
    "description": "צפה בצילומי מסך שנלכדו במהלך ריצה זו",
    "count": "{{current}} מתוך {{total}}",
    "stage": "שלב: {{stage}}",
    "noImage": "אין תמונה זמינה",
    "download": "הורד",
    "close": "סגור"
  },
  "filters": {
    "title": "מסננים",
    "clear": "נקה",
    "status": "סטטוס",
    "stage": "שלב",
    "allStatuses": "כל הסטטוסים",
    "allStages": "כל השלבים",
    "activeFilters": "מסננים פעילים:",
    "statusLabel": "סטטוס: {{status}}",
    "stageLabel": "שלב: {{stage}}"
  }
} as const;
