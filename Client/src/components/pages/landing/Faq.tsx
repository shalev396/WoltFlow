import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
  {
    question: "How does WoltFlow access my Cibus and Wolt accounts?",
    answer:
      "WoltFlow uses secure, encrypted authentication to connect with your accounts. We store your credentials using bank-level encryption and follow strict security protocols. You maintain full control and can revoke access at any time.",
  },
  {
    question: "Is my personal information safe?",
    answer:
      "Absolutely. We use industry-standard encryption, store data on secure AWS infrastructure, and follow strict data protection protocols. We never access your personal emails or data beyond what's necessary for the meal benefit automation.",
  },
  {
    question: "What happens if something goes wrong?",
    answer:
      "WoltFlow includes comprehensive error handling and will notify you immediately if any issues occur. Our system automatically retries failed operations and provides detailed logs. You can also manually trigger runs or disable automation at any time.",
  },
  {
    question: "How much does WoltFlow cost?",
    answer:
      "WoltFlow is currently free to use. We're focused on building the best possible experience for our users. If we introduce pricing in the future, existing users will receive advance notice and grandfathered benefits.",
  },
  {
    question: "Which meal benefit providers are supported?",
    answer:
      "Currently, WoltFlow supports Cibus meal benefits with Wolt gift card purchases. We're actively working to add support for additional providers like Sodexo, Ten Bis, and others based on user demand.",
  },
  {
    question: "Can I customize when the automation runs?",
    answer:
      "WoltFlow automatically schedules runs at optimal times for the best success rates (typically weekdays at noon). While the timing is optimized for reliability, you can manually trigger runs anytime from your dashboard.",
  },
  {
    question: "What if I need to pause the automation?",
    answer:
      "You can easily pause or disable automation from your settings page at any time. The system will stop running until you re-enable it. You can also adjust notification preferences and other settings as needed.",
  },
  {
    question: "How do I get support if I need help?",
    answer:
      "You can reach out through our support email or use the help section in your dashboard. We typically respond within a few hours and provide detailed assistance with any setup or operational questions.",
  },
];

export default function Faq() {
  return (
    <section className="bg-muted/50 py-12 md:py-20">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
                    {faq.answer}
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
              href="mailto:support@woltflow.com"
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
