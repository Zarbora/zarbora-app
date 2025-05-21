"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  Building,
  Car,
  Home,
  Search,
  Bike,
  Shirt,
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ResourceCard } from "./resource-card";
import { ResourceDetailsDialog } from "./resource-details-dialog";
import { ResourceFormDialog } from "./resource-form-dialog";
import { Button } from "@/components/ui/button";
import type { Database } from "@/types/supabase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DepositButton } from "./deposit-button";

type Resource = Database["public"]["Tables"]["resources"]["Row"];
type Zone = Database["public"]["Tables"]["zones"]["Row"];

interface ResourcesOverviewProps {
  societyId: string;
}

export function ResourcesOverview({ societyId }: ResourcesOverviewProps) {
  console.log("ResourcesOverview societyId:", societyId);

  const [resources, setResources] = useState<Resource[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null
  );
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [resourceToEdit, setResourceToEdit] = useState<Resource | null>(null);

  useEffect(() => {
    if (!societyId) {
      setError("Society ID is required");
      setIsLoading(false);
      return;
    }
    loadData();
  }, [societyId]);

  async function loadData() {
    try {
      setIsLoading(true);
      setError(null);
      const [resourcesData, zonesData] = await Promise.all([
        api.resources.getBySociety(societyId),
        api.zones.getBySociety(societyId),
      ]);
      setResources(resourcesData || []);
      setZones(zonesData || []);
    } catch (error) {
      console.error("Failed to load data:", error);
      setError(error instanceof Error ? error.message : "Failed to load data");
      if (error && typeof error === "object") {
        const errObj = error as Record<string, unknown>;
        for (const key in errObj) {
          console.log("Error detail:", key, errObj[key]);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }

  // Filter resources based on search term, type, and status
  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (resource.current_owner_name &&
        resource.current_owner_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));

    const matchesType =
      selectedType === "all" || resource.type === selectedType;

    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "occupied" && resource.current_owner_address) ||
      (selectedStatus === "available" && !resource.current_owner_address);

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleResourceClick = (resource: Resource) => {
    setSelectedResource(resource);
    setIsDetailsDialogOpen(true);
  };

  const handleAddResource = () => {
    setSelectedResource(null);
    setIsFormDialogOpen(true);
  };

  const handleEditResource = (resource: Resource) => {
    setResourceToEdit(resource);
    setIsFormDialogOpen(true);
  };

  const handleResourceCreated = async () => {
    await loadData();
    setIsFormDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Public Resources</CardTitle>
            <CardDescription>
              All resources are governed by Harberger taxes. Set your valuation,
              pay the tax, and use the resource until someone buys it from you.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <DepositButton variant="outline" />
            <Button
              onClick={handleAddResource}
              className="bg-stone-800 text-white hover:bg-stone-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Resource
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
          ) : isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-800" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <Input
                    placeholder="Search resources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
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
                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="occupied">
                        Currently Occupied
                      </SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
                {filteredResources.length === 0 ? (
                  <div className="col-span-full text-center py-8 text-stone-500">
                    No resources found
                  </div>
                ) : (
                  filteredResources.map((resource) => (
                    <div key={resource.id} className="relative group">
                      <ResourceCard
                        resource={resource}
                        onClick={() => handleResourceClick(resource)}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleEditResource(resource);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit {resource.name}</span>
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {selectedResource && (
        <ResourceDetailsDialog
          resource={selectedResource}
          open={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
          onResourceUpdated={loadData}
        />
      )}

      <ResourceFormDialog
        open={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        resource={resourceToEdit}
        cityZones={zones}
        onResourceCreated={handleResourceCreated}
      />
    </div>
  );
}
