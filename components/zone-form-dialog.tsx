"use client";

import { useState, useEffect } from "react";
import {
  Building,
  Coffee,
  Home,
  Laptop,
  Users,
  AlertCircle,
  X,
} from "lucide-react";
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
import { Slider } from "@/components/ui/slider";
import type { Zone } from "@/lib/api";

interface ZoneFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  zone?: Zone;
  onZoneUpdated?: () => void;
}

interface FormData {
  name: string;
  description: string;
  icon: string;
  tax_rate: number;
  resource_types: string[];
  eligibility_rules: string[];
  custom_hooks: string[];
}

export function ZoneFormDialog({
  open,
  onOpenChange,
  zone,
  onZoneUpdated,
}: ZoneFormDialogProps) {
  const isEditing = !!zone;

  // Default empty form data for new zones
  const defaultFormData: FormData = {
    name: "",
    description: "",
    icon: "Home",
    tax_rate: 10,
    resource_types: [],
    eligibility_rules: [],
    custom_hooks: [],
  };

  const [formData, setFormData] = useState<FormData>(
    isEditing
      ? {
          name: zone?.name || "",
          description: zone?.description || "",
          icon: zone?.icon || "Home",
          tax_rate: zone?.tax_rate || 10,
          resource_types:
            zone?.zone_resource_types?.map(
              (t: { resource_type: string }) => t.resource_type
            ) || [],
          eligibility_rules:
            zone?.zone_eligibility_rules?.map(
              (r: { rule: string }) => r.rule
            ) || [],
          custom_hooks: zone?.custom_hooks || [],
        }
      : defaultFormData
  );

  // Reset form data when zone prop changes or when switching between edit/new modes
  useEffect(() => {
    if (isEditing && zone) {
      setFormData({
        name: zone.name,
        description: zone.description || "",
        icon: zone.icon,
        tax_rate: zone.tax_rate,
        resource_types:
          zone.zone_resource_types?.map(
            (t: { resource_type: string }) => t.resource_type
          ) || [],
        eligibility_rules:
          zone.zone_eligibility_rules?.map((r: { rule: string }) => r.rule) ||
          [],
        custom_hooks: zone.custom_hooks || [],
      });
    } else {
      setFormData(defaultFormData);
    }
  }, [zone, isEditing]);

  const [newResourceType, setNewResourceType] = useState("");
  const [newEligibilityRule, setNewEligibilityRule] = useState("");
  const [newCustomHook, setNewCustomHook] = useState("");
  const [proposalCreated, setProposalCreated] = useState(false);

  const zoneIcons = [
    { value: "Home", label: "Residential", icon: Home },
    { value: "Laptop", label: "Innovation", icon: Laptop },
    { value: "Users", label: "Community", icon: Users },
    { value: "Building", label: "Mobility", icon: Building },
    { value: "Coffee", label: "Wellness", icon: Coffee },
  ];

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addResourceType = () => {
    if (
      newResourceType.trim() &&
      !formData.resource_types.includes(newResourceType.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        resource_types: [...prev.resource_types, newResourceType.trim()],
      }));
      setNewResourceType("");
    }
  };

  const removeResourceType = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      resource_types: prev.resource_types.filter((t) => t !== type),
    }));
  };

  const addEligibilityRule = () => {
    if (
      newEligibilityRule.trim() &&
      !formData.eligibility_rules.includes(newEligibilityRule.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        eligibility_rules: [
          ...prev.eligibility_rules,
          newEligibilityRule.trim(),
        ],
      }));
      setNewEligibilityRule("");
    }
  };

  const removeEligibilityRule = (rule: string) => {
    setFormData((prev) => ({
      ...prev,
      eligibility_rules: prev.eligibility_rules.filter((r) => r !== rule),
    }));
  };

  const addCustomHook = () => {
    if (
      newCustomHook.trim() &&
      !formData.custom_hooks.includes(newCustomHook.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        custom_hooks: [...prev.custom_hooks, newCustomHook.trim()],
      }));
      setNewCustomHook("");
    }
  };

  const removeCustomHook = (hook: string) => {
    setFormData((prev) => ({
      ...prev,
      custom_hooks: prev.custom_hooks.filter((h) => h !== hook),
    }));
  };

  const handleSubmit = () => {
    // In a real app, this would send the data to the backend
    console.log("Zone form submitted:", formData);

    // Simulate creating a proposal
    setProposalCreated(true);

    // In a real app, we would redirect to the proposal page or show a success message
    setTimeout(() => {
      setProposalCreated(false);
      onOpenChange(false);
      onZoneUpdated?.();
    }, 3000);
  };

  const getIconComponent = (iconName: string) => {
    const found = zoneIcons.find((i) => i.value === iconName);
    return found ? found.icon : Home;
  };

  const ZoneIcon = getIconComponent(formData.icon);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit City Zone" : "Add New City Zone"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of this city zone. Changes will require governance approval."
              : "Create a new city zone. This will create a governance proposal."}
          </DialogDescription>
        </DialogHeader>

        {proposalCreated ? (
          <div className="py-6">
            <Alert className="bg-green-50 text-green-800">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Proposal Created Successfully</AlertTitle>
              <AlertDescription>
                Your {isEditing ? "zone update" : "new zone"} proposal has been
                submitted to governance for voting. You can track its status in
                the Governance section.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Zone Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="icon" className="text-right">
                Zone Icon
              </Label>
              <Select
                value={formData.icon}
                onValueChange={(value) => handleChange("icon", value)}
              >
                <SelectTrigger id="icon" className="col-span-3">
                  <SelectValue placeholder="Select zone icon" />
                </SelectTrigger>
                <SelectContent>
                  {zoneIcons.map((icon) => (
                    <SelectItem key={icon.value} value={icon.value}>
                      <div className="flex items-center">
                        <icon.icon className="mr-2 h-4 w-4" />
                        {icon.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tax_rate" className="text-right">
                Tax Rate (%)
              </Label>
              <div className="col-span-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-stone-500">Lower</span>
                  <span className="text-sm font-medium">
                    {formData.tax_rate}%
                  </span>
                  <span className="text-sm text-stone-500">Higher</span>
                </div>
                <Slider
                  id="tax_rate"
                  min={1}
                  max={20}
                  step={1}
                  value={[formData.tax_rate]}
                  onValueChange={(value) => handleChange("tax_rate", value[0])}
                />
                <p className="text-xs text-stone-500">
                  This tax rate will be applied to all resources in this zone.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Resource Types</Label>
              <div className="col-span-3 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {formData.resource_types.map((type: string) => (
                    <Badge
                      key={type}
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      {type}
                      <button
                        type="button"
                        onClick={() => removeResourceType(type)}
                        className="ml-1 rounded-full p-0.5 hover:bg-stone-200"
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {type}</span>
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add resource type"
                    value={newResourceType}
                    onChange={(e) => setNewResourceType(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addResourceType();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addResourceType}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Eligibility Rules</Label>
              <div className="col-span-3 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {formData.eligibility_rules.map((rule: string) => (
                    <Badge
                      key={rule}
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      {rule}
                      <button
                        type="button"
                        onClick={() => removeEligibilityRule(rule)}
                        className="ml-1 rounded-full p-0.5 hover:bg-stone-200"
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {rule}</span>
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add eligibility rule"
                    value={newEligibilityRule}
                    onChange={(e) => setNewEligibilityRule(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addEligibilityRule();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addEligibilityRule}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Custom Hooks</Label>
              <div className="col-span-3 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {formData.custom_hooks.map((hook: string) => (
                    <Badge
                      key={hook}
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      {hook}
                      <button
                        type="button"
                        onClick={() => removeCustomHook(hook)}
                        className="ml-1 rounded-full p-0.5 hover:bg-stone-200"
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {hook}</span>
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add custom hook"
                    value={newCustomHook}
                    onChange={(e) => setNewCustomHook(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomHook();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addCustomHook}
                  >
                    Add
                  </Button>
                </div>
                <p className="text-xs text-stone-500">
                  Custom hooks are smart contracts that modify eligibility,
                  pricing, and tax rates.
                </p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          {!proposalCreated && (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {isEditing ? "Submit Changes for Approval" : "Create Proposal"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
