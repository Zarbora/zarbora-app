"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building, Home, Users, Vote } from "lucide-react";
import { api } from "@/lib/api";
import type { Society, DashboardStats } from "@/lib/api";
import { getDashboardStats } from "@/lib/api";

export default function SocietyDashboardPage() {
  const params = useParams();
  const societyId = params.id as string;
  const [society, setSociety] = useState<Society | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [societyData, stats] = await Promise.all([
          api.societies.getById(societyId),
          getDashboardStats(societyId),
        ]);
        setSociety(societyData);
        setDashboardStats(stats);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [societyId]);

  if (loading) return <div>Loading society data...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!society || !dashboardStats) return <div>Society not found</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{society.name}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Overview of society metrics and activities
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Resources
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats.totalResources}
            </div>
            <p className="text-xs text-muted-foreground">Across all zones</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">City Zones</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.zoneCount}</div>
            <p className="text-xs text-muted-foreground">
              With unique tax rates
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats.totalMembers}
            </div>
            <p className="text-xs text-muted-foreground">Active participants</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Proposals
            </CardTitle>
            <Vote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats.activeProposals}
            </div>
            <p className="text-xs text-muted-foreground">
              Governance activities
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
