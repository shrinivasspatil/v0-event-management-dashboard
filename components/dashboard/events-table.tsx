"use client"

import { MoreHorizontal, ArrowUpRight, MapPin, CalendarDays } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const events = [
  {
    id: "EVT-001",
    name: "Tech Conference 2026",
    date: "Apr 15, 2026",
    location: "San Francisco, CA",
    ticketsSold: 450,
    capacity: 500,
    revenue: "$22,500",
    status: "upcoming",
  },
  {
    id: "EVT-002",
    name: "Music Festival",
    date: "Apr 20, 2026",
    location: "Austin, TX",
    ticketsSold: 1200,
    capacity: 1500,
    revenue: "$36,000",
    status: "upcoming",
  },
  {
    id: "EVT-003",
    name: "Startup Pitch Night",
    date: "Apr 25, 2026",
    location: "New York, NY",
    ticketsSold: 200,
    capacity: 200,
    revenue: "$4,000",
    status: "sold-out",
  },
  {
    id: "EVT-004",
    name: "Design Workshop",
    date: "May 1, 2026",
    location: "Los Angeles, CA",
    ticketsSold: 45,
    capacity: 75,
    revenue: "$2,250",
    status: "upcoming",
  },
  {
    id: "EVT-005",
    name: "AI Summit",
    date: "May 10, 2026",
    location: "Seattle, WA",
    ticketsSold: 320,
    capacity: 400,
    revenue: "$16,000",
    status: "upcoming",
  },
  {
    id: "EVT-006",
    name: "Networking Mixer",
    date: "May 15, 2026",
    location: "Chicago, IL",
    ticketsSold: 0,
    capacity: 150,
    revenue: "$0",
    status: "draft",
  },
]

function getStatusBadge(status: string) {
  switch (status) {
    case "upcoming":
      return <Badge variant="secondary" className="bg-primary/10 text-primary border-0">Upcoming</Badge>
    case "sold-out":
      return <Badge variant="secondary" className="bg-success/10 text-success border-0">Sold Out</Badge>
    case "draft":
      return <Badge variant="secondary" className="bg-muted text-muted-foreground border-0">Draft</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export function EventsTable() {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-card-foreground">Upcoming Events</CardTitle>
        <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
          View all
          <ArrowUpRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Event</TableHead>
              <TableHead className="text-muted-foreground hidden md:table-cell">Date</TableHead>
              <TableHead className="text-muted-foreground hidden lg:table-cell">Location</TableHead>
              <TableHead className="text-muted-foreground text-right">Tickets</TableHead>
              <TableHead className="text-muted-foreground text-right hidden sm:table-cell">Revenue</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id} className="border-border">
                <TableCell>
                  <div>
                    <p className="font-medium text-card-foreground">{event.name}</p>
                    <p className="text-xs text-muted-foreground md:hidden flex items-center gap-1 mt-1">
                      <CalendarDays className="h-3 w-3" />
                      {event.date}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    {event.date}
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="text-card-foreground">
                    {event.ticketsSold}/{event.capacity}
                  </div>
                  <div className="mt-1 h-1.5 w-full max-w-20 overflow-hidden rounded-full bg-secondary ml-auto">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{
                        width: `${(event.ticketsSold / event.capacity) * 100}%`,
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell className="text-right hidden sm:table-cell">
                  <span className="text-card-foreground">{event.revenue}</span>
                </TableCell>
                <TableCell>{getStatusBadge(event.status)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>View details</DropdownMenuItem>
                      <DropdownMenuItem>Edit event</DropdownMenuItem>
                      <DropdownMenuItem>Manage tickets</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        Cancel event
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
