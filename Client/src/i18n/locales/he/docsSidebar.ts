export default {
  header: {
    title: "תיעוד",
    subtitle: "מדריך התקנה והגדרה",
  },
  sections: {
    introduction: {
      title: "מבוא",
      subsections: {
        "what-is-woltflow": "מה זה WoltFlow?",
        "how-it-works": "איך זה עובד",
        "security-privacy": "אבטחה ופרטיות",
      },
    },
    "getting-started": {
      title: "תחילת עבודה",
      subsections: {
        "setup-checklist": "רשימת בדיקה להתקנה",
        "account-requirements": "דרישות חשבון",
        "activation-guide": "מדריך הפעלה",
      },
    },
    "woltflow-extension": {
      title: "בודק אסימוני WoltFlow",
      subsections: {
        "extension-installation": "התקנה",
        "extracting-credentials": "חילוץ אישורים",
        "extension-troubleshooting": "פתרון בעיות",
      },
    },
    "manual-setup": {
      title: "הגדרת אסימון ידנית",
      subsections: {
        "understanding-tokens": "הבנת אסימונים",
        "manual-extraction": "חילוץ ידני",
        "token-security": "אבטחת אסימונים",
      },
    },
  },
} as const;
