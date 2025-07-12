import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import { WoltCredentialsHelp } from "@/components/WoltCredentialsHelp";
import { AutomationModesHelp } from "@/components/AutomationModesHelp";
import { AutomationToggle } from "@/components/AutomationToggle";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  useSettingsQuery,
  useUpdateSettingsMutation,
} from "@/queries/settings";

// Define available gift card amounts
const GIFT_CARD_AMOUNTS = [
  20, 25, 30, 35, 40, 45, 50, 60, 70, 75, 80, 85, 90, 100, 150, 180, 200, 250,
  300, 350, 400, 450, 500, 550, 600, 650, 700, 800, 850, 900, 1000, 1500,
].sort((a, b) => a - b);

const formSchema = z.object({
  isNotification: z.boolean(),
  automationEnabled: z.boolean(),
  automationMode: z.enum(["full-run", "buy-only", "cross-account"], {
    required_error: "Please select an automation mode",
  }),
  wrtoken: z.string().min(1, "Refresh token is required"),
  wtoken: z.string().min(1, "Access token is required"),
  cibusName: z.string().min(1, "Username is required"),
  cibusPassword: z.string().min(1, "Password is required"),
  cibusCompany: z.string().min(1, "Company is required"),
  giftAmount: z.number().min(0, "Amount must be positive"),
});

type FormData = z.infer<typeof formSchema>;

export function SettingsTab() {
  const { data: settings, isLoading: isLoadingSettings } = useSettingsQuery();
  const updateSettingsMutation = useUpdateSettingsMutation();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isNotification: false,
      automationEnabled: false,
      automationMode: "full-run" as const,
      wrtoken: "",
      wtoken: "",
      cibusName: "",
      cibusPassword: "",
      cibusCompany: "",
      giftAmount: 50,
    },
  });

  useEffect(() => {
    if (settings) {
      const parsedAmount = settings.giftAmount
        ? Math.round(parseFloat(settings.giftAmount))
        : 50;

      // Use setValue instead of reset to ensure proper form updates
      form.setValue("isNotification", settings.isNotification);
      form.setValue("automationEnabled", settings.automationEnabled ?? false);
      form.setValue("automationMode", settings.automationMode || "full-run");
      form.setValue("wrtoken", settings.wrtoken || "");
      form.setValue("wtoken", settings.wtoken || "");
      form.setValue("cibusName", settings.cibusName || "");
      form.setValue("cibusPassword", settings.cibusPassword || "");
      form.setValue("cibusCompany", settings.cibusCompany || "");
      form.setValue("giftAmount", parsedAmount);
    }
  }, [settings, form]);

  async function onSubmit(values: FormData) {
    // Validate tokens
    if (!values.wrtoken.trim() || !values.wtoken.trim()) {
      return;
    }

    // Convert giftAmount to string format for server
    const serverValues = {
      ...values,
      giftAmount: values.giftAmount.toFixed(2), // Convert to "35.00" format
    };

    updateSettingsMutation.mutate(serverValues);
  }

  const isLoading = isLoadingSettings || updateSettingsMutation.isPending;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="isNotification"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-card">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Notifications</FormLabel>
                  <FormDescription>
                    Get notified about purchase updates
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <AutomationToggle control={form.control} name="automationEnabled" />

          <FormField
            control={form.control}
            name="automationMode"
            render={({ field }) => (
              <FormItem className="rounded-lg border p-4 bg-card">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base flex items-center gap-2">
                      Automation Mode
                      <AutomationModesHelp />
                    </FormLabel>
                    <FormDescription>
                      Choose how the automation should work
                    </FormDescription>
                  </div>
                </div>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="bg-card w-full">
                      <SelectValue placeholder="Select automation mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-run">
                        <div className="flex items-center gap-2">
                          <span>🚀</span>
                          <div>
                            <p className="font-medium">Complete Automation</p>
                            <p className="text-xs text-muted-foreground">
                              Buy and apply automatically
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="buy-only">
                        <div className="flex items-center gap-2">
                          <span>🛒</span>
                          <div>
                            <p className="font-medium">Buy Only</p>
                            <p className="text-xs text-muted-foreground">
                              Just purchase, apply manually
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="cross-account">
                        <div className="flex items-center gap-2">
                          <span>⚡</span>
                          <div>
                            <p className="font-medium">
                              Smart Account Strategy
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Buy from secondary, apply to main
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Wolt Integration
            </h3>
            <WoltCredentialsHelp />
          </div>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="wrtoken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wolt Refresh Token</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="bg-card min-h-[100px] font-mono text-sm"
                      placeholder="xxxxxxxxxxxxxx"
                    />
                  </FormControl>
                  <FormDescription>
                    Your Wolt refresh token used for authentication.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="wtoken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wolt Access Token</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="bg-card min-h-[100px] font-mono text-sm"
                      placeholder='{accessToken:"xxxxxxxxxxxxxxxxxxxxxx",expireTime:1720704000}'
                    />
                  </FormControl>
                  <FormDescription>
                    Your Wolt access token used for API requests.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Cibus Credentials
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="cibusName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-card" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cibusPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} className="bg-card" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cibusCompany"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-card" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="giftAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gift Card Amount (₪)</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value?.toString() || ""}
                      onValueChange={(value) => {
                        if (value && value !== "") {
                          field.onChange(Number(value));
                        }
                      }}
                    >
                      <SelectTrigger className="bg-card w-full">
                        <SelectValue placeholder="Select amount" />
                      </SelectTrigger>
                      <SelectContent>
                        {GIFT_CARD_AMOUNTS.map((amount) => (
                          <SelectItem key={amount} value={amount.toString()}>
                            ₪{amount}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormDescription className="text-sm text-muted-foreground">
            Choose from available Wolt gift card amounts
          </FormDescription>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </form>
    </Form>
  );
}
