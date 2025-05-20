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
  onResourceCreated?: () => Promise<void>;
}

interface FormData {
  name: string;
  description: string;
  type: string;
  zone_id: string;
  location: string;
  current_value: number;
  daily_tax: number;
  depreciating: boolean;
  original_value: number;
  depreciation_rate: number;
  amenities: string[];
  min_holding_period: number;
  min_holding_period_unit: string;
  has_min_holding_period: boolean;
  release_notice: number;
  release_notice_unit: string;
}

export function ResourceFormDialog({
  open,
  onOpenChange,
  resource,
  cityZones,
  onResourceCreated,
}: ResourceFormDialogProps) {
  const isEditing = !!resource;

  // Default empty form data for new resources
  const defaultFormData: FormData = {
    name: "",
    description: "",
    type: "",
    zone_id: "",
    location: "",
    current_value: 0,
    daily_tax: 0,
    depreciating: false,
    original_value: 0,
    depreciation_rate: 0,
    amenities: [],
    min_holding_period: 0,
    min_holding_period_unit: "days",
    has_min_holding_period: false,
    release_notice: 0,
    release_notice_unit: "days",
  };

  const [formData, setFormData] = useState<FormData>(
    isEditing && resource
      ? {
          name: resource.name || "",
          description: resource.description || "",
          type: resource.type || "",
          zone_id: resource.zone_id || "",
          location: resource.location || "",
          current_value: resource.current_value || 0,
          daily_tax: resource.daily_tax || 0,
          depreciating: resource.depreciating || false,
          original_value: resource.original_value || 0,
          depreciation_rate: resource.depreciation_rate || 0,
          amenities:
            resource.resource_amenities?.map((a: { name: string }) => a.name) ||
            [],
          min_holding_period: resource.min_holding_period || 0,
          min_holding_period_unit: resource.min_holding_period_unit || "days",
          has_min_holding_period: resource.has_min_holding_period || false,
          release_notice: resource.release_notice || 0,
          release_notice_unit: resource.release_notice_unit || "days",
        }
      : defaultFormData
  );

  // Reset form data when resource prop changes or when switching between edit/new modes
  useEffect(() => {
    if (isEditing && resource) {
      setFormData({
        name: resource.name || "",
        description: resource.description || "",
        type: resource.type || "",
        zone_id: resource.zone_id || "",
        location: resource.location || "",
        current_value: resource.current_value || 0,
        daily_tax: resource.daily_tax || 0,
        depreciating: resource.depreciating || false,
        original_value: resource.original_value || 0,
        depreciation_rate: resource.depreciation_rate || 0,
        amenities:
          resource.resource_amenities?.map((a: { name: string }) => a.name) ||
          [],
        min_holding_period: resource.min_holding_period || 0,
        min_holding_period_unit: resource.min_holding_period_unit || "days",
        has_min_holding_period: resource.has_min_holding_period || false,
        release_notice: resource.release_notice || 0,
        release_notice_unit: resource.release_notice_unit || "days",
      });
    } else {
      setFormData(defaultFormData);
    }
  }, [resource, isEditing, cityZones]);

  const [newAmenity, setNewAmenity] = useState("");
  const [proposalCreated, setProposalCreated] = useState(false);

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
      amenities: prev.amenities.filter((a) => a !== amenity),
    }));
  };

  const handleSubmit = async () => {
    try {
      // In a real app, this would send the data to the backend
      console.log("Resource form submitted:", formData);

      // Simulate creating a proposal
      setProposalCreated(true);

      // Call the onResourceCreated callback if provided
      if (onResourceCreated) {
        await onResourceCreated();
      }

      // In a real app, we would redirect to the proposal page or show a success message
      setTimeout(() => {
        setProposalCreated(false);
        onOpenChange(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to create/update resource:", error);
    }
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="current_value" className="text-right">
                  Current Value
                </Label>
                <Input
                  id="current_value"
                  type="number"
                  value={formData.current_value}
                  onChange={(e) =>
                    handleChange("current_value", parseFloat(e.target.value))
                  }
                  className="col-span-3"
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="depreciating" className="text-right">
                  Enable
                </Label>
                <div className="col-span-3">
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
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="original_value" className="text-right">
                      Original Value
                    </Label>
                    <Input
                      id="original_value"
                      type="number"
                      value={formData.original_value}
                      onChange={(e) =>
                        handleChange(
                          "original_value",
                          parseFloat(e.target.value)
                        )
                      }
                      className="col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="depreciation_rate" className="text-right">
                      Depreciation Rate
                    </Label>
                    <Input
                      id="depreciation_rate"
                      type="number"
                      value={formData.depreciation_rate}
                      onChange={(e) =>
                        handleChange(
                          "depreciation_rate",
                          parseFloat(e.target.value)
                        )
                      }
                      className="col-span-3"
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="has_min_holding_period" className="text-right">
                  Enable Minimum Holding Period
                </Label>
                <Switch
                  id="has_min_holding_period"
                  checked={formData.has_min_holding_period}
                  onCheckedChange={(checked) =>
                    handleChange("has_min_holding_period", checked)
                  }
                />
              </div>

              {formData.has_min_holding_period && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="min_holding_period" className="text-right">
                    Minimum Holding Period
                  </Label>
                  <div className="col-span-3 flex gap-2">
                    <Input
                      id="min_holding_period"
                      type="number"
                      value={formData.min_holding_period}
                      onChange={(e) =>
                        handleChange(
                          "min_holding_period",
                          parseInt(e.target.value)
                        )
                      }
                      className="flex-1"
                    />
                    <Select
                      value={formData.min_holding_period_unit}
                      onValueChange={(value) =>
                        handleChange("min_holding_period_unit", value)
                      }
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="weeks">Weeks</SelectItem>
                        <SelectItem value="months">Months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="release_notice" className="text-right">
                  Release Notice Period
                </Label>
                <div className="col-span-3 flex gap-2">
                  <Input
                    id="release_notice"
                    type="number"
                    value={formData.release_notice}
                    onChange={(e) =>
                      handleChange("release_notice", parseInt(e.target.value))
                    }
                    className="flex-1"
                  />
                  <Select
                    value={formData.release_notice_unit}
                    onValueChange={(value) =>
                      handleChange("release_notice_unit", value)
                    }
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="days">Days</SelectItem>
                      <SelectItem value="weeks">Weeks</SelectItem>
                      <SelectItem value="months">Months</SelectItem>
                    </SelectContent>
                  </Select>
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
