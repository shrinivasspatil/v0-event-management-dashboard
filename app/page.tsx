"use client"

import { useState } from "react"
import { Plus, Search, Calendar, MapPin, Users, MoreHorizontal, Filter, Grid3X3, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CreateEventModal } from "@/components/create-event-modal"
import Link from "next/link"

const events = [
  {
    id: "1",
    name: "Tech Summit 2026",
    date: "Apr 15-17, 2026",
    location: "San Francisco, CA",
    type: "In Person",
    attendees: 1250,
    status: "Published",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop",
  },
  {
    id: "2",
    name: "Design Conference",
    date: "May 8-9, 2026",
    location: "Virtual",
    type: "Virtual",
    attendees: 3500,
    status: "Published",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=200&fit=crop",
  },
  {
    id: "3",
    name: "Product Launch Event",
    date: "Jun 1, 2026",
    location: "New York, NY",
    type: "Hybrid",
    attendees: 850,
    status: "Draft",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=200&fit=crop",
  },
  {
    id: "4",
    name: "Developer Workshop",
    date: "Jun 20, 2026",
    location: "Austin, TX",
    type: "In Person",
    attendees: 200,
    status: "Published",
    image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400&h=200&fit=crop",
  },
  {
    id: "5",
    name: "Annual Company Meetup",
    date: "Jul 10-12, 2026",
    location: "Chicago, IL",
    type: "In Person",
    attendees: 500,
    status: "Draft",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=200&fit=crop",
  },
  {
    id: "6",
    name: "Marketing Summit",
    date: "Aug 5, 2026",
    location: "Virtual",
    type: "Virtual",
    attendees: 2000,
    status: "Published",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=200&fit=crop",
  },
]

export default function EventsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      <CreateEventModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
      {/* Top Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Calendar className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">Eventify</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              Help
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <span>John Doe</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Events</h1>
            <p className="mt-1 text-muted-foreground">
              Manage and organize all your events in one place
            </p>
          </div>
          <Button className="gap-2" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Create Event
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm font-medium text-muted-foreground">Total Events</p>
            <p className="mt-1 text-3xl font-bold text-foreground">{events.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm font-medium text-muted-foreground">Total Attendees</p>
            <p className="mt-1 text-3xl font-bold text-foreground">
              {events.reduce((sum, e) => sum + e.attendees, 0).toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm font-medium text-muted-foreground">Published Events</p>
            <p className="mt-1 text-3xl font-bold text-foreground">
              {events.filter((e) => e.status === "Published").length}
            </p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <div className="flex rounded-lg border border-border">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                className="rounded-r-none"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                className="rounded-l-none"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {viewMode === "grid" ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    crossOrigin="anonymous"
                  />
                  <div className="absolute right-3 top-3">
                    <Badge
                      variant={event.status === "Published" ? "default" : "secondary"}
                    >
                      {event.status}
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="font-semibold text-foreground group-hover:text-primary">
                      {event.name}
                    </h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{event.attendees.toLocaleString()} attendees</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Badge variant="outline">{event.type}</Badge>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEvents.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md"
              >
                <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="h-full w-full object-cover"
                    crossOrigin="anonymous"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-foreground group-hover:text-primary">
                    {event.name}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {event.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {event.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {event.attendees.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{event.type}</Badge>
                  <Badge variant={event.status === "Published" ? "default" : "secondary"}>
                    {event.status}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
