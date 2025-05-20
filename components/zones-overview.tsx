"use client";

import { useState, useEffect } from "react";
import {
  Building,
  Coffee,
  Home,
  Laptop,
  Users,
  Plus,
  Edit,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ZoneDetailsDialog } from "./zone-details-dialog";
import { ZoneFormDialog } from "./zone-form-dialog";
import { api } from "@/lib/api";
import type { Zone } from "@/lib/api";

interface ZonesOverviewProps {
  societyId: string;
}

// Add type for the API response
interface ZoneWithTypes extends Zone {
  zone_resource_types: Array<{ resource_type: string }>;
}

const iconMap = {
  Home: Home,
  Laptop: Laptop,
  Users: Users,
  Building: Building,
  Coffee: Coffee,
};

export function ZonesOverview({ societyId }: ZonesOverviewProps) {
  console.log("ZonesOverview societyId:", societyId);
  const [zones, setZones] = useState<ZoneWithTypes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<ZoneWithTypes | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    async function loadZones() {
      try {
        const data = await api.zones.getBySociety(societyId);
        console.log("Zones data:", data);
        setZones(data || []);
      } catch (err) {
        console.error("Failed to load zones:", err);
        setError(err instanceof Error ? err.message : "Failed to load zones");
      } finally {
        setLoading(false);
      }
    }

    if (societyId) {
      loadZones();
    }
  }, [societyId]);

  const handleZoneClick = (zone: ZoneWithTypes) => {
    setSelectedZone(zone);
    setIsDetailsOpen(true);
  };

  const handleNewZone = () => {
    setSelectedZone(null);
    setIsFormOpen(true);
  };

  const handleEditZone = (zone: ZoneWithTypes) => {
    setSelectedZone(zone);
    setIsFormOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-800 mx-auto mb-4" />
          <p>Loading zones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (zones.length === 0) {
    return (
      <div className="text-center">
        <p className="mb-4">No zones found</p>
        <Button onClick={handleNewZone}>Create First Zone</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium text-stone-800">City Zones</h2>
        <Button onClick={handleNewZone} className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          <span>New Zone</span>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {zones.map((zone) => {
          const Icon = iconMap[zone.icon as keyof typeof iconMap] || Building;
          const resourceTypes =
            zone.zone_resource_types?.map((t) => t.resource_type) || [];

          return (
            <Card
              key={zone.id}
              className="cursor-pointer transition-colors hover:bg-stone-50"
              onClick={() => handleZoneClick(zone)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-stone-600" />
                    <span>{zone.name}</span>
                  </div>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditZone(zone);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {zone.description}
                </CardDescription>
                <div className="space-y-4">
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">Tax Rate</span>
                      <span className="text-sm text-stone-500">
                        {zone.tax_rate}%
                      </span>
                    </div>
                    <Progress value={zone.tax_rate} className="h-2" />
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">Occupancy</span>
                      <span className="text-sm text-stone-500">
                        {zone.occupancy_rate}%
                      </span>
                    </div>
                    <Progress value={zone.occupancy_rate} className="h-2" />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {resourceTypes.slice(0, 3).map((type) => (
                      <Badge key={type} variant="outline">
                        {type}
                      </Badge>
                    ))}
                    {resourceTypes.length > 3 && (
                      <Badge variant="outline">
                        +{resourceTypes.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedZone && (
        <ZoneDetailsDialog
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          zone={selectedZone}
        />
      )}

      <ZoneFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        zone={selectedZone || undefined}
      />
    </div>
  );
}
