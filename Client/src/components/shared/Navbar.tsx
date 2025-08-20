import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Menu,
  Home,
  Activity,
  Settings,
  Mail,
  LogOut,
  BookOpen,
} from "lucide-react";

import type { RootState } from "@/store/store";
import { ModeToggle } from "@/components/shared/mode-toggle";
import LoginButton from "@/components/shared/LoginButton";
import LogoutButton from "@/components/shared/LogoutButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
import { Button, buttonVariants } from "@/components/ui/button";
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
      href: "/inbox",
      label: "Inbox",
      icon: Mail,
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  const isActivePage = (path: string) => {
    // For docs pages, check if we're on any docs route
    if (path === "/docs") {
      return location.pathname.startsWith("/docs");
    }
    return location.pathname === path;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const AuthButtons = () => {
    if (isAuthenticated && user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-3 px-4 py-3 h-auto rounded-lg hover:bg-muted/50 transition-all duration-200 min-w-[220px] border border-border/50 hover:border-border shadow-sm bg-background/50"
            >
              <Avatar className="h-9 w-9 ring-2 ring-border/20">
                <AvatarImage
                  src={user.picture}
                  alt={user.name}
                  onError={(e) => {
                    // If image fails to load, hide it to show fallback
                    e.currentTarget.style.display = "none";
                  }}
                />
                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-left min-w-0 flex-1 gap-1">
                <p className="text-sm font-medium leading-tight truncate w-full">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground truncate w-full leading-tight">
                  {user.email}
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[220px]"
            align="end"
            side="bottom"
            sideOffset={4}
            forceMount
          >
            <DropdownMenuItem asChild>
              <LogoutButton
                variant="ghost"
                className="w-full justify-start h-8 px-2 py-1.5 font-normal text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </LogoutButton>
            </DropdownMenuItem>
            {/* Future options can be added here */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return <LoginButton variant="default" size="default" />;
  };

  return (
    <header className="fixed border-b top-0 z-50 w-full bg-background/98 backdrop-blur-md supports-[backdrop-filter]:bg-background/95 shadow-sm">
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
          <div className="flex lg:hidden items-center gap-2">
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
                  <div className="flex items-center gap-3 p-4 mt-4 rounded-lg bg-muted/50 border border-border/50">
                    <Avatar className="h-9 w-9 ring-2 ring-border/20">
                      <AvatarImage
                        src={user.picture}
                        alt={user.name}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                      <p className="font-medium text-sm leading-tight truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground leading-tight truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col h-full">
                  <nav className="flex flex-col gap-2 mt-6 flex-1">
                    {/* Public Docs Link - Always Visible */}
                    <Link
                      to="/docs"
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "justify-start h-12 px-4",
                        isActivePage("/docs") &&
                          "bg-accent text-accent-foreground"
                      )}
                    >
                      <BookOpen className="mr-3 h-5 w-5" />
                      Documentation
                    </Link>

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
          <nav className="hidden lg:flex gap-1">
            {/* Public Documentation Link */}
            <Link
              to="/docs"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "h-9 px-4 py-2",
                isActivePage("/docs") && "bg-accent text-accent-foreground"
              )}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Documentation
            </Link>

            {/* Authenticated User Routes */}
            {isAuthenticated &&
              routeList.map((route) => {
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

          {/* Right side - Auth buttons and theme toggle */}
          <div className="hidden lg:flex gap-2 items-center">
            <AuthButtons />
            <ModeToggle />
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}
