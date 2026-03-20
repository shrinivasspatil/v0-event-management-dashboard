"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import {
  Plus,
  Search,
  Users,
  Link as LinkIcon,
  Copy,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
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
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

type RegistrationForm = {
  id: string
  name: string
  slug: string
  description: string
  status: "Active" | "Inactive" | "Closed"
  registrations: {
    total: number
    registered: number
    attended: number
    rejected: number
    open: number
  }
  createdAt: string
}

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export default function FormsPage() {
  const params = useParams()
  const eventId = params.id as string
  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""

  const [forms, setForms] = useState<RegistrationForm[]>([
    {
      id: "1",
      name: "Shrinivas",
      slug: "shrinivas",
      description: "General visitor registration form",
      status: "Active",
      registrations: {
        total: 99,
        registered: 45,
        attended: 32,
        rejected: 5,
        open: 17,
      },
      createdAt: "Mar 1, 2026",
    },
    {
      id: "2",
      name: "Vinay",
      slug: "vinay",
      description: "VIP visitor registration",
      status: "Active",
      registrations: {
        total: 150,
        registered: 78,
        attended: 52,
        rejected: 8,
        open: 12,
      },
      createdAt: "Mar 5, 2026",
    },
    {
      id: "3",
      name: "Ravi",
      slug: "ravi",
      description: "Partner registration form",
      status: "Active",
      registrations: {
        total: 9999,
        registered: 4500,
        attended: 3200,
        rejected: 150,
        open: 2149,
      },
      createdAt: "Mar 10, 2026",
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedForm, setSelectedForm] = useState<RegistrationForm | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const [newForm, setNewForm] = useState({
    name: "",
    description: "",
    status: "Active" as "Active" | "Inactive" | "Closed",
  })

  const filteredForms = forms.filter((form) =>
    form.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateForm = () => {
    if (!newForm.name) return

    const form: RegistrationForm = {
      id: String(forms.length + 1),
      name: newForm.name,
      slug: generateSlug(newForm.name),
      description: newForm.description,
      status: newForm.status,
      registrations: {
        total: 0,
        registered: 0,
        attended: 0,
        rejected: 0,
        open: 0,
      },
      createdAt: "Mar 20, 2026",
    }

    setForms([...forms, form])
    setNewForm({ name: "", description: "", status: "Active" })
    setIsCreateModalOpen(false)
  }

  const copyToClipboard = (form: RegistrationForm) => {
    const url = `${baseUrl}/register/${eventId}/${form.slug}`
    navigator.clipboard.writeText(url)
    setCopiedId(form.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDeleteForm = (id: string) => {
    setForms(forms.filter((f) => f.id !== id))
  }

  const handleViewForm = (form: RegistrationForm) => {
    setSelectedForm(form)
    setIsViewModalOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
      case "Inactive":
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Inactive</Badge>
      case "Closed":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Closed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const totalStats = forms.reduce(
    (acc, form) => ({
      total: acc.total + form.registrations.total,
      registered: acc.registered + form.registrations.registered,
      attended: acc.attended + form.registrations.attended,
      rejected: acc.rejected + form.registrations.rejected,
      open: acc.open + form.registrations.open,
    }),
    { total: 0, registered: 0, attended: 0, rejected: 0, open: 0 }
  )

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Registration Forms</h1>
          <p className="mt-1 text-muted-foreground">
            Create and manage visitor registration forms with unique URLs
          </p>
        </div>
        <Button className="gap-2" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Create Form
        </Button>
      </div>

      {/* Overall Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-5">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Registrations</p>
                <p className="text-2xl font-bold text-foreground">{totalStats.total.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Registered</p>
                <p className="text-2xl font-bold text-foreground">{totalStats.registered.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Attended</p>
                <p className="text-2xl font-bold text-foreground">{totalStats.attended.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold text-foreground">{totalStats.rejected.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Open</p>
                <p className="text-2xl font-bold text-foreground">{totalStats.open.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search forms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Forms Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredForms.map((form) => (
          <Card key={form.id} className="overflow-hidden transition-shadow hover:shadow-md">
            <CardContent className="p-0">
              {/* Card Header */}
              <div className="flex items-start justify-between border-b border-border p-5">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{form.name}</h3>
                    {getStatusBadge(form.status)}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                    {form.description || "No description"}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewForm(form)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit Form
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => copyToClipboard(form)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy URL
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDeleteForm(form.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 divide-x divide-border border-b border-border">
                <div className="p-3 text-center">
                  <p className="text-lg font-bold text-foreground">{form.registrations.registered}</p>
                  <p className="text-xs text-muted-foreground">Registered</p>
                </div>
                <div className="p-3 text-center">
                  <p className="text-lg font-bold text-green-600">{form.registrations.attended}</p>
                  <p className="text-xs text-muted-foreground">Attended</p>
                </div>
                <div className="p-3 text-center">
                  <p className="text-lg font-bold text-red-600">{form.registrations.rejected}</p>
                  <p className="text-xs text-muted-foreground">Rejected</p>
                </div>
                <div className="p-3 text-center">
                  <p className="text-lg font-bold text-yellow-600">{form.registrations.open}</p>
                  <p className="text-xs text-muted-foreground">Open</p>
                </div>
              </div>

              {/* URL Section */}
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <div className="flex flex-1 items-center gap-2 rounded-md bg-muted px-3 py-2">
                    <LinkIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <p className="truncate text-sm text-muted-foreground">
                      /register/{eventId}/{form.slug}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    onClick={() => copyToClipboard(form)}
                  >
                    {copiedId === form.id ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="outline" size="icon" className="shrink-0" asChild>
                    <a
                      href={`/register/${eventId}/${form.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Created on {form.createdAt}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredForms.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Users className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 font-semibold text-foreground">No forms found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first registration form to get started
          </p>
          <Button className="mt-4 gap-2" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Create Form
          </Button>
        </div>
      )}

      {/* Create Form Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Registration Form</DialogTitle>
            <DialogDescription>
              Create a new visitor registration form with a unique URL
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                Form Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., VIP Registration"
                value={newForm.name}
                onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
              />
              {newForm.name && (
                <p className="text-xs text-muted-foreground">
                  URL: /register/{eventId}/{generateSlug(newForm.name)}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter form description..."
                value={newForm.description}
                onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={newForm.status}
                onValueChange={(value: "Active" | "Inactive" | "Closed") =>
                  setNewForm({ ...newForm, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateForm} disabled={!newForm.name}>
              Create Form
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Form Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedForm?.name}
              {selectedForm && getStatusBadge(selectedForm.status)}
            </DialogTitle>
            <DialogDescription>{selectedForm?.description || "No description"}</DialogDescription>
          </DialogHeader>
          {selectedForm && (
            <div className="space-y-6 py-4">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Total Registrations</p>
                    <p className="text-2xl font-bold">{selectedForm.registrations.total.toLocaleString()}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Registered</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {selectedForm.registrations.registered.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Attended</p>
                    <p className="text-2xl font-bold text-green-600">
                      {selectedForm.registrations.attended.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Rejected</p>
                    <p className="text-2xl font-bold text-red-600">
                      {selectedForm.registrations.rejected.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* URL */}
              <div>
                <Label className="text-muted-foreground">Registration URL</Label>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex flex-1 items-center gap-2 rounded-md bg-muted px-3 py-2">
                    <LinkIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <p className="truncate text-sm">
                      {baseUrl}/register/{eventId}/{selectedForm.slug}
                    </p>
                  </div>
                  <Button variant="outline" size="icon" onClick={() => copyToClipboard(selectedForm)}>
                    {copiedId === selectedForm.id ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Created Date */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Created on</span>
                <span className="font-medium">{selectedForm.createdAt}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
            <Button asChild>
              <a
                href={`/register/${eventId}/${selectedForm?.slug}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Form
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
