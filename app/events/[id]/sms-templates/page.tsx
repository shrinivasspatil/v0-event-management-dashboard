"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import {
  Plus,
  Search,
  MessageSquare,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Copy,
  Users,
  Building2,
  Send,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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

interface SMSTemplate {
  id: string
  name: string
  message: string
  type: "visitor" | "exhibitor"
  trigger: string
  status: "Active" | "Inactive"
  lastEdited: string
  sentCount: number
  deliveryRate: number
}

const initialTemplates: SMSTemplate[] = [
  {
    id: "1",
    name: "Visitor Registration Confirmation",
    message: "Hi {name}, your registration for {event_name} is confirmed! Event date: {date}. See you there!",
    type: "visitor",
    trigger: "On Registration",
    status: "Active",
    lastEdited: "Mar 15, 2026",
    sentCount: 1245,
    deliveryRate: 98,
  },
  {
    id: "2",
    name: "Visitor Registration Approved",
    message: "Great news {name}! Your registration for {event_name} has been approved. Download your pass at {link}",
    type: "visitor",
    trigger: "On Approval",
    status: "Active",
    lastEdited: "Mar 12, 2026",
    sentCount: 980,
    deliveryRate: 97,
  },
  {
    id: "3",
    name: "Visitor Registration Rejected",
    message: "Hi {name}, we regret to inform you that your registration for {event_name} could not be approved.",
    type: "visitor",
    trigger: "On Rejection",
    status: "Active",
    lastEdited: "Mar 10, 2026",
    sentCount: 52,
    deliveryRate: 96,
  },
  {
    id: "4",
    name: "Visitor Event Reminder",
    message: "Reminder: {event_name} is tomorrow at {venue}! Show your pass at entry. Looking forward to seeing you!",
    type: "visitor",
    trigger: "1 Day Before Event",
    status: "Active",
    lastEdited: "Mar 8, 2026",
    sentCount: 850,
    deliveryRate: 99,
  },
  {
    id: "5",
    name: "Exhibitor Registration Confirmation",
    message: "Thank you {name}! Your exhibitor registration for {event_name} is received. We'll confirm your booth soon.",
    type: "exhibitor",
    trigger: "On Registration",
    status: "Active",
    lastEdited: "Mar 14, 2026",
    sentCount: 156,
    deliveryRate: 98,
  },
  {
    id: "6",
    name: "Exhibitor Booth Assigned",
    message: "Hi {name}, your booth {booth_no} at {event_name} is confirmed! Setup starts {setup_date}. Check email for details.",
    type: "exhibitor",
    trigger: "On Booth Assignment",
    status: "Active",
    lastEdited: "Mar 11, 2026",
    sentCount: 98,
    deliveryRate: 97,
  },
  {
    id: "7",
    name: "Exhibitor Setup Reminder",
    message: "Reminder: Booth setup for {event_name} begins tomorrow at 8 AM. Please bring your exhibitor ID.",
    type: "exhibitor",
    trigger: "1 Day Before Setup",
    status: "Inactive",
    lastEdited: "Mar 5, 2026",
    sentCount: 0,
    deliveryRate: 0,
  },
]

const triggers = [
  "On Registration",
  "On Approval",
  "On Rejection",
  "On Booth Assignment",
  "1 Day Before Event",
  "1 Day Before Setup",
  "3 Days Before Event",
  "After Event",
]

const variables = [
  { name: "{name}", desc: "Recipient name" },
  { name: "{event_name}", desc: "Event name" },
  { name: "{date}", desc: "Event date" },
  { name: "{venue}", desc: "Event venue" },
  { name: "{link}", desc: "Pass/ticket link" },
  { name: "{booth_no}", desc: "Booth number" },
  { name: "{setup_date}", desc: "Setup date" },
]

const MAX_SMS_LENGTH = 160

export default function SMSTemplatesPage() {
  const params = useParams()
  const eventId = params.id as string
  
  const [templates, setTemplates] = useState<SMSTemplate[]>(initialTemplates)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isSendTestModalOpen, setIsSendTestModalOpen] = useState(false)
  
  const [selectedTemplate, setSelectedTemplate] = useState<SMSTemplate | null>(null)
  const [testPhone, setTestPhone] = useState("")
  const [sendingTest, setSendingTest] = useState(false)
  const [testSent, setTestSent] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    message: "",
    type: "visitor" as "visitor" | "exhibitor",
    trigger: "",
    status: "Active" as "Active" | "Inactive",
  })

  const resetForm = () => {
    setFormData({
      name: "",
      message: "",
      type: "visitor",
      trigger: "",
      status: "Active",
    })
  }

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.message.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || template.type === filterType
    return matchesSearch && matchesType
  })

  const visitorTemplates = templates.filter((t) => t.type === "visitor")
  const exhibitorTemplates = templates.filter((t) => t.type === "exhibitor")
  const activeTemplates = templates.filter((t) => t.status === "Active")

  // Create Template
  const handleCreateTemplate = () => {
    if (!formData.name || !formData.message || !formData.trigger) return

    const template: SMSTemplate = {
      id: String(Date.now()),
      name: formData.name,
      message: formData.message,
      type: formData.type,
      trigger: formData.trigger,
      status: formData.status,
      lastEdited: "Mar 20, 2026",
      sentCount: 0,
      deliveryRate: 0,
    }

    setTemplates([template, ...templates])
    resetForm()
    setIsCreateModalOpen(false)
  }

  // Edit Template
  const openEditModal = (template: SMSTemplate) => {
    setSelectedTemplate(template)
    setFormData({
      name: template.name,
      message: template.message,
      type: template.type,
      trigger: template.trigger,
      status: template.status,
    })
    setIsEditModalOpen(true)
  }

  const handleUpdateTemplate = () => {
    if (!selectedTemplate || !formData.name || !formData.message || !formData.trigger) return

    setTemplates(
      templates.map((t) =>
        t.id === selectedTemplate.id
          ? {
              ...t,
              name: formData.name,
              message: formData.message,
              type: formData.type,
              trigger: formData.trigger,
              status: formData.status,
              lastEdited: "Mar 20, 2026",
            }
          : t
      )
    )
    resetForm()
    setIsEditModalOpen(false)
    setSelectedTemplate(null)
  }

  // Delete Template
  const openDeleteDialog = (template: SMSTemplate) => {
    setSelectedTemplate(template)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteTemplate = () => {
    if (!selectedTemplate) return
    setTemplates(templates.filter((t) => t.id !== selectedTemplate.id))
    setIsDeleteDialogOpen(false)
    setSelectedTemplate(null)
  }

  // Duplicate Template
  const handleDuplicateTemplate = (template: SMSTemplate) => {
    const duplicate: SMSTemplate = {
      ...template,
      id: String(Date.now()),
      name: `${template.name} (Copy)`,
      lastEdited: "Mar 20, 2026",
      sentCount: 0,
      deliveryRate: 0,
    }
    setTemplates([duplicate, ...templates])
  }

  // Toggle Status
  const handleToggleStatus = (id: string) => {
    setTemplates(
      templates.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "Active" ? "Inactive" : "Active", lastEdited: "Mar 20, 2026" }
          : t
      )
    )
  }

  // Send Test SMS
  const openSendTestModal = (template: SMSTemplate) => {
    setSelectedTemplate(template)
    setTestPhone("")
    setTestSent(false)
    setIsSendTestModalOpen(true)
  }

  const handleSendTestSMS = async () => {
    if (!testPhone || !selectedTemplate) return
    setSendingTest(true)
    // Simulate sending
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setSendingTest(false)
    setTestSent(true)
  }

  // View Template
  const openViewModal = (template: SMSTemplate) => {
    setSelectedTemplate(template)
    setIsViewModalOpen(true)
  }

  const getTypeBadge = (type: "visitor" | "exhibitor") => {
    return type === "visitor" ? (
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
        <Users className="mr-1 h-3 w-3" />
        Visitor
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
        <Building2 className="mr-1 h-3 w-3" />
        Exhibitor
      </Badge>
    )
  }

  const getStatusBadge = (status: "Active" | "Inactive") => {
    return status === "Active" ? (
      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
    ) : (
      <Badge variant="secondary">Inactive</Badge>
    )
  }

  const getCharCountBadge = (length: number) => {
    if (length > MAX_SMS_LENGTH) {
      return (
        <Badge variant="outline" className="border-red-300 text-red-700 bg-red-50">
          <AlertTriangle className="mr-1 h-3 w-3" />
          {length} / {MAX_SMS_LENGTH}
        </Badge>
      )
    } else if (length > MAX_SMS_LENGTH - 20) {
      return (
        <Badge variant="outline" className="border-yellow-300 text-yellow-700 bg-yellow-50">
          {length} / {MAX_SMS_LENGTH}
        </Badge>
      )
    }
    return (
      <Badge variant="outline">
        {length} / {MAX_SMS_LENGTH}
      </Badge>
    )
  }

  // Template Form Component
  const TemplateForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="name">
          Template Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          placeholder="e.g., Registration Confirmation"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label>Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value: "visitor" | "exhibitor") =>
              setFormData({ ...formData, type: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="visitor">Visitor</SelectItem>
              <SelectItem value="exhibitor">Exhibitor</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>
            Trigger <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.trigger}
            onValueChange={(value) => setFormData({ ...formData, trigger: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select trigger" />
            </SelectTrigger>
            <SelectContent>
              {triggers.map((trigger) => (
                <SelectItem key={trigger} value={trigger}>
                  {trigger}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="message">
            Message <span className="text-destructive">*</span>
          </Label>
          <span className={`text-xs font-medium ${formData.message.length > MAX_SMS_LENGTH ? "text-red-600" : formData.message.length > MAX_SMS_LENGTH - 20 ? "text-yellow-600" : "text-muted-foreground"}`}>
            {formData.message.length} / {MAX_SMS_LENGTH} characters
          </span>
        </div>
        <Textarea
          id="message"
          placeholder="Enter SMS message..."
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="font-mono text-sm"
        />
        {formData.message.length > MAX_SMS_LENGTH && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Message exceeds {MAX_SMS_LENGTH} characters and may be split into multiple SMS
          </p>
        )}
        <div className="flex flex-wrap gap-1 mt-1">
          {variables.map((v) => (
            <Badge
              key={v.name}
              variant="outline"
              className="cursor-pointer hover:bg-primary/10 text-xs"
              onClick={() => setFormData({ ...formData, message: formData.message + v.name })}
            >
              {v.name}
            </Badge>
          ))}
        </div>
      </div>
      {isEdit && (
        <div className="flex items-center justify-between rounded-lg border border-border p-3">
          <div>
            <Label htmlFor="status">Template Status</Label>
            <p className="text-xs text-muted-foreground">Active templates will be sent automatically</p>
          </div>
          <Switch
            id="status"
            checked={formData.status === "Active"}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, status: checked ? "Active" : "Inactive" })
            }
          />
        </div>
      )}
    </div>
  )

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">SMS Templates</h1>
          <p className="mt-1 text-muted-foreground">
            Manage SMS templates for visitor and exhibitor notifications
          </p>
        </div>
        <Button onClick={() => { resetForm(); setIsCreateModalOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Templates</p>
                <p className="text-2xl font-bold">{templates.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Visitor Templates</p>
                <p className="text-2xl font-bold">{visitorTemplates.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                <Building2 className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Exhibitor Templates</p>
                <p className="text-2xl font-bold">{exhibitorTemplates.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Templates</p>
                <p className="text-2xl font-bold">{activeTemplates.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="visitor">Visitor</SelectItem>
            <SelectItem value="exhibitor">Exhibitor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Templates Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Template Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Trigger</TableHead>
              <TableHead>Sent</TableHead>
              <TableHead>Delivery Rate</TableHead>
              <TableHead>Characters</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTemplates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <MessageSquare className="h-8 w-8" />
                    <p>No templates found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredTemplates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{template.name}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1 max-w-xs">
                        {template.message}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(template.type)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {template.trigger}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Send className="h-3.5 w-3.5 text-muted-foreground" />
                      {template.sentCount.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-16 rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-green-500"
                          style={{ width: `${template.deliveryRate}%` }}
                        />
                      </div>
                      <span className="text-sm">{template.deliveryRate}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getCharCountBadge(template.message.length)}
                  </TableCell>
                  <TableCell>{getStatusBadge(template.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openViewModal(template)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditModal(template)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit Template
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicateTemplate(template)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openSendTestModal(template)}>
                          <Send className="mr-2 h-4 w-4" />
                          Send Test
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(template.id)}>
                          {template.status === "Active" ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => openDeleteDialog(template)}
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
      </Card>

      {/* Create Template Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create SMS Template</DialogTitle>
            <DialogDescription>
              Create a new SMS template for visitor or exhibitor notifications
            </DialogDescription>
          </DialogHeader>
          <TemplateForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTemplate}>Create Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Template Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit SMS Template</DialogTitle>
            <DialogDescription>
              Update the SMS template details
            </DialogDescription>
          </DialogHeader>
          <TemplateForm isEdit />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditModalOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTemplate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Template Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-lg p-0 gap-0 max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
          <DialogTitle className="sr-only">
            {selectedTemplate?.name || "Template"} Details
          </DialogTitle>
          {selectedTemplate && (
            <>
              <div className="bg-primary/5 border-b border-border p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg font-bold text-foreground">{selectedTemplate.name}</h2>
                      {getStatusBadge(selectedTemplate.status)}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      {getTypeBadge(selectedTemplate.type)}
                      {getCharCountBadge(selectedTemplate.message.length)}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Button size="sm" onClick={() => { setIsViewModalOpen(false); openEditModal(selectedTemplate); }}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDuplicateTemplate(selectedTemplate)}>
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicate
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => { setIsViewModalOpen(false); openSendTestModal(selectedTemplate); }}>
                    <Send className="mr-2 h-4 w-4" />
                    Send Test
                  </Button>
                </div>
              </div>

              <div className="p-5 space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-border bg-card p-3 text-center">
                    <p className="text-xl font-bold text-foreground">
                      {selectedTemplate.sentCount.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">SMS Sent</p>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-3 text-center">
                    <p className="text-xl font-bold text-green-600">{selectedTemplate.deliveryRate}%</p>
                    <p className="text-xs text-muted-foreground">Delivery Rate</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Trigger</span>
                    <span className="font-medium">{selectedTemplate.trigger}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last Edited</span>
                    <span className="font-medium">{selectedTemplate.lastEdited}</span>
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground">Message</Label>
                  <div className="mt-2 rounded-lg border border-border bg-muted/30 p-4">
                    <p className="text-sm whitespace-pre-wrap">{selectedTemplate.message}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => { setIsViewModalOpen(false); openDeleteDialog(selectedTemplate); }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setIsViewModalOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Send Test SMS Modal */}
      <Dialog open={isSendTestModalOpen} onOpenChange={setIsSendTestModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Test SMS</DialogTitle>
            <DialogDescription>
              Send a test SMS to verify the template
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {testSent ? (
              <div className="flex flex-col items-center gap-3 py-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <p className="font-medium text-foreground">Test SMS sent!</p>
                <p className="text-sm text-muted-foreground">Check your phone at {testPhone}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <p className="text-sm font-medium">{selectedTemplate?.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{selectedTemplate?.message}</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="test-phone">Phone Number</Label>
                  <Input
                    id="test-phone"
                    type="tel"
                    placeholder="Enter phone number"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            {testSent ? (
              <Button onClick={() => setIsSendTestModalOpen(false)}>Done</Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsSendTestModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSendTestSMS} disabled={!testPhone || sendingTest}>
                  {sendingTest ? "Sending..." : "Send Test"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedTemplate?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTemplate}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
