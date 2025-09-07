import { Link } from "react-router-dom";
import { CookieSettings } from "../consent/CookieSettings";

export default function Footer() {
  return (
    <footer className="relative z-20 bg-background border-t py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground text-center md:text-left">
            © 2025 WoltFlow. All rights reserved.
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 text-sm text-center md:text-left">
            <Link
              to="/legal/privacy-policy"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/legal/extension-privacy-policy"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Extension Privacy Policy
            </Link>
            <Link
              to="/legal/terms-of-service"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <CookieSettings variant="link" />
          </div>
        </div>
      </div>
    </footer>
  );
}
