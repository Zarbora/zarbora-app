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

export default function IdentityPage() {
  const { displayName, address } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Identity</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Welcome back, {displayName}
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="governance">Governance</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <IdentityOverview />
        </TabsContent>
        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Resources</CardTitle>
              <CardDescription>
                Resources you currently own and manage across all societies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                You don't own any resources yet
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="governance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Governance Activity</CardTitle>
              <CardDescription>
                Your recent votes and proposals across all societies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No recent governance activity
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
