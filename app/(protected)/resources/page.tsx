import { ResourcesOverview } from "@/components/resources-overview";
import { ProtectedRoute } from "@/components/protected-route";

export default function ResourcesPage() {
  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <ResourcesOverview />
      </div>
    </ProtectedRoute>
  );
}
