import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/store/slices/userSlice";
import type { RootState, AppDispatch } from "@/store/store";

interface LogoutButtonProps {
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
  redirectTo?: string;
  onLogoutStart?: () => void;
  onLogoutComplete?: () => void;
  onLogoutError?: (error: any) => void;
}

export default function LogoutButton({
  variant = "outline",
  size = "default",
  className = "",
  children = "Logout",
  redirectTo = "/",
  onLogoutStart,
  onLogoutComplete,
  onLogoutError,
}: LogoutButtonProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state: RootState) => state.user);

  const handleLogout = async () => {
    try {
      onLogoutStart?.();

      // Dispatch logout action
      await dispatch(logoutUser()).unwrap();

      onLogoutComplete?.();

      // Navigate to redirect path
      navigate(redirectTo);
    } catch (error) {
      onLogoutError?.(error);

      // Even if logout fails, try to navigate
      navigate(redirectTo);
    }
  };

  return (
    <Button
      onClick={handleLogout}
      disabled={isLoading}
      variant={variant}
      size={size}
      className={className}
    >
      {isLoading ? "Logging out..." : children}
    </Button>
  );
}
