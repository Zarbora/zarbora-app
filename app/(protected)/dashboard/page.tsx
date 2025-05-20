"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IdentityOverview } from "@/components/identity-overview";
import { Building, Home, Users, Vote } from "lucide-react";

export default function DashboardPage() {
  const { displayName, address } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
          Welcome back, {displayName}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white dark:bg-stone-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-stone-900 dark:text-white">
              Total Resources
            </CardTitle>
            <Building className="h-4 w-4 text-stone-600 dark:text-stone-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-900 dark:text-white">
              79
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              Across all zones
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-stone-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-stone-900 dark:text-white">
              City Zones
            </CardTitle>
            <Home className="h-4 w-4 text-stone-600 dark:text-stone-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-900 dark:text-white">
              5
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              With unique tax rates
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-stone-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-stone-900 dark:text-white">
              Active Citizens
            </CardTitle>
            <Users className="h-4 w-4 text-stone-600 dark:text-stone-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-900 dark:text-white">
              42
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              With governance weight
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-stone-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-stone-900 dark:text-white">
              Active Proposals
            </CardTitle>
            <Vote className="h-4 w-4 text-stone-600 dark:text-stone-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-900 dark:text-white">
              3
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              Awaiting community votes
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="identity" className="space-y-4">
        <TabsList className="bg-stone-100 dark:bg-stone-800">
          <TabsTrigger
            value="identity"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-stone-700"
          >
            Identity
          </TabsTrigger>
          <TabsTrigger
            value="resources"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-stone-700"
          >
            Resources
          </TabsTrigger>
          <TabsTrigger
            value="governance"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-stone-700"
          >
            Governance
          </TabsTrigger>
        </TabsList>
        <TabsContent value="identity" className="space-y-4">
          <IdentityOverview />
        </TabsContent>
        <TabsContent value="resources" className="space-y-4">
          <Card className="bg-white dark:bg-stone-800">
            <CardHeader>
              <CardTitle className="text-stone-900 dark:text-white">
                Your Resources
              </CardTitle>
              <CardDescription className="text-stone-600 dark:text-stone-400">
                Resources you currently own and manage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-stone-600 dark:text-stone-400">
                Coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="governance" className="space-y-4">
          <Card className="bg-white dark:bg-stone-800">
            <CardHeader>
              <CardTitle className="text-stone-900 dark:text-white">
                Governance Activity
              </CardTitle>
              <CardDescription className="text-stone-600 dark:text-stone-400">
                Your recent votes and proposals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-stone-600 dark:text-stone-400">
                Coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
