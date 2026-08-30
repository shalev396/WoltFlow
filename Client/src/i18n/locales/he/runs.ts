export default {
  title: "ריצות אוטומציה",
  description: "צפה ונהל את כל ביצועי האוטומציה שלך",
  nextRunBanner: {
    title: "ריצת אוטומציה הבאה",
    timeUntilRun: "זמן עד הריצה הבאה",
    calculating: "מחשב...",
    status: "סטטוס",
    active: "פעיל",
    schedule: "לוח זמנים",
    dailyTime: "כל בוקר בשעה 10:00",
    dailyTimeDetail: "שעון ישראל",
    runDays: "ב'-ה' וא'",
    automaticExecution: "ביצוע אוטומטי מופעל",
    nextRun: "הבא: יום חול בבוקר בשעה 10:00",
  },
  manualRun: {
    enabled: {
      title: "נסו עכשיו",
      description:
        "לא רוצים לחכות לריצה המתוזמנת? הפעילו אוטומציה לחשבון שלכם מיד.",
    },
    disabled: {
      title: "ריצות לפי דרישה אינן זמינות",
      description:
        "הפיצ'ר כבוי כרגע. עדיין תקבלו את האוטומציה המתוזמנת בשעה 10:00 שעון ישראל בימי חול.",
    },
    runNow: "הפעל עכשיו",
    starting: "מתחיל…",
    requirementsNotMet: "הדרישות לא מולאו",
    cooldown: "זמין שוב בעוד {{time}}",
    loadError: "לא ניתן לטעון את סטטוס הריצה לפי דרישה.",
    requirementsHelp: {
      title: "למה אי אפשר להפעיל עכשיו?",
      description: "תקנו את הפריטים הבאים בהגדרות, ואז חזרו להתחיל ריצה.",
      notice:
        "יש למלא את אסימוני Wolt, סכום המתנה ולהפעיל אוטומציה לפני ריצה לפי דרישה.",
      openSettings: "פתח הגדרות",
    },
    issues: {
      missing_wolt_refresh_token: {
        title: "חסר אסימון רענון של Wolt",
        fix: "הדביקו את אסימון הרענון (__wrtoken) בעמוד ההגדרות.",
      },
      missing_wolt_access_token: {
        title: "חסר אסימון גישה של Wolt",
        fix: "הדביקו את אסימון הגישה (__wtoken) בעמוד ההגדרות.",
      },
      missing_gift_amount: {
        title: "סכום מתנה לא הוגדר",
        fix: "בחרו סכום בין ₪1 ל־₪1500 בהגדרות האוטומציה.",
      },
      automation_disabled: {
        title: "האוטומציה כבויה",
        fix: "הפעילו אוטומציה בהגדרות כדי לאפשר ריצות לחשבון שלכם.",
      },
      run_in_progress: {
        title: "כבר יש ריצה בתהליך",
        fix: "המתינו לסיום הריצה הנוכחית לפני התחלת ריצה נוספת.",
      },
      cooldown_active: {
        title: "תקופת המתנה פעילה",
        fix: "המתינו כמה דקות לפני בקשת ריצה נוספת לפי דרישה.",
      },
    },
  },
  table: {
    title: "כל הריצות",
    totalRunsFound: "נמצאו {{count}} ריצות בסך הכל",
    loading: "טוען...",
    noRuns: "לא נמצאו ריצות.",
    tryAgain: "נסה שוב",
    failedToLoad: "טעינת הריצות נכשלה",
    columns: {
      id: "מזהה",
      date: "תאריך",
      status: "סטטוס",
      stage: "שלב",
      amount: "סכום",
      screenshots: "צילומי מסך",
      actions: "פעולות",
    },
    filters: {
      filterByStatus: "סטטוס",
      filterByStage: "שלב",
      clear: "נקה",
      activeFilters: "מסננים פעילים:",
      statusChip: "סטטוס: {{status}}",
      stageChip: "שלב: {{stage}}",
    },
    status: {
      allStatuses: "כל הסטטוסים",
      completed: "הושלם",
      failed: "נכשל",
      inProgress: "בתהליך",
      started: "התחיל",
    },
    stages: {
      allStages: "כל השלבים",
      triggered: "הופעל",
      refreshingTokens: "מרענן אסימונים",
      buyingGift: "רוכש מתנה",
      completed: "הושלם",
    },
    actions: {
      details: "פרטים",
    },
    pagination: {
      showing: "מציג {{from}}–{{to}} מתוך {{total}}",
      updating: "מעדכן...",
      previous: "הקודם",
      next: "הבא",
    },
    accessibility: {
      timeUntilNextRun: "זמן עד הריצה הבאה",
    },
    none: "אין",
  },
  screenshots: {
    title: "צילומי מסך של הריצה",
    description: "צפה בצילומי מסך שנלכדו במהלך ריצה זו",
    count: "{{current}} מתוך {{total}}",
    stage: "שלב: {{stage}}",
    noImage: "אין תמונה זמינה",
    download: "הורד",
    close: "סגור",
    back: "חזרה",
    loading: "טוען תמונה…",
    previous: "צילום מסך קודם",
    next: "צילום מסך הבא",
  },
} as const;
