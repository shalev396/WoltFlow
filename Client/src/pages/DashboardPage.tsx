import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

import Layout from "@/components/shared/Layout";
import SavingsOverviewCard from "@/components/pages/dashboard/SavingsOverviewCard";
import SavingsTrendChart from "@/components/pages/dashboard/SavingsTrendChart";
import LastRunsTable from "@/components/pages/dashboard/LastRunsTable";
import MetricsGrid from "@/components/pages/dashboard/MetricsGrid";

export default function DashboardPage() {
  const { user } = useSelector((state: RootState) => state.user);

  return (
    <Layout
      title="Dashboard"
      description={user?.name ? `Welcome back, ${user.name}` : undefined}
    >
      {/* Metrics grid */}
      <MetricsGrid />

      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left column - Savings overview and chart */}
        <div className="xl:col-span-2 space-y-6">
          <SavingsOverviewCard />
          <SavingsTrendChart />
        </div>

        {/* Right column - Recent runs */}
        <div className="xl:col-span-1">
          <LastRunsTable />
        </div>
      </div>
    </Layout>
  );
}
