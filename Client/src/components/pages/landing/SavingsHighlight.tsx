import { TrendingUp, Calendar, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SavingsHighlight() {
  const { t } = useTranslation("landing");

  return (
    <section className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-normal">
          {t("savingsHighlight.title")}
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t("savingsHighlight.subtitle")}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-4xl mx-auto">
        {/* Main savings stat */}
        <Card className="md:col-span-2 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border-green-200 dark:border-green-800">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <TrendingUp className="size-5" aria-hidden="true" />
              {t("savingsHighlight.monthlySavings.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-4xl md:text-5xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {t("savingsHighlight.monthlySavings.amount")}
                </div>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  {t("savingsHighlight.monthlySavings.description")}
                </p>
              </div>

              <div className="pt-4 border-t border-green-200 dark:border-green-800">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">
                    {t("savingsHighlight.monthlySavings.before")}
                  </strong>{" "}
                  {t("savingsHighlight.monthlySavings.beforeText")}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  <strong>{t("savingsHighlight.monthlySavings.with")}</strong>{" "}
                  {t("savingsHighlight.monthlySavings.withText")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time saved */}
        <div className="space-y-6">
          <Card className="bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200 text-base">
                <Clock className="size-4" aria-hidden="true" />
                {t("savingsHighlight.timeSaved.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                {t("savingsHighlight.timeSaved.amount")}
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {t("savingsHighlight.timeSaved.description")}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-200 text-base">
                <Calendar className="size-4" aria-hidden="true" />
                {t("savingsHighlight.reliability.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                {t("savingsHighlight.reliability.amount")}
              </div>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                {t("savingsHighlight.reliability.description")}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
