"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";

export default function DashboardPage() {
  const { displayName, address } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-800 dark:text-white">
          Dashboard
        </h1>
        <p className="text-stone-500 dark:text-stone-400">
          Welcome back, {displayName}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-white dark:bg-stone-800">
          <CardHeader>
            <CardTitle className="text-stone-900 dark:text-white">
              Your Address
            </CardTitle>
            <CardDescription className="text-stone-600 dark:text-stone-400">
              Your connected wallet address
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-sm text-stone-700 dark:text-stone-300">
              {address}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-stone-800">
          <CardHeader>
            <CardTitle className="text-stone-900 dark:text-white">
              Resources
            </CardTitle>
            <CardDescription className="text-stone-600 dark:text-stone-400">
              Your owned resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-stone-900 dark:text-white">
              3
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-stone-800">
          <CardHeader>
            <CardTitle className="text-stone-900 dark:text-white">
              Governance Weight
            </CardTitle>
            <CardDescription className="text-stone-600 dark:text-stone-400">
              Your voting power
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-stone-900 dark:text-white">
              120
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
