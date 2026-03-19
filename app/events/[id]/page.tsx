"use client"

import { useParams } from "next/navigation"
import {
  Users,
  Building2,
  TrendingUp,
  Calendar,
  MapPin,
  Clock,
  ExternalLink,
  Copy,
  MoreHorizontal,
  Eye,
  UserPlus,
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
  visitorCapacity: number
  visitorsRegistered: number
  exhibitorCapacity: number
  exhibitorsRegistered: number
  checkedIn: number
}> = {
  "1": {
    name: "Tech Summit 2026",
    date: "Apr 15-17, 2026",
    time: "9:00 AM - 6:00 PM PST",
    location: "Moscone Center, San Francisco, CA",
    type: "In Person",
    visitorCapacity: 2000,
    visitorsRegistered: 1250,
    exhibitorCapacity: 100,
    exhibitorsRegistered: 78,
    checkedIn: 0,
  },
  "2": {
    name: "Design Conference",
    date: "May 8-9, 2026",
    time: "10:00 AM - 5:00 PM EST",
    location: "Virtual Event",
    type: "Virtual",
    visitorCapacity: 5000,
    visitorsRegistered: 3500,
    exhibitorCapacity: 50,
    exhibitorsRegistered: 42,
    checkedIn: 0,
  },
  "3": {
    name: "Product Launch Event",
    date: "Jun 1, 2026",
    time: "2:00 PM - 8:00 PM EST",
    location: "Jacob Javits Center, New York, NY",
    type: "Hybrid",
    visitorCapacity: 1500,
    visitorsRegistered: 850,
    exhibitorCapacity: 80,
    exhibitorsRegistered: 65,
    checkedIn: 0,
  },
}

const recentVisitors = [
  { name: "Sarah Johnson", email: "sarah.j@email.com", company: "TechCorp Inc.", date: "2 hours ago", avatar: "SJ" },
  { name: "Mike Chen", email: "mike.chen@company.com", company: "StartUp Labs", date: "4 hours ago", avatar: "MC" },
  { name: "Emily Davis", email: "emily.d@startup.io", company: "Design Studio", date: "5 hours ago", avatar: "ED" },
  { name: "Alex Thompson", email: "alex.t@tech.co", company: "InnovateTech", date: "6 hours ago", avatar: "AT" },
  { name: "Lisa Wang", email: "lisa.wang@design.com", company: "Creative Agency", date: "8 hours ago", avatar: "LW" },
]

const recentExhibitors = [
  { name: "TechCorp Inc.", contact: "John Smith", email: "john@techcorp.com", boothSize: "Large", date: "1 day ago" },
  { name: "InnovateTech", contact: "Sarah Lee", email: "sarah@innovate.com", boothSize: "Medium", date: "2 days ago" },
  { name: "Design Co.", contact: "Mike Brown", email: "mike@designco.com", boothSize: "Small", date: "3 days ago" },
]

export default function EventOverviewPage() {
  const params = useParams()
  const eventId = params.id as string
  const event = eventDetails[eventId] || eventDetails["1"]

  const visitorProgress = (event.visitorsRegistered / event.visitorCapacity) * 100
  const exhibitorProgress = (event.exhibitorsRegistered / event.exhibitorCapacity) * 100

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
                Visitors Registered
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {event.visitorsRegistered.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                of {event.visitorCapacity.toLocaleString()} capacity
              </p>
              <Progress value={visitorProgress} className="mt-2 h-1.5" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Exhibitors Registered
              </CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {event.exhibitorsRegistered}
              </div>
              <p className="text-xs text-muted-foreground">
                of {event.exhibitorCapacity} booths available
              </p>
              <Progress value={exhibitorProgress} className="mt-2 h-1.5" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Checked In
              </CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {event.checkedIn}
              </div>
              <p className="text-xs text-muted-foreground">
                Event not started yet
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Page Views
              </CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">8,429</div>
              <p className="flex items-center text-xs text-chart-2">
                <TrendingUp className="mr-1 h-3 w-3" />
                +8.2% this week
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Registration Stats */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Registration Overview</CardTitle>
              <Badge variant="secondary">Free Registration</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Visitor Registrations</p>
                        <p className="text-sm text-muted-foreground">General attendees</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{event.visitorsRegistered.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">of {event.visitorCapacity.toLocaleString()}</p>
                    </div>
                  </div>
                  <Progress value={visitorProgress} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10">
                        <Building2 className="h-5 w-5 text-chart-2" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Exhibitor Registrations</p>
                        <p className="text-sm text-muted-foreground">Companies with booths</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{event.exhibitorsRegistered}</p>
                      <p className="text-sm text-muted-foreground">of {event.exhibitorCapacity}</p>
                    </div>
                  </div>
                  <Progress value={exhibitorProgress} className="h-2" />
                </div>
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
                <Users className="mr-2 h-4 w-4" />
                Add Visitor
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Building2 className="mr-2 h-4 w-4" />
                Add Exhibitor
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

        {/* Recent Visitors */}
        <Card className="mt-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Visitor Registrations</CardTitle>
            <Button variant="outline" size="sm">
              View All Visitors
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Visitor</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentVisitors.map((visitor) => (
                  <TableRow key={visitor.email}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="" />
                          <AvatarFallback className="text-xs">
                            {visitor.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{visitor.name}</p>
                          <p className="text-sm text-muted-foreground">{visitor.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{visitor.company}</TableCell>
                    <TableCell className="text-muted-foreground">{visitor.date}</TableCell>
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
                          <DropdownMenuItem>Resend Confirmation</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Exhibitors */}
        <Card className="mt-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Exhibitor Registrations</CardTitle>
            <Button variant="outline" size="sm">
              View All Exhibitors
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Booth Size</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentExhibitors.map((exhibitor) => (
                  <TableRow key={exhibitor.email}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span className="font-medium text-foreground">{exhibitor.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{exhibitor.contact}</p>
                        <p className="text-sm text-muted-foreground">{exhibitor.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{exhibitor.boothSize}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{exhibitor.date}</TableCell>
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
                          <DropdownMenuItem>Assign Booth</DropdownMenuItem>
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
