"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import {
  Search,
  Filter,
  Download,
  MoreHorizontal,
  UserCheck,
  UserX,
  Clock,
  Users,
  Mail,
  Phone,
  Eye,
  Trash2,
  CheckCircle2,
  XCircle,
  Plus,
  MapPin,
  Briefcase,
  Edit,
  Send,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Stats data
const stats = [
  {
    label: "Registered",
    value: 1847,
    icon: Users,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    label: "Attended",
    value: 1245,
    icon: UserCheck,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    label: "Rejected",
    value: 52,
    icon: UserX,
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
  {
    label: "Open",
    value: 550,
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
]

// Industry options
const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Manufacturing",
  "Retail",
  "Education",
  "Real Estate",
  "Marketing",
  "Consulting",
  "Other",
]

// Registration forms
const registrationForms = [
  { id: "all", name: "All Forms" },
  { id: "shrinivas", name: "Shrinivas" },
  { id: "vinay", name: "Vinay" },
  { id: "ravi", name: "Ravi" },
]

// Sample visitors data with updated fields
const visitorsData = [
  {
    id: "1",
    name: "John Anderson",
    email: "john.anderson@example.com",
    mobileNo: "+1 (555) 123-4567",
    city: "San Francisco",
    industry: "Technology",
    registrationForm: "Shrinivas",
    registeredAt: "Mar 15, 2026",
    status: "Attended",
  },
  {
    id: "2",
    name: "Sarah Mitchell",
    email: "sarah.m@example.com",
    mobileNo: "+1 (555) 234-5678",
    city: "New York",
    industry: "Marketing",
    registrationForm: "Vinay",
    registeredAt: "Mar 14, 2026",
    status: "Registered",
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "m.chen@example.com",
    mobileNo: "+1 (555) 345-6789",
    city: "Los Angeles",
    industry: "Healthcare",
    registrationForm: "Ravi",
    registeredAt: "Mar 14, 2026",
    status: "Attended",
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    email: "emily.r@example.com",
    mobileNo: "+1 (555) 456-7890",
    city: "Chicago",
    industry: "Finance",
    registrationForm: "Shrinivas",
    registeredAt: "Mar 13, 2026",
    status: "Rejected",
  },
  {
    id: "5",
    name: "David Kim",
    email: "d.kim@example.com",
    mobileNo: "+1 (555) 567-8901",
    city: "Seattle",
    industry: "Technology",
    registrationForm: "Vinay",
    registeredAt: "Mar 13, 2026",
    status: "Open",
  },
  {
    id: "6",
    name: "Lisa Thompson",
    email: "lisa.t@example.com",
    mobileNo: "+1 (555) 678-9012",
    city: "Boston",
    industry: "Education",
    registrationForm: "Ravi",
    registeredAt: "Mar 12, 2026",
    status: "Attended",
  },
  {
    id: "7",
    name: "James Wilson",
    email: "j.wilson@example.com",
    mobileNo: "+1 (555) 789-0123",
    city: "Austin",
    industry: "Consulting",
    registrationForm: "Shrinivas",
    registeredAt: "Mar 12, 2026",
    status: "Open",
  },
  {
    id: "8",
    name: "Amanda Foster",
    email: "a.foster@example.com",
    mobileNo: "+1 (555) 890-1234",
    city: "Denver",
    industry: "Retail",
    registrationForm: "Vinay",
    registeredAt: "Mar 11, 2026",
    status: "Registered",
  },
  {
    id: "9",
    name: "Robert Martinez",
    email: "r.martinez@example.com",
    mobileNo: "+1 (555) 901-2345",
    city: "Miami",
    industry: "Real Estate",
    registrationForm: "Ravi",
    registeredAt: "Mar 11, 2026",
    status: "Attended",
  },
  {
    id: "10",
    name: "Jennifer Lee",
    email: "j.lee@example.com",
    mobileNo: "+1 (555) 012-3456",
    city: "Portland",
    industry: "Manufacturing",
    registrationForm: "Shrinivas",
    registeredAt: "Mar 10, 2026",
    status: "Open",
  },
]

type Visitor = typeof visitorsData[0]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Attended":
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Attended</Badge>
    case "Registered":
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Registered</Badge>
    case "Rejected":
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Rejected</Badge>
    case "Open":
      return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Open</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function VisitorsPage() {
  const params = useParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedForm, setSelectedForm] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [visitors, setVisitors] = useState(visitorsData)
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null)
  
  // Add visitor form state
  const [newVisitor, setNewVisitor] = useState({
    name: "",
    email: "",
    mobileNo: "",
    city: "",
    industry: "",
  })

  const filteredVisitors = visitors.filter((visitor) => {
    const matchesSearch =
      visitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visitor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visitor.city.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesForm = selectedForm === "all" || visitor.registrationForm.toLowerCase() === selectedForm
    const matchesStatus = selectedStatus === "all" || visitor.status.toLowerCase() === selectedStatus.toLowerCase()
    return matchesSearch && matchesForm && matchesStatus
  })

  const toggleSelectAll = () => {
    if (selectedRows.length === filteredVisitors.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(filteredVisitors.map((v) => v.id))
    }
  }

  const toggleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id))
    } else {
      setSelectedRows([...selectedRows, id])
    }
  }

  const handleViewDetails = (visitor: Visitor) => {
    setSelectedVisitor(visitor)
    setIsViewModalOpen(true)
  }

  const handleAddVisitor = () => {
    if (!newVisitor.name || !newVisitor.email || !newVisitor.mobileNo) return
    
    const visitor: Visitor = {
      id: String(visitors.length + 1),
      name: newVisitor.name,
      email: newVisitor.email,
      mobileNo: newVisitor.mobileNo,
      city: newVisitor.city,
      industry: newVisitor.industry,
      registrationForm: "Shrinivas",
      registeredAt: "Mar 20, 2026",
      status: "Open",
    }
    
    setVisitors([visitor, ...visitors])
    setNewVisitor({ name: "", email: "", mobileNo: "", city: "", industry: "" })
    setIsAddModalOpen(false)
  }

  const handleMarkAttended = (id: string) => {
    setVisitors(visitors.map(v => v.id === id ? { ...v, status: "Attended" } : v))
  }

  const handleReject = (id: string) => {
    setVisitors(visitors.map(v => v.id === id ? { ...v, status: "Rejected" } : v))
  }

  const handleDelete = (id: string) => {
    setVisitors(visitors.filter(v => v.id !== id))
    setSelectedRows(selectedRows.filter(rowId => rowId !== id))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Visitors</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage visitor registrations for your event
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button className="gap-2" onClick={() => setIsAddModalOpen(true)}>
              <Plus className="h-4 w-4" />
              Add Visitor
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
              placeholder="Search by name, email, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={selectedForm} onValueChange={setSelectedForm}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Registration Form" />
            </SelectTrigger>
            <SelectContent>
              {registrationForms.map((form) => (
                <SelectItem key={form.id} value={form.id}>
                  {form.name}
                </SelectItem>
              ))}
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
              <SelectItem value="rejected">Rejected</SelectItem>
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
                <XCircle className="h-4 w-4" />
                Reject
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
                    checked={selectedRows.length === filteredVisitors.length && filteredVisitors.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Mobile No</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVisitors.map((visitor) => (
                <TableRow key={visitor.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(visitor.id)}
                      onCheckedChange={() => toggleSelectRow(visitor.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{visitor.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" />
                      {visitor.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" />
                      {visitor.mobileNo}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {visitor.city}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Briefcase className="h-3.5 w-3.5" />
                      {visitor.industry}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(visitor.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2" onClick={() => handleViewDetails(visitor)}>
                          <Eye className="h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Edit className="h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Send className="h-4 w-4" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2" onClick={() => handleMarkAttended(visitor.id)}>
                          <CheckCircle2 className="h-4 w-4" />
                          Mark Attended
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2" onClick={() => handleReject(visitor.id)}>
                          <XCircle className="h-4 w-4" />
                          Reject
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 text-destructive" onClick={() => handleDelete(visitor.id)}>
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
          <p>Showing {filteredVisitors.length} of {visitors.length} visitors</p>
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

      {/* Add Visitor Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Visitor</DialogTitle>
            <DialogDescription>
              Enter the visitor details to register them for this event.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={newVisitor.name}
                onChange={(e) => setNewVisitor({ ...newVisitor, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={newVisitor.email}
                onChange={(e) => setNewVisitor({ ...newVisitor, email: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mobileNo">Mobile No <span className="text-destructive">*</span></Label>
              <Input
                id="mobileNo"
                placeholder="Enter mobile number"
                value={newVisitor.mobileNo}
                onChange={(e) => setNewVisitor({ ...newVisitor, mobileNo: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="Enter city"
                value={newVisitor.city}
                onChange={(e) => setNewVisitor({ ...newVisitor, city: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="industry">Industry</Label>
              <Select
                value={newVisitor.industry}
                onValueChange={(value) => setNewVisitor({ ...newVisitor, industry: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddVisitor}>
              Add Visitor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Visitor Details</DialogTitle>
            <DialogDescription>
              Complete information about the visitor registration.
            </DialogDescription>
          </DialogHeader>
          {selectedVisitor && (
            <div className="py-4">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-2xl font-semibold text-primary">
                    {selectedVisitor.name.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{selectedVisitor.name}</h3>
                  <div className="mt-1">{getStatusBadge(selectedVisitor.status)}</div>
                </div>
              </div>
              
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-border p-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">Email</span>
                    </div>
                    <p className="mt-1 font-medium text-foreground">{selectedVisitor.email}</p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">Mobile No</span>
                    </div>
                    <p className="mt-1 font-medium text-foreground">{selectedVisitor.mobileNo}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-border p-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">City</span>
                    </div>
                    <p className="mt-1 font-medium text-foreground">{selectedVisitor.city}</p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Briefcase className="h-4 w-4" />
                      <span className="text-sm">Industry</span>
                    </div>
                    <p className="mt-1 font-medium text-foreground">{selectedVisitor.industry}</p>
                  </div>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">Registration Form</span>
                  </div>
                  <p className="mt-1 font-medium text-foreground">{selectedVisitor.registrationForm}</p>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Registered At</span>
                  </div>
                  <p className="mt-1 font-medium text-foreground">{selectedVisitor.registeredAt}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button variant="outline" className="gap-2" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
            <Button variant="outline" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button variant="outline" className="gap-2">
              <Send className="h-4 w-4" />
              Send Email
            </Button>
            {selectedVisitor?.status !== "Attended" && (
              <Button className="gap-2" onClick={() => {
                if (selectedVisitor) handleMarkAttended(selectedVisitor.id)
                setIsViewModalOpen(false)
              }}>
                <CheckCircle2 className="h-4 w-4" />
                Mark Attended
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
