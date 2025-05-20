"use client";

import { useState } from "react";
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

// Sample data for city zones
const cityZones = [
  {
    id: 1,
    name: "Residential Zone",
    icon: Home,
    description: "Living spaces and community areas for residents",
    taxRate: 10,
    resourceCount: 24,
    occupancyRate: 85,
    resourceTypes: ["Apartments", "Shared Houses", "Laundry Facilities"],
    totalValue: 12500,
    dailyTaxRevenue: 1250,
    eligibilityRules: ["ZuPassport Holders", "Approved Residents"],
    customHooks: ["Residential Verification", "Minimum Stay Requirements"],
  },
  {
    id: 2,
    name: "Innovation Zone",
    icon: Laptop,
    description: "Workspaces and labs for research and development",
    taxRate: 8,
    resourceCount: 18,
    occupancyRate: 70,
    resourceTypes: ["Coworking Desks", "Meeting Rooms", "Wet Labs"],
    totalValue: 8200,
    dailyTaxRevenue: 656,
    eligibilityRules: ["Researchers", "Builders", "Contributors"],
    customHooks: ["Role Verification", "Project Contribution Requirements"],
  },
  {
    id: 3,
    name: "Community Hub",
    icon: Users,
    description: "Gathering spaces for events and collaboration",
    taxRate: 12,
    resourceCount: 10,
    occupancyRate: 60,
    resourceTypes: ["Event Spaces", "Workshop Areas", "Community Kitchen"],
    totalValue: 6000,
    dailyTaxRevenue: 720,
    eligibilityRules: ["All Community Members"],
    customHooks: ["Event Scheduling", "Community Contribution"],
  },
  {
    id: 4,
    name: "Mobility Hub",
    icon: Building,
    description: "Transportation resources for the community",
    taxRate: 15,
    resourceCount: 15,
    occupancyRate: 75,
    resourceTypes: ["Electric Cars", "E-Bikes", "Scooters"],
    totalValue: 9500,
    dailyTaxRevenue: 1425,
    eligibilityRules: ["Licensed Drivers", "Safety Certified Members"],
    customHooks: ["License Verification", "Usage Tracking"],
  },
  {
    id: 5,
    name: "Wellness Area",
    icon: Coffee,
    description: "Spaces for health, fitness, and relaxation",
    taxRate: 7,
    resourceCount: 12,
    occupancyRate: 65,
    resourceTypes: ["Gym Equipment", "Meditation Rooms", "Yoga Studios"],
    totalValue: 5200,
    dailyTaxRevenue: 364,
    eligibilityRules: ["All Community Members"],
    customHooks: ["Booking Limits", "Shared Usage Rules"],
  },
];

export function ZonesOverview() {
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [zoneToEdit, setZoneToEdit] = useState<any>(null);

  const handleZoneClick = (zone: any) => {
    setSelectedZone(zone);
    setIsDetailsDialogOpen(true);
  };

  const handleAddZone = () => {
    setZoneToEdit(null);
    setIsFormDialogOpen(true);
  };

  const handleEditZone = (zone: any) => {
    setZoneToEdit(zone);
    setIsFormDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Dynamic City Zones</CardTitle>
            <CardDescription>
              Each zone has its own Harberger tax rate, eligibility rules, and
              custom hooks for resource allocation.
            </CardDescription>
          </div>
          <Button
            onClick={handleAddZone}
            className="bg-stone-800 text-white hover:bg-stone-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Zone
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
              <p className="text-sm text-stone-600">
                <strong>Total Zones:</strong> {cityZones.length}
              </p>
            </div>
            <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
              <p className="text-sm text-stone-600">
                <strong>Total Resources:</strong>{" "}
                {cityZones.reduce((acc, zone) => acc + zone.resourceCount, 0)}
              </p>
            </div>
            <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
              <p className="text-sm text-stone-600">
                <strong>Daily Tax Revenue:</strong>{" "}
                {cityZones.reduce((acc, zone) => acc + zone.dailyTaxRevenue, 0)}{" "}
                DAI
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cityZones.map((zone) => (
          <div key={zone.id} className="relative group">
            <Card className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-start space-x-3">
                  <div className="rounded-full bg-stone-100 p-2">
                    <zone.icon className="h-5 w-5 text-stone-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-medium">
                      {zone.name}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {zone.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="mb-3 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-600">Tax Rate:</span>
                    <span className="font-medium">{zone.taxRate}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-600">Resources:</span>
                    <span className="font-medium">{zone.resourceCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-600">Daily Revenue:</span>
                    <span className="font-medium">
                      {zone.dailyTaxRevenue} DAI
                    </span>
                  </div>
                </div>

                <div className="mb-3 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-500">Occupancy Rate:</span>
                    <span className="text-stone-500">
                      {zone.occupancyRate}%
                    </span>
                  </div>
                  <Progress value={zone.occupancyRate} className="h-1.5" />
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-stone-600">
                    Resource Types:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {zone.resourceTypes.map((type) => (
                      <Badge
                        key={type}
                        variant="outline"
                        className="text-xs font-normal"
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <div className="border-t border-stone-100 p-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => handleZoneClick(zone)}
                >
                  View Zone Details
                </Button>
              </div>
            </Card>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white"
              onClick={(e) => {
                e.stopPropagation();
                handleEditZone(zone);
              }}
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit {zone.name}</span>
            </Button>
          </div>
        ))}
      </div>

      {selectedZone && (
        <ZoneDetailsDialog
          zone={selectedZone}
          open={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
        />
      )}

      <ZoneFormDialog
        open={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        zone={zoneToEdit}
      />
    </div>
  );
}
