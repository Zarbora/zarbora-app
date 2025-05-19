"use client"

import { useState } from "react"
import { Building, Car, Home, Search, Bike, Shirt, Plus, Edit } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ResourceCard } from "./resource-card"
import { ResourceDetailsDialog } from "./resource-details-dialog"
import { ResourceFormDialog } from "./resource-form-dialog"
import { Button } from "@/components/ui/button"

// Sample city zones data
const cityZones = [
  {
    id: 1,
    name: "Residential Zone",
    icon: Home,
    description: "Living spaces and community areas for residents",
    taxRate: 10,
  },
  {
    id: 2,
    name: "Innovation Zone",
    icon: Building,
    description: "Workspaces and labs for research and development",
    taxRate: 8,
  },
  {
    id: 3,
    name: "Community Hub",
    icon: Home,
    description: "Gathering spaces for events and collaboration",
    taxRate: 12,
  },
  {
    id: 4,
    name: "Mobility Hub",
    icon: Car,
    description: "Transportation resources for the community",
    taxRate: 15,
  },
  {
    id: 5,
    name: "Wellness Area",
    icon: Home,
    description: "Spaces for health, fitness, and relaxation",
    taxRate: 7,
  },
]

// Sample resource data
const resources = [
  {
    id: 1,
    name: "Apartment 3B",
    type: "housing",
    icon: Home,
    currentValue: 250,
    dailyTax: 25,
    currentOwner: "0x1a2...3b4c",
    ownerName: "Alex Rivera",
    description: "2-bedroom apartment with balcony, close to community kitchen",
    location: "Residential Zone",
    amenities: ["Wifi", "Kitchen", "Workspace"],
    occupancyEnds: "2024-06-15",
    depreciating: false,
  },
  {
    id: 2,
    name: "Coworking Desk #12",
    type: "workspace",
    icon: Building,
    currentValue: 50,
    dailyTax: 5,
    currentOwner: "0x4d5...6e7f",
    ownerName: "Maya Chen",
    description: "Standing desk with dual monitor setup in the main coworking space",
    location: "Innovation Zone",
    amenities: ["Ergonomic Chair", "Monitors", "High-speed Internet"],
    occupancyEnds: "2024-05-25",
    depreciating: true,
    originalValue: 80,
    depreciationRate: 5,
  },
  {
    id: 3,
    name: "Community Car #2",
    type: "vehicle",
    icon: Car,
    currentValue: 120,
    dailyTax: 12,
    currentOwner: "0x7g8...9h0i",
    ownerName: "Jamal Washington",
    description: "Electric sedan, 4-seater with 300km range",
    location: "Mobility Hub",
    amenities: ["Electric", "GPS", "Charging Cable"],
    occupancyEnds: "2024-05-20",
    depreciating: true,
    originalValue: 150,
    depreciationRate: 3,
  },
  {
    id: 4,
    name: "E-Bike #7",
    type: "vehicle",
    icon: Bike,
    currentValue: 30,
    dailyTax: 3,
    currentOwner: null,
    ownerName: null,
    description: "Electric bike with cargo basket, 60km range",
    location: "Mobility Hub",
    amenities: ["Electric", "Cargo Basket", "Helmet"],
    occupancyEnds: null,
    depreciating: true,
    originalValue: 50,
    depreciationRate: 2,
    currentDepreciatedValue: 38,
  },
  {
    id: 5,
    name: "Laundry Room Slot",
    type: "utility",
    icon: Shirt,
    currentValue: 15,
    dailyTax: 1.5,
    currentOwner: null,
    ownerName: null,
    description: "2-hour slot for using the community laundry facilities",
    location: "Residential Zone",
    amenities: ["Washer", "Dryer", "Detergent Available"],
    occupancyEnds: null,
    depreciating: true,
    originalValue: 25,
    depreciationRate: 1,
    currentDepreciatedValue: 20,
  },
]

export function ResourcesOverview() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedResource, setSelectedResource] = useState<any>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)
  const [resourceToEdit, setResourceToEdit] = useState<any>(null)

  // Filter resources based on search term, type, and status
  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (resource.ownerName && resource.ownerName.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesType = selectedType === "all" || resource.type === selectedType

    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "occupied" && resource.currentOwner) ||
      (selectedStatus === "available" && !resource.currentOwner)

    return matchesSearch && matchesType && matchesStatus
  })

  const handleResourceClick = (resource: any) => {
    setSelectedResource(resource)
    setIsDetailsDialogOpen(true)
  }

  const handleAddResource = () => {
    setResourceToEdit(null)
    setIsFormDialogOpen(true)
  }

  const handleEditResource = (resource: any) => {
    setResourceToEdit(resource)
    setIsFormDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Public Resources</CardTitle>
            <CardDescription>
              All resources are governed by Harberger taxes. Set your valuation, pay the tax, and use the resource until
              someone buys it from you.
            </CardDescription>
          </div>
          <Button onClick={handleAddResource} className="bg-stone-800 text-white hover:bg-stone-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Resource
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
                icon={<Search className="h-4 w-4" />}
              />
            </div>
            <div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Resource type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="housing">Housing</SelectItem>
                  <SelectItem value="workspace">Workspace</SelectItem>
                  <SelectItem value="vehicle">Vehicles</SelectItem>
                  <SelectItem value="utility">Utilities</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="occupied">Currently Occupied</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredResources.map((resource) => (
          <div key={resource.id} className="relative group">
            <ResourceCard resource={resource} onClick={() => handleResourceClick(resource)} />
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white"
              onClick={(e) => {
                e.stopPropagation()
                handleEditResource(resource)
              }}
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit {resource.name}</span>
            </Button>
          </div>
        ))}
      </div>

      {selectedResource && (
        <ResourceDetailsDialog
          resource={selectedResource}
          open={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
        />
      )}

      <ResourceFormDialog
        open={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        resource={resourceToEdit}
        cityZones={cityZones}
      />
    </div>
  )
}
