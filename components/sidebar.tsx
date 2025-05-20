"use client";

import { usePathname, useParams } from "next/navigation";
import Link from "next/link";
import {
  Building,
  Home,
  LayoutDashboard,
  Vote,
  Users,
  Building2,
  Mic2,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { useEffect, useState } from "react";
import { Sidebar as UISidebar, SidebarProvider } from "@/components/ui/sidebar";

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const params = useParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // If we're not mounted yet, don't render anything
  if (!mounted) {
    return null;
  }

  const mainNavigation = [
    { name: "Societies", href: "/", icon: Building2 },
    { name: "Identity", href: "/identity", icon: UserCircle },
  ];

  const societyNavigation = params.id
    ? [
        {
          name: "Dashboard",
          href: `/society/${params.id}`,
          icon: LayoutDashboard,
        },
        {
          name: "Resources",
          href: `/society/${params.id}/resources`,
          icon: Building,
        },
        { name: "City Zones", href: `/society/${params.id}/zones`, icon: Home },
        {
          name: "Governance",
          href: `/society/${params.id}/governance`,
          icon: Vote,
        },
        {
          name: "Speakers",
          href: `/society/${params.id}/speakers`,
          icon: Mic2,
        },
      ]
    : [];

  const navigation = params.id
    ? [...societyNavigation, ...mainNavigation]
    : mainNavigation;

  return (
    <SidebarProvider defaultOpen={true}>
      <UISidebar
        className={cn("flex flex-col", className)}
        variant="sidebar"
        collapsible="none"
      >
        <div className="flex min-h-0 flex-1 flex-col bg-background">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <h1 className="text-xl font-bold text-foreground">Zarbora</h1>
            </div>
            {params.id && (
              <div className="mt-2 px-4">
                <p className="text-sm text-muted-foreground">
                  A decentralized city simulation with Harberger taxes
                </p>
              </div>
            )}
            <nav className="mt-5 flex-1 space-y-1 px-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    pathname === item.href
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    "group flex items-center rounded-md px-2 py-2 text-sm font-medium"
                  )}
                >
                  <item.icon
                    className={cn(
                      pathname === item.href
                        ? "text-accent-foreground"
                        : "text-muted-foreground group-hover:text-accent-foreground",
                      "mr-3 h-5 w-5 flex-shrink-0"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
            {params.id && (
              <div className="mt-4 border-t border-stone-200 dark:border-stone-800 px-4 pt-4">
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-accent-foreground"
                >
                  ← Back to Societies
                </Link>
              </div>
            )}
          </div>
        </div>
      </UISidebar>
    </SidebarProvider>
  );
}
