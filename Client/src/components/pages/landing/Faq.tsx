import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";

const faqData = [
  {
    question: "How does WoltFlow access my Cibus and Wolt accounts?",
    answer:
      "WoltFlow uses secure, encrypted authentication to connect with your accounts. We store your credentials using AES 256 algorithm encryption. You maintain full control and can revoke access at any time.",
  },
  {
    question: "Is my personal information safe?",
    answer: (
      <>
        Absolutely. We use industry-standard encryption and store data on secure
        AWS infrastructure. We never access your personal emails or data beyond
        what's necessary for the meal benefit automation. You can read more
        details in our{" "}
        <Link
          to="/legal/privacy-policy"
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors underline underline-offset-2"
        >
          privacy policy
        </Link>
        .
      </>
    ),
  },
  {
    question: "What happens if something goes wrong?",
    answer:
      "WoltFlow includes comprehensive error handling and will notify you immediately if any issues occur. You can disable automation at any time from your settings.",
  },
  {
    question: "How much does WoltFlow cost?",
    answer:
      "WoltFlow is currently free to use. We're focused on building the best possible experience for our users. If we introduce pricing in the future, existing users will receive advance notice and grandfathered benefits.",
  },
  {
    question: "Which meal benefit providers are supported?",
    answer:
      "Currently, WoltFlow supports Cibus meal benefits with Wolt gift card purchases.",
  },
  {
    question: "Can I customize when the automation runs?",
    answer:
      "The automation runs at a specific time, usually around 12:00 PM (noon), but the exact timing may vary. You can see a countdown to the next run on your runs page.",
  },
  {
    question: "What if I need to pause the automation?",
    answer:
      "You can easily pause or disable automation from your settings page at any time. The system will stop running until you re-enable it. You can also adjust notification preferences and other settings as needed.",
  },
  {
    question: "How do I get support if I need help?",
    answer:
      "First, check out our comprehensive documentation page where you can find detailed setup guides and troubleshooting information. If you're still having trouble, you can contact our support at shalev396@gmail.com.",
  },
];

export default function Faq() {
  return (
    <section className="bg-muted/50 py-12 md:py-20">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-normal">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about WoltFlow automation
          </p>
        </header>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqData.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-background border rounded-lg px-6"
              >
                <AccordionTrigger className="text-left py-6 hover:no-underline">
                  <span className="font-medium text-base">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-6 pt-0">
                  <div className="text-muted-foreground leading-relaxed">
                    {typeof faq.answer === "string" ? faq.answer : faq.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Have a different question?{" "}
            <a
              href="mailto:shalev396@gmail.com"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
            >
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
