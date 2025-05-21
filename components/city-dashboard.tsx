"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResourcesOverview } from "./resources-overview";
import { GovernanceOverview } from "./governance-overview";
import { ZonesOverview } from "./zones-overview";
import { IdentityOverview } from "./identity-overview";

export function CityDashboard() {
  const [activeTab, setActiveTab] = useState("resources");
  const params = useParams();
  const societyId = params.id as string;

  return (
    <div className="space-y-8">
      <Tabs defaultValue="resources" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="zones">City Zones</TabsTrigger>
          <TabsTrigger value="governance">Governance</TabsTrigger>
        </TabsList>
        <TabsContent value="resources">
          <ResourcesOverview societyId={societyId} />
        </TabsContent>
        <TabsContent value="zones">
          <ZonesOverview societyId={societyId} />
        </TabsContent>
        <TabsContent value="governance">
          <GovernanceOverview societyId={societyId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
