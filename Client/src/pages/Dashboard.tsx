import { useSelector } from "react-redux";

import type { RootState } from "@/store/store";
import Navbar from "@/components/Navbar";
import AccountOverview from "@/components/AccountOverview";
import RecentActivity from "@/components/RecentActivity";

export default function Dashboard() {
  const { user } = useSelector((state: RootState) => state.user);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
            Dashboard
          </h1>
          {user?.name && (
            <p className="text-muted-foreground mt-2">
              Welcome back, {user.name}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AccountOverview />
          <RecentActivity />
        </div>
      </main>
    </div>
  );
}
