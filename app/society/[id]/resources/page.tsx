"use client";

import { useParams, usePathname } from "next/navigation";
import { ResourcesOverview } from "@/components/resources-overview";

export default function ResourcesPage() {
  // Get the pathname and extract the ID
  const pathname = usePathname();
  const societyId = pathname?.split("/")[2]; // /society/[id]/resources -> get the [id] part

  console.log("ResourcesPage - pathname:", pathname);
  console.log("ResourcesPage - extracted societyId:", societyId);

  if (!societyId) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-800 mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return <ResourcesOverview societyId={societyId} />;
}
