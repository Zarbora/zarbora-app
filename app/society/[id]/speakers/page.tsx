"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SpeakerProfileCard } from "@/components/speaker-profile-card";
import { getSpeakers } from "@/lib/api";
import type { Speaker } from "@/lib/api";

export default function SpeakersPage() {
  const params = useParams();
  const societyId = params.id as string;
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSpeakers() {
      try {
        const data = await getSpeakers(societyId);
        setSpeakers(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load speakers"
        );
      } finally {
        setLoading(false);
      }
    }

    loadSpeakers();
  }, [societyId]);

  if (loading) {
    return <div>Loading speakers...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (speakers.length === 0) {
    return <div>No speakers found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Speakers</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {speakers.map((speaker) => (
          <SpeakerProfileCard
            key={speaker.id}
            name={speaker.name}
            bio={speaker.bio}
            avatar={speaker.avatar_url}
            topics={speaker.topics}
            pastSessions={speaker.past_sessions}
            endorsements={speaker.endorsements}
          />
        ))}
      </div>
    </div>
  );
}
