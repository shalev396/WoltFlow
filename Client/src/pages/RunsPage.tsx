import { useState } from "react";
import Layout from "@/components/shared/Layout";
import NextRunBanner from "@/components/pages/runs/NextRunBanner";
import { RunsDataTable } from "@/components/pages/runs/RunsDataTable";
import type { RunFilters } from "@/types";

export default function RunsPage() {
  const [filters, setFilters] = useState<RunFilters>({});

  return (
    <Layout
      title="Automation Runs"
      description="View and manage all your automation executions"
    >
      {/* Next run banner */}
      <NextRunBanner />

      {/* Data table with built-in filters */}
      <RunsDataTable filters={filters} onFiltersChange={setFilters} />
    </Layout>
  );
}
