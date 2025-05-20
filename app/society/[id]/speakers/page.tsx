"use client";

import { SpeakerProfileCard } from "@/components/speaker-profile-card";

// Sample speaker data
const speakers = [
  {
    id: 1,
    name: "Alex Rivera",
    bio: "Researcher and developer focused on web3 social coordination mechanisms and governance systems.",
    avatar: "/diverse-group-city.png",
    topics: ["web3", "governance", "social coordination"],
    pastSessions: 5,
    endorsements: 27,
  },
  {
    id: 2,
    name: "Maya Chen",
    bio: "Digital artist and educator exploring the intersection of solarpunk aesthetics and sustainable technology.",
    avatar: "/diverse-group-city.png",
    topics: ["art", "solarpunk", "education"],
    pastSessions: 3,
    endorsements: 19,
  },
  {
    id: 3,
    name: "Jamal Washington",
    bio: "Economist and community organizer working on regenerative economic models for local communities.",
    avatar: "/diverse-group-city.png",
    topics: ["economics", "community", "regenerative"],
    pastSessions: 7,
    endorsements: 42,
  },
  {
    id: 4,
    name: "Sophia Lee",
    bio: "Wellness practitioner and meditation guide focused on mindfulness in digital communities.",
    avatar: "/diverse-group-city.png",
    topics: ["wellness", "meditation", "mindfulness"],
    pastSessions: 4,
    endorsements: 31,
  },
  {
    id: 5,
    name: "Dr. Marcus Johnson",
    bio: "Researcher in decentralized science (DeSci) exploring new funding models for scientific research.",
    avatar: "/diverse-group-city.png",
    topics: ["science", "research", "funding"],
    pastSessions: 6,
    endorsements: 38,
  },
  {
    id: 6,
    name: "Elena Rodriguez",
    bio: "Community builder and facilitator specializing in participatory decision-making processes.",
    avatar: "/diverse-group-city.png",
    topics: ["facilitation", "governance", "participation"],
    pastSessions: 8,
    endorsements: 45,
  },
];

export default function SpeakersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Speakers</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {speakers.map((speaker, index) => (
          <SpeakerProfileCard key={index} {...speaker} />
        ))}
      </div>
    </div>
  );
}
