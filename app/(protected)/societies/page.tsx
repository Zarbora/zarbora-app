"use client";

import { SocietyOverview } from "@/components/society-overview";

export default function SocietiesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-white">
          Societies
        </h1>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
          Create and join decentralized societies to participate in collective
          governance.
        </p>
      </div>
      <SocietyOverview />
    </div>
  );
}
