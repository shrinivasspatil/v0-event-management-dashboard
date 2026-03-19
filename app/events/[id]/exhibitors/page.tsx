"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import {
  Search,
  Filter,
  Download,
  MoreHorizontal,
  UserCheck,
  Clock,
  Building2,
  Mail,
  Phone,
  Eye,
  Trash2,
  CheckCircle2,
  PauseCircle,
  Globe,
  MapPin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Stats data
const stats = [
  {
    label: "Registered",
    value: 156,
    icon: Building2,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    label: "Attended",
    value: 98,
    icon: UserCheck,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    label: "On Hold",
    value: 23,
    icon: PauseCircle,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  {
    label: "Open",
    value: 35,
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
]

// Sample exhibitors data
const exhibitors = [
  {
    id: "1",
    companyName: "Tech Solutions Inc",
    contactPerson: "John Anderson",
    email: "john@techsolutions.com",
    phone: "+1 (555) 123-4567",
    website: "techsolutions.com",
    boothSize: "Large",
    location: "Hall A - Booth 101",
    registeredAt: "Mar 15, 2026",
    status: "Attended",
  },
  {
    id: "2",
    companyName: "Design Studio Pro",
    contactPerson: "Sarah Mitchell",
    email: "sarah@designstudio.com",
    phone: "+1 (555) 234-5678",
    website: "designstudio.com",
    boothSize: "Medium",
    location: "Hall B - Booth 205",
    registeredAt: "Mar 14, 2026",
    status: "Registered",
  },
  {
    id: "3",
    companyName: "Innovation Labs",
    contactPerson: "Michael Chen",
    email: "m.chen@innovationlabs.io",
    phone: "+1 (555) 345-6789",
    website: "innovationlabs.io",
    boothSize: "Premium",
    location: "Hall A - Booth 102",
    registeredAt: "Mar 14, 2026",
    status: "Attended",
  },
  {
    id: "4",
    companyName: "Marketing Pro Agency",
    contactPerson: "Emily Rodriguez",
    email: "emily@marketingpro.com",
    phone: "+1 (555) 456-7890",
    website: "marketingpro.com",
    boothSize: "Small",
    location: "Hall C - Booth 310",
    registeredAt: "Mar 13, 2026",
    status: "On Hold",
  },
  {
    id: "5",
    companyName: "Startup Ventures",
    contactPerson: "David Kim",
    email: "d.kim@startupventures.co",
    phone: "+1 (555) 567-8901",
    website: "startupventures.co",
    boothSize: "Medium",
    location: "Hall B - Booth 208",
    registeredAt: "Mar 13, 2026",
    status: "Open",
  },
  {
    id: "6",
    companyName: "Global Solutions Ltd",
    contactPerson: "Lisa Thompson",
    email: "lisa@globalsolutions.com",
    phone: "+1 (555) 678-9012",
    website: "globalsolutions.com",
    boothSize: "Large",
    location: "Hall A - Booth 105",
    registeredAt: "Mar 12, 2026",
    status: "Attended",
  },
  {
    id: "7",
    companyName: "Enterprise Systems",
    contactPerson: "James Wilson",
    email: "j.wilson@enterprise.com",
    phone: "+1 (555) 789-0123",
    website: "enterprise.com",
    boothSize: "Premium",
    location: "Hall A - Booth 103",
    registeredAt: "Mar 12, 2026",
    status: "Open",
  },
  {
    id: "8",
    companyName: "Creative Agency Co",
    contactPerson: "Amanda Foster",
    email: "a.foster@creativeagency.co",
    phone: "+1 (555) 890-1234",
    website: "creativeagency.co",
    boothSize: "Small",
    location: "Hall C - Booth 315",
    registeredAt: "Mar 11, 2026",
    status: "Registered",
  },
  {
    id: "9",
    companyName: "Finance Plus Corp",
    contactPerson: "Robert Martinez",
    email: "r.martinez@financeplus.com",
    phone: "+1 (555) 901-2345",
    website: "financeplus.com",
    boothSize: "Medium",
    location: "Hall B - Booth 210",
    registeredAt: "Mar 11, 2026",
    status: "Attended",
  },
  {
    id: "10",
    companyName: "Health Tech Innovations",
    contactPerson: "Jennifer Lee",
    email: "j.lee@healthtech.io",
    phone: "+1 (555) 012-3456",
    website: "healthtech.io",
    boothSize: "Large",
    location: "Hall A - Booth 108",
    registeredAt: "Mar 10, 2026",
    status: "On Hold",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Attended":
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Attended</Badge>
    case "Registered":
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Registered</Badge>
    case "On Hold":
      return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">On Hold</Badge>
    case "Open":
      return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Open</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const getBoothBadge = (size: string) => {
  switch (size) {
    case "Premium":
      return <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Premium</Badge>
    case "Large":
      return <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">Large</Badge>
    case "Medium":
      return <Badge variant="outline">Medium</Badge>
    case "Small":
      return <Badge variant="secondary">Small</Badge>
    default:
      return <Badge variant="secondary">{size}</Badge>
  }
}

export default function ExhibitorsPage() {
  const params = useParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBoothSize, setSelectedBoothSize] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedRows, setSelectedRows] = useState<string[]>([])

  const filteredExhibitors = exhibitors.filter((exhibitor) => {
    const matchesSearch =
      exhibitor.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exhibitor.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exhibitor.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesBoothSize = selectedBoothSize === "all" || exhibitor.boothSize.toLowerCase() === selectedBoothSize.toLowerCase()
    const matchesStatus = selectedStatus === "all" || exhibitor.status.toLowerCase() === selectedStatus.toLowerCase().replace(" ", "-")
    return matchesSearch && matchesBoothSize && matchesStatus
  })

  const toggleSelectAll = () => {
    if (selectedRows.length === filteredExhibitors.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(filteredExhibitors.map((e) => e.id))
    }
  }

  const toggleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id))
    } else {
      setSelectedRows([...selectedRows, id])
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Exhibitors</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage exhibitor registrations for your event
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button className="gap-2">
              <Building2 className="h-4 w-4" />
              Add Exhibitor
            </Button>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Stats Widgets */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="cursor-pointer transition-shadow hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="mt-1 text-3xl font-bold text-foreground">{stat.value.toLocaleString()}</p>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[250px] max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by company, contact, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={selectedBoothSize} onValueChange={setSelectedBoothSize}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Booth Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sizes</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="small">Small</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="registered">Registered</SelectItem>
              <SelectItem value="attended">Attended</SelectItem>
              <SelectItem value="on hold">On Hold</SelectItem>
              <SelectItem value="open">Open</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Selected Actions */}
        {selectedRows.length > 0 && (
          <div className="mb-4 flex items-center gap-4 rounded-lg border border-border bg-muted/50 px-4 py-3">
            <span className="text-sm font-medium text-foreground">
              {selectedRows.length} selected
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Mark Attended
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <PauseCircle className="h-4 w-4" />
                Put On Hold
              </Button>
              <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        )}

        {/* Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedRows.length === filteredExhibitors.length && filteredExhibitors.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Booth</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExhibitors.map((exhibitor) => (
                <TableRow key={exhibitor.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(exhibitor.id)}
                      onCheckedChange={() => toggleSelectRow(exhibitor.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                        <Building2 className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{exhibitor.companyName}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Globe className="h-3 w-3" />
                          {exhibitor.website}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground">{exhibitor.contactPerson}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" />
                      {exhibitor.email}
                    </div>
                  </TableCell>
                  <TableCell>{getBoothBadge(exhibitor.boothSize)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {exhibitor.location}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{exhibitor.registeredAt}</TableCell>
                  <TableCell>{getStatusBadge(exhibitor.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2">
                          <Eye className="h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Mail className="h-4 w-4" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          Mark Attended
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <PauseCircle className="h-4 w-4" />
                          Put On Hold
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 text-destructive">
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Pagination Info */}
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <p>Showing {filteredExhibitors.length} of {exhibitors.length} exhibitors</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
