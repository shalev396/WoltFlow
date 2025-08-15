import Layout from "@/components/shared/Layout";
import WoltForm from "@/components/pages/settings/WoltForm";
import CibusForm from "@/components/pages/settings/CibusForm";
import AutomationSettingsForm from "@/components/pages/settings/AutomationSettingsForm";
import NotificationsForm from "@/components/pages/settings/NotificationsForm";

export default function SettingsPage() {
  return (
    <Layout
      title="Settings"
      description="Manage your account settings and automation preferences"
    >
      {/* Settings forms in responsive grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Top Left - Wolt Settings */}
        <div className="order-1 h-full">
          <WoltForm />
        </div>

        {/* Top Right - Cibus Settings */}
        <div className="order-2 h-full">
          <CibusForm />
        </div>

        {/* Bottom Left - Notification Settings */}
        <div className="order-3 lg:order-3 h-full">
          <NotificationsForm />
        </div>

        {/* Bottom Right - Automation Settings */}
        <div className="order-4 lg:order-4 h-full">
          <AutomationSettingsForm />
        </div>
      </div>
    </Layout>
  );
}
