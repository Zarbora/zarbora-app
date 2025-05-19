"use client"

import { useState } from "react"
import { Calendar, Filter, MapPin, Tag, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { QuadraticVoting } from "./quadratic-voting"
import { HarbergerSlot } from "./harberger-slot"

// Sample data
const events = [
  {
    id: 1,
    title: "Web3 Social Coordination",
    description: "Exploring new models for community coordination using web3 primitives",
    speaker: "Alex Rivera",
    location: "Main Hall",
    time: "10:00 AM - 11:30 AM",
    date: "2024-05-15",
    tags: ["web3", "social", "governance"],
    isPremium: true,
    votes: 24,
  },
  {
    id: 2,
    title: "Solarpunk Art Workshop",
    description: "Hands-on workshop creating solarpunk-inspired digital art",
    speaker: "Maya Chen",
    location: "Studio B",
    time: "2:00 PM - 4:00 PM",
    date: "2024-05-15",
    tags: ["art", "workshop", "solarpunk"],
    isPremium: false,
    votes: 18,
  },
  {
    id: 3,
    title: "Regenerative Economics",
    description: "Practical approaches to building regenerative economic systems",
    speaker: "Jamal Washington",
    location: "Garden Pavilion",
    time: "11:00 AM - 12:30 PM",
    date: "2024-05-16",
    tags: ["economics", "sustainability"],
    isPremium: true,
    votes: 31,
  },
  {
    id: 4,
    title: "Meditation Circle",
    description: "Group meditation and mindfulness practice",
    speaker: "Sophia Lee",
    location: "Zen Garden",
    time: "8:00 AM - 9:00 AM",
    date: "2024-05-16",
    tags: ["wellness", "meditation"],
    isPremium: false,
    votes: 12,
  },
  {
    id: 5,
    title: "Decentralized Science",
    description: "How DeSci is transforming research funding and collaboration",
    speaker: "Dr. Marcus Johnson",
    location: "Innovation Lab",
    time: "3:30 PM - 5:00 PM",
    date: "2024-05-17",
    tags: ["science", "research", "funding"],
    isPremium: false,
    votes: 27,
  },
]

export function EventFeed() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  // Filter events based on search term, date, and category
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.speaker.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDate = selectedDate === "all" || event.date === selectedDate

    const matchesCategory = selectedCategory === "all" || event.tags.includes(selectedCategory.toLowerCase())

    return matchesSearch && matchesDate && matchesCategory
  })

  return (
    <div className="mb-12">
      <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <h2 className="text-2xl font-medium text-stone-800">Community Events</h2>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            aria-label="Toggle filters"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="mb-6 grid grid-cols-1 gap-4 rounded-lg border border-stone-200 bg-stone-100 p-4 sm:grid-cols-2 md:grid-cols-3">
          <div>
            <label htmlFor="date-filter" className="mb-1 block text-sm font-medium text-stone-600">
              Date
            </label>
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger id="date-filter">
                <SelectValue placeholder="Select date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="2024-05-15">May 15, 2024</SelectItem>
                <SelectItem value="2024-05-16">May 16, 2024</SelectItem>
                <SelectItem value="2024-05-17">May 17, 2024</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="category-filter" className="mb-1 block text-sm font-medium text-stone-600">
              Category
            </label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger id="category-filter">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="web3">Web3</SelectItem>
                <SelectItem value="art">Art</SelectItem>
                <SelectItem value="economics">Economics</SelectItem>
                <SelectItem value="wellness">Wellness</SelectItem>
                <SelectItem value="science">Science</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="location-filter" className="mb-1 block text-sm font-medium text-stone-600">
              Location
            </label>
            <Select defaultValue="all">
              <SelectTrigger id="location-filter">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="main-hall">Main Hall</SelectItem>
                <SelectItem value="studio-b">Studio B</SelectItem>
                <SelectItem value="garden-pavilion">Garden Pavilion</SelectItem>
                <SelectItem value="zen-garden">Zen Garden</SelectItem>
                <SelectItem value="innovation-lab">Innovation Lab</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="overflow-hidden transition-all hover:shadow-md">
            {event.isPremium && <HarbergerSlot />}
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl font-medium">{event.title}</CardTitle>
              </div>
              <CardDescription className="flex items-center text-stone-500">
                <Calendar className="mr-1 h-3 w-3" />
                {event.date.split("-")[2]} {new Date(event.date).toLocaleString("default", { month: "short" })},{" "}
                {event.time}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="mb-3 text-sm text-stone-600">{event.description}</p>
              <div className="mb-3 flex items-center text-xs text-stone-500">
                <Users className="mr-1 h-3 w-3" />
                <span className="font-medium">{event.speaker}</span>
              </div>
              <div className="mb-3 flex items-center text-xs text-stone-500">
                <MapPin className="mr-1 h-3 w-3" />
                <span>{event.location}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {event.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs font-normal">
                    <Tag className="mr-1 h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t border-stone-100 pt-3">
              <QuadraticVoting eventId={event.id} initialVotes={event.votes} />
              <Button variant="outline" size="sm" className="text-xs">
                Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
