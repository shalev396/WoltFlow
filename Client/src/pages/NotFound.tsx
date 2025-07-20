import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-18 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center space-y-6">
          <h1 className="text-[8rem] md:text-[12rem] font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-none">
            404
          </h1>
          <h2 className="text-2xl md:text-4xl font-semibold text-foreground">
            Page Not Found
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-md mx-auto">
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
