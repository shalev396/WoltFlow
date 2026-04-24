export default {
  title: "התחלת עבודה",
  description:
    "עקוב אחר המדריך הזה צעד אחר צעד כדי להגדיר את האוטומציה של WoltFlow תוך פחות מ-10 דקות. נעבור איתך על כל מה שאתה צריך כדי להפוך את הטבות הארוחות היומיות שלך לאוטומטיות.",
  setupChecklist: {
    title: "רשימת בדיקות הגדרה",
    overview: {
      title: "סקירה מהירה של ההגדרה",
      description:
        "השלם את 2 השלבים העיקריים הללו כדי להפעיל את האוטומציה של WoltFlow. לכל שלב יש מדריכים מפורטים מקושרים למטה.",
    },
    steps: {
      woltCredentials: {
        label: "השג אישורי Wolt",
        badge: "2 אפשרויות",
      },
      configureAutomation: {
        label: "הגדר אוטומציה",
        badge: "שלב אחרון",
      },
    },
  },
  accountRequirements: {
    title: "דרישות חשבון",
    woltAccount: {
      title: "הגדרת חשבון Wolt",
      description:
        "תצטרך את טוקני האימות של Wolt שלך כדי לאפשר לאוטומציה שלנו להחיל כרטיסי מתנה.",
      optionsTitle: "שתי אפשרויות הגדרה:",
      extension: {
        title: "WoltFlow Token Reviewer",
        badge: "מומלץ",
        description: "התקן את תוסף הדפדפן שלנו והעתק אישורים בלחיצה אחת.",
        button: "מדריך תוסף",
      },
      manual: {
        title: "חילוץ ידני",
        badge: "מתקדם",
        description: "חלץ טוקנים ידנית באמצעות כלי מפתח של הדפדפן.",
        button: "מדריך ידני",
      },
      deviceConsideration: {
        title: "שיקול התקן",
        description:
          "לכל התקן יש טוקנים ייחודיים. חלץ אישורים מהתקן שלא תתחבר אליו/תתנתק ממנו לעתים קרובות ב-Wolt, מכיוון שזה עלול לבטל את הטוקנים.",
      },
    },
  },
  activationGuide: {
    title: "הפעלה צעד אחר צעד",
    step1: {
      title: "הגדר אישורי Wolt",
      description: "בחר את השיטה המועדפת עליך לחילוץ טוקני האימות של Wolt שלך:",
      extensionMethod: {
        title: "שיטת תוסף",
        badge: "מומלץ",
        description: "מהיר וקל עם התוסף שלנו",
      },
      manualMethod: {
        title: "שיטה ידנית",
        badge: "מתקדם",
        description: "חלץ טוקנים באמצעות כלי מפתח",
      },
    },
    step2: {
      title: "שמור את אישורי Wolt שלך",
      description:
        "פתח את עמוד ההגדרות והדבק את טוקני הגישה והרענון של Wolt כדי שהאוטומציה תוכל להתחבר עבורך.",
      quickTip: {
        title: "💡 טיפ מהיר:",
        description: "הטוקנים נשמרים מוצפנים ולא יוצאים מהחשבון שלך לעולם.",
      },
    },
    step3: {
      title: "הפעל אוטומציה",
      description: "הגדר את העדפות האוטומציה שלך והפעל את התהליך היומי:",
      settings: {
        giftCardAmount: "הגדר סכום כרטיס מתנה בתוך הקצבה של Wolt Benefits שלך",
        enableToggle: "הפעל מתג אוטומציה",
      },
      allSet: {
        title: "הכול מוכן!",
        description:
          "לאחר ההפעלה, WoltFlow יפעל אוטומטית 30 דקות לאחר ש-Wolt Benefits נפתח: 10:30 בחורף, 11:30 בקיץ (בגלל שעון קיץ). הגיפט-קארד נרכש ונממומש אוטומטית לחשבונך — בלי העברת אימיילים ובלי קודים.",
      },
    },
  },
  readyToBegin: {
    title: "מוכן להתחיל?",
    description:
      "התחל עם קבלת אישורי Wolt שלך - בחר את השיטה שמתאימה לך ביותר.",
    buttons: {
      startWithExtension: "התחל עם תוסף",
      manualSetup: "הגדרה ידנית במקום",
    },
  },
} as const;
