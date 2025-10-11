import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";

export default function Faq() {
  const { t } = useTranslation("landing");
  const faqList = t("faq.list", { returnObjects: true }) as Array<{
    question: string;
    answer: string;
  }>;

  return (
    <section className="bg-muted/50 py-12 md:py-20">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-normal">
            {t("faq.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("faq.subtitle")}
          </p>
        </header>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqList.map((faq, index) => (
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
            {t("faq.contactPrompt")}{" "}
            <a
              href="mailto:shalev396@gmail.com"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
            >
              {t("faq.contactLink")}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
