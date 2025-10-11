import { useTranslation } from "react-i18next";
import Layout from "@/components/shared/Layout";
import WoltForm from "@/components/pages/settings/WoltForm";
import CibusForm from "@/components/pages/settings/CibusForm";
import AutomationSettingsForm from "@/components/pages/settings/AutomationSettingsForm";
import NotificationsForm from "@/components/pages/settings/NotificationsForm";
import ApiKeyForm from "@/components/pages/settings/ApiKeyForm";
import ExportDataForm from "@/components/pages/settings/ExportDataForm";
import DeleteAccountForm from "@/components/pages/settings/DeleteAccountForm";

export default function SettingsPage() {
  const { t } = useTranslation("settings");

  return (
    <Layout title={t("title")} description={t("description")}>
      <div className="space-y-8">
        {/* API Key Management - Full width at top for prominence */}
        <div className="w-full">
          <ApiKeyForm />
        </div>

        {/* Main Settings - Responsive grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Top Left - Wolt Settings */}
          <div className="order-1 h-full">
            <WoltForm />
          </div>

          {/* Top Right - Cibus Settings */}
          <div className="order-2 h-full">
            <CibusForm />
          </div>

          {/* Middle Left - Notification Settings */}
          <div className="order-3 lg:order-3 h-full">
            <NotificationsForm />
          </div>

          {/* Middle Right - Automation Settings */}
          <div className="order-4 lg:order-4 h-full">
            <AutomationSettingsForm />
          </div>
        </div>

        {/* Data Management - Full width section */}
        <div className="space-y-6">
          <div className="border-t pt-8">
            <h3 className="text-lg font-semibold mb-6">
              {t("dataManagement.title")}
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Export Data */}
              <div className="h-full" data-export-card>
                <ExportDataForm />
              </div>

              {/* Delete Account */}
              <div className="h-full">
                <DeleteAccountForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
