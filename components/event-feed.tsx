"use client";

import { useState, useEffect } from "react";
import { Calendar, Filter, MapPin, Tag, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QuadraticVoting } from "./quadratic-voting";
import { HarbergerSlot } from "./harberger-slot";
import { getEvents } from "@/lib/api";
import type { Event } from "@/lib/api";

interface EventFeedProps {
  societyId: string;
}

export function EventFeed({ societyId }: EventFeedProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await getEvents(societyId);
        setEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load events");
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, [societyId]);

  // Filter events based on search term, date, and category
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.speaker.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate = selectedDate === "all" || event.date === selectedDate;

    const matchesCategory =
      selectedCategory === "all" ||
      event.tags.includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesDate && matchesCategory;
  });

  if (loading) {
    return <div>Loading events...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Get unique dates for the date filter
  const uniqueDates = [...new Set(events.map((event) => event.date))].sort();

  // Get unique categories from all event tags
  const uniqueCategories = [
    ...new Set(events.flatMap((event) => event.tags)),
  ].sort();

  return (
    <div className="mb-12">
      <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <h2 className="text-2xl font-medium text-stone-800">
          Community Events
        </h2>
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
            <label
              htmlFor="date-filter"
              className="mb-1 block text-sm font-medium text-stone-600"
            >
              Date
            </label>
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger id="date-filter">
                <SelectValue placeholder="Select date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                {uniqueDates.map((date) => (
                  <SelectItem key={date} value={date}>
                    {new Date(date).toLocaleDateString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label
              htmlFor="category-filter"
              className="mb-1 block text-sm font-medium text-stone-600"
            >
              Category
            </label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger id="category-filter">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {uniqueCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label
              htmlFor="location-filter"
              className="mb-1 block text-sm font-medium text-stone-600"
            >
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
          <Card
            key={event.id}
            className="overflow-hidden transition-all hover:shadow-md"
          >
            {event.is_premium && <HarbergerSlot eventId={event.id} />}
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl font-medium">
                  {event.title}
                </CardTitle>
              </div>
              <CardDescription className="flex items-center text-stone-500">
                <div className="flex items-center space-x-4 text-sm text-stone-500">
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    <span>
                      {new Date(event.date).toLocaleDateString()}{" "}
                      {event.start_time} - {event.end_time}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-1 h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-1 h-4 w-4" />
                    <span>{event.votes} votes</span>
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="mb-3 text-sm text-stone-600">{event.description}</p>
              <div className="mb-3 flex items-center text-xs text-stone-500">
                <Users className="mr-1 h-3 w-3" />
                <span className="font-medium">{event.speaker.name}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {event.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs font-normal"
                  >
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
  );
}
