"use client";

import { MapPin, Tag } from "lucide-react";
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

export function ResourceCard({ resource, onClick }: ResourceCardProps) {
  const Icon = resource.icon;

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

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className="rounded-full bg-stone-100 p-2">
              <Icon className="h-5 w-5 text-stone-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-medium">
                {resource.name}
              </CardTitle>
              <CardDescription className="flex items-center text-xs text-stone-500">
                <MapPin className="mr-1 h-3 w-3" />
                {resource.location}
              </CardDescription>
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {resource.currentOwner ? (
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700"
                  >
                    Occupied
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    Available
                  </Badge>
                )}
              </TooltipTrigger>
              <TooltipContent>
                {resource.currentOwner
                  ? `Currently owned by ${
                      resource.ownerName || resource.currentOwner
                    }`
                  : "Available for claiming"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="mb-3 text-sm text-stone-600">{resource.description}</p>

        <div className="mb-3 space-y-2">
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
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-600">Current Owner:</span>
              <span className="font-medium">
                {resource.ownerName || resource.currentOwner}
              </span>
            </div>
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
          <div className="mb-3 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500">Price Depreciation:</span>
              <span className="text-stone-500">
                {resource.currentDepreciatedValue || resource.currentValue} /{" "}
                {resource.originalValue} DAI
              </span>
            </div>
            <Progress value={depreciationProgress} className="h-1.5" />
            <p className="text-xs text-stone-500">
              Price decreases by {resource.depreciationRate} DAI/day while
              unoccupied
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-1">
          {resource.amenities.map((amenity: string) => (
            <Badge
              key={amenity}
              variant="outline"
              className="text-xs font-normal"
            >
              <Tag className="mr-1 h-3 w-3" />
              {amenity}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t border-stone-100 pt-3">
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
