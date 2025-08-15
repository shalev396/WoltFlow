import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Settings, Key, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AsyncButton from "@/components/shared/AsyncButton";
import { WoltCredentialsHelp } from "@/components/pages/settings/WoltCredentialsHelp";

import {
  woltSettingsSchema,
  type WoltSettingsFormData,
} from "@/lib/validations/settings/wolt";
import {
  useWoltSettingsQuery,
  useUpdateWoltSettingsMutation,
} from "@/queries/settings";

export default function WoltForm() {
  const [showRefreshToken, setShowRefreshToken] = useState(false);
  const [showAccessToken, setShowAccessToken] = useState(false);

  const { data: woltSettings, isLoading } = useWoltSettingsQuery();
  const updateWoltSettings = useUpdateWoltSettingsMutation();

  const form = useForm<WoltSettingsFormData>({
    resolver: zodResolver(woltSettingsSchema),
    defaultValues: {
      woltRefreshToken: "",
      woltAccessToken: "",
    },
  });

  // Populate form when data loads
  useEffect(() => {
    if (woltSettings) {
      form.reset({
        woltRefreshToken: woltSettings.woltRefreshToken || "",
        woltAccessToken: woltSettings.woltAccessToken || "",
      });
    }
  }, [woltSettings, form]);

  const onSubmit = async (data: WoltSettingsFormData) => {
    try {
      await updateWoltSettings.mutateAsync(data);
    } catch (error) {
      console.error("Failed to update Wolt settings:", error);
    }
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Wolt Settings
        </CardTitle>
        <CardDescription>
          Configure your Wolt account tokens for automated gift card application
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <Form {...form}>
          <form className="flex-1 flex flex-col">
            <div className="flex-1 space-y-6">
              {/* Help section */}
              <Alert>
                <Key className="h-4 w-4" />
                <AlertDescription className="flex items-start justify-between">
                  <span>
                    You'll need to obtain these tokens from your Wolt account.
                    Tokens are required for automated gift card application.
                  </span>
                  <WoltCredentialsHelp />
                </AlertDescription>
              </Alert>

              {/* Refresh Token */}
              <FormField
                control={form.control}
                name="woltRefreshToken"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Refresh Token</FormLabel>
                    <FormDescription>
                      Long-term token used to obtain new access tokens
                    </FormDescription>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          value={field.value || ""}
                          type={showRefreshToken ? "text" : "password"}
                          placeholder="Enter your Wolt refresh token..."
                          className="pr-10 font-mono"
                          disabled={isLoading || updateWoltSettings.isPending}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-2 h-6 w-6 p-0"
                          onClick={() => setShowRefreshToken(!showRefreshToken)}
                        >
                          {showRefreshToken ? (
                            <EyeOff className="h-3 w-3" />
                          ) : (
                            <Eye className="h-3 w-3" />
                          )}
                          <span className="sr-only">
                            {showRefreshToken ? "Hide" : "Show"} refresh token
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Access Token */}
              <FormField
                control={form.control}
                name="woltAccessToken"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Access Token</FormLabel>
                    <FormDescription>
                      Short-term token used for API requests (optional - will be
                      generated from refresh token)
                    </FormDescription>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          value={field.value || ""}
                          type={showAccessToken ? "text" : "password"}
                          placeholder="Enter your Wolt access token (optional)..."
                          className="pr-10 font-mono"
                          disabled={isLoading || updateWoltSettings.isPending}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                          onClick={() => setShowAccessToken(!showAccessToken)}
                        >
                          {showAccessToken ? (
                            <EyeOff className="h-3 w-3" />
                          ) : (
                            <Eye className="h-3 w-3" />
                          )}
                          <span className="sr-only">
                            {showAccessToken ? "Hide" : "Show"} access token
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit button - Fixed at bottom */}
            <div className="flex justify-end pt-6 border-t mt-6">
              <AsyncButton
                type="submit"
                onClick={form.handleSubmit(onSubmit)}
                loading={updateWoltSettings.isPending}
                disabled={isLoading || !form.formState.isDirty}
                className="min-w-32"
              >
                Save Changes
              </AsyncButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
