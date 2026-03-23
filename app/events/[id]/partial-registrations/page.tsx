"use client"

import { useState } from "react"
import {
  Search,
  Phone,
  Clock,
  MoreHorizontal,
  Trash2,
  MessageSquare,
  UserPlus,
  AlertCircle,
  Calendar,
  Filter,
  Download,
  RefreshCw,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface PartialRegistration {
  id: string
  mobileNo: string
  otpVerified: boolean
  verifiedAt: string
  registrationForm: string
  attemptCount: number
  lastAttempt: string
  source: string
}

const initialData: PartialRegistration[] = [
  {
    id: "1",
    mobileNo: "9876543210",
    otpVerified: true,
    verifiedAt: "Mar 20, 2026 10:30 AM",
    registrationForm: "Shrinivas",
    attemptCount: 1,
    lastAttempt: "Mar 20, 2026 10:32 AM",
    source: "Direct Link",
  },
  {
    id: "2",
    mobileNo: "9123456789",
    otpVerified: true,
    verifiedAt: "Mar 19, 2026 2:15 PM",
    registrationForm: "Vinay",
    attemptCount: 3,
    lastAttempt: "Mar 19, 2026 2:45 PM",
    source: "WhatsApp",
  },
  {
    id: "3",
    mobileNo: "9988776655",
    otpVerified: true,
    verifiedAt: "Mar 19, 2026 11:00 AM",
    registrationForm: "Ravi",
    attemptCount: 1,
    lastAttempt: "Mar 19, 2026 11:05 AM",
    source: "Email Campaign",
  },
  {
    id: "4",
    mobileNo: "9112233445",
    otpVerified: true,
    verifiedAt: "Mar 18, 2026 4:20 PM",
    registrationForm: "Shrinivas",
    attemptCount: 2,
    lastAttempt: "Mar 18, 2026 4:35 PM",
    source: "Direct Link",
  },
  {
    id: "5",
    mobileNo: "9556677889",
    otpVerified: true,
    verifiedAt: "Mar 18, 2026 9:45 AM",
    registrationForm: "Vinay",
    attemptCount: 1,
    lastAttempt: "Mar 18, 2026 9:50 AM",
    source: "Social Media",
  },
  {
    id: "6",
    mobileNo: "9443322110",
    otpVerified: true,
    verifiedAt: "Mar 17, 2026 3:30 PM",
    registrationForm: "Ravi",
    attemptCount: 4,
    lastAttempt: "Mar 17, 2026 4:00 PM",
    source: "Direct Link",
  },
  {
    id: "7",
    mobileNo: "9667788990",
    otpVerified: true,
    verifiedAt: "Mar 17, 2026 1:00 PM",
    registrationForm: "Shrinivas",
    attemptCount: 1,
    lastAttempt: "Mar 17, 2026 1:02 PM",
    source: "WhatsApp",
  },
  {
    id: "8",
    mobileNo: "9778899001",
    otpVerified: true,
    verifiedAt: "Mar 16, 2026 10:15 AM",
    registrationForm: "Vinay",
    attemptCount: 2,
    lastAttempt: "Mar 16, 2026 10:30 AM",
    source: "Email Campaign",
  },
]

const registrationForms = [
  { id: "all", name: "All Forms" },
  { id: "1", name: "Shrinivas" },
  { id: "2", name: "Vinay" },
  { id: "3", name: "Ravi" },
]

export default function PartialRegistrationsPage() {
  const [data, setData] = useState<PartialRegistration[]>(initialData)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedForm, setSelectedForm] = useState("all")
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [isSendReminderOpen, setIsSendReminderOpen] = useState(false)
  const [reminderTarget, setReminderTarget] = useState<PartialRegistration | null>(null)
  const [isSending, setIsSending] = useState(false)

  // Stats
  const totalPartial = data.length
  const todayCount = data.filter(d => d.verifiedAt.includes("Mar 20")).length
  const multipleAttempts = data.filter(d => d.attemptCount > 1).length
  const last7Days = data.length // Simplified for demo

  // Filter data
  const filteredData = data.filter(item => {
    const matchesSearch = item.mobileNo.includes(searchQuery)
    const matchesForm = selectedForm === "all" || item.registrationForm === registrationForms.find(f => f.id === selectedForm)?.name
    return matchesSearch && matchesForm
  })

  // Select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(filteredData.map(d => d.id))
    } else {
      setSelectedRows([])
    }
  }

  // Select row
  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRows([...selectedRows, id])
    } else {
      setSelectedRows(selectedRows.filter(r => r !== id))
    }
  }

  // Delete
  const handleDelete = (id: string) => {
    setDeleteTarget(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (deleteTarget === "bulk") {
      setData(data.filter(d => !selectedRows.includes(d.id)))
      setSelectedRows([])
    } else if (deleteTarget) {
      setData(data.filter(d => d.id !== deleteTarget))
    }
    setIsDeleteDialogOpen(false)
    setDeleteTarget(null)
  }

  // Send reminder
  const handleSendReminder = (item: PartialRegistration) => {
    setReminderTarget(item)
    setIsSendReminderOpen(true)
  }

  const confirmSendReminder = async () => {
    setIsSending(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSending(false)
    setIsSendReminderOpen(false)
    setReminderTarget(null)
  }

  // Bulk delete
  const handleBulkDelete = () => {
    setDeleteTarget("bulk")
    setIsDeleteDialogOpen(true)
  }

  // Export
  const handleExport = () => {
    // Export logic
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Partial Registrations</h1>
        <p className="mt-1 text-muted-foreground">
          Visitors who verified their mobile number but did not complete the registration form
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                <AlertCircle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalPartial}</p>
                <p className="text-sm text-muted-foreground">Total Incomplete</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{todayCount}</p>
                <p className="text-sm text-muted-foreground">Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
                <RefreshCw className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{multipleAttempts}</p>
                <p className="text-sm text-muted-foreground">Multiple Attempts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{last7Days}</p>
                <p className="text-sm text-muted-foreground">Last 7 Days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by mobile number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={selectedForm} onValueChange={setSelectedForm}>
            <SelectTrigger className="w-40">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by form" />
            </SelectTrigger>
            <SelectContent>
              {registrationForms.map((form) => (
                <SelectItem key={form.id} value={form.id}>
                  {form.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-3">
          {selectedRows.length > 0 && (
            <>
              <Button variant="outline" size="sm" onClick={handleBulkDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete ({selectedRows.length})
              </Button>
              <Button variant="outline" size="sm">
                <MessageSquare className="mr-2 h-4 w-4" />
                Send Reminder ({selectedRows.length})
              </Button>
            </>
          )}
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedRows.length === filteredData.length && filteredData.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Mobile Number</TableHead>
                <TableHead>OTP Status</TableHead>
                <TableHead>Verified At</TableHead>
                <TableHead>Registration Form</TableHead>
                <TableHead>Attempts</TableHead>
                <TableHead>Last Attempt</TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">No partial registrations found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.includes(item.id)}
                        onCheckedChange={(checked) => handleSelectRow(item.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 font-medium">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {item.mobileNo}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        Verified
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{item.verifiedAt}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.registrationForm}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className={item.attemptCount > 2 ? "font-medium text-orange-600" : ""}>
                        {item.attemptCount}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{item.lastAttempt}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{item.source}</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleSendReminder(item)}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Send Reminder
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Complete Registration
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(item.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Info Banner */}
      <Card className="mt-6 border-orange-200 bg-orange-50">
        <CardContent className="flex items-start gap-3 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 text-orange-600" />
          <div>
            <p className="font-medium text-orange-800">Recover Lost Registrations</p>
            <p className="text-sm text-orange-700">
              These visitors verified their phone number but left before completing the form. 
              Send them a reminder via SMS or WhatsApp to complete their registration.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Partial Registration?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget === "bulk"
                ? `This will permanently delete ${selectedRows.length} selected records. This action cannot be undone.`
                : "This will permanently delete this partial registration record. This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Send Reminder Dialog */}
      <Dialog open={isSendReminderOpen} onOpenChange={setIsSendReminderOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Registration Reminder</DialogTitle>
            <DialogDescription>
              Send a reminder to complete the registration form
            </DialogDescription>
          </DialogHeader>
          {reminderTarget && (
            <div className="space-y-4 py-4">
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{reminderTarget.mobileNo}</p>
                    <p className="text-sm text-muted-foreground">
                      Form: {reminderTarget.registrationForm}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Send via:</p>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    SMS
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    WhatsApp
                  </Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSendReminderOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmSendReminder} disabled={isSending}>
              {isSending ? "Sending..." : "Send Reminder"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
