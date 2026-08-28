import { useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/shared/Layout";
import NextRunBanner from "@/components/pages/runs/NextRunBanner";
import ManualRunCard from "@/components/pages/runs/ManualRunCard";
import { RunsDataTable } from "@/components/pages/runs/RunsDataTable";
import type { RunFilters } from "@/types";

export default function RunsPage() {
  const { t } = useTranslation("runs");
  const [filters, setFilters] = useState<RunFilters>({});

  return (
    <Layout title={t("title")} description={t("description")}>
      <div className="space-y-6">
        <div className="grid gap-4 lg:grid-cols-5 lg:items-stretch">
          <div className="lg:col-span-3 min-h-0">
            <NextRunBanner />
          </div>
          <div className="lg:col-span-2 min-h-0">
            <ManualRunCard />
          </div>
        </div>
        <RunsDataTable filters={filters} onFiltersChange={setFilters} />
      </div>
    </Layout>
  );
}
