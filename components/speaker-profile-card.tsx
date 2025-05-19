import { User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface SpeakerProfileCardProps {
  name: string
  bio: string
  avatar?: string
  topics: string[]
  pastSessions: number
  endorsements: number
}

export function SpeakerProfileCard({ name, bio, avatar, topics, pastSessions, endorsements }: SpeakerProfileCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12 border-2 border-stone-200">
            <AvatarImage src={avatar || "/placeholder.svg"} alt={name} />
            <AvatarFallback>
              <User className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg font-medium">{name}</CardTitle>
            <CardDescription className="text-xs">
              {pastSessions} past sessions · {endorsements} endorsements
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-3 text-sm text-stone-600">{bio}</p>
        <div className="flex flex-wrap gap-1">
          {topics.map((topic) => (
            <Badge key={topic} variant="outline" className="text-xs font-normal">
              {topic}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
