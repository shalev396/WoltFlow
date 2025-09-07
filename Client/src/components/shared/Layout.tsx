import { type ReactNode } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { RouteTracker } from "@/components/shared/RouteTracker";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export default function Layout({
  children,
  title,
  description,
  className = "",
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <RouteTracker />
      <Navbar />

      <main className="flex-1 pt-16">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {(title || description) && (
            <header className="mb-8">
              {title && (
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                  {title}
                </h1>
              )}
              {description && (
                <p className="text-muted-foreground mt-2">{description}</p>
              )}
            </header>
          )}

          <div className={`space-y-8 ${className}`}>{children}</div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
