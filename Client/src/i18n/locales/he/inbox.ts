export default {
  "title": "תיבת דואר",
  "description": "התראות אוטומציה וסיכומי דוא\"ל",
  "customEmail": "הדוא\"ל המותאם שלך:",
  "loading": {
    "title": "טוען את תיבת הדואר שלך...",
    "subtitle": "מביא את המיילים וההגדרות שלך"
  },
  "error": {
    "title": "לא ניתן לטעון את תיבת הדואר",
    "message": "הייתה בעיה בטעינת המיילים שלך. אנא נסה שוב.",
    "tryAgain": "נסה שוב"
  },
  "empty": {
    "title": "אין עדיין מיילים",
    "noFilters": "תיבת הדואר שלך ריקה. מיילים שנשלחו לכתובת המותאמת שלך יופיעו כאן.",
    "withFilters": "אין מיילים שתואמים את המסננים הנוכחיים. נסה לשנות את החיפוש או המסננים.",
    "withEmail": "שלח מייל ל-{{email}} כדי לראות אותו כאן."
  },
  "navigation": {
    "backToEmails": "חזור למיילים"
  },
  "list": {
    "header": "תיבת דואר ({{count}})",
    "noEmails": "לא נמצאו מיילים",
    "adjustFilters": "נסה לשנות את החיפוש או המסנן",
    "accessibility": {
      "emailList": "רשימת מיילים"
    }
  },
  "viewer": {
    "noSelection": {
      "title": "לא נבחר מייל",
      "message": "בחר מייל מהרשימה כדי לצפות בתוכן שלו"
    },
    "from": "מאת:",
    "to": "אל:",
    "date": "תאריך:",
    "attachments": {
      "title": "קובץ מצורף אחד",
      "title_plural": "{{count}} קבצים מצורפים",
      "download": "הורד {{filename}}"
    },
    "actions": {
      "markRead": "סמן כנקרא",
      "markUnread": "סמן כלא נקרא",
      "star": "הוסף כוכב",
      "reply": "השב",
      "replyAll": "השב לכולם",
      "forward": "העבר",
      "archive": "ארכיון",
      "delete": "מחק"
    }
  },
  "toolbar": {
    "search": {
      "placeholder": "חפש מיילים...",
      "label": "חיפוש:"
    },
    "filter": {
      "placeholder": "סנן...",
      "allLabels": "כל התוויות",
      "label": "תווית:"
    },
    "clearFilters": "נקה מסננים",
    "clear": "נקה",
    "activeFilters": "פעיל:"
  },
  "labels": {
    "automation": "אוטומציה",
    "giftCard": "כרטיס מתנה",
    "error": "שגיאה",
    "alert": "התראה",
    "summary": "סיכום",
    "balance": "יתרה"
  }
} as const;
