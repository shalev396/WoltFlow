import Navbar from "@/components/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SettingsTab } from "@/components/SettingsTab";

export default function Settings() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-18 pb-8">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
            Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and automation preferences
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>
              Configure your Wolt automation and notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SettingsTab />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
