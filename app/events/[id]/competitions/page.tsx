"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import {
  Trophy,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Users,
  IndianRupee,
  Gift,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Copy,
  ExternalLink,
  Crown,
  Medal,
  Award,
  Calendar,
  Link as LinkIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
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

interface Participant {
  id: string
  name: string
  email: string
  mobile: string
  paymentId: string
  paymentStatus: "Paid" | "Pending" | "Failed"
  registeredAt: string
  rank?: number
}

interface Competition {
  id: string
  name: string
  description: string
  entryFee: number
  prizePool: number
  prizes: {
    first: number
    second: number
    third: number
  }
  maxParticipants: number
  currentParticipants: number
  startDate: string
  endDate: string
  status: "Draft" | "Active" | "Completed" | "Cancelled"
  rules: string
  slug: string
  totalRevenue: number
  participants: Participant[]
  winners: {
    first?: Participant
    second?: Participant
    third?: Participant
  }
}

const initialCompetitions: Competition[] = [
  {
    id: "1",
    name: "Best Startup Pitch",
    description: "Pitch your innovative startup idea to our panel of judges and win exciting prizes!",
    entryFee: 500,
    prizePool: 50000,
    prizes: { first: 25000, second: 15000, third: 10000 },
    maxParticipants: 50,
    currentParticipants: 32,
    startDate: "Apr 15, 2026",
    endDate: "Apr 17, 2026",
    status: "Active",
    rules: "1. Each participant gets 5 minutes to pitch\n2. Judges decision is final\n3. No plagiarism allowed",
    slug: "best-startup-pitch",
    totalRevenue: 16000,
    participants: [
      { id: "p1", name: "Rahul Sharma", email: "rahul@example.com", mobile: "9876543210", paymentId: "pay_ABC123", paymentStatus: "Paid", registeredAt: "Mar 10, 2026" },
      { id: "p2", name: "Priya Patel", email: "priya@example.com", mobile: "9876543211", paymentId: "pay_DEF456", paymentStatus: "Paid", registeredAt: "Mar 11, 2026" },
      { id: "p3", name: "Amit Kumar", email: "amit@example.com", mobile: "9876543212", paymentId: "pay_GHI789", paymentStatus: "Paid", registeredAt: "Mar 12, 2026" },
    ],
    winners: {},
  },
  {
    id: "2",
    name: "Hackathon Challenge",
    description: "24-hour coding marathon to build innovative solutions",
    entryFee: 1000,
    prizePool: 100000,
    prizes: { first: 50000, second: 30000, third: 20000 },
    maxParticipants: 100,
    currentParticipants: 78,
    startDate: "Apr 16, 2026",
    endDate: "Apr 17, 2026",
    status: "Active",
    rules: "1. Teams of 2-4 members\n2. Use any technology stack\n3. Submit working prototype",
    slug: "hackathon-challenge",
    totalRevenue: 78000,
    participants: [],
    winners: {},
  },
  {
    id: "3",
    name: "Design Sprint",
    description: "Create the best UI/UX design for a given problem statement",
    entryFee: 300,
    prizePool: 30000,
    prizes: { first: 15000, second: 10000, third: 5000 },
    maxParticipants: 40,
    currentParticipants: 40,
    startDate: "Apr 15, 2026",
    endDate: "Apr 15, 2026",
    status: "Completed",
    rules: "1. Individual participation only\n2. Submit Figma file\n3. Original work only",
    slug: "design-sprint",
    totalRevenue: 12000,
    participants: [],
    winners: {
      first: { id: "w1", name: "Sneha Verma", email: "sneha@example.com", mobile: "9876543220", paymentId: "pay_WIN1", paymentStatus: "Paid", registeredAt: "Mar 5, 2026", rank: 1 },
      second: { id: "w2", name: "Karan Singh", email: "karan@example.com", mobile: "9876543221", paymentId: "pay_WIN2", paymentStatus: "Paid", registeredAt: "Mar 6, 2026", rank: 2 },
      third: { id: "w3", name: "Neha Gupta", email: "neha@example.com", mobile: "9876543222", paymentId: "pay_WIN3", paymentStatus: "Paid", registeredAt: "Mar 7, 2026", rank: 3 },
    },
  },
]

export default function CompetitionsPage() {
  const params = useParams()
  const eventId = params.id as string
  
  const [competitions, setCompetitions] = useState<Competition[]>(initialCompetitions)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false)
  const [isWinnersModalOpen, setIsWinnersModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    entryFee: "",
    prizeFirst: "",
    prizeSecond: "",
    prizeThird: "",
    maxParticipants: "",
    startDate: "",
    endDate: "",
    rules: "",
    status: "Draft" as Competition["status"],
  })

  // Winners selection state
  const [selectedWinners, setSelectedWinners] = useState<{
    first: string
    second: string
    third: string
  }>({ first: "", second: "", third: "" })

  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""

  // Stats
  const totalCompetitions = competitions.length
  const activeCompetitions = competitions.filter(c => c.status === "Active").length
  const totalRevenue = competitions.reduce((sum, c) => sum + c.totalRevenue, 0)
  const totalParticipants = competitions.reduce((sum, c) => sum + c.currentParticipants, 0)

  // Filtered competitions
  const filteredCompetitions = competitions.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      entryFee: "",
      prizeFirst: "",
      prizeSecond: "",
      prizeThird: "",
      maxParticipants: "",
      startDate: "",
      endDate: "",
      rules: "",
      status: "Draft",
    })
  }

  const handleCreate = async () => {
    if (!formData.name || !formData.entryFee || !formData.prizeFirst) return
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newCompetition: Competition = {
      id: String(competitions.length + 1),
      name: formData.name,
      description: formData.description,
      entryFee: Number(formData.entryFee),
      prizePool: Number(formData.prizeFirst) + Number(formData.prizeSecond || 0) + Number(formData.prizeThird || 0),
      prizes: {
        first: Number(formData.prizeFirst),
        second: Number(formData.prizeSecond || 0),
        third: Number(formData.prizeThird || 0),
      },
      maxParticipants: Number(formData.maxParticipants) || 100,
      currentParticipants: 0,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: formData.status,
      rules: formData.rules,
      slug: generateSlug(formData.name),
      totalRevenue: 0,
      participants: [],
      winners: {},
    }
    
    setCompetitions([newCompetition, ...competitions])
    setIsLoading(false)
    setIsCreateModalOpen(false)
    resetForm()
  }

  const handleEdit = async () => {
    if (!selectedCompetition || !formData.name) return
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setCompetitions(competitions.map(c => 
      c.id === selectedCompetition.id 
        ? {
            ...c,
            name: formData.name,
            description: formData.description,
            entryFee: Number(formData.entryFee),
            prizePool: Number(formData.prizeFirst) + Number(formData.prizeSecond || 0) + Number(formData.prizeThird || 0),
            prizes: {
              first: Number(formData.prizeFirst),
              second: Number(formData.prizeSecond || 0),
              third: Number(formData.prizeThird || 0),
            },
            maxParticipants: Number(formData.maxParticipants) || 100,
            startDate: formData.startDate,
            endDate: formData.endDate,
            status: formData.status,
            rules: formData.rules,
            slug: generateSlug(formData.name),
          }
        : c
    ))
    
    setIsLoading(false)
    setIsEditModalOpen(false)
    resetForm()
  }

  const handleDelete = () => {
    if (!selectedCompetition) return
    setCompetitions(competitions.filter(c => c.id !== selectedCompetition.id))
    setIsDeleteDialogOpen(false)
    setSelectedCompetition(null)
  }

  const handleSelectWinners = async () => {
    if (!selectedCompetition) return
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const participants = selectedCompetition.participants
    const winners: Competition["winners"] = {}
    
    if (selectedWinners.first) {
      winners.first = { ...participants.find(p => p.id === selectedWinners.first)!, rank: 1 }
    }
    if (selectedWinners.second) {
      winners.second = { ...participants.find(p => p.id === selectedWinners.second)!, rank: 2 }
    }
    if (selectedWinners.third) {
      winners.third = { ...participants.find(p => p.id === selectedWinners.third)!, rank: 3 }
    }
    
    setCompetitions(competitions.map(c =>
      c.id === selectedCompetition.id
        ? { ...c, winners, status: "Completed" as const }
        : c
    ))
    
    setIsLoading(false)
    setIsWinnersModalOpen(false)
    setSelectedWinners({ first: "", second: "", third: "" })
  }

  const openEditModal = (competition: Competition) => {
    setSelectedCompetition(competition)
    setFormData({
      name: competition.name,
      description: competition.description,
      entryFee: String(competition.entryFee),
      prizeFirst: String(competition.prizes.first),
      prizeSecond: String(competition.prizes.second),
      prizeThird: String(competition.prizes.third),
      maxParticipants: String(competition.maxParticipants),
      startDate: competition.startDate,
      endDate: competition.endDate,
      rules: competition.rules,
      status: competition.status,
    })
    setIsEditModalOpen(true)
  }

  const copyToClipboard = (competition: Competition) => {
    const url = `${baseUrl}/compete/${eventId}/${competition.slug}`
    navigator.clipboard.writeText(url)
    setCopiedId(competition.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getStatusBadge = (status: Competition["status"]) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
      case "Completed":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Completed</Badge>
      case "Cancelled":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Cancelled</Badge>
      default:
        return <Badge variant="secondary">Draft</Badge>
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Competitions</h1>
          <p className="text-muted-foreground">Create and manage paid competitions with prizes</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Competition
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Competitions</p>
                <p className="text-2xl font-bold">{totalCompetitions}</p>
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
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{activeCompetitions}</p>
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
                <p className="text-sm text-muted-foreground">Total Participants</p>
                <p className="text-2xl font-bold">{totalParticipants}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
                <IndianRupee className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">{totalRevenue.toLocaleString()}</p>
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
            placeholder="Search competitions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Competitions Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Competition</TableHead>
              <TableHead>Entry Fee</TableHead>
              <TableHead>Prize Pool</TableHead>
              <TableHead>Participants</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCompetitions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  No competitions found
                </TableCell>
              </TableRow>
            ) : (
              filteredCompetitions.map((competition) => (
                <TableRow key={competition.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{competition.name}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{competition.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <IndianRupee className="h-3.5 w-3.5" />
                      {competition.entryFee.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 font-medium text-green-600">
                      <IndianRupee className="h-3.5 w-3.5" />
                      {competition.prizePool.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{competition.currentParticipants}/{competition.maxParticipants}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <IndianRupee className="h-3.5 w-3.5" />
                      {competition.totalRevenue.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(competition.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setSelectedCompetition(competition)
                          setIsViewModalOpen(true)
                        }}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditModal(competition)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => copyToClipboard(competition)}>
                          {copiedId === competition.id ? (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="mr-2 h-4 w-4" />
                              Copy Link
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => {
                          setSelectedCompetition(competition)
                          setIsParticipantsModalOpen(true)
                        }}>
                          <Users className="mr-2 h-4 w-4" />
                          View Participants
                        </DropdownMenuItem>
                        {competition.status === "Active" && (
                          <DropdownMenuItem onClick={() => {
                            setSelectedCompetition(competition)
                            setSelectedWinners({ first: "", second: "", third: "" })
                            setIsWinnersModalOpen(true)
                          }}>
                            <Trophy className="mr-2 h-4 w-4" />
                            Select Winners
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => {
                            setSelectedCompetition(competition)
                            setIsDeleteDialogOpen(true)
                          }}
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

      {/* Create/Edit Competition Modal */}
      <Dialog open={isCreateModalOpen || isEditModalOpen} onOpenChange={(open) => {
        if (!open) {
          setIsCreateModalOpen(false)
          setIsEditModalOpen(false)
          resetForm()
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditModalOpen ? "Edit Competition" : "Create Competition"}</DialogTitle>
            <DialogDescription>
              {isEditModalOpen ? "Update competition details" : "Set up a new paid competition with prizes"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>Competition Name <span className="text-destructive">*</span></Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Best Startup Pitch"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the competition..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Entry Fee (INR) <span className="text-destructive">*</span></Label>
                <Input
                  type="number"
                  value={formData.entryFee}
                  onChange={(e) => setFormData({ ...formData, entryFee: e.target.value })}
                  placeholder="500"
                />
              </div>
              <div className="space-y-2">
                <Label>Max Participants</Label>
                <Input
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                  placeholder="100"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Prize Distribution (INR)</Label>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-yellow-500" />
                    <Label className="text-sm">1st Prize <span className="text-destructive">*</span></Label>
                  </div>
                  <Input
                    type="number"
                    value={formData.prizeFirst}
                    onChange={(e) => setFormData({ ...formData, prizeFirst: e.target.value })}
                    placeholder="25000"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Medal className="h-4 w-4 text-gray-400" />
                    <Label className="text-sm">2nd Prize</Label>
                  </div>
                  <Input
                    type="number"
                    value={formData.prizeSecond}
                    onChange={(e) => setFormData({ ...formData, prizeSecond: e.target.value })}
                    placeholder="15000"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-amber-700" />
                    <Label className="text-sm">3rd Prize</Label>
                  </div>
                  <Input
                    type="number"
                    value={formData.prizeThird}
                    onChange={(e) => setFormData({ ...formData, prizeThird: e.target.value })}
                    placeholder="10000"
                  />
                </div>
              </div>
              {(formData.prizeFirst || formData.prizeSecond || formData.prizeThird) && (
                <p className="text-sm text-muted-foreground">
                  Total Prize Pool: <span className="font-medium text-green-600">
                    {(Number(formData.prizeFirst || 0) + Number(formData.prizeSecond || 0) + Number(formData.prizeThird || 0)).toLocaleString()} INR
                  </span>
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Rules & Guidelines</Label>
              <Textarea
                value={formData.rules}
                onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                placeholder="Enter competition rules (one per line)..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: Competition["status"]) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsCreateModalOpen(false)
              setIsEditModalOpen(false)
              resetForm()
            }}>
              Cancel
            </Button>
            <Button onClick={isEditModalOpen ? handleEdit : handleCreate} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditModalOpen ? "Saving..." : "Creating..."}
                </>
              ) : (
                isEditModalOpen ? "Save Changes" : "Create Competition"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">{selectedCompetition?.name} Details</DialogTitle>
          {selectedCompetition && (
            <>
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold">{selectedCompetition.name}</h2>
                      {getStatusBadge(selectedCompetition.status)}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{selectedCompetition.description}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border p-3 text-center">
                    <p className="text-xl font-bold text-primary">{selectedCompetition.entryFee.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Entry Fee (INR)</p>
                  </div>
                  <div className="rounded-lg border p-3 text-center">
                    <p className="text-xl font-bold text-green-600">{selectedCompetition.prizePool.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Prize Pool (INR)</p>
                  </div>
                  <div className="rounded-lg border p-3 text-center">
                    <p className="text-xl font-bold">{selectedCompetition.currentParticipants}/{selectedCompetition.maxParticipants}</p>
                    <p className="text-xs text-muted-foreground">Participants</p>
                  </div>
                  <div className="rounded-lg border p-3 text-center">
                    <p className="text-xl font-bold text-yellow-600">{selectedCompetition.totalRevenue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Revenue (INR)</p>
                  </div>
                </div>

                {/* Prizes */}
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-3">Prize Distribution</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Crown className="h-4 w-4 text-yellow-500" />
                        <span>1st Prize</span>
                      </div>
                      <span className="font-medium">{selectedCompetition.prizes.first.toLocaleString()} INR</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Medal className="h-4 w-4 text-gray-400" />
                        <span>2nd Prize</span>
                      </div>
                      <span className="font-medium">{selectedCompetition.prizes.second.toLocaleString()} INR</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-amber-700" />
                        <span>3rd Prize</span>
                      </div>
                      <span className="font-medium">{selectedCompetition.prizes.third.toLocaleString()} INR</span>
                    </div>
                  </div>
                </div>

                {/* Winners (if completed) */}
                {selectedCompetition.status === "Completed" && Object.keys(selectedCompetition.winners).length > 0 && (
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                    <h3 className="font-medium mb-3 text-green-800">Winners</h3>
                    <div className="space-y-2">
                      {selectedCompetition.winners.first && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Crown className="h-4 w-4 text-yellow-500" />
                            <span className="text-green-800">{selectedCompetition.winners.first.name}</span>
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-800">1st</Badge>
                        </div>
                      )}
                      {selectedCompetition.winners.second && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Medal className="h-4 w-4 text-gray-400" />
                            <span className="text-green-800">{selectedCompetition.winners.second.name}</span>
                          </div>
                          <Badge variant="secondary">2nd</Badge>
                        </div>
                      )}
                      {selectedCompetition.winners.third && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-amber-700" />
                            <span className="text-green-800">{selectedCompetition.winners.third.name}</span>
                          </div>
                          <Badge variant="outline">3rd</Badge>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* URL */}
                <div>
                  <Label className="text-sm text-muted-foreground">Registration URL</Label>
                  <div className="mt-2 flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2">
                    <LinkIcon className="h-4 w-4 shrink-0 text-primary" />
                    <code className="flex-1 text-xs truncate">/compete/{eventId}/{selectedCompetition.slug}</code>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyToClipboard(selectedCompetition)}>
                      {copiedId === selectedCompetition.id ? (
                        <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  <Button size="sm" variant="outline" onClick={() => {
                    setIsViewModalOpen(false)
                    setIsParticipantsModalOpen(true)
                  }}>
                    <Users className="mr-2 h-4 w-4" />
                    View Participants
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <a href={`/compete/${eventId}/${selectedCompetition.slug}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open Page
                    </a>
                  </Button>
                  {selectedCompetition.status === "Active" && (
                    <Button size="sm" onClick={() => {
                      setIsViewModalOpen(false)
                      setSelectedWinners({ first: "", second: "", third: "" })
                      setIsWinnersModalOpen(true)
                    }}>
                      <Trophy className="mr-2 h-4 w-4" />
                      Select Winners
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Participants Modal */}
      <Dialog open={isParticipantsModalOpen} onOpenChange={setIsParticipantsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Participants - {selectedCompetition?.name}</DialogTitle>
            <DialogDescription>
              {selectedCompetition?.currentParticipants} participants registered
            </DialogDescription>
          </DialogHeader>
          {selectedCompetition && selectedCompetition.participants.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Registered</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedCompetition.participants.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{p.email}</TableCell>
                    <TableCell>{p.mobile}</TableCell>
                    <TableCell>
                      <Badge className={
                        p.paymentStatus === "Paid" 
                          ? "bg-green-100 text-green-700" 
                          : p.paymentStatus === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }>
                        {p.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{p.registeredAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              No participants yet
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Select Winners Modal */}
      <Dialog open={isWinnersModalOpen} onOpenChange={setIsWinnersModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Select Winners</DialogTitle>
            <DialogDescription>
              Choose winners for {selectedCompetition?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedCompetition && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-yellow-500" />
                  <Label>1st Place - {selectedCompetition.prizes.first.toLocaleString()} INR</Label>
                </div>
                <Select value={selectedWinners.first} onValueChange={(v) => setSelectedWinners({ ...selectedWinners, first: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select winner" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCompetition.participants
                      .filter(p => p.paymentStatus === "Paid")
                      .filter(p => p.id !== selectedWinners.second && p.id !== selectedWinners.third)
                      .map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Medal className="h-4 w-4 text-gray-400" />
                  <Label>2nd Place - {selectedCompetition.prizes.second.toLocaleString()} INR</Label>
                </div>
                <Select value={selectedWinners.second} onValueChange={(v) => setSelectedWinners({ ...selectedWinners, second: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select winner" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCompetition.participants
                      .filter(p => p.paymentStatus === "Paid")
                      .filter(p => p.id !== selectedWinners.first && p.id !== selectedWinners.third)
                      .map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-700" />
                  <Label>3rd Place - {selectedCompetition.prizes.third.toLocaleString()} INR</Label>
                </div>
                <Select value={selectedWinners.third} onValueChange={(v) => setSelectedWinners({ ...selectedWinners, third: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select winner" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCompetition.participants
                      .filter(p => p.paymentStatus === "Paid")
                      .filter(p => p.id !== selectedWinners.first && p.id !== selectedWinners.second)
                      .map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWinnersModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSelectWinners} disabled={isLoading || !selectedWinners.first}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Trophy className="mr-2 h-4 w-4" />
                  Announce Winners
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Competition?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{selectedCompetition?.name}" and all associated data. This action cannot be undone.
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
