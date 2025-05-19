"use client"

import { useState } from "react"
import { Building, Car, Home, Shirt, AlertCircle } from "lucide-react"
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
import { X } from "lucide-react"

interface ResourceFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  resource?: any // For editing existing resource
  cityZones: any[] // Available city zones
}

export function ResourceFormDialog({ open, onOpenChange, resource, cityZones }: ResourceFormDialogProps) {
  const isEditing = !!resource
  const [formData, setFormData] = useState({
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
  })
  const [newAmenity, setNewAmenity] = useState("")
  const [proposalCreated, setProposalCreated] = useState(false)

  const resourceTypes = [
    { value: "housing", label: "Housing", icon: Home },
    { value: "workspace", label: "Workspace", icon: Building },
    { value: "vehicle", label: "Vehicle", icon: Car },
    { value: "utility", label: "Utility", icon: Shirt },
  ]

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()],
      }))
      setNewAmenity("")
    }
  }

  const removeAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((a) => a !== amenity),
    }))
  }

  const handleSubmit = () => {
    // In a real app, this would send the data to the backend
    console.log("Resource form submitted:", formData)

    // Simulate creating a proposal
    setProposalCreated(true)

    // In a real app, we would redirect to the proposal page or show a success message
    setTimeout(() => {
      setProposalCreated(false)
      onOpenChange(false)
    }, 3000)
  }

  const getIconForType = (type: string) => {
    const found = resourceTypes.find((t) => t.value === type)
    return found ? found.icon : Home
  }

  const ResourceIcon = getIconForType(formData.type)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Resource" : "Add New Resource"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of this resource. Changes will require governance approval."
              : "Create a new resource for the city. This will create a governance proposal."}
          </DialogDescription>
        </DialogHeader>

        {proposalCreated ? (
          <div className="py-6">
            <Alert className="bg-green-50 text-green-800">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Proposal Created Successfully</AlertTitle>
              <AlertDescription>
                Your {isEditing ? "resource update" : "new resource"} proposal has been submitted to governance for
                voting. You can track its status in the Governance section.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
                <SelectTrigger id="type" className="col-span-3">
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
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Select value={formData.location} onValueChange={(value) => handleChange("location", value)}>
                <SelectTrigger id="location" className="col-span-3">
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

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="currentValue" className="text-right">
                Initial Value (DAI)
              </Label>
              <Input
                id="currentValue"
                type="number"
                value={formData.currentValue}
                onChange={(e) => handleChange("currentValue", Number(e.target.value))}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Amenities</Label>
              <div className="col-span-3 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {formData.amenities.map((amenity: string) => (
                    <Badge key={amenity} variant="outline" className="flex items-center gap-1">
                      {amenity}
                      <button
                        type="button"
                        onClick={() => removeAmenity(amenity)}
                        className="ml-1 rounded-full p-0.5 hover:bg-stone-200"
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
                        e.preventDefault()
                        addAmenity()
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={addAmenity}>
                    Add
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="depreciating" className="text-right">
                Depreciation
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.depreciating ? "yes" : "no"}
                  onValueChange={(value) => handleChange("depreciating", value === "yes")}
                >
                  <SelectTrigger id="depreciating">
                    <SelectValue placeholder="Enable depreciation?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes, enable depreciation</SelectItem>
                    <SelectItem value="no">No depreciation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.depreciating && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="originalValue" className="text-right">
                    Original Value (DAI)
                  </Label>
                  <Input
                    id="originalValue"
                    type="number"
                    value={formData.originalValue}
                    onChange={(e) => handleChange("originalValue", Number(e.target.value))}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="depreciationRate" className="text-right">
                    Daily Depreciation (DAI)
                  </Label>
                  <Input
                    id="depreciationRate"
                    type="number"
                    value={formData.depreciationRate}
                    onChange={(e) => handleChange("depreciationRate", Number(e.target.value))}
                    className="col-span-3"
                  />
                </div>
              </>
            )}
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
