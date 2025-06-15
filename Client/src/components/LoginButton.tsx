import { useState } from "react";
import { Button } from "@/components/ui/button";

interface LoginButtonProps {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
}
const isDev = import.meta.env.VITE_ENV === "Development";
const baseURL = isDev
  ? "http://localhost:3000/api"
  : `${window.location.origin}/api`;
export default function LoginButton({
  variant = "default",
  size = "default",
  className = "",
  children = "Sign in with Google",
}: LoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    // Remove any 'g_state' cookie that has invalid JSON value
    document.cookie = `g_state=; Path=/; Max-Age=0; domain=localhost`;

    // Redirect to OAuth start
    setIsLoading(true);
    window.location.href = `${baseURL}/oauth2/start`;
  };

  return (
    <Button
      onClick={handleLogin}
      disabled={isLoading}
      variant={variant}
      size={size}
      className={className}
    >
      {isLoading ? "Redirecting..." : children}
    </Button>
  );
}
