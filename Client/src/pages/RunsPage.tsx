import { useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/shared/Layout";
import NextRunBanner from "@/components/pages/runs/NextRunBanner";
import { RunsDataTable } from "@/components/pages/runs/RunsDataTable";
import type { RunFilters } from "@/types";

export default function RunsPage() {
  const { t } = useTranslation("runs");
  const [filters, setFilters] = useState<RunFilters>({});

  return (
    <Layout title={t("title")} description={t("description")}>
      {/* Next run banner */}
      <NextRunBanner />

      {/* Data table with built-in filters */}
      <RunsDataTable filters={filters} onFiltersChange={setFilters} />
    </Layout>
  );
}
