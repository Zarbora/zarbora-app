"use client";

import { useParams } from "next/navigation";
import { ResourcesOverview } from "@/components/resources-overview";

export default function ResourcesPage() {
  const params = useParams();
  const societyId = params.id as string;

  return <ResourcesOverview societyId={societyId} />;
}
