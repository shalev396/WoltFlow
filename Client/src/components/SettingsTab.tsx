import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from "lucide-react";

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
  20, 25, 30, 35, 40, 45, 50, 60, 70, 75, 80, 85, 90, 100, 150, 200, 250, 300,
  350, 400, 450, 500, 550, 600, 650,
].sort((a, b) => a - b);

const formSchema = z.object({
  isNotification: z.boolean(),
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
      form.reset({
        isNotification: settings.isNotification,
        wrtoken: settings.wrtoken || "",
        wtoken: settings.wtoken || "",
        cibusName: settings.cibusName || "",
        cibusPassword: settings.cibusPassword || "",
        cibusCompany: settings.cibusCompany || "",
        giftAmount: settings.giftAmount
          ? parseInt(settings.giftAmount.toString(), 10)
          : 50,
      });
    }
  }, [settings, form]);

  async function onSubmit(values: FormData) {
    // Validate tokens
    if (!values.wrtoken.trim() || !values.wtoken.trim()) {
      return;
    }

    updateSettingsMutation.mutate(values);
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
        <FormField
          control={form.control}
          name="isNotification"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-card">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Notifications</FormLabel>
                <FormDescription>
                  Enable notifications for purchase updates
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

        <div className="space-y-4">
          <h3 className="text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Wolt Integration
          </h3>
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
                      placeholder="Your Wolt refresh token"
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
                      placeholder="Your Wolt access token"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <FormItem className="md:col-span-2 lg:col-span-1">
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-card" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="giftAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gift Card Amount (₪)</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger className="bg-card">
                    <SelectValue placeholder="Select amount" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {GIFT_CARD_AMOUNTS.map((amount) => (
                    <SelectItem key={amount} value={amount.toString()}>
                      ₪{amount}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Choose from available Wolt gift card amounts
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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
