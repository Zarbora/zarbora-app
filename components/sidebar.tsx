"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Building, Home, LayoutDashboard, Vote } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Resources", href: "/resources", icon: Building },
  { name: "City Zones", href: "/zones", icon: Home },
  { name: "Governance", href: "/governance", icon: Vote },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex min-h-0 flex-1 flex-col bg-background">
        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <div className="flex flex-shrink-0 items-center px-4">
            <h1 className="text-xl font-bold text-foreground">Zarbora</h1>
          </div>
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
        </div>
      </div>
    </div>
  );
}
