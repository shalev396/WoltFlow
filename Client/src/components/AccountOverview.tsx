import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AccountOverview() {
  const { user } = useSelector((state: RootState) => state.user);
  const totalSaved = 100;
  const isLoading = false;

  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Account Overview
        </CardTitle>
        <CardDescription>Your account details and settings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <p className="text-lg font-medium text-foreground">{user?.email}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Total Saved
            </p>
            <p className="text-lg font-medium text-foreground">
              {isLoading ? (
                <span className="inline-block w-16 h-6 bg-muted animate-pulse rounded" />
              ) : (
                `₪${totalSaved.toFixed(2)}`
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
