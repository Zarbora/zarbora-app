"use client";

import { useState, useEffect } from "react";
import { Building, Car, Home, Shirt, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface ResourceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resource?: any; // For editing existing resource
  cityZones: any[]; // Available city zones
}

export function ResourceFormDialog({
  open,
  onOpenChange,
  resource,
  cityZones,
}: ResourceFormDialogProps) {
  const isEditing = !!resource;
  const [formData, setFormData] = useState(() => ({
    name: resource?.name || "",
    type: resource?.type || "housing",
    description: resource?.description || "",
    location: resource?.location || cityZones[0]?.name || "",
    currentValue: resource?.currentValue || 100,
    dailyTax: resource?.dailyTax || 10,
    depreciating: resource?.depreciating || false,
    originalValue: resource?.originalValue || 120,
    depreciationRate: resource?.depreciationRate || 5,
    amenities: resource?.amenities || [],
    minHoldingPeriod: resource?.minHoldingPeriod || 30,
    minHoldingPeriodUnit: resource?.minHoldingPeriodUnit || "days",
    hasMinHoldingPeriod: resource?.hasMinHoldingPeriod || true,
    releaseNotice: resource?.releaseNotice || 7,
    releaseNoticeUnit: resource?.releaseNoticeUnit || "days",
  }));
  const [newAmenity, setNewAmenity] = useState("");
  const [proposalCreated, setProposalCreated] = useState(false);

  // Reset form data when resource changes
  useEffect(() => {
    if (resource) {
      setFormData({
        name: resource.name,
        type: resource.type,
        description: resource.description,
        location: resource.location,
        currentValue: resource.currentValue,
        dailyTax: resource.dailyTax,
        depreciating: resource.depreciating,
        originalValue: resource.originalValue,
        depreciationRate: resource.depreciationRate,
        amenities: resource.amenities,
        minHoldingPeriod: resource.minHoldingPeriod || 30,
        minHoldingPeriodUnit: resource.minHoldingPeriodUnit || "days",
        hasMinHoldingPeriod: resource.hasMinHoldingPeriod || true,
        releaseNotice: resource.releaseNotice || 7,
        releaseNoticeUnit: resource.releaseNoticeUnit || "days",
      });
    }
  }, [resource]);

  const resourceTypes = [
    { value: "housing", label: "Housing", icon: Home },
    { value: "workspace", label: "Workspace", icon: Building },
    { value: "vehicle", label: "Vehicle", icon: Car },
    { value: "utility", label: "Utility", icon: Shirt },
  ];

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()],
      }));
      setNewAmenity("");
    }
  };

  const removeAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((a: any) => a !== amenity),
    }));
  };

  const handleSubmit = () => {
    // In a real app, this would send the data to the backend
    console.log("Resource form submitted:", formData);

    // Simulate creating a proposal
    setProposalCreated(true);

    // In a real app, we would redirect to the proposal page or show a success message
    setTimeout(() => {
      setProposalCreated(false);
      onOpenChange(false);
    }, 3000);
  };

  const getIconForType = (type: string) => {
    const found = resourceTypes.find((t) => t.value === type);
    return found ? found.icon : Home;
  };

  const ResourceIcon = getIconForType(formData.type);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="px-2">
          <DialogTitle className="text-2xl">
            {isEditing ? "Edit Resource" : "Add New Resource"}
          </DialogTitle>
          <DialogDescription className="text-base">
            {isEditing
              ? "Update the details of this resource. Changes will require governance approval."
              : "Create a new resource for the city. This will create a governance proposal."}
          </DialogDescription>
        </DialogHeader>

        {proposalCreated ? (
          <div className="p-6">
            <Alert className="bg-green-50 text-green-800">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Proposal Created Successfully</AlertTitle>
              <AlertDescription>
                Your {isEditing ? "resource update" : "new resource"} proposal
                has been submitted to governance for voting. You can track its
                status in the Governance section.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className="space-y-8 px-2 py-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4">
                <Label htmlFor="name" className="sm:text-right sm:pt-2">
                  Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="sm:col-span-3"
                  placeholder="Enter resource name"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4">
                <Label htmlFor="type" className="sm:text-right sm:pt-2">
                  Type
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleChange("type", value)}
                >
                  <SelectTrigger id="type" className="sm:col-span-3">
                    <SelectValue placeholder="Select resource type" />
                  </SelectTrigger>
                  <SelectContent>
                    {resourceTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center">
                          <type.icon className="mr-2 h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4">
                <Label htmlFor="description" className="sm:text-right sm:pt-2">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="sm:col-span-3 min-h-[100px] resize-none"
                  placeholder="Describe the resource"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4">
                <Label htmlFor="location" className="sm:text-right sm:pt-2">
                  Location
                </Label>
                <Select
                  value={formData.location}
                  onValueChange={(value) => handleChange("location", value)}
                >
                  <SelectTrigger id="location" className="sm:col-span-3">
                    <SelectValue placeholder="Select zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {cityZones.map((zone) => (
                      <SelectItem key={zone.id} value={zone.name}>
                        {zone.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Value and Tax */}
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h3 className="font-medium text-lg">Value and Tax</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4">
                <Label htmlFor="currentValue" className="sm:text-right sm:pt-2">
                  Initial Value (DAI)
                </Label>
                <Input
                  id="currentValue"
                  type="number"
                  value={formData.currentValue}
                  onChange={(e) =>
                    handleChange("currentValue", Number(e.target.value))
                  }
                  min={0}
                  className="sm:col-span-3"
                />
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h3 className="font-medium text-lg">Amenities</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4">
                <Label className="sm:text-right sm:pt-2">Features</Label>
                <div className="sm:col-span-3 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {formData.amenities.map((amenity: string) => (
                      <Badge
                        key={amenity}
                        variant="outline"
                        className="flex items-center gap-1 py-1.5 px-3 text-sm"
                      >
                        {amenity}
                        <button
                          type="button"
                          onClick={() => removeAmenity(amenity)}
                          className="ml-1.5 rounded-full hover:bg-stone-200 p-0.5 transition-colors"
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove {amenity}</span>
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add amenity"
                      value={newAmenity}
                      onChange={(e) => setNewAmenity(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addAmenity();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addAmenity}
                      className="shrink-0"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Depreciation */}
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h3 className="font-medium text-lg">Depreciation Settings</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4">
                <Label htmlFor="depreciating" className="sm:text-right sm:pt-2">
                  Enable
                </Label>
                <div className="sm:col-span-3">
                  <Select
                    value={formData.depreciating ? "yes" : "no"}
                    onValueChange={(value) =>
                      handleChange("depreciating", value === "yes")
                    }
                  >
                    <SelectTrigger id="depreciating">
                      <SelectValue placeholder="Enable depreciation?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">
                        Yes, enable depreciation
                      </SelectItem>
                      <SelectItem value="no">No depreciation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.depreciating && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4">
                    <Label
                      htmlFor="originalValue"
                      className="sm:text-right sm:pt-2"
                    >
                      Original Value (DAI)
                    </Label>
                    <Input
                      id="originalValue"
                      type="number"
                      value={formData.originalValue}
                      onChange={(e) =>
                        handleChange("originalValue", Number(e.target.value))
                      }
                      min={0}
                      className="sm:col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4">
                    <Label
                      htmlFor="depreciationRate"
                      className="sm:text-right sm:pt-2"
                    >
                      Daily Depreciation (DAI)
                    </Label>
                    <Input
                      id="depreciationRate"
                      type="number"
                      value={formData.depreciationRate}
                      onChange={(e) =>
                        handleChange("depreciationRate", Number(e.target.value))
                      }
                      min={0}
                      className="sm:col-span-3"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Release Constraints */}
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h3 className="font-medium text-lg">Release Constraints</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4">
                <Label className="sm:text-right sm:pt-2">
                  Minimum Holding Period
                </Label>
                <div className="sm:col-span-3 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.hasMinHoldingPeriod}
                      onCheckedChange={(checked) =>
                        handleChange("hasMinHoldingPeriod", checked)
                      }
                    />
                    <Label>Require minimum holding period</Label>
                  </div>
                  {formData.hasMinHoldingPeriod && (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={formData.minHoldingPeriod}
                        onChange={(e) =>
                          handleChange(
                            "minHoldingPeriod",
                            Number(e.target.value)
                          )
                        }
                        min={1}
                        className="w-24"
                      />
                      <Select
                        value={formData.minHoldingPeriodUnit}
                        onValueChange={(value) =>
                          handleChange("minHoldingPeriodUnit", value)
                        }
                      >
                        <SelectTrigger className="w-[110px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minutes">Minutes</SelectItem>
                          <SelectItem value="hours">Hours</SelectItem>
                          <SelectItem value="days">Days</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="text-sm text-muted-foreground">
                        minimum holding time
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4">
                <Label
                  htmlFor="releaseNotice"
                  className="sm:text-right sm:pt-2"
                >
                  Release Notice
                </Label>
                <div className="sm:col-span-3 flex items-center gap-2">
                  <Input
                    id="releaseNotice"
                    type="number"
                    value={formData.releaseNotice}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value >= 1) {
                        handleChange("releaseNotice", value);
                      }
                    }}
                    min={1}
                    required
                    className="w-24"
                  />
                  <Select
                    value={formData.releaseNoticeUnit}
                    onValueChange={(value) =>
                      handleChange("releaseNoticeUnit", value)
                    }
                  >
                    <SelectTrigger className="w-[110px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minutes">Minutes</SelectItem>
                      <SelectItem value="hours">Hours</SelectItem>
                      <SelectItem value="days">Days</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="text-sm text-muted-foreground">
                    notice required before release
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="px-2 py-4 gap-2">
          {!proposalCreated && (
            <>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 sm:flex-none"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-stone-800 text-white hover:bg-stone-700 flex-1 sm:flex-none"
              >
                {isEditing ? "Submit Changes for Approval" : "Create Proposal"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
