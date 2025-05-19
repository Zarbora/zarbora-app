"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/sidebar";
import { LoginButton } from "@/components/login-button";
import { UserAccount } from "@/components/user-account";
import { useAuth } from "@/context/auth-context";

export function Header() {
  const { isConnected } = useAuth();

  return (
    <header className="sticky top-0 z-10 flex h-16 flex-shrink-0 border-b border-stone-200 bg-white">
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
              <div className="flex h-full flex-col">
                <Sidebar />
              </div>
            </SheetContent>
          </Sheet>
          <h1 className="text-xl font-semibold text-stone-800 md:hidden">
            Zarbora
          </h1>
        </div>
        <div className="ml-4 flex items-center gap-4 md:ml-6">
          <LoginButton />
          <UserAccount />
        </div>
      </div>
    </header>
  );
}
