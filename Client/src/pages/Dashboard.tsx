import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/userSlice";
import type { RootState, AppDispatch } from "@/store/store";
import { api } from "@/api/api";
import type { Run } from "@/types";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const [runs, setRuns] = useState<Run[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRuns = async () => {
      try {
        const response = await api.get(`/run/${user?.id}`);
        setRuns(response.data);
      } catch (error) {
        toast.error("Failed to fetch runs");
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchRuns();
    }
  }, [user?.id]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleNotificationToggle = async () => {
    try {
      await api.patch(`/user/${user?.id}`, {
        in_notification: !user?.in_notification,
      });
      toast.success("Notification settings updated");
    } catch (error) {
      toast.error("Failed to update notification settings");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b bg-background/80">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-24 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Account Overview
              </CardTitle>
              <CardDescription>
                Your account details and settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Email
                  </p>
                  <p className="text-lg font-medium text-foreground">
                    {user?.email}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Saved
                  </p>
                  <p className="text-lg font-medium text-foreground">
                    ₪{user?.total_saved.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      Notifications
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts about your purchases
                    </p>
                  </div>
                  <Switch
                    checked={user?.in_notification}
                    onCheckedChange={handleNotificationToggle}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest purchase attempts</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-[60%] bg-muted animate-pulse rounded" />
                      <div className="h-4 w-[80%] bg-muted animate-pulse rounded" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-[70%] bg-muted animate-pulse rounded" />
                      <div className="h-4 w-[60%] bg-muted animate-pulse rounded" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-[50%] bg-muted animate-pulse rounded" />
                      <div className="h-4 w-[75%] bg-muted animate-pulse rounded" />
                    </div>
                  </div>
                </div>
              ) : runs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Loader2 className="size-6 text-muted-foreground animate-spin" />
                  </div>
                  <p className="text-lg font-medium text-foreground">
                    No purchase history yet
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your recent gift card purchases will appear here
                  </p>
                </div>
              ) : (
                <div className="relative overflow-x-auto -mx-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-foreground font-medium pl-6">
                          Date
                        </TableHead>
                        <TableHead className="text-foreground font-medium">
                          Status
                        </TableHead>
                        <TableHead className="text-foreground font-medium">
                          Notification
                        </TableHead>
                        <TableHead className="text-right text-foreground font-medium pr-6">
                          Amount
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {runs.slice(0, 5).map((run) => (
                        <TableRow
                          key={run.id}
                          className="hover:bg-muted/50 transition-colors"
                        >
                          <TableCell className="pl-6">
                            <div className="space-y-1">
                              <p className="font-medium text-foreground">
                                {format(
                                  new Date(run.created_at),
                                  "MMM d, yyyy"
                                )}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(run.created_at), "h:mm a")}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                run.status === "success"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                                  : run.status === "failed"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
                              }`}
                            >
                              {run.status === "success" && "✓ "}
                              {run.status === "failed" && "✕ "}
                              {run.status === "in progress" && "⋯ "}
                              {run.status.charAt(0).toUpperCase() +
                                run.status.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                run.is_notify
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300"
                              }`}
                            >
                              {run.is_notify ? "Enabled" : "Disabled"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <span className="font-medium text-foreground">
                              ₪{run.amount.toFixed(2)}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
