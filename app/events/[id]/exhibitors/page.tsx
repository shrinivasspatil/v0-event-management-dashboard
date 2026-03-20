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
  MapPin,
  Plus,
  Pencil,
  X,
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

interface Exhibitor {
  id: string
  name: string
  email: string
  whatsappNo: string
  stallSizeSqmtrs: number
  booth: string
  registeredAt: string
  status: string
}

// Sample exhibitors data
const initialExhibitors: Exhibitor[] = [
  {
    id: "1",
    name: "John Anderson",
    email: "john@techsolutions.com",
    whatsappNo: "+91 98765 43210",
    stallSizeSqmtrs: 100,
    booth: "Hall A - Booth 101",
    registeredAt: "Mar 15, 2026",
    status: "Attended",
  },
  {
    id: "2",
    name: "Sarah Mitchell",
    email: "sarah@designstudio.com",
    whatsappNo: "+91 87654 32109",
    stallSizeSqmtrs: 50,
    booth: "Hall B - Booth 205",
    registeredAt: "Mar 14, 2026",
    status: "Registered",
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "m.chen@innovationlabs.io",
    whatsappNo: "+91 76543 21098",
    stallSizeSqmtrs: 150,
    booth: "Hall A - Booth 102",
    registeredAt: "Mar 14, 2026",
    status: "Attended",
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    email: "emily@marketingpro.com",
    whatsappNo: "+91 65432 10987",
    stallSizeSqmtrs: 25,
    booth: "Hall C - Booth 310",
    registeredAt: "Mar 13, 2026",
    status: "On Hold",
  },
  {
    id: "5",
    name: "David Kim",
    email: "d.kim@startupventures.co",
    whatsappNo: "+91 54321 09876",
    stallSizeSqmtrs: 50,
    booth: "Hall B - Booth 208",
    registeredAt: "Mar 13, 2026",
    status: "Open",
  },
  {
    id: "6",
    name: "Lisa Thompson",
    email: "lisa@globalsolutions.com",
    whatsappNo: "+91 43210 98765",
    stallSizeSqmtrs: 100,
    booth: "Hall A - Booth 105",
    registeredAt: "Mar 12, 2026",
    status: "Attended",
  },
  {
    id: "7",
    name: "James Wilson",
    email: "j.wilson@enterprise.com",
    whatsappNo: "+91 32109 87654",
    stallSizeSqmtrs: 200,
    booth: "Hall A - Booth 103",
    registeredAt: "Mar 12, 2026",
    status: "Open",
  },
  {
    id: "8",
    name: "Amanda Foster",
    email: "a.foster@creativeagency.co",
    whatsappNo: "+91 21098 76543",
    stallSizeSqmtrs: 25,
    booth: "Hall C - Booth 315",
    registeredAt: "Mar 11, 2026",
    status: "Registered",
  },
  {
    id: "9",
    name: "Robert Martinez",
    email: "r.martinez@financeplus.com",
    whatsappNo: "+91 10987 65432",
    stallSizeSqmtrs: 75,
    booth: "Hall B - Booth 210",
    registeredAt: "Mar 11, 2026",
    status: "Attended",
  },
  {
    id: "10",
    name: "Jennifer Lee",
    email: "j.lee@healthtech.io",
    whatsappNo: "+91 09876 54321",
    stallSizeSqmtrs: 100,
    booth: "Hall A - Booth 108",
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

export default function ExhibitorsPage() {
  const params = useParams()
  const [exhibitors, setExhibitors] = useState<Exhibitor[]>(initialExhibitors)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedExhibitor, setSelectedExhibitor] = useState<Exhibitor | null>(null)

  // Add exhibitor form state
  const [newExhibitor, setNewExhibitor] = useState({
    name: "",
    email: "",
    whatsappNo: "",
    stallSizeSqmtrs: "",
    booth: "",
  })

  const filteredExhibitors = exhibitors.filter((exhibitor) => {
    const matchesSearch =
      exhibitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exhibitor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exhibitor.booth.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === "all" || exhibitor.status.toLowerCase() === selectedStatus.toLowerCase().replace(" ", "-")
    return matchesSearch && matchesStatus
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

  const handleViewDetails = (exhibitor: Exhibitor) => {
    setSelectedExhibitor(exhibitor)
    setIsViewModalOpen(true)
  }

  const handleAddExhibitor = () => {
    if (!newExhibitor.name || !newExhibitor.email || !newExhibitor.whatsappNo || !newExhibitor.stallSizeSqmtrs) return
    
    const exhibitor: Exhibitor = {
      id: String(exhibitors.length + 1),
      name: newExhibitor.name,
      email: newExhibitor.email,
      whatsappNo: newExhibitor.whatsappNo,
      stallSizeSqmtrs: Number(newExhibitor.stallSizeSqmtrs),
      booth: newExhibitor.booth || "Pending Assignment",
      registeredAt: "Mar 20, 2026",
      status: "Open",
    }
    
    setExhibitors([exhibitor, ...exhibitors])
    setNewExhibitor({ name: "", email: "", whatsappNo: "", stallSizeSqmtrs: "", booth: "" })
    setIsAddModalOpen(false)
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
            <Button className="gap-2" onClick={() => setIsAddModalOpen(true)}>
              <Plus className="h-4 w-4" />
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
              placeholder="Search by name, email, or booth..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
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
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>WhatsApp No</TableHead>
                <TableHead>Stall Size (Sqmtrs)</TableHead>
                <TableHead>Booth</TableHead>
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
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-sm font-medium text-primary">
                          {exhibitor.name.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                      <span className="font-medium text-foreground">{exhibitor.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" />
                      {exhibitor.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" />
                      {exhibitor.whatsappNo}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-foreground">{exhibitor.stallSizeSqmtrs} sqm</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {exhibitor.booth}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(exhibitor.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2" onClick={() => handleViewDetails(exhibitor)}>
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

      {/* Add Exhibitor Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Exhibitor</DialogTitle>
            <DialogDescription>
              Register a new exhibitor for this event. Fields marked with * are required.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={newExhibitor.name}
                onChange={(e) => setNewExhibitor({ ...newExhibitor, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={newExhibitor.email}
                onChange={(e) => setNewExhibitor({ ...newExhibitor, email: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="whatsappNo">WhatsApp Mobile No <span className="text-destructive">*</span></Label>
              <Input
                id="whatsappNo"
                placeholder="Enter WhatsApp number"
                value={newExhibitor.whatsappNo}
                onChange={(e) => setNewExhibitor({ ...newExhibitor, whatsappNo: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stallSize">Required Stall Size (Sqmtrs) <span className="text-destructive">*</span></Label>
              <Input
                id="stallSize"
                type="number"
                placeholder="Enter stall size in square meters"
                value={newExhibitor.stallSizeSqmtrs}
                onChange={(e) => setNewExhibitor({ ...newExhibitor, stallSizeSqmtrs: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="booth">Booth Assignment</Label>
              <Input
                id="booth"
                placeholder="e.g. Hall A - Booth 101"
                value={newExhibitor.booth}
                onChange={(e) => setNewExhibitor({ ...newExhibitor, booth: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddExhibitor}>
              Add Exhibitor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Exhibitor Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Exhibitor Details</DialogTitle>
          </DialogHeader>
          {selectedExhibitor && (
            <div className="py-4">
              {/* Header with avatar */}
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-xl font-semibold text-primary">
                    {selectedExhibitor.name.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{selectedExhibitor.name}</h3>
                  <div className="mt-1">{getStatusBadge(selectedExhibitor.status)}</div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">{selectedExhibitor.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">WhatsApp Mobile No</p>
                    <p className="font-medium text-foreground">{selectedExhibitor.whatsappNo}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Required Stall Size</p>
                    <p className="font-medium text-foreground">{selectedExhibitor.stallSizeSqmtrs} Sqmtrs</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Booth Assignment</p>
                    <p className="font-medium text-foreground">{selectedExhibitor.booth}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <Button variant="outline" className="flex-1 gap-2">
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
                <Button variant="outline" className="flex-1 gap-2">
                  <Mail className="h-4 w-4" />
                  Send Email
                </Button>
                <Button className="flex-1 gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Mark Attended
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
