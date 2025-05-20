import { SpeakerProfileCard } from "@/components/speaker-profile-card"

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
]

export default function SpeakersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-medium text-stone-800">Community Speakers</h1>
      <p className="mb-8 text-stone-600">
        These are the community members who have hosted or are planning to host sessions. Profiles are soulbound and
        reflect past contributions, not gatekeeping mechanisms.
      </p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {speakers.map((speaker) => (
          <SpeakerProfileCard key={speaker.id} {...speaker} />
        ))}
      </div>
    </div>
  )
}
