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
  AlertCircle,
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
import { DepositButton } from "./deposit-button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const [zones, setZones] = useState<ZoneWithTypes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<ZoneWithTypes | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedOccupancy, setSelectedOccupancy] = useState("all");

  useEffect(() => {
    async function loadZones() {
      try {
        const data = await api.zones.getBySociety(societyId);
        setZones(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load zones");
      } finally {
        setLoading(false);
      }
    }

    if (societyId) {
      loadZones();
    }
  }, [societyId]);

  const filteredZones = zones.filter((zone) => {
    const matchesSearch =
      zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      zone.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      selectedType === "all" ||
      zone.zone_resource_types.some(
        (t) => t.resource_type.toLowerCase() === selectedType.toLowerCase()
      );

    const matchesOccupancy =
      selectedOccupancy === "all" ||
      (selectedOccupancy === "occupied" && zone.occupancy_rate > 0) ||
      (selectedOccupancy === "vacant" && zone.occupancy_rate === 0);

    return matchesSearch && matchesType && matchesOccupancy;
  });

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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>City Zones</CardTitle>
          <CardDescription>
            Manage and monitor your city's different zones and their
            performance. Each zone has its own tax rate and resource types.
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <DepositButton variant="outline" />
          <Button
            onClick={handleNewZone}
            className="bg-stone-800 text-white hover:bg-stone-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Zone
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-800" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <Input
                  placeholder="Search zones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Zone type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="housing">Housing</SelectItem>
                    <SelectItem value="workspace">Workspace</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="industrial">Industrial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select
                  value={selectedOccupancy}
                  onValueChange={setSelectedOccupancy}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Occupancy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Occupancy</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                    <SelectItem value="vacant">Vacant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
              {filteredZones.length === 0 ? (
                <div className="col-span-full text-center py-8 text-stone-500">
                  No zones found
                </div>
              ) : (
                filteredZones.map((zone) => {
                  const Icon =
                    iconMap[zone.icon as keyof typeof iconMap] || Building;
                  const resourceTypes =
                    zone.zone_resource_types?.map((t) => t.resource_type) || [];

                  return (
                    <div key={zone.id} className="relative group">
                      <Card
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
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="mb-4">
                            {zone.description}
                          </CardDescription>
                          <div className="space-y-4">
                            <div>
                              <div className="mb-1 flex items-center justify-between">
                                <span className="text-sm font-medium">
                                  Tax Rate
                                </span>
                                <span className="text-sm text-stone-500">
                                  {zone.tax_rate}%
                                </span>
                              </div>
                              <Progress value={zone.tax_rate} className="h-2" />
                            </div>
                            <div>
                              <div className="mb-1 flex items-center justify-between">
                                <span className="text-sm font-medium">
                                  Occupancy
                                </span>
                                <span className="text-sm text-stone-500">
                                  {zone.occupancy_rate}%
                                </span>
                              </div>
                              <Progress
                                value={zone.occupancy_rate}
                                className="h-2"
                              />
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
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleEditZone(zone);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit {zone.name}</span>
                      </Button>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

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
      </CardContent>
    </Card>
  );
}
