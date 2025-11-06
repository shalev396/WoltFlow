import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useTranslation } from "react-i18next";
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

export default function LoginButton({
  variant = "default",
  size = "default",
  className = "",
  children,
}: LoginButtonProps) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { t } = useTranslation("common");

  const handleLogin = () => {
    navigate(`/${language}/auth/login`);
  };

  return (
    <Button
      onClick={handleLogin}
      variant={variant}
      size={size}
      className={className}
    >
      {children || t("nav.login")}
    </Button>
  );
}
