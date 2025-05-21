"use client";

import {
  MapPin,
  Tag,
  Clock,
  AlertCircle,
  Building,
  Car,
  Home,
  Bike,
  Shirt,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ResourceCardProps {
  resource: any;
  onClick: () => void;
}

// Map icon string to Lucide icon component
const iconMap: Record<string, React.ElementType> = {
  Building,
  Car,
  Home,
  Bike,
  Shirt,
};

export function ResourceCard({ resource, onClick }: ResourceCardProps) {
  // Use icon string to get the correct component, fallback to Building
  const Icon = iconMap[resource.icon] || Building;

  // Calculate the depreciation progress if applicable
  const depreciationProgress =
    resource.depreciating && !resource.currentOwner
      ? Math.round(
          ((resource.originalValue -
            (resource.currentDepreciatedValue || resource.currentValue)) /
            resource.originalValue) *
            100
        )
      : 0;

  // Calculate days until release is possible
  const calculateReleaseStatus = () => {
    if (!resource.currentOwner) return null;

    const now = new Date();
    const acquiredDate = new Date(resource.acquiredDate);
    const minHoldingEndDate = new Date(acquiredDate);
    minHoldingEndDate.setDate(
      minHoldingEndDate.getDate() + resource.minHoldingPeriod
    );

    const daysUntilReleasable = Math.ceil(
      (minHoldingEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (resource.releaseRequested) {
      const releaseDate = new Date(resource.releaseRequestDate);
      releaseDate.setDate(releaseDate.getDate() + resource.releaseNotice);
      const daysUntilRelease = Math.ceil(
        (releaseDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      return {
        status: "releasing",
        days: daysUntilRelease,
        message: `Release in ${daysUntilRelease} days`,
      };
    }

    if (daysUntilReleasable > 0) {
      return {
        status: "locked",
        days: daysUntilReleasable,
        message: `Can request release in ${daysUntilReleasable} days`,
      };
    }

    return {
      status: "releasable",
      days: 0,
      message: resource.releaseNotice
        ? `Can be released with ${resource.releaseNotice} day${
            resource.releaseNotice === 1 ? "" : "s"
          } notice`
        : "Can be released immediately",
    };
  };

  const releaseStatus = resource.currentOwner ? calculateReleaseStatus() : null;

  return (
    <Card className="flex h-[300px] flex-col overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-1">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className="rounded-full bg-stone-100 p-1.5">
              <Icon className="h-4 w-4 text-stone-600" />
            </div>
            <div>
              <CardTitle className="text-base font-medium line-clamp-1">
                {resource.name}
              </CardTitle>
              <CardDescription className="flex items-center text-xs text-stone-500">
                <MapPin className="mr-1 h-3 w-3" />
                <span className="line-clamp-1">{resource.location}</span>
              </CardDescription>
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {resource.currentOwner ? (
                  releaseStatus?.status === "releasing" ? (
                    <Badge
                      variant="outline"
                      className="bg-yellow-50 text-yellow-700 text-xs"
                    >
                      Releasing
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 text-xs"
                    >
                      Occupied
                    </Badge>
                  )
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 text-xs"
                  >
                    Available
                  </Badge>
                )}
              </TooltipTrigger>
              <TooltipContent>
                {resource.currentOwner
                  ? releaseStatus?.message ||
                    `Currently owned by ${
                      resource.ownerName || resource.currentOwner
                    }`
                  : "Available for claiming"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto py-2">
        <p className="mb-2 text-sm text-stone-600 line-clamp-2">
          {resource.description}
        </p>

        <div className="mb-2 space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-stone-600">Current Value:</span>
            <span className="font-medium">
              {resource.currentOwner
                ? `${resource.currentValue} DAI`
                : `${
                    resource.currentDepreciatedValue || resource.currentValue
                  } DAI`}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-stone-600">Daily Tax:</span>
            <span className="font-medium">{resource.dailyTax} DAI</span>
          </div>
          {resource.currentOwner && (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-600">Current Owner:</span>
                <span className="font-medium line-clamp-1">
                  {resource.ownerName || resource.currentOwner}
                </span>
              </div>
              {releaseStatus && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-600">
                    <Clock className="mr-1 inline-block h-3 w-3" />
                    Release Status:
                  </span>
                  <span className="font-medium">{releaseStatus.message}</span>
                </div>
              )}
            </>
          )}
          {resource.occupancyEnds && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-600">Occupancy Until:</span>
              <span className="font-medium">
                {new Date(resource.occupancyEnds)
                  .toISOString()
                  .split("T")[0]
                  .split("-")
                  .reverse()
                  .join("/")}
              </span>
            </div>
          )}
        </div>

        {resource.depreciating && !resource.currentOwner && (
          <div className="mb-2 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500">Price Depreciation:</span>
              <span className="text-stone-500">{depreciationProgress}%</span>
            </div>
            <Progress value={depreciationProgress} className="h-1" />
          </div>
        )}

        {resource.resource_amenities &&
          resource.resource_amenities.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {resource.resource_amenities.map((amenity: { name: string }) => (
                <Badge
                  key={amenity.name}
                  variant="outline"
                  className="bg-stone-50 text-stone-600 text-xs"
                >
                  <Tag className="mr-1 h-2.5 w-2.5" />
                  {amenity.name}
                </Badge>
              ))}
            </div>
          )}
      </CardContent>
      <CardFooter className="mt-auto border-t border-stone-100 pt-2">
        {resource.currentOwner ? (
          <Button
            variant="outline"
            size="sm"
            onClick={onClick}
            className="w-full"
          >
            View Details
          </Button>
        ) : (
          <Button
            className="w-full bg-stone-800 text-white hover:bg-stone-700"
            size="sm"
            onClick={onClick}
          >
            Claim Resource
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
