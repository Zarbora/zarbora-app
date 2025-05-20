"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Sidebar } from "@/components/sidebar";
import { LoginButton } from "@/components/login-button";
import { UserAccount } from "@/components/user-account";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/context/auth-context";

export function Header() {
  const { isConnected } = useAuth();

  return (
    <header className="sticky top-0 z-10 flex h-16 flex-shrink-0 border-b border-border bg-background">
      <div className="flex flex-1 justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex flex-1 items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open sidebar</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation Menu</SheetTitle>
                <SheetDescription>
                  Access the main navigation menu of Zarbora
                </SheetDescription>
              </SheetHeader>
              <Sidebar />
            </SheetContent>
          </Sheet>
          <h1 className="text-xl font-semibold text-foreground lg:hidden">
            Zarbora
          </h1>
        </div>
        <div className="ml-4 flex items-center gap-4 md:ml-6">
          <ThemeToggle />
          {!isConnected && <LoginButton />}
          {isConnected && <UserAccount />}
        </div>
      </div>
    </header>
  );
}
