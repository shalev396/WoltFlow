import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

interface AsyncButtonProps extends ComponentProps<typeof Button> {
  loading?: boolean;
  loadingText?: string;
}

export default function AsyncButton({
  children,
  loading = false,
  loadingText,
  disabled,
  className,
  ...props
}: AsyncButtonProps) {
  return (
    <Button {...props} disabled={loading || disabled} className={cn(className)}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {loading ? loadingText || "Loading..." : children}
    </Button>
  );
}
