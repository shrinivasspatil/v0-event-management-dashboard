"use client"

import { useParams } from "next/navigation"
import {
  Users,
  Ticket,
  DollarSign,
  TrendingUp,
  Calendar,
  MapPin,
  Clock,
  ExternalLink,
  Copy,
  MoreHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const eventDetails: Record<string, {
  name: string
  date: string
  time: string
  location: string
  type: string
  totalTickets: number
  soldTickets: number
  revenue: number
  checkedIn: number
}> = {
  "1": {
    name: "Tech Summit 2026",
    date: "Apr 15-17, 2026",
    time: "9:00 AM - 6:00 PM PST",
    location: "Moscone Center, San Francisco, CA",
    type: "In Person",
    totalTickets: 2000,
    soldTickets: 1250,
    revenue: 187500,
    checkedIn: 0,
  },
  "2": {
    name: "Design Conference",
    date: "May 8-9, 2026",
    time: "10:00 AM - 5:00 PM EST",
    location: "Virtual Event",
    type: "Virtual",
    totalTickets: 5000,
    soldTickets: 3500,
    revenue: 52500,
    checkedIn: 0,
  },
  "3": {
    name: "Product Launch Event",
    date: "Jun 1, 2026",
    time: "2:00 PM - 8:00 PM EST",
    location: "Jacob Javits Center, New York, NY",
    type: "Hybrid",
    totalTickets: 1500,
    soldTickets: 850,
    revenue: 127500,
    checkedIn: 0,
  },
}

const recentAttendees = [
  { name: "Sarah Johnson", email: "sarah.j@email.com", ticket: "VIP Pass", date: "2 hours ago", avatar: "SJ" },
  { name: "Mike Chen", email: "mike.chen@company.com", ticket: "Standard", date: "4 hours ago", avatar: "MC" },
  { name: "Emily Davis", email: "emily.d@startup.io", ticket: "VIP Pass", date: "5 hours ago", avatar: "ED" },
  { name: "Alex Thompson", email: "alex.t@tech.co", ticket: "Standard", date: "6 hours ago", avatar: "AT" },
  { name: "Lisa Wang", email: "lisa.wang@design.com", ticket: "Early Bird", date: "8 hours ago", avatar: "LW" },
]

const ticketTypes = [
  { name: "VIP Pass", price: 299, sold: 150, total: 200, color: "bg-primary" },
  { name: "Standard", price: 149, sold: 800, total: 1200, color: "bg-chart-2" },
  { name: "Early Bird", price: 99, sold: 300, total: 300, color: "bg-chart-3" },
  { name: "Student", price: 49, sold: 0, total: 300, color: "bg-chart-4" },
]

export default function EventOverviewPage() {
  const params = useParams()
  const eventId = params.id as string
  const event = eventDetails[eventId] || eventDetails["1"]

  const ticketProgress = (event.soldTickets / event.totalTickets) * 100

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-8 py-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{event.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {event.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {event.time}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {event.location}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Copy className="h-4 w-4" />
              Copy Link
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Preview
            </Button>
            <Button size="sm">Publish Changes</Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-8">
        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tickets Sold
              </CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {event.soldTickets.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                of {event.totalTickets.toLocaleString()} total
              </p>
              <Progress value={ticketProgress} className="mt-2 h-1.5" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${event.revenue.toLocaleString()}
              </div>
              <p className="flex items-center text-xs text-chart-2">
                <TrendingUp className="mr-1 h-3 w-3" />
                +12.5% from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Registered
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {event.soldTickets.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {event.checkedIn} checked in
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Page Views
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">8,429</div>
              <p className="flex items-center text-xs text-chart-2">
                <TrendingUp className="mr-1 h-3 w-3" />
                +8.2% conversion rate
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Ticket Sales */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Ticket Sales by Type</CardTitle>
              <Button variant="outline" size="sm">
                Manage Tickets
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ticketTypes.map((ticket) => (
                  <div key={ticket.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-full ${ticket.color}`} />
                        <span className="font-medium text-foreground">{ticket.name}</span>
                        <span className="text-muted-foreground">${ticket.price}</span>
                      </div>
                      <span className="text-muted-foreground">
                        {ticket.sold} / {ticket.total}
                      </span>
                    </div>
                    <Progress
                      value={(ticket.sold / ticket.total) * 100}
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Ticket className="mr-2 h-4 w-4" />
                Create New Ticket Type
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Import Attendees
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Add Session
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MapPin className="mr-2 h-4 w-4" />
                Update Venue
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Attendees */}
        <Card className="mt-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Registrations</CardTitle>
            <Button variant="outline" size="sm">
              View All Attendees
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Attendee</TableHead>
                  <TableHead>Ticket Type</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentAttendees.map((attendee) => (
                  <TableRow key={attendee.email}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="" />
                          <AvatarFallback className="text-xs">
                            {attendee.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{attendee.name}</p>
                          <p className="text-sm text-muted-foreground">{attendee.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{attendee.ticket}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{attendee.date}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Send Email</DropdownMenuItem>
                          <DropdownMenuItem>Resend Ticket</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
