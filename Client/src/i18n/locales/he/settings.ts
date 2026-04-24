export default {
  title: "הגדרות",
  description: "נהל את הגדרות החשבון והעדפות האוטומציה שלך",
  dataManagement: {
    title: "ניהול נתונים",
  },
  woltForm: {
    title: "הגדרות Wolt",
    description:
      "הגדר את האסימונים של חשבון Wolt שלך להחלת כרטיסי מתנה אוטומטית",
    helpAlert:
      "תצטרך להשיג את האסימונים האלה מחשבון Wolt שלך. אסימונים נדרשים להחלת כרטיסי מתנה אוטומטית.",
    refreshToken: {
      label: "אסימון רענון",
      description: "אסימון לטווח ארוך המשמש להשגת אסימוני גישה חדשים",
      placeholder: "הזן את אסימון הרענון שלך ב-Wolt...",
      show: "הצג אסימון רענון",
      hide: "הסתר אסימון רענון",
    },
    accessToken: {
      label: "אסימון גישה",
      description:
        "אסימון לטווח קצר המשמש לבקשות API (אופציונלי - ייווצר מאסימון הרענון)",
      placeholder: "הזן את אסימון הגישה שלך ב-Wolt (אופציונלי)...",
      show: "הצג אסימון גישה",
      hide: "הסתר אסימון גישה",
    },
    saveChanges: "שמור שינויים",
  },
  automationForm: {
    title: "הגדרות אוטומציה",
    description: "הגדר את העדפות האוטומציה וסכום כרטיס המתנה שלך",
    giftAmount: {
      label: "סכום כרטיס מתנה (₪)",
      description: "הזן כל סכום בין 1 ₪ ל-1500 ₪. ייתכנו מגבלות Wolt Benefits.",
      placeholder: "1-1500 ₪",
    },
    highAmountWarning:
      "סכומי כרטיסי מתנה גבוהים יותר דורשים יתרת Wolt Benefits מספקת. ודא שהחשבון שלך יכול לכסות ₪{{amount}} לכל רכישה.",
    note: "הערה:",
    saveChanges: "שמור שינויים",
    savingChanges: "שומר שינויים...",
  },
  notificationsForm: {
    title: "הגדרות התראות",
    description: "הגדר מתי ואיך אתה מקבל התראות על ריצות אוטומציה",
    enableNotifications: {
      label: "אפשר התראות",
      description: "קבל התראות על ריצות אוטומציה ותוצאות",
    },
    successfulRuns: {
      label: "ריצות מוצלחות",
      description: "הודע כאשר אוטומציה מושלמת בהצלחה",
    },
    failedRuns: {
      label: "ריצות כושלות",
      description: "הודע כאשר אוטומציה נתקלת בשגיאות או נכשלת",
    },
    contactMethod: {
      label: "שיטת יצירת קשר",
      description: "בחר כיצד אתה רוצה לקבל התראות",
      placeholder: "בחר כיצד לקבל התראות...",
      none: "ללא",
    },
    phoneNumber: {
      label: "מספר טלפון",
      description:
        "הזן את מספר הטלפון שלך (פורמט ישראלי: 0XX-XXX-XXXX או בינלאומי: +972XXXXXXXXX)",
      placeholder: "+972XXXXXXXXX או 0XX-XXX-XXXX",
    },
    email: {
      label: 'כתובת דוא"ל',
      description: 'הזן את כתובת הדוא"ל שבה אתה רוצה לקבל התראות',
      placeholder: "your.email@example.com",
    },
    verificationStatus: {
      label: "סטטוס אימות",
      verified: "מאומת",
      notVerified: "לא מאומת",
      verify: "אמת",
    },
    enterCode: {
      title: "הזן קוד אימות",
      subtitle: "קוד נשלח אל {{contact}}",
      placeholder: "הזן קוד",
      verify: "אמת",
    },
    verificationSuccess: "{{method}} אומת בהצלחה!",
    verificationWarning: "עליך לאמת את {{type}} שלך לפני שניתן לשלוח התראות.",
    saveChanges: "שמור שינויים",
    toast: {
      invalidContact: "אנא הזן {{type}} תקין",
      phoneNumber: "מספר טלפון",
      emailAddress: 'כתובת דוא"ל',
      codeSent: "קוד אימות נשלח אל {{method}} שלך",
      phone: "הטלפון",
      email: 'הדוא"ל',
      sendFailed: "נכשל בשליחת קוד אימות",
      enterCode: "אנא הזן את קוד האימות",
      invalidCode: "קוד אימות לא תקין",
    },
  },
  exportForm: {
    title: "ייצוא הנתונים שלך",
    description:
      "הורד עותק מלא של כל הנתונים שלך ב-WoltFlow כולל קבצים בארכיון ZIP",
    infoAlert:
      "ייצוא זה כולל את כל נתוני החשבון שלך: הגדרות, ריצות אוטומציה, צילומי מסך ועוד. הנתונים יורדו כקובץ ZIP המכיל CSV עם רשומות מסד הנתונים בתוספת כל הקבצים שלך מאורגנים בתיקיות.",
    whatsIncluded: {
      title: "מה כלול:",
      accountInfo: "מידע והגדרות חשבון (פורמט CSV)",
      runHistory: "כל היסטוריית ריצות האוטומציה (פורמט CSV)",
      screenshots: "צילומי מסך מריצות אוטומציה (PNG/JPG)",
      twoFactor: "רשומות אימות דו-שלבי (פורמט CSV)",
    },
    export: {
      title: "ייצוא הנתונים שלך",
      description:
        "לחץ על הכפתור למטה כדי ליצור ולהוריד את ייצוא הנתונים המלא שלך כקובץ ZIP. זה עשוי לקחת כמה רגעים לעיבוד כאשר אנו אוספים את כל הקבצים שלך.",
      button: "הורד ארכיון ZIP",
      creating: "יוצר ארכיון ZIP...",
    },
    success: {
      title: "ייצוא הושלם!",
      message: "ארכיון ה-ZIP של הנתונים שלך הורד בהצלחה למחשב שלך.",
    },
    exportAgain: {
      title: "צריך עותק נוסף?",
      description:
        "אתה יכול לייצא את הנתונים שלך שוב בכל עת. כל ייצוא יוצר ארכיון ZIP טרי עם נתונים נוכחיים.",
      button: "ייצוא שוב",
    },
  },
  deleteForm: {
    title: "מחק חשבון",
    description: "מחק לצמיתות את חשבון WoltFlow שלך ואת כל הנתונים המשויכים",
    dangerZone: {
      title: "אזור מסוכן:",
      message:
        "פעולה זו אינה ניתנת לביטול. לאחר המחיקה, החשבון שלך וכל הנתונים יוסרו לצמיתות מהמערכות שלנו.",
    },
    whatWillBeDeleted: {
      title: "מה יימחק:",
      account: "החשבון ומידע הפרופיל שלך",
      settings: "כל הגדרות האוטומציה והאישורים",
      runs: "היסטוריית ריצות מלאה וצילומי מסך",
      personalData: "כל הנתונים האישיים והיסטוריית השימוש",
    },
    timeline: {
      message:
        "מחיקת חשבון מעובדת מיד ואינה ניתנת לביטול. על פי מדיניות הפרטיות שלנו, חלק מהנתונים עשויים להישמר בגיבויים מוצפנים למשך עד 90 יום לצורכי אבטחה ותאימות משפטית.",
    },
    deleteButton: "מחק את החשבון שלי",
    confirmDialog: {
      title: "אשר מחיקת חשבון",
      description:
        "פעולה זו תמחק לצמיתות את החשבון שלך ואת כל הנתונים המשויכים. לא ניתן לבטל זאת.",
      instruction: 'כדי לאשר, אנא הקלד "DELETE MY ACCOUNT" בשדה למטה:',
      inputLabel: 'הקלד "DELETE MY ACCOUNT" לאישור',
      placeholder: "DELETE MY ACCOUNT",
      cancel: "ביטול",
      delete: "מחק חשבון",
      deleting: "מוחק חשבון...",
    },
  },
  woltCredentialsHelp: {
    title: "כיצד להשיג את האישורים שלך ב-Wolt",
    description:
      "השתמש בתוסף שלנו כדי לחלץ בקלות את האסימונים שלך ב-Wolt לרכישות כרטיסי מתנה אוטומטיות",
    importantNotice: {
      title: "חשוב:",
      message:
        "אסימונים אלה הם ספציפיים למכשיר ויתנתקו אותך מ-Wolt במכשיר שבו אתה משתמש. מומלץ לעשות זאת במכשיר שאינך אכפת להתנתק ממנו מ-Wolt.",
    },
    steps: {
      title: "הוראות שלב אחר שלב:",
      step1: {
        title: "התקן את WoltFlow Token Reviewer",
        description:
          "ראשית, עליך להתקין את תוסף הדפדפן שלנו שיעזור לך לחלץ את האסימונים אוטומטית.",
        button: "התקן תוסף",
      },
      step2: {
        title: "עבור ל-Wolt.com והתחבר",
        description:
          "פתח את דפדפן האינטרנט שלך ועבור ל-wolt.com. ודא שאתה מחובר לחשבון Wolt שלך.",
      },
      step3: {
        title: "השתמש בתוסף",
        description:
          "לאחר שהתחברת, לחץ על סמל התוסף WoltFlow Token Reviewer בסרגל הכלים של הדפדפן שלך. התוסף יחלץ אוטומטית את האסימונים שלך.",
      },
      step4: {
        title: "העתק את האסימונים",
        description:
          "התוסף יציג את אסימון הרענון ואסימון הגישה שלך. העתק את שני האסימונים מהחלון הקופץ של התוסף.",
      },
      step5: {
        title: "הדבק ושמור",
        description:
          'חזור לדף ההגדרות הזה והדבק את אסימון הרענון בשדה "אסימון רענון Wolt" ואת אסימון הגישה בשדה "אסימון גישה Wolt". לאחר מכן לחץ על "שמור שינויים".',
      },
    },
    tips: {
      title: "💡 טיפים:",
      tip1: "ודא שאתה מחובר ל-Wolt לפני שאתה משתמש בתוסף",
      tip2: "אם התוסף לא מציג אסימונים, נסה לרענן את דף Wolt ונסה שוב",
      tip3: "אסימונים אלה הם ספציפיים למכשיר, כך שאולי תרצה לעשות זאת במכשיר שאתה לא משתמש בו לעתים קרובות עבור Wolt",
      tip4: "אסימונים אלה יפקעו בסופו של דבר, כך שייתכן שתצטרך לחזור על תהליך זה מעת לעת",
      tip5: "שמור את האסימונים שלך מאובטחים ואל תשתף אותם עם אף אחד",
    },
  },
  automationToggle: {
    label: "אוטומציה",
    enabledDescription: "אוטומציה מופעלת ומוכנה לריצה",
    disabledDescription: "אפשר אוטומציה כדי להתחיל ריצות מתוזמנות",
  },
  notificationDialog: {
    title: "הגדרות התראות",
    description: {
      setup: "הגדר את העדפות ההתראות שלך",
      verify: "הזן את קוד האימות שנשלח אל {{method}} שלך",
    },
    devMode: {
      badge: "מצב פיתוח",
      alert: "מצב פיתוח: קריאות API מושבתות. כל קוד בן 6 ספרות יעבוד לאימות.",
    },
    primaryMethod: {
      label: "שיטת התראה ראשית",
      placeholder: "בחר שיטת התראה",
      sms: "SMS",
      email: 'דוא"ל',
      disabled: "מושבת",
    },
    preferences: {
      title: "העדפות התראות",
      success: {
        label: "התראות הצלחה",
        description: "קבל התראה כאשר ריצות אוטומציה מושלמות בהצלחה",
      },
      error: {
        label: "התראות שגיאה",
        description: "קבל התראה כאשר ריצות אוטומציה נכשלות או נתקלות בשגיאות",
      },
    },
    smsNotifications: {
      title: "התראות SMS",
      primary: "ראשי",
      disabled: "מושבת",
      disabledMessage: "פונקציונליות SMS כרגע מושבתת על ידי המנהל.",
      placeholder: "+972501234567 או 050-123-4567",
      verify: "אמת",
      verified: "מאומת",
      remove: "הסר",
    },
    emailNotifications: {
      title: 'התראות דוא"ל',
      primary: "ראשי",
      placeholder: "your.email@example.com",
      verify: "אמת",
      verified: "מאומת",
      remove: "הסר",
    },
    verification: {
      title: "קוד אימות",
      devModeMessage: "מצב פיתוח: כל קוד בן 6 ספרות יעבוד",
      productionMessage:
        "שלחנו קוד אימות בן 6 ספרות אל {{contact}} דרך {{method}}",
      devModePrompt: "מצב פיתוח: כל קוד בן 6 ספרות יעבוד",
      productionPrompt: "הזן את הקוד בן 6 הספרות שנשלח לאיש הקשר שלך",
      placeholder: "000000",
      cancel: "ביטול",
      resend: "שלח שוב",
      sending: "שולח...",
      verify: "אמת קוד",
      verifying: "מאמת...",
    },
    buttons: {
      cancel: "ביטול",
      save: "שמור הגדרות",
      saving: "שומר...",
    },
    validation: {
      atLeastOne: "אנא אמת לפחות שיטת התראה אחת ({{methods}})",
      smsDisabled: 'פונקציונליות SMS כרגע מושבתת. אנא בחר דוא"ל כשיטה ראשית.',
      phoneRequired: "אנא הזן מספר טלפון להתראות SMS",
      phoneInvalid: "אנא הזן מספר טלפון תקין",
      phoneNotVerified: "אנא אמת את מספר הטלפון שלך לפני הגדרתו כראשי",
      emailRequired: 'אנא הזן כתובת דוא"ל להתראות דוא"ל',
      emailInvalid: 'אנא הזן כתובת דוא"ל תקינה',
      emailNotVerified: 'אנא אמת את כתובת הדוא"ל שלך לפני הגדרתה כראשית',
    },
  },
} as const;
