import { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import type { RootState } from "@/store/store";

import Layout from "@/components/shared/Layout";
import SavingsOverviewCard from "@/components/pages/dashboard/SavingsOverviewCard";
import SavingsTrendChart from "@/components/pages/dashboard/SavingsTrendChart";
import LastRunsTable from "@/components/pages/dashboard/LastRunsTable";
import MetricsGrid from "@/components/pages/dashboard/MetricsGrid";
import { Card, CardContent } from "@/components/ui/card";
import { useDashboardAnalyticsQuery } from "@/queries/dashboard";
import type { TimeRange } from "@/types";

export default function DashboardPage() {
  const { user } = useSelector((state: RootState) => state.user);
  const { t } = useTranslation("dashboard");
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");

  const {
    data: analytics,
    isLoading,
    error,
  } = useDashboardAnalyticsQuery(timeRange);

  if (error) {
    return (
      <Layout
        title={t("title")}
        description={
          user?.name ? t("welcomeBack", { name: user.name }) : undefined
        }
      >
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{t("error.loadFailed")}</p>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout
      title={t("title")}
      description={
        user?.name ? t("welcomeBack", { name: user.name }) : undefined
      }
    >
      {/* Metrics grid */}
      <MetricsGrid
        analytics={analytics}
        isLoading={isLoading}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
      />

      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left column - Savings overview and chart */}
        <div className="xl:col-span-2 space-y-6">
          <SavingsOverviewCard analytics={analytics} isLoading={isLoading} />
          <SavingsTrendChart
            analytics={analytics}
            isLoading={isLoading}
            timeRange={timeRange}
          />
        </div>

        {/* Right column - Recent runs */}
        <div className="xl:col-span-1">
          <LastRunsTable analytics={analytics} isLoading={isLoading} />
        </div>
      </div>
    </Layout>
  );
}
