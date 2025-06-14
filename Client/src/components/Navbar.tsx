import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu, Home, Activity, Settings, User } from "lucide-react";

import type { RootState } from "@/store/store";
import { ModeToggle } from "@/components/mode-toggle";
import LoginButton from "@/components/LoginButton";
import LogoutButton from "@/components/LogoutButton";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RouteProps {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function Navbar() {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.user
  );

  const [isOpen, setIsOpen] = useState(false);

  const location = useLocation();

  const routeList: RouteProps[] = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: Home,
    },
    {
      href: "/runs",
      label: "Runs",
      icon: Activity,
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  const isActivePage = (path: string) => location.pathname === path;

  const AuthButtons = () => {
    if (isAuthenticated && user) {
      return (
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-md bg-muted/50">
            <User className="h-4 w-4" />
            <span className="text-sm font-medium">{user.name}</span>
          </div>
          <LogoutButton variant="outline" size="sm">
            Logout
          </LogoutButton>
        </div>
      );
    }

    return <LoginButton variant="default" size="default" />;
  };

  return (
    <header className="sticky border-b top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <NavigationMenu className="mx-auto max-w-none">
        <NavigationMenuList className="container h-16 px-4 w-screen flex justify-between items-center">
          {/* Logo */}
          <div className="font-bold flex items-center">
            <Link
              to="/"
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              WoltFlow
            </Link>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2">
            <ModeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="px-2">
                <Menu className="h-5 w-5" onClick={() => setIsOpen(true)}>
                  <span className="sr-only">Menu Icon</span>
                </Menu>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    WoltFlow
                  </SheetTitle>
                </SheetHeader>

                {isAuthenticated && user && (
                  <div className="flex items-center gap-3 p-4 mt-4 rounded-lg bg-muted/50">
                    <User className="h-8 w-8 rounded-full bg-primary/10 p-2" />
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col h-full">
                  <nav className="flex flex-col gap-2 mt-6 flex-1">
                    {isAuthenticated ? (
                      <>
                        {routeList.map((route) => {
                          const Icon = route.icon;
                          return (
                            <Link
                              key={route.label}
                              to={route.href}
                              onClick={() => setIsOpen(false)}
                              className={cn(
                                buttonVariants({ variant: "ghost" }),
                                "justify-start h-12 px-4",
                                isActivePage(route.href) &&
                                  "bg-accent text-accent-foreground"
                              )}
                            >
                              <Icon className="mr-3 h-5 w-5" />
                              {route.label}
                            </Link>
                          );
                        })}
                      </>
                    ) : (
                      <LoginButton className="w-full h-12" />
                    )}
                  </nav>

                  {/* Logout button at bottom */}
                  {isAuthenticated && (
                    <div className="mt-auto pb-4 pt-4 border-t">
                      <LogoutButton
                        variant="outline"
                        className="w-full h-12"
                        onLogoutComplete={() => setIsOpen(false)}
                      >
                        Logout
                      </LogoutButton>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <nav className="hidden md:flex gap-1">
              {routeList.map((route) => {
                const Icon = route.icon;
                return (
                  <Link
                    key={route.label}
                    to={route.href}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "h-9 px-4 py-2",
                      isActivePage(route.href) &&
                        "bg-accent text-accent-foreground"
                    )}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {route.label}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Right side - Auth buttons and theme toggle */}
          <div className="hidden md:flex gap-2 items-center">
            <AuthButtons />
            <ModeToggle />
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}
