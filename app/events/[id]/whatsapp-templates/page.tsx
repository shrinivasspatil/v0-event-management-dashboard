"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import {
  Plus,
  Search,
  MessageCircle,
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
  X,
  AlertCircle,
  ExternalLink,
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

interface WhatsAppTemplate {
  id: string
  name: string
  templateName: string
  message: string
  type: "visitor" | "exhibitor"
  trigger: string
  status: "Active" | "Inactive" | "Pending" | "Rejected"
  approvalStatus: "Approved" | "Pending" | "Rejected"
  lastEdited: string
  sentCount: number
  deliveryRate: number
}

const initialTemplates: WhatsAppTemplate[] = [
  {
    id: "1",
    name: "Visitor Registration Confirmation",
    templateName: "visitor_reg_confirm",
    message: "Hello {{1}}! Thank you for registering for {{2}}. Your registration ID is {{3}}. We look forward to seeing you at the event!",
    type: "visitor",
    trigger: "On Registration",
    status: "Active",
    approvalStatus: "Approved",
    lastEdited: "Mar 15, 2026",
    sentCount: 2450,
    deliveryRate: 98,
  },
  {
    id: "2",
    name: "Visitor Registration Approved",
    templateName: "visitor_approved",
    message: "Great news {{1}}! Your registration for {{2}} has been approved. Download your visitor pass here: {{3}}. See you at the event!",
    type: "visitor",
    trigger: "On Approval",
    status: "Active",
    approvalStatus: "Approved",
    lastEdited: "Mar 12, 2026",
    sentCount: 1890,
    deliveryRate: 97,
  },
  {
    id: "3",
    name: "Visitor Registration Rejected",
    templateName: "visitor_rejected",
    message: "Hello {{1}}, We regret to inform you that your registration for {{2}} could not be approved. For queries, contact us at {{3}}.",
    type: "visitor",
    trigger: "On Rejection",
    status: "Active",
    approvalStatus: "Approved",
    lastEdited: "Mar 10, 2026",
    sentCount: 45,
    deliveryRate: 96,
  },
  {
    id: "4",
    name: "Visitor Event Reminder",
    templateName: "visitor_reminder",
    message: "Reminder: {{1}} is happening tomorrow at {{2}}! Don't forget your visitor pass. Venue: {{3}}. See you there!",
    type: "visitor",
    trigger: "1 Day Before Event",
    status: "Active",
    approvalStatus: "Approved",
    lastEdited: "Mar 8, 2026",
    sentCount: 1650,
    deliveryRate: 99,
  },
  {
    id: "5",
    name: "Exhibitor Registration Confirmation",
    templateName: "exhibitor_reg_confirm",
    message: "Hello {{1}}! Thank you for registering as an exhibitor for {{2}}. Your application is under review. Reference: {{3}}",
    type: "exhibitor",
    trigger: "On Registration",
    status: "Active",
    approvalStatus: "Approved",
    lastEdited: "Mar 14, 2026",
    sentCount: 312,
    deliveryRate: 98,
  },
  {
    id: "6",
    name: "Exhibitor Booth Assignment",
    templateName: "exhibitor_booth",
    message: "Great news {{1}}! Your booth for {{2}} has been assigned. Booth: {{3}}, Location: {{4}}. Setup begins on {{5}}.",
    type: "exhibitor",
    trigger: "On Booth Assignment",
    status: "Active",
    approvalStatus: "Approved",
    lastEdited: "Mar 11, 2026",
    sentCount: 198,
    deliveryRate: 99,
  },
  {
    id: "7",
    name: "Exhibitor Welcome Message",
    templateName: "exhibitor_welcome",
    message: "Welcome {{1}}! We're excited to have you at {{2}}. Your exhibitor kit will be sent to {{3}}. Questions? Reply to this message.",
    type: "exhibitor",
    trigger: "On Approval",
    status: "Inactive",
    approvalStatus: "Pending",
    lastEdited: "Mar 18, 2026",
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
  "3 Days Before Event",
  "7 Days Before Event",
  "After Event",
]

const variables = [
  { name: "{{1}}", desc: "Recipient name" },
  { name: "{{2}}", desc: "Event name" },
  { name: "{{3}}", desc: "Dynamic value (ID/Link/Date)" },
  { name: "{{4}}", desc: "Additional info" },
  { name: "{{5}}", desc: "Extra field" },
]

export default function WhatsAppTemplatesPage() {
  const params = useParams()
  const eventId = params.id as string
  
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>(initialTemplates)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isSendTestModalOpen, setIsSendTestModalOpen] = useState(false)
  
  const [selectedTemplate, setSelectedTemplate] = useState<WhatsAppTemplate | null>(null)
  const [testPhone, setTestPhone] = useState("")
  const [sendingTest, setSendingTest] = useState(false)
  const [testSent, setTestSent] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    templateName: "",
    message: "",
    type: "visitor" as "visitor" | "exhibitor",
    trigger: "On Registration",
    status: "Active" as "Active" | "Inactive",
  })

  // Stats
  const stats = {
    total: templates.length,
    visitor: templates.filter(t => t.type === "visitor").length,
    exhibitor: templates.filter(t => t.type === "exhibitor").length,
    active: templates.filter(t => t.status === "Active").length,
    pending: templates.filter(t => t.approvalStatus === "Pending").length,
  }

  // Filter templates
  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.templateName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || t.type === filterType
    return matchesSearch && matchesType
  })

  // Handlers
  const handleCreate = () => {
    const newTemplate: WhatsAppTemplate = {
      id: String(templates.length + 1),
      name: formData.name,
      templateName: formData.templateName,
      message: formData.message,
      type: formData.type,
      trigger: formData.trigger,
      status: "Inactive",
      approvalStatus: "Pending",
      lastEdited: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      sentCount: 0,
      deliveryRate: 0,
    }
    setTemplates([newTemplate, ...templates])
    setIsCreateModalOpen(false)
    resetForm()
  }

  const handleEdit = () => {
    if (!selectedTemplate) return
    setTemplates(templates.map(t => 
      t.id === selectedTemplate.id 
        ? { 
            ...t, 
            ...formData,
            lastEdited: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
          } 
        : t
    ))
    setIsEditModalOpen(false)
    setSelectedTemplate(null)
    resetForm()
  }

  const handleDelete = () => {
    if (!selectedTemplate) return
    setTemplates(templates.filter(t => t.id !== selectedTemplate.id))
    setIsDeleteDialogOpen(false)
    setSelectedTemplate(null)
  }

  const handleDuplicate = (template: WhatsAppTemplate) => {
    const newTemplate: WhatsAppTemplate = {
      ...template,
      id: String(templates.length + 1),
      name: `${template.name} (Copy)`,
      templateName: `${template.templateName}_copy`,
      status: "Inactive",
      approvalStatus: "Pending",
      lastEdited: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      sentCount: 0,
      deliveryRate: 0,
    }
    setTemplates([newTemplate, ...templates])
  }

  const handleToggleStatus = (template: WhatsAppTemplate) => {
    if (template.approvalStatus !== "Approved") return
    setTemplates(templates.map(t => 
      t.id === template.id 
        ? { ...t, status: t.status === "Active" ? "Inactive" : "Active" } 
        : t
    ))
  }

  const handleSendTest = async () => {
    setSendingTest(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setSendingTest(false)
    setTestSent(true)
    setTimeout(() => {
      setIsSendTestModalOpen(false)
      setTestSent(false)
      setTestPhone("")
    }, 2000)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      templateName: "",
      message: "",
      type: "visitor",
      trigger: "On Registration",
      status: "Active",
    })
  }

  const openEditModal = (template: WhatsAppTemplate) => {
    setSelectedTemplate(template)
    setFormData({
      name: template.name,
      templateName: template.templateName,
      message: template.message,
      type: template.type,
      trigger: template.trigger,
      status: template.status,
    })
    setIsEditModalOpen(true)
  }

  const openViewModal = (template: WhatsAppTemplate) => {
    setSelectedTemplate(template)
    setIsViewModalOpen(true)
  }

  const openDeleteDialog = (template: WhatsAppTemplate) => {
    setSelectedTemplate(template)
    setIsDeleteDialogOpen(true)
  }

  const openSendTestModal = (template: WhatsAppTemplate) => {
    setSelectedTemplate(template)
    setIsSendTestModalOpen(true)
  }

  const getStatusBadge = (status: WhatsAppTemplate["status"]) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
      case "Inactive":
        return <Badge variant="secondary">Inactive</Badge>
      case "Pending":
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>
      case "Rejected":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Rejected</Badge>
    }
  }

  const getApprovalBadge = (status: WhatsAppTemplate["approvalStatus"]) => {
    switch (status) {
      case "Approved":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Approved</Badge>
      case "Pending":
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending Review</Badge>
      case "Rejected":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Rejected</Badge>
    }
  }

  const getTypeBadge = (type: "visitor" | "exhibitor") => {
    return type === "visitor" 
      ? <Badge variant="outline" className="gap-1"><Users className="h-3 w-3" /> Visitor</Badge>
      : <Badge variant="outline" className="gap-1"><Building2 className="h-3 w-3" /> Exhibitor</Badge>
  }

  const insertVariable = (variable: string) => {
    setFormData({ ...formData, message: formData.message + variable })
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">WhatsApp Templates</h1>
            <p className="text-sm text-muted-foreground">Manage WhatsApp message templates for visitors and exhibitors</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Template
          </Button>
        </div>
      </div>

      <div className="p-6">
        {/* Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-5">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <MessageCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total Templates</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.visitor}</p>
                  <p className="text-xs text-muted-foreground">Visitor Templates</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                  <Building2 className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.exhibitor}</p>
                  <p className="text-xs text-muted-foreground">Exhibitor Templates</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.active}</p>
                  <p className="text-xs text-muted-foreground">Active Templates</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-xs text-muted-foreground">Pending Approval</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Banner */}
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="flex items-start gap-3">
            <MessageCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-green-800">WhatsApp Business API Templates</p>
              <p className="text-sm text-green-700">
                Templates must be approved by Meta before they can be used. Use variables like {"{{1}}"}, {"{{2}}"} for dynamic content. 
                <a href="#" className="ml-1 underline inline-flex items-center gap-1">
                  Learn more <ExternalLink className="h-3 w-3" />
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="visitor">Visitor</SelectItem>
              <SelectItem value="exhibitor">Exhibitor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template Name</TableHead>
                <TableHead>Template ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Trigger</TableHead>
                <TableHead>Approval</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTemplates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                    No templates found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTemplates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell>
                      <button
                        onClick={() => openViewModal(template)}
                        className="font-medium text-foreground hover:text-primary hover:underline text-left"
                      >
                        {template.name}
                      </button>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">{template.templateName}</code>
                    </TableCell>
                    <TableCell>{getTypeBadge(template.type)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{template.trigger}</TableCell>
                    <TableCell>{getApprovalBadge(template.approvalStatus)}</TableCell>
                    <TableCell>{getStatusBadge(template.status)}</TableCell>
                    <TableCell className="text-muted-foreground">{template.sentCount.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={template.deliveryRate >= 95 ? "text-green-600" : template.deliveryRate >= 80 ? "text-yellow-600" : "text-red-600"}>
                        {template.deliveryRate}%
                      </span>
                    </TableCell>
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
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(template)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          {template.approvalStatus === "Approved" && (
                            <DropdownMenuItem onClick={() => openSendTestModal(template)}>
                              <Send className="mr-2 h-4 w-4" />
                              Send Test
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {template.approvalStatus === "Approved" && (
                            <DropdownMenuItem onClick={() => handleToggleStatus(template)}>
                              {template.status === "Active" ? (
                                <>
                                  <X className="mr-2 h-4 w-4" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => openDeleteDialog(template)}
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
        </Card>
      </div>

      {/* Create Template Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby="create-template-desc">
          <DialogHeader>
            <DialogTitle>Create WhatsApp Template</DialogTitle>
            <DialogDescription id="create-template-desc">
              Create a new WhatsApp message template. Templates must be approved by Meta before use.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Template Name <span className="text-destructive">*</span></Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Visitor Welcome Message"
                />
              </div>
              <div className="space-y-2">
                <Label>Template ID <span className="text-destructive">*</span></Label>
                <Input
                  value={formData.templateName}
                  onChange={(e) => setFormData({ ...formData, templateName: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                  placeholder="e.g., visitor_welcome"
                />
                <p className="text-xs text-muted-foreground">Lowercase with underscores only</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type <span className="text-destructive">*</span></Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "visitor" | "exhibitor") => setFormData({ ...formData, type: value })}
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
              <div className="space-y-2">
                <Label>Trigger <span className="text-destructive">*</span></Label>
                <Select
                  value={formData.trigger}
                  onValueChange={(value) => setFormData({ ...formData, trigger: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {triggers.map((trigger) => (
                      <SelectItem key={trigger} value={trigger}>{trigger}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Message Content <span className="text-destructive">*</span></Label>
              <Textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Enter your message. Use {{1}}, {{2}}, etc. for variables."
                rows={5}
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {formData.message.length} / 1024 characters
                </p>
                {formData.message.length > 1024 && (
                  <p className="text-xs text-destructive">Message too long</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Variables</Label>
              <div className="flex flex-wrap gap-2">
                {variables.map((v) => (
                  <Button
                    key={v.name}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => insertVariable(v.name)}
                    className="text-xs"
                  >
                    {v.name} <span className="ml-1 text-muted-foreground">({v.desc})</span>
                  </Button>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <p className="text-sm text-yellow-700">
                  This template will be submitted for approval. It may take 24-48 hours to be approved by Meta.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleCreate}
              disabled={!formData.name || !formData.templateName || !formData.message}
            >
              Create & Submit for Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Template Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby="edit-template-desc">
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription id="edit-template-desc">
              Edit the template details. Changes may require re-approval.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Template Name <span className="text-destructive">*</span></Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Template ID</Label>
                <Input value={formData.templateName} disabled className="bg-muted" />
                <p className="text-xs text-muted-foreground">Cannot be changed after creation</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "visitor" | "exhibitor") => setFormData({ ...formData, type: value })}
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
              <div className="space-y-2">
                <Label>Trigger</Label>
                <Select
                  value={formData.trigger}
                  onValueChange={(value) => setFormData({ ...formData, trigger: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {triggers.map((trigger) => (
                      <SelectItem key={trigger} value={trigger}>{trigger}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Message Content</Label>
              <Textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={5}
              />
              <p className="text-xs text-muted-foreground">{formData.message.length} / 1024 characters</p>
            </div>
            <div className="space-y-2">
              <Label>Variables</Label>
              <div className="flex flex-wrap gap-2">
                {variables.map((v) => (
                  <Button
                    key={v.name}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => insertVariable(v.name)}
                    className="text-xs"
                  >
                    {v.name}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t">
              <Label>Status</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {formData.status === "Active" ? "Active" : "Inactive"}
                </span>
                <Switch
                  checked={formData.status === "Active"}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, status: checked ? "Active" : "Inactive" })
                  }
                  disabled={selectedTemplate?.approvalStatus !== "Approved"}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Template Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
          <DialogTitle className="sr-only">{selectedTemplate?.name} Details</DialogTitle>
          {selectedTemplate && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold">{selectedTemplate.name}</h2>
                  <code className="text-sm bg-muted px-2 py-1 rounded">{selectedTemplate.templateName}</code>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  {getApprovalBadge(selectedTemplate.approvalStatus)}
                  {getStatusBadge(selectedTemplate.status)}
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Type</p>
                  <p className="font-medium capitalize">{selectedTemplate.type}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Trigger</p>
                  <p className="font-medium">{selectedTemplate.trigger}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Messages Sent</p>
                  <p className="font-medium">{selectedTemplate.sentCount.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Delivery Rate</p>
                  <p className={`font-medium ${selectedTemplate.deliveryRate >= 95 ? "text-green-600" : "text-yellow-600"}`}>
                    {selectedTemplate.deliveryRate}%
                  </p>
                </div>
              </div>

              {/* Message Preview */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Message Preview</p>
                <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
                      <MessageCircle className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap text-green-900">{selectedTemplate.message}</p>
                      <p className="text-xs text-green-600 mt-2">WhatsApp Message</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Last Edited */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Last edited: {selectedTemplate.lastEdited}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button variant="outline" className="flex-1" onClick={() => openEditModal(selectedTemplate)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => handleDuplicate(selectedTemplate)}>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </Button>
                {selectedTemplate.approvalStatus === "Approved" && (
                  <Button className="flex-1" onClick={() => openSendTestModal(selectedTemplate)}>
                    <Send className="mr-2 h-4 w-4" />
                    Send Test
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Send Test Modal */}
      <Dialog open={isSendTestModalOpen} onOpenChange={setIsSendTestModalOpen}>
        <DialogContent className="sm:max-w-md" aria-describedby="send-test-desc">
          <DialogHeader>
            <DialogTitle>Send Test Message</DialogTitle>
            <DialogDescription id="send-test-desc">
              Send a test WhatsApp message to verify the template
            </DialogDescription>
          </DialogHeader>
          {testSent ? (
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <p className="font-medium">Test Message Sent!</p>
              <p className="text-sm text-muted-foreground mt-1">Check your WhatsApp for the message</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>WhatsApp Number</Label>
                  <Input
                    type="tel"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    placeholder="9876543210"
                  />
                  <p className="text-xs text-muted-foreground">Enter 10-digit mobile number</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-xs text-muted-foreground mb-1">Template Preview:</p>
                  <p className="text-sm">{selectedTemplate?.message}</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsSendTestModalOpen(false)}>Cancel</Button>
                <Button onClick={handleSendTest} disabled={!testPhone || sendingTest}>
                  {sendingTest ? "Sending..." : "Send Test"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
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
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
