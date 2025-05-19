"use client"

import { useState } from "react"
import { Building, Coffee, Home, Laptop, Users, AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"

interface ZoneFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  zone?: any // For editing existing zone
}

export function ZoneFormDialog({ open, onOpenChange, zone }: ZoneFormDialogProps) {
  const isEditing = !!zone
  const [formData, setFormData] = useState({
    name: zone?.name || "",
    description: zone?.description || "",
    icon: zone?.icon || "Home",
    taxRate: zone?.taxRate || 10,
    resourceTypes: zone?.resourceTypes || [],
    eligibilityRules: zone?.eligibilityRules || [],
    customHooks: zone?.customHooks || [],
  })
  const [newResourceType, setNewResourceType] = useState("")
  const [newEligibilityRule, setNewEligibilityRule] = useState("")
  const [newCustomHook, setNewCustomHook] = useState("")
  const [proposalCreated, setProposalCreated] = useState(false)

  const zoneIcons = [
    { value: "Home", label: "Residential", icon: Home },
    { value: "Laptop", label: "Innovation", icon: Laptop },
    { value: "Users", label: "Community", icon: Users },
    { value: "Building", label: "Mobility", icon: Building },
    { value: "Coffee", label: "Wellness", icon: Coffee },
  ]

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addResourceType = () => {
    if (newResourceType.trim() && !formData.resourceTypes.includes(newResourceType.trim())) {
      setFormData((prev) => ({
        ...prev,
        resourceTypes: [...prev.resourceTypes, newResourceType.trim()],
      }))
      setNewResourceType("")
    }
  }

  const removeResourceType = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      resourceTypes: prev.resourceTypes.filter((t) => t !== type),
    }))
  }

  const addEligibilityRule = () => {
    if (newEligibilityRule.trim() && !formData.eligibilityRules.includes(newEligibilityRule.trim())) {
      setFormData((prev) => ({
        ...prev,
        eligibilityRules: [...prev.eligibilityRules, newEligibilityRule.trim()],
      }))
      setNewEligibilityRule("")
    }
  }

  const removeEligibilityRule = (rule: string) => {
    setFormData((prev) => ({
      ...prev,
      eligibilityRules: prev.eligibilityRules.filter((r) => r !== rule),
    }))
  }

  const addCustomHook = () => {
    if (newCustomHook.trim() && !formData.customHooks.includes(newCustomHook.trim())) {
      setFormData((prev) => ({
        ...prev,
        customHooks: [...prev.customHooks, newCustomHook.trim()],
      }))
      setNewCustomHook("")
    }
  }

  const removeCustomHook = (hook: string) => {
    setFormData((prev) => ({
      ...prev,
      customHooks: prev.customHooks.filter((h) => h !== hook),
    }))
  }

  const handleSubmit = () => {
    // In a real app, this would send the data to the backend
    console.log("Zone form submitted:", formData)

    // Simulate creating a proposal
    setProposalCreated(true)

    // In a real app, we would redirect to the proposal page or show a success message
    setTimeout(() => {
      setProposalCreated(false)
      onOpenChange(false)
    }, 3000)
  }

  const getIconComponent = (iconName: string) => {
    const found = zoneIcons.find((i) => i.value === iconName)
    return found ? found.icon : Home
  }

  const ZoneIcon = getIconComponent(formData.icon)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit City Zone" : "Add New City Zone"}</DialogTitle>
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
                Your {isEditing ? "zone update" : "new zone"} proposal has been submitted to governance for voting. You
                can track its status in the Governance section.
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
              <Select value={formData.icon} onValueChange={(value) => handleChange("icon", value)}>
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
              <Label htmlFor="taxRate" className="text-right">
                Tax Rate (%)
              </Label>
              <div className="col-span-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-stone-500">Lower</span>
                  <span className="text-sm font-medium">{formData.taxRate}%</span>
                  <span className="text-sm text-stone-500">Higher</span>
                </div>
                <Slider
                  id="taxRate"
                  min={1}
                  max={20}
                  step={1}
                  value={[formData.taxRate]}
                  onValueChange={(value) => handleChange("taxRate", value[0])}
                />
                <p className="text-xs text-stone-500">This tax rate will be applied to all resources in this zone.</p>
              </div>
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Resource Types</Label>
              <div className="col-span-3 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {formData.resourceTypes.map((type: string) => (
                    <Badge key={type} variant="outline" className="flex items-center gap-1">
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
                        e.preventDefault()
                        addResourceType()
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={addResourceType}>
                    Add
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Eligibility Rules</Label>
              <div className="col-span-3 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {formData.eligibilityRules.map((rule: string) => (
                    <Badge key={rule} variant="outline" className="flex items-center gap-1">
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
                        e.preventDefault()
                        addEligibilityRule()
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={addEligibilityRule}>
                    Add
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Custom Hooks</Label>
              <div className="col-span-3 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {formData.customHooks.map((hook: string) => (
                    <Badge key={hook} variant="outline" className="flex items-center gap-1">
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
                        e.preventDefault()
                        addCustomHook()
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={addCustomHook}>
                    Add
                  </Button>
                </div>
                <p className="text-xs text-stone-500">
                  Custom hooks are smart contracts that modify eligibility, pricing, and tax rates.
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
              <Button onClick={handleSubmit}>{isEditing ? "Submit Changes for Approval" : "Create Proposal"}</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
