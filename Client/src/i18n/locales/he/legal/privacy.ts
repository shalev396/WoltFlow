export default {
  title: "מדיניות פרטיות",
  description:
    "למד כיצד אנו אוספים, משתמשים ומגינים על המידע האישי שלך בהתאם לחוקי הפרטיות הישראליים.",
  lastUpdated: "עדכון אחרון",
  contactEmail: "shalev396@gmail.com",
  sections: {
    whoWeAre: {
      title: "מי אנחנו",
      owner: "בעלים/מפעיל:",
      territory: "טריטוריה ואירוח:",
      product: "מוצר:",
      lastUpdated: "עדכון אחרון:",
    },
    introduction:
      "מדיניות זו מסבירה מה אנו אוספים, מדוע אנו אוספים אותו, היכן הוא מאוחסן, כמה זמן אנו שומרים אותו, עם מי אנו משתפים אותו, וכיצד אתה יכול לשלוט בו. היא נכתבה כדי לעמוד בדרישות חוק הפרטיות הישראלי, כולל חובות השקיפות שהוכנסו עם תיקון 13 לחוק הגנת הפרטיות ותקנות אבטחת המידע.",
    whatData: {
      title: "אילו נתונים אנו אוספים (לפי מודל נתונים)",
      intro:
        "אנו אוספים רק את מה שדרוש להפעלת האוטומציה והתראות אופציונליות. כל דבר המסומן [enc: AES-256] מוצפן על ידי האפליקציה לפני האחסון; הוא מפוענח רק בתוך קוד השרת כאשר נדרש לאוטומציה ולעולם לא מוחזר ללקוח.",
      auth: {
        title: "אימות וחשבון",
        user: {
          title: "משתמש",
          items: [
            "cognitoSub (מזהה ייחודי של AWS Cognito), name, email",
            "ביקורת: lastLoginAt, createdAt, updatedAt",
          ],
        },
        session: {
          title: "סשן (localStorage של דפדפן)",
          description:
            "אסימוני אימות (idToken ו-refreshToken) מאוחסנים ב-localStorage של הדפדפן. אין שימוש בעוגיות לאימות. ללא עוגיות פרסום של צד שלישי. ניתוח מנועע כברירת מחדל עד להסכמה (ראה §7).",
        },
      },
      credentials: {
        title: "אישורי Wolt / אסימונים",
        wolt: {
          title: "WoltSettings",
          items: [
            "woltRefreshToken [enc: AES-256]",
            "woltAccessToken [enc: AES-256] (מחרוזת JSON כולל תפוגה)",
          ],
        },
      },
      codes: {
        title: "קודים חד-פעמיים (קצרי טווח)",
        twoFactor: {
          title: "TwoFactorAuthentication (האימות שלנו)",
          items: [
            "notificationSettingsId, method (sms/email), contact, code, purpose, expiresAt, verified",
          ],
          retention: "שמירה: נמחק בניקוי יומי (קודי אימות בלבד).",
        },
      },
      runs: {
        title: "ריצות אוטומציה ופריטים",
        runSettings: {
          title: "RunSettings",
          description: "giftAmount",
        },
        run: {
          title: "Run",
          items: [
            "userId, status, stage (למשל buying_gift, completed), errorMessage?",
          ],
          purpose: "מטרה: מעקב תפעולי לאוטומציות שלך.",
        },
        screenshot: {
          title: "Screenshot",
          items: [
            'runId, screenshotType ("error"/"success"/"step"/"debug"/"final"), stage?, siteUrl?, screenshotUrl, isError',
          ],
          purpose:
            "מטרה: ניפוי באגים/מעקב עבור הריצה; עשוי להיות מוצג בממשק המשתמש.",
        },
      },
      notifications: {
        title: "התראות",
        settings: {
          title: "NotificationSettings",
          description:
            'isEnabled, notificationOnSuccess, notificationOnError, notificationMethod ("sms" | "email" | "both"), phoneNumber?, phoneVerified, email?, emailVerified',
        },
      },
    },
    whyCollect: {
      title: "מדוע אנו אוספים זאת (מטרות ובסיס משפטי)",
      service: {
        title: "לספק את השירות",
        description:
          'לאמת אותך (AWS Cognito עם דוא"ל/סיסמה) ולהפעיל את אוטומציית הקנייה עבור Wolt באמצעות Wolt Benefits — כרטיסי המתנה נפדים אוטומטית ישירות לחשבון ה-Wolt שלך בעת התשלום, כך שאין צורך לקלוט אימיילים או לחלץ קודים.',
      },
      operate: {
        title: "להפעיל את המוצר",
        description:
          "להפעיל תזמור (עבודות, תורים, פונקציות), להציג היסטוריית ריצות/צילומי מסך, ולשלוח התראות אופציונליות על הצלחה/שגיאה.",
      },
      security: {
        title: "אבטחה ומניעת הונאות",
        description:
          "מגבלות קצב, זיהוי חריגות/שגיאות, והגנה על אישורים/אסימונים.",
      },
      analytics: {
        title: "ניתוח",
        description: "אופציונלי בלבד (ראה §7).",
      },
      legalBasis:
        "תחת החוק הישראלי הבסיסים העיקריים כאן הם ביצוע של יחסים שאתה יוזם (מתן השירות שביקשת) ואינטרסים לגיטימיים (תפעול טכני ואבטחה), יחד עם הסכמה במקום שנדרשת (עוגיות/מזהי ניתוח). אנו גם עוקבים אחר החובה ליידע על מה שאנו אוספים, היכן זה מאוחסן, שמירה ושיתוף.",
    },
    whereProcess: {
      title: "היכן אנו מעבדים ומאחסנים",
      primary: {
        title: "אזור ראשי",
        description:
          "AWS {{region}} ({{city}}) עבור Aurora PostgreSQL, Lambda, API Gateway, VPC, CloudWatch logs, EventBridge, Step Functions, CloudFormation, IAM, S3, SES (התראות יוצאות בלבד), Certificate Manager, Route 53, CloudFront.",
      },
      global: {
        title: "אספקה גלובלית",
        description:
          "CloudFront משרת נכסי אינטרנט סטטיים ונקודות קצה API גלובלית (edge POPs). בקשות מסתיימות בסופו של דבר ל-API שלנו המתארחים ב-{{region}}.",
      },
      dataMovement:
        "אם נתונים חייבים לנוע מחוץ לישראל עבור מעבר CDN או פעולות ספק, אנו מסתמכים על אמצעי הגנה של ספק ומשדרים דרך TLS; מיקום אחסון לרשומות ליבה הוא {{region}}.",
    },
    security: {
      title: "אבטחה (כיצד אנו מגינים על נתונים)",
      appLevel: {
        title: "הצפנה ברמת האפליקציה",
        description:
          "AES-256 עבור אסימוני Wolt. אישורים אלו מאוחסנים מוצפנים במסד הנתונים ומפוענחים רק בצד השרת כאשר נדרש לאוטומציה. הם עשויים להיות מוחזרים לדפדפן (עדיין מוצפנים במעבר דרך HTTPS) לתצוגה בהגדרות, אך לעולם לא נחשפים בטקסט פשוט ללקוח. אסימוני אימות Cognito מאוחסנים ב-localStorage של הדפדפן ומועברים בצורה מאובטחת דרך HTTPS.",
      },
      transport: {
        title: "תעבורה",
        description:
          "TLS עבור לקוח⇄API ו-API⇄שירותי AWS. (RDS וקישורי שירות משתמשים בברירות מחדל של AWS; תעבורת לקוח אלינו היא תמיד HTTPS.)",
      },
      atRest: {
        title: "במנוחה",
        description:
          "הצפנת אחסון RDS; הצפנת bucket S3; בתוספת הצפנת AES-256 ברמת האפליקציה שלנו עבור השדות הרגישים המפורטים לעיל.",
      },
      access: {
        title: "גישה",
        description: "גישה לנתוני ייצור מוגבלת לבעלים/מפעיל לצרכים תפעוליים.",
      },
    },
    retention: {
      title: "כמה זמן אנו שומרים נתונים (שמירה)",
      oneTime: {
        title: "קודים חד-פעמיים",
        description:
          'TwoFactorAuthentication (קודי אימות עבור אימות ערוץ ה-SMS/דוא"ל שלנו) – נמחקים בניקוי יומי (עשויים להימחק מוקדם יותר על ידי ניקוי מתגלגל).',
      },
      operational: {
        title: "היסטוריה תפעולית",
        description: "Run ו-Screenshot – 90 יום.",
      },
      logs: {
        title: "לוגים",
        description: "CloudWatch / לוגי אפליקציה – 30 יום.",
      },
      account: {
        title: "חשבון והגדרות",
        description:
          "חשבון משתמש, הגדרות, WoltSettings, RunSettings, NotificationSettings – נשמרים עד שתמחק את חשבונך.",
      },
      deletion:
        "מחיקת חשבון: מפעילה מחיקה של כל הנתונים הקשורים למשתמש לעיל, כולל ריצות, צילומי מסך ואישורים/אסימונים מאוחסנים, בכפוף רק לעיכוב טכני לניקוי בטוח. (אנחנו לא שומרים גיבויי מסד נתונים עבור פרויקט זה.)",
    },
    controls: {
      title: "הבקרות שלך",
      signIn: {
        title: "התחברות ופרופיל",
        description:
          'אימות דוא"ל/סיסמה דרך AWS Cognito. אתה יכול לראות שם/דוא"ל בממשק המשתמש.',
      },
      delete: {
        title: "מחק חשבון (וכל הנתונים)",
        description:
          "זמין בהגדרות. זה מסיר את החשבון שלך ומערכי נתונים מקושרים המפורטים ב-§5.",
      },
      edit: {
        title: "ערוך נתונים",
        description:
          "אתה יכול לעדכן העדפות התראה, העדפות ריצה, ו(לפי עיצוב) אתה מזין מחדש אישורי Wolt כאשר נדרש.",
      },
    },
    cookies: {
      title: "עוגיות וניתוח",
      authToken: {
        title: "אסימוני אימות (localStorage)",
        description:
          "אסימוני אימות (idToken ו-refreshToken) מאוחסנים ב-localStorage של הדפדפן (הכרחי בהחלט). משמש לשמור עליך מחובר ולאשר בקשות ל-API. אין שימוש בעוגיות לאימות.",
      },
      analytics: {
        title: "ניתוח",
        description:
          "Google Analytics (GA4) פועל רק לאחר הסכמה. אנו מיישמים Google Consent Mode V2 – Basic, אשר חוסם תגי Google עד שתבחר בבאנר. אם אינך מסכים, GA נשאר כבוי. אתה יכול לשנות את ההסכמה שלך בכל עת מקישור הבאנר באפליקציה.",
      },
    },
    thirdParty: {
      title: "שירותי צד שלישי (קטגוריות)",
      intro:
        "אנו משתמשים במעבדים צד שלישי כדי להפעיל את המוצר. הם מטפלים בנתונים רק כפי שנדרש כדי לספק את הפונקציה הספציפית שלהם:",
      aws: {
        title: "Amazon Web Services (AWS)",
        items: [
          'AWS Cognito (אימות: חשבונות משתמש מבוססי דוא"ל/סיסמה, ניהול אסימונים מאובטח)',
          "חישוב ו-API: Lambda, API Gateway, EC2 (לפי הצורך)",
          "אחסון/נתונים: Aurora PostgreSQL (RDS), S3",
          'הודעות/דוא"ל: Amazon SES (לשליחת התראות יוצאות בלבד), AWS End User Messaging (עבור SMS/התראות, אם מוגדר)',
          "תזמור/ניטור: EventBridge, Step Functions, CloudWatch",
          "רשת ואספקה: VPC, Route 53, CloudFront (CDN גלובלי וקצה API), Certificate Manager (TLS)",
          "פלטפורמה: IAM (בקרת גישה), CloudFormation (תשתית כקוד)",
        ],
      },
      analytics: {
        title: "Google Analytics",
        items: [
          "Google Analytics (GA4) - רק לאחר הסכמה; ראה סעיף עוגיות וניתוח",
        ],
      },
    },
    sharing: {
      title: "שיתוף",
      intro: "אנחנו לא מוכרים נתונים אישיים. אנו משתפים נתונים רק עם:",
      items: [
        "מעבדים המפורטים ב-§8 כדי להפעיל את השירות; ו",
        "רשויות אם נדרש על פי חוק חל, צו בית משפט או הוראת רגולטור.",
      ],
    },
    children: {
      title: "ילדים",
      description:
        "השירות אינו מיועד לילדים. אל תשתמש ב-{{productName}} אם אתה מתחת לגיל החוקי לכריתת הסכם מחייב.",
    },
    changes: {
      title: "שינויים למדיניות זו",
      description:
        'אם נשנה באופן מהותי הודעה זו, נעדכן את תאריך "עדכון אחרון" ונציג הודעה באפליקציה.',
      lastUpdated: "עדכון אחרון: {{date}}",
    },
    questions: {
      title: "שאלות?",
      description:
        "לכל שאלה על מדיניות פרטיות זו או כיצד אנו מטפלים בנתונים שלך, אל תהסס ליצור איתי קשר ישירות.",
    },
  },
} as const;
