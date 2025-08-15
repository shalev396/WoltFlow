import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/shared/Layout";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-8xl md:text-9xl font-bold text-muted-foreground/20 mb-4">
            404
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight mb-4">
            Page Not Found
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
            The page you're looking for doesn't exist or has been moved to
            another location.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            size="lg"
            className="min-w-[160px]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          <Button
            onClick={() => navigate("/")}
            size="lg"
            className="min-w-[160px]"
          >
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Button>
        </div>

        {/* Additional Help */}
        <div className="mt-12 p-6 border border-border rounded-lg bg-muted/30">
          <h2 className="text-xl font-semibold mb-3">Need Help?</h2>
          <p className="text-muted-foreground mb-4">
            If you believe this is an error or you're looking for something
            specific, here are some helpful links:
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a
              href="/dashboard"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Dashboard
            </a>
            <a
              href="/runs"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Automation Runs
            </a>
            <a
              href="/inbox"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Inbox
            </a>
            <a
              href="/settings"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Settings
            </a>
            <a
              href="/privacy"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
