"use client";

import { GovernanceOverview } from "@/components/governance-overview";
import { useParams } from "next/navigation";

export default function GovernancePage() {
  const { id: societyId } = useParams();
  return <GovernanceOverview societyId={societyId as string} />;
}
