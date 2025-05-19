"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Building, Home, LayoutDashboard, Users, Vote } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Resources", href: "/resources", icon: Building },
  { name: "City Zones", href: "/zones", icon: Home },
  { name: "Governance", href: "/governance", icon: Vote },
  { name: "Identity", href: "/identity", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden border-r border-stone-200 md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
      <div className="flex min-h-0 flex-1 flex-col bg-white">
        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <div className="flex flex-shrink-0 items-center px-4">
            <h1 className="text-xl font-bold text-stone-800">Zarbora</h1>
          </div>
          <nav className="mt-5 flex-1 space-y-1 px-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  pathname === item.href
                    ? "bg-stone-100 text-stone-900"
                    : "text-stone-600 hover:bg-stone-50 hover:text-stone-900",
                  "group flex items-center rounded-md px-2 py-2 text-sm font-medium"
                )}
              >
                <item.icon
                  className={cn(
                    pathname === item.href
                      ? "text-stone-700"
                      : "text-stone-400 group-hover:text-stone-500",
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
