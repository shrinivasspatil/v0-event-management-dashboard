"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import {
  Plus,
  Search,
  Mail,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface EmailTemplate {
  id: string
  name: string
  subject: string
  type: "visitor" | "exhibitor"
  trigger: string
  status: "Active" | "Inactive"
  lastEdited: string
  sentCount: number
  openRate: number
}

const initialTemplates: EmailTemplate[] = [
  {
    id: "1",
    name: "Visitor Registration Confirmation",
    subject: "Welcome! Your registration is confirmed",
    type: "visitor",
    trigger: "On Registration",
    status: "Active",
    lastEdited: "Mar 15, 2026",
    sentCount: 1245,
    openRate: 68,
  },
  {
    id: "2",
    name: "Visitor Registration Approved",
    subject: "Your registration has been approved!",
    type: "visitor",
    trigger: "On Approval",
    status: "Active",
    lastEdited: "Mar 12, 2026",
    sentCount: 980,
    openRate: 72,
  },
  {
    id: "3",
    name: "Visitor Registration Rejected",
    subject: "Update on your registration",
    type: "visitor",
    trigger: "On Rejection",
    status: "Active",
    lastEdited: "Mar 10, 2026",
    sentCount: 52,
    openRate: 45,
  },
  {
    id: "4",
    name: "Visitor Event Reminder",
    subject: "Reminder: Event starts tomorrow!",
    type: "visitor",
    trigger: "1 Day Before Event",
    status: "Active",
    lastEdited: "Mar 8, 2026",
    sentCount: 850,
    openRate: 78,
  },
  {
    id: "5",
    name: "Exhibitor Registration Confirmation",
    subject: "Thank you for registering as an exhibitor",
    type: "exhibitor",
    trigger: "On Registration",
    status: "Active",
    lastEdited: "Mar 14, 2026",
    sentCount: 156,
    openRate: 82,
  },
  {
    id: "6",
    name: "Exhibitor Booth Assignment",
    subject: "Your booth has been assigned",
    type: "exhibitor",
    trigger: "On Booth Assignment",
    status: "Active",
    lastEdited: "Mar 11, 2026",
    sentCount: 98,
    openRate: 89,
  },
  {
    id: "7",
    name: "Exhibitor Setup Instructions",
    subject: "Important: Booth setup guidelines",
    type: "exhibitor",
    trigger: "3 Days Before Event",
    status: "Inactive",
    lastEdited: "Mar 5, 2026",
    sentCount: 0,
    openRate: 0,
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

export default function EmailTemplatesPage() {
  const params = useParams()
  const eventId = params.id as string
  
  const [templates, setTemplates] = useState<EmailTemplate[]>(initialTemplates)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    subject: "",
    type: "visitor" as "visitor" | "exhibitor",
    trigger: "",
    body: "",
  })

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || template.type === filterType
    return matchesSearch && matchesType
  })

  const visitorTemplates = templates.filter((t) => t.type === "visitor")
  const exhibitorTemplates = templates.filter((t) => t.type === "exhibitor")
  const activeTemplates = templates.filter((t) => t.status === "Active")

  const handleCreateTemplate = () => {
    if (!newTemplate.name || !newTemplate.subject || !newTemplate.trigger) return

    const template: EmailTemplate = {
      id: String(templates.length + 1),
      name: newTemplate.name,
      subject: newTemplate.subject,
      type: newTemplate.type,
      trigger: newTemplate.trigger,
      status: "Active",
      lastEdited: "Mar 20, 2026",
      sentCount: 0,
      openRate: 0,
    }

    setTemplates([template, ...templates])
    setNewTemplate({ name: "", subject: "", type: "visitor", trigger: "", body: "" })
    setIsCreateModalOpen(false)
  }

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter((t) => t.id !== id))
  }

  const handleToggleStatus = (id: string) => {
    setTemplates(
      templates.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "Active" ? "Inactive" : "Active" }
          : t
      )
    )
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

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Email Templates</h1>
          <p className="mt-1 text-muted-foreground">
            Manage email templates for visitor and exhibitor communications
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
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
                <Mail className="h-5 w-5 text-primary" />
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
              <TableHead>Open Rate</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTemplates.map((template) => (
              <TableRow key={template.id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">{template.name}</p>
                    <p className="text-sm text-muted-foreground">{template.subject}</p>
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
                        style={{ width: `${template.openRate}%` }}
                      />
                    </div>
                    <span className="text-sm">{template.openRate}%</span>
                  </div>
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
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedTemplate(template)
                          setIsViewModalOpen(true)
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Template
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleStatus(template.id)}>
                        {template.status === "Active" ? "Deactivate" : "Activate"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDeleteTemplate(template.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
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

      {/* Create Template Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Email Template</DialogTitle>
            <DialogDescription>
              Create a new email template for visitor or exhibitor communications
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                Template Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., Registration Confirmation"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject">
                Email Subject <span className="text-destructive">*</span>
              </Label>
              <Input
                id="subject"
                placeholder="e.g., Welcome! Your registration is confirmed"
                value={newTemplate.subject}
                onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Type</Label>
                <Select
                  value={newTemplate.type}
                  onValueChange={(value: "visitor" | "exhibitor") =>
                    setNewTemplate({ ...newTemplate, type: value })
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
                  value={newTemplate.trigger}
                  onValueChange={(value) => setNewTemplate({ ...newTemplate, trigger: value })}
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
              <Label htmlFor="body">Email Body</Label>
              <Textarea
                id="body"
                placeholder="Enter email content..."
                rows={6}
                value={newTemplate.body}
                onChange={(e) => setNewTemplate({ ...newTemplate, body: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTemplate}>Create Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Template Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-lg p-0 gap-0 max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">
            {selectedTemplate?.name || "Template"} Details
          </DialogTitle>
          {selectedTemplate && (
            <>
              <div className="bg-primary/5 border-b border-border p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg font-bold text-foreground">{selectedTemplate.name}</h2>
                      {getStatusBadge(selectedTemplate.status)}
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground truncate">
                      {selectedTemplate.subject}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Button size="sm">
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Template
                  </Button>
                  <Button size="sm" variant="outline">
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicate
                  </Button>
                  <Button size="sm" variant="outline">
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
                    <p className="text-xs text-muted-foreground">Emails Sent</p>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-3 text-center">
                    <p className="text-xl font-bold text-green-600">{selectedTemplate.openRate}%</p>
                    <p className="text-xs text-muted-foreground">Open Rate</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Type</span>
                    {getTypeBadge(selectedTemplate.type)}
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Trigger</span>
                    <span className="text-sm font-medium">{selectedTemplate.trigger}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Last Edited</span>
                    <span className="text-sm font-medium">{selectedTemplate.lastEdited}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-muted-foreground">Status</span>
                    {getStatusBadge(selectedTemplate.status)}
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 text-xs"
                    onClick={() => {
                      handleDeleteTemplate(selectedTemplate.id)
                      setIsViewModalOpen(false)
                    }}
                  >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                    Delete Template
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
