"use client";

import { useState } from "react";
import {
  AlertCircle,
  Check,
  Code,
  Shield,
  Users,
  Edit,
  Save,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import type { Zone } from "@/lib/api";

interface ZoneWithTypes extends Zone {
  zone_resource_types?: Array<{ resource_type: string }>;
  zone_eligibility_rules?: Array<{ rule: string }>;
}

interface ZoneDetailsDialogProps {
  zone: ZoneWithTypes;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onZoneUpdated?: () => void;
}

export function ZoneDetailsDialog({
  zone,
  open,
  onOpenChange,
  onZoneUpdated,
}: ZoneDetailsDialogProps) {
  console.log("Zone data in dialog:", zone);

  if (!zone) {
    console.error("No zone data provided to dialog");
    return null;
  }

  const [isEditing, setIsEditing] = useState(false);
  const [editedZone, setEditedZone] = useState(zone);
  const resourceTypes =
    zone.zone_resource_types?.map((t) => t.resource_type) || [];
  const eligibilityRules =
    zone.zone_eligibility_rules?.map((r) => r.rule) || [];
  const customHooks = zone.custom_hooks || [];

  const handleSave = async () => {
    try {
      // Ensure we're not sending undefined values
      const updates: Partial<Zone> = {
        name: editedZone.name,
        description: editedZone.description || undefined,
        tax_rate: editedZone.tax_rate,
        icon: editedZone.icon,
      };

      await api.zones.update(zone.id, updates);
      setIsEditing(false);
      onZoneUpdated?.();
    } catch (error) {
      console.error("Failed to update zone:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="rounded-full bg-stone-100 p-2">
                <Users className="h-5 w-5 text-stone-600" />
              </div>
              {isEditing ? (
                <Input
                  value={editedZone.name}
                  onChange={(e) =>
                    setEditedZone({ ...editedZone, name: e.target.value })
                  }
                  className="text-xl font-semibold"
                />
              ) : (
                <DialogTitle className="text-xl">{zone.name}</DialogTitle>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            >
              {isEditing ? (
                <Save className="h-4 w-4" />
              ) : (
                <Edit className="h-4 w-4" />
              )}
            </Button>
          </div>
          {isEditing ? (
            <Textarea
              value={editedZone.description || ""}
              onChange={(e) =>
                setEditedZone({ ...editedZone, description: e.target.value })
              }
              className="mt-2"
            />
          ) : (
            <DialogDescription>
              {zone.description || "No description available"}
            </DialogDescription>
          )}
        </DialogHeader>

        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
            <TabsTrigger value="hooks">Custom Hooks</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 pt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Tax Rate</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editedZone.tax_rate}
                    onChange={(e) =>
                      setEditedZone({
                        ...editedZone,
                        tax_rate: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="text-2xl font-bold"
                  />
                ) : (
                  <p className="text-2xl font-bold">{zone.tax_rate || 0}%</p>
                )}
                <p className="text-xs text-stone-500">
                  Applied to all resources in this zone
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Resource Types</CardTitle>
                <CardDescription>Available in this zone</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {resourceTypes.length > 0 ? (
                    resourceTypes.map((type: string) => (
                      <Badge
                        key={type}
                        className="bg-stone-100 text-stone-800 hover:bg-stone-200"
                      >
                        {type}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-stone-500">
                      No resource types defined
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Zone Governance</AlertTitle>
              <AlertDescription>
                Tax revenue from this zone is allocated to zone maintenance and
                community resources. Governance weight for zone decisions is
                proportional to tax payments within the zone.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="eligibility" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Eligibility Rules
                </CardTitle>
                <CardDescription>
                  Who can claim resources in this zone
                </CardDescription>
              </CardHeader>
              <CardContent>
                {eligibilityRules.length > 0 ? (
                  <ul className="space-y-2">
                    {eligibilityRules.map((rule: string) => (
                      <li key={rule} className="flex items-start">
                        <Check className="mr-2 h-4 w-4 text-green-600" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-stone-500">
                    No eligibility rules defined
                  </p>
                )}
              </CardContent>
            </Card>

            <Alert className="bg-stone-50">
              <Shield className="h-4 w-4" />
              <AlertTitle>Verification Process</AlertTitle>
              <AlertDescription>
                Eligibility is verified through SBT attestations and on-chain
                identity verification. This ensures resources are allocated to
                qualified community members.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="hooks" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="mr-2 h-5 w-5" />
                  Custom Hook Contracts
                </CardTitle>
                <CardDescription>
                  Special rules for resource allocation in this zone
                </CardDescription>
              </CardHeader>
              <CardContent>
                {customHooks.length > 0 ? (
                  <ul className="space-y-2">
                    {customHooks.map((hook: string) => (
                      <li key={hook} className="flex items-start">
                        <div className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-stone-400"></div>
                        <div>
                          <p className="font-medium">{hook}</p>
                          <p className="text-sm text-stone-500">
                            Custom logic to enforce zone-specific rules and
                            requirements
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-stone-500">
                    No custom hooks defined
                  </p>
                )}
              </CardContent>
            </Card>

            <Alert className="bg-amber-50 text-amber-800">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Developer Note</AlertTitle>
              <AlertDescription>
                Custom hooks are implemented as smart contracts that interact
                with the Harberger tax system. They can modify eligibility,
                pricing, and tax rates based on zone-specific requirements.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
