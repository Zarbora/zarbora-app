"use client";

import { usePathname } from "next/navigation";
import { ZonesOverview } from "@/components/zones-overview";

export default function ZonesPage() {
  const pathname = usePathname();
  const societyId = pathname?.split("/")[2]; // /society/[id]/zones -> get the [id] part

  console.log("ZonesPage - pathname:", pathname);
  console.log("ZonesPage - extracted societyId:", societyId);

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

  return <ZonesOverview societyId={societyId} />;
}
