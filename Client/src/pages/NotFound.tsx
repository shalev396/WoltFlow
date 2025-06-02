import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b bg-background/80">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            WoltFlow
          </h1>
          <ModeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 pt-24 flex flex-col items-center justify-center min-h-screen">
        <div className="text-center space-y-6">
          <h1 className="text-[12rem] font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-none">
            404
          </h1>
          <h2 className="text-4xl font-semibold text-foreground">
            Page Not Found
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button asChild variant="outline" size="lg" className="mt-8">
            <Link to="/">Return Home</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
