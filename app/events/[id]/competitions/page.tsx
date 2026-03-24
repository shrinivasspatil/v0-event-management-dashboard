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
  RotateCcw,
  UserCheck,
  UserX,
  Download,
  Phone,
  Mail,
  AlertTriangle,
  Ban,
  RefreshCw,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type ParticipantStatus = "Pending" | "Paid" | "Participated" | "No-Show" | "Cancelled" | "Refunded"

interface Participant {
  id: string
  name: string
  email: string
  mobile: string
  organization?: string
  paymentId: string
  paymentAmount: number
  paymentDate: string
  status: ParticipantStatus
  registeredAt: string
  refundId?: string
  refundDate?: string
  refundAmount?: number
  refundReason?: string
  attendedAt?: string
  cancelledAt?: string
  cancelReason?: string
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
    currentParticipants: 8,
    startDate: "Apr 15, 2026",
    endDate: "Apr 17, 2026",
    status: "Active",
    rules: "1. Each participant gets 5 minutes to pitch\n2. Judges decision is final\n3. No plagiarism allowed",
    slug: "best-startup-pitch",
    totalRevenue: 4000,
    participants: [
      { id: "p1", name: "Rahul Sharma", email: "rahul@example.com", mobile: "9876543210", organization: "TechStart Inc", paymentId: "pay_ABC123", paymentAmount: 500, paymentDate: "Mar 10, 2026", status: "Paid", registeredAt: "Mar 10, 2026" },
      { id: "p2", name: "Priya Patel", email: "priya@example.com", mobile: "9876543211", organization: "InnovateCo", paymentId: "pay_DEF456", paymentAmount: 500, paymentDate: "Mar 11, 2026", status: "Paid", registeredAt: "Mar 11, 2026" },
      { id: "p3", name: "Amit Kumar", email: "amit@example.com", mobile: "9876543212", organization: "FutureTech", paymentId: "pay_GHI789", paymentAmount: 500, paymentDate: "Mar 12, 2026", status: "Participated", registeredAt: "Mar 12, 2026", attendedAt: "Apr 15, 2026" },
      { id: "p4", name: "Sneha Verma", email: "sneha@example.com", mobile: "9876543213", organization: "DesignHub", paymentId: "pay_JKL012", paymentAmount: 500, paymentDate: "Mar 13, 2026", status: "No-Show", registeredAt: "Mar 13, 2026" },
      { id: "p5", name: "Karan Singh", email: "karan@example.com", mobile: "9876543214", organization: "CodeCraft", paymentId: "pay_MNO345", paymentAmount: 500, paymentDate: "Mar 14, 2026", status: "Refunded", registeredAt: "Mar 14, 2026", refundId: "rfnd_001", refundDate: "Mar 20, 2026", refundAmount: 500, refundReason: "Personal emergency" },
      { id: "p6", name: "Neha Gupta", email: "neha@example.com", mobile: "9876543215", organization: "DataDriven", paymentId: "pay_PQR678", paymentAmount: 500, paymentDate: "Mar 15, 2026", status: "Cancelled", registeredAt: "Mar 15, 2026", cancelledAt: "Mar 18, 2026", cancelReason: "Schedule conflict" },
      { id: "p7", name: "Vikram Joshi", email: "vikram@example.com", mobile: "9876543216", paymentId: "", paymentAmount: 0, paymentDate: "", status: "Pending", registeredAt: "Mar 16, 2026" },
      { id: "p8", name: "Anita Desai", email: "anita@example.com", mobile: "9876543217", organization: "GrowthLabs", paymentId: "pay_STU901", paymentAmount: 500, paymentDate: "Mar 17, 2026", status: "Paid", registeredAt: "Mar 17, 2026" },
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
      first: { id: "w1", name: "Sneha Verma", email: "sneha@example.com", mobile: "9876543220", paymentId: "pay_WIN1", paymentAmount: 300, paymentDate: "Mar 5, 2026", status: "Participated", registeredAt: "Mar 5, 2026", rank: 1 },
      second: { id: "w2", name: "Karan Singh", email: "karan@example.com", mobile: "9876543221", paymentId: "pay_WIN2", paymentAmount: 300, paymentDate: "Mar 6, 2026", status: "Participated", registeredAt: "Mar 6, 2026", rank: 2 },
      third: { id: "w3", name: "Neha Gupta", email: "neha@example.com", mobile: "9876543222", paymentId: "pay_WIN3", paymentAmount: 300, paymentDate: "Mar 7, 2026", status: "Participated", registeredAt: "Mar 7, 2026", rank: 3 },
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
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false)
  const [isViewParticipantModalOpen, setIsViewParticipantModalOpen] = useState(false)
  
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null)
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null)
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])
  const [participantStatusFilter, setParticipantStatusFilter] = useState<string>("all")
  const [participantSearch, setParticipantSearch] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  
  // Refund form state
  const [refundReason, setRefundReason] = useState("")
  const [refundAmount, setRefundAmount] = useState<number>(0)
  
  // Form state for create/edit
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

  // Stats
  const totalCompetitions = competitions.length
  const activeCompetitions = competitions.filter(c => c.status === "Active").length
  const totalParticipants = competitions.reduce((sum, c) => sum + c.currentParticipants, 0)
  const totalRevenue = competitions.reduce((sum, c) => sum + c.totalRevenue, 0)

  // Filter competitions
  const filteredCompetitions = competitions.filter(competition => {
    const matchesSearch = competition.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || competition.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Filter participants
  const filteredParticipants = selectedCompetition?.participants.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(participantSearch.toLowerCase()) ||
                          p.email.toLowerCase().includes(participantSearch.toLowerCase()) ||
                          p.mobile.includes(participantSearch)
    const matchesStatus = participantStatusFilter === "all" || p.status === participantStatusFilter
    return matchesSearch && matchesStatus
  }) || []

  // Participant stats for selected competition
  const getParticipantStats = (competition: Competition) => {
    const participants = competition.participants
    return {
      total: participants.length,
      pending: participants.filter(p => p.status === "Pending").length,
      paid: participants.filter(p => p.status === "Paid").length,
      participated: participants.filter(p => p.status === "Participated").length,
      noShow: participants.filter(p => p.status === "No-Show").length,
      cancelled: participants.filter(p => p.status === "Cancelled").length,
      refunded: participants.filter(p => p.status === "Refunded").length,
    }
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

  const getParticipantStatusBadge = (status: ParticipantStatus) => {
    switch (status) {
      case "Pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Pending Payment</Badge>
      case "Paid":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Paid</Badge>
      case "Participated":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Participated</Badge>
      case "No-Show":
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">No-Show</Badge>
      case "Cancelled":
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Cancelled</Badge>
      case "Refunded":
        return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Refunded</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const copyToClipboard = (competition: Competition) => {
    const url = `${window.location.origin}/compete/${eventId}/${competition.slug}`
    navigator.clipboard.writeText(url)
    setCopiedId(competition.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleCreateCompetition = () => {
    setIsLoading(true)
    setTimeout(() => {
      const newCompetition: Competition = {
        id: String(competitions.length + 1),
        name: formData.name,
        description: formData.description,
        entryFee: Number(formData.entryFee),
        prizePool: Number(formData.prizeFirst) + Number(formData.prizeSecond) + Number(formData.prizeThird),
        prizes: {
          first: Number(formData.prizeFirst),
          second: Number(formData.prizeSecond),
          third: Number(formData.prizeThird),
        },
        maxParticipants: Number(formData.maxParticipants),
        currentParticipants: 0,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status,
        rules: formData.rules,
        slug: formData.name.toLowerCase().replace(/\s+/g, "-"),
        totalRevenue: 0,
        participants: [],
        winners: {},
      }
      setCompetitions([...competitions, newCompetition])
      setIsCreateModalOpen(false)
      resetForm()
      setIsLoading(false)
    }, 1000)
  }

  const handleEditCompetition = () => {
    if (!selectedCompetition) return
    setIsLoading(true)
    setTimeout(() => {
      setCompetitions(competitions.map(c => 
        c.id === selectedCompetition.id ? {
          ...c,
          name: formData.name,
          description: formData.description,
          entryFee: Number(formData.entryFee),
          prizePool: Number(formData.prizeFirst) + Number(formData.prizeSecond) + Number(formData.prizeThird),
          prizes: {
            first: Number(formData.prizeFirst),
            second: Number(formData.prizeSecond),
            third: Number(formData.prizeThird),
          },
          maxParticipants: Number(formData.maxParticipants),
          startDate: formData.startDate,
          endDate: formData.endDate,
          status: formData.status,
          rules: formData.rules,
        } : c
      ))
      setIsEditModalOpen(false)
      setIsLoading(false)
    }, 1000)
  }

  const handleDeleteCompetition = () => {
    if (!selectedCompetition) return
    setCompetitions(competitions.filter(c => c.id !== selectedCompetition.id))
    setIsDeleteDialogOpen(false)
    setSelectedCompetition(null)
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

  // Participant actions
  const handleMarkAttendance = (participantId: string, attended: boolean) => {
    if (!selectedCompetition) return
    setCompetitions(competitions.map(c => {
      if (c.id === selectedCompetition.id) {
        return {
          ...c,
          participants: c.participants.map(p => {
            if (p.id === participantId) {
              return {
                ...p,
                status: attended ? "Participated" as ParticipantStatus : "No-Show" as ParticipantStatus,
                attendedAt: attended ? new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : undefined,
              }
            }
            return p
          })
        }
      }
      return c
    }))
    // Update selected competition
    setSelectedCompetition(prev => {
      if (!prev) return prev
      return {
        ...prev,
        participants: prev.participants.map(p => {
          if (p.id === participantId) {
            return {
              ...p,
              status: attended ? "Participated" as ParticipantStatus : "No-Show" as ParticipantStatus,
              attendedAt: attended ? new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : undefined,
            }
          }
          return p
        })
      }
    })
  }

  const handleBulkMarkAttendance = (attended: boolean) => {
    if (!selectedCompetition || selectedParticipants.length === 0) return
    setCompetitions(competitions.map(c => {
      if (c.id === selectedCompetition.id) {
        return {
          ...c,
          participants: c.participants.map(p => {
            if (selectedParticipants.includes(p.id) && p.status === "Paid") {
              return {
                ...p,
                status: attended ? "Participated" as ParticipantStatus : "No-Show" as ParticipantStatus,
                attendedAt: attended ? new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : undefined,
              }
            }
            return p
          })
        }
      }
      return c
    }))
    setSelectedCompetition(prev => {
      if (!prev) return prev
      return {
        ...prev,
        participants: prev.participants.map(p => {
          if (selectedParticipants.includes(p.id) && p.status === "Paid") {
            return {
              ...p,
              status: attended ? "Participated" as ParticipantStatus : "No-Show" as ParticipantStatus,
              attendedAt: attended ? new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : undefined,
            }
          }
          return p
        })
      }
    })
    setSelectedParticipants([])
  }

  const openRefundModal = (participant: Participant) => {
    setSelectedParticipant(participant)
    setRefundAmount(participant.paymentAmount)
    setRefundReason("")
    setIsRefundModalOpen(true)
  }

  const handleProcessRefund = () => {
    if (!selectedCompetition || !selectedParticipant) return
    setIsLoading(true)
    setTimeout(() => {
      setCompetitions(competitions.map(c => {
        if (c.id === selectedCompetition.id) {
          return {
            ...c,
            participants: c.participants.map(p => {
              if (p.id === selectedParticipant.id) {
                return {
                  ...p,
                  status: "Refunded" as ParticipantStatus,
                  refundId: `rfnd_${Date.now()}`,
                  refundDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                  refundAmount: refundAmount,
                  refundReason: refundReason,
                }
              }
              return p
            }),
            totalRevenue: c.totalRevenue - refundAmount,
          }
        }
        return c
      }))
      setSelectedCompetition(prev => {
        if (!prev) return prev
        return {
          ...prev,
          participants: prev.participants.map(p => {
            if (p.id === selectedParticipant.id) {
              return {
                ...p,
                status: "Refunded" as ParticipantStatus,
                refundId: `rfnd_${Date.now()}`,
                refundDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                refundAmount: refundAmount,
                refundReason: refundReason,
              }
            }
            return p
          }),
          totalRevenue: prev.totalRevenue - refundAmount,
        }
      })
      setIsRefundModalOpen(false)
      setIsLoading(false)
    }, 1500)
  }

  const handleCancelParticipation = (participantId: string, reason: string) => {
    if (!selectedCompetition) return
    setCompetitions(competitions.map(c => {
      if (c.id === selectedCompetition.id) {
        return {
          ...c,
          participants: c.participants.map(p => {
            if (p.id === participantId) {
              return {
                ...p,
                status: "Cancelled" as ParticipantStatus,
                cancelledAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                cancelReason: reason,
              }
            }
            return p
          })
        }
      }
      return c
    }))
    setSelectedCompetition(prev => {
      if (!prev) return prev
      return {
        ...prev,
        participants: prev.participants.map(p => {
          if (p.id === participantId) {
            return {
              ...p,
              status: "Cancelled" as ParticipantStatus,
              cancelledAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
              cancelReason: reason,
            }
          }
          return p
        })
      }
    })
  }

  const handleSelectWinners = (first?: string, second?: string, third?: string) => {
    if (!selectedCompetition) return
    const participatedOnly = selectedCompetition.participants.filter(p => p.status === "Participated")
    const winners: Competition["winners"] = {}
    
    if (first) {
      const winner = participatedOnly.find(p => p.id === first)
      if (winner) winners.first = { ...winner, rank: 1 }
    }
    if (second) {
      const winner = participatedOnly.find(p => p.id === second)
      if (winner) winners.second = { ...winner, rank: 2 }
    }
    if (third) {
      const winner = participatedOnly.find(p => p.id === third)
      if (winner) winners.third = { ...winner, rank: 3 }
    }

    setCompetitions(competitions.map(c => 
      c.id === selectedCompetition.id ? { ...c, winners, status: "Completed" } : c
    ))
    setSelectedCompetition(prev => prev ? { ...prev, winners, status: "Completed" } : prev)
    setIsWinnersModalOpen(false)
  }

  const exportParticipants = () => {
    if (!selectedCompetition) return
    const data = selectedCompetition.participants.map(p => ({
      Name: p.name,
      Email: p.email,
      Mobile: p.mobile,
      Organization: p.organization || "",
      Status: p.status,
      PaymentID: p.paymentId,
      PaymentAmount: p.paymentAmount,
      PaymentDate: p.paymentDate,
      RegisteredAt: p.registeredAt,
      RefundID: p.refundId || "",
      RefundAmount: p.refundAmount || "",
      RefundReason: p.refundReason || "",
    }))
    const csv = [
      Object.keys(data[0] || {}).join(","),
      ...data.map(row => Object.values(row).join(","))
    ].join("\n")
    
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${selectedCompetition.name}-participants.csv`
    a.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Competitions</h1>
          <p className="text-muted-foreground">Manage paid competitions with prizes</p>
        </div>
        <Button onClick={() => { resetForm(); setIsCreateModalOpen(true) }}>
          <Plus className="mr-2 h-4 w-4" />
          Create Competition
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
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
                <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
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
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Competition</TableHead>
                <TableHead>Entry Fee</TableHead>
                <TableHead>Prize Pool</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompetitions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No competitions found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCompetitions.map((competition) => (
                  <TableRow key={competition.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{competition.name}</p>
                        <p className="text-sm text-muted-foreground">{competition.startDate} - {competition.endDate}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">₹{competition.entryFee}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-green-600">₹{competition.prizePool.toLocaleString()}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{competition.currentParticipants}/{competition.maxParticipants}</span>
                        <div className="h-2 w-16 rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${(competition.currentParticipants / competition.maxParticipants) * 100}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">₹{competition.totalRevenue.toLocaleString()}</span>
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
                          <DropdownMenuItem onClick={() => { setSelectedCompetition(competition); setIsViewModalOpen(true) }}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { 
                            setSelectedCompetition(competition)
                            setParticipantStatusFilter("all")
                            setParticipantSearch("")
                            setSelectedParticipants([])
                            setIsParticipantsModalOpen(true) 
                          }}>
                            <Users className="mr-2 h-4 w-4" />
                            Manage Participants
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditModal(competition)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => copyToClipboard(competition)}>
                            {copiedId === competition.id ? (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="mr-2 h-4 w-4" />
                                Copy Direct Link
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            const url = `${window.location.origin}/compete/${eventId}`
                            navigator.clipboard.writeText(url)
                          }}>
                            <LinkIcon className="mr-2 h-4 w-4" />
                            Copy Registration Page
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <a href={`/compete/${eventId}`} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Open Registration Page
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {competition.status === "Active" && (
                            <DropdownMenuItem onClick={() => { setSelectedCompetition(competition); setIsWinnersModalOpen(true) }}>
                              <Crown className="mr-2 h-4 w-4" />
                              Select Winners
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => { setSelectedCompetition(competition); setIsDeleteDialogOpen(true) }}
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

      {/* Create/Edit Competition Modal */}
      <Dialog open={isCreateModalOpen || isEditModalOpen} onOpenChange={(open) => { 
        if (!open) { setIsCreateModalOpen(false); setIsEditModalOpen(false) } 
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditModalOpen ? "Edit Competition" : "Create Competition"}</DialogTitle>
            <DialogDescription>
              {isEditModalOpen ? "Update competition details" : "Add a new paid competition with prizes"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Competition Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Best Startup Pitch"
              />
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the competition..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Entry Fee (₹) *</Label>
                <Input
                  type="number"
                  value={formData.entryFee}
                  onChange={(e) => setFormData({ ...formData, entryFee: e.target.value })}
                  placeholder="500"
                />
              </div>
              <div className="grid gap-2">
                <Label>Max Participants *</Label>
                <Input
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                  placeholder="50"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Prize Distribution (₹)</Label>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">1st Prize</span>
                  </div>
                  <Input
                    type="number"
                    value={formData.prizeFirst}
                    onChange={(e) => setFormData({ ...formData, prizeFirst: e.target.value })}
                    placeholder="25000"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Medal className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">2nd Prize</span>
                  </div>
                  <Input
                    type="number"
                    value={formData.prizeSecond}
                    onChange={(e) => setFormData({ ...formData, prizeSecond: e.target.value })}
                    placeholder="15000"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-amber-600" />
                    <span className="text-sm">3rd Prize</span>
                  </div>
                  <Input
                    type="number"
                    value={formData.prizeThird}
                    onChange={(e) => setFormData({ ...formData, prizeThird: e.target.value })}
                    placeholder="10000"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Start Date *</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>End Date *</Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Rules & Guidelines</Label>
              <Textarea
                value={formData.rules}
                onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                placeholder="1. Rule one&#10;2. Rule two&#10;3. Rule three"
                rows={4}
              />
            </div>
            <div className="grid gap-2">
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
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false) }}>
              Cancel
            </Button>
            <Button onClick={isEditModalOpen ? handleEditCompetition : handleCreateCompetition} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditModalOpen ? "Updating..." : "Creating..."}
                </>
              ) : (
                isEditModalOpen ? "Update Competition" : "Create Competition"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Competition Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-0 gap-0">
          <DialogTitle className="sr-only">{selectedCompetition?.name} Details</DialogTitle>
          {selectedCompetition && (
            <>
              <div className="bg-primary/5 p-5 border-b">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg font-bold">{selectedCompetition.name}</h2>
                      {getStatusBadge(selectedCompetition.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{selectedCompetition.description}</p>
                  </div>
                </div>
              </div>
              <div className="p-5 space-y-5">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border p-3 text-center">
                    <p className="text-xl font-bold">₹{selectedCompetition.entryFee}</p>
                    <p className="text-xs text-muted-foreground">Entry Fee</p>
                  </div>
                  <div className="rounded-lg border p-3 text-center">
                    <p className="text-xl font-bold text-green-600">₹{selectedCompetition.prizePool.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Prize Pool</p>
                  </div>
                  <div className="rounded-lg border p-3 text-center">
                    <p className="text-xl font-bold">{selectedCompetition.currentParticipants}/{selectedCompetition.maxParticipants}</p>
                    <p className="text-xs text-muted-foreground">Participants</p>
                  </div>
                  <div className="rounded-lg border p-3 text-center">
                    <p className="text-xl font-bold">₹{selectedCompetition.totalRevenue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                  </div>
                </div>

                {/* Prize Distribution */}
                <div>
                  <Label className="text-sm text-muted-foreground">Prize Distribution</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between rounded-lg bg-yellow-50 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Crown className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">1st Prize</span>
                      </div>
                      <span className="font-bold">₹{selectedCompetition.prizes.first.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Medal className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium">2nd Prize</span>
                      </div>
                      <span className="font-bold">₹{selectedCompetition.prizes.second.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-amber-50 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-amber-600" />
                        <span className="text-sm font-medium">3rd Prize</span>
                      </div>
                      <span className="font-bold">₹{selectedCompetition.prizes.third.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Winners */}
                {selectedCompetition.status === "Completed" && Object.keys(selectedCompetition.winners).length > 0 && (
                  <div>
                    <Label className="text-sm text-muted-foreground">Winners</Label>
                    <div className="mt-2 space-y-2">
                      {selectedCompetition.winners.first && (
                        <div className="flex items-center justify-between rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-2">
                          <div className="flex items-center gap-2">
                            <Crown className="h-4 w-4 text-yellow-500" />
                            <span className="font-medium">{selectedCompetition.winners.first.name}</span>
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-700">1st</Badge>
                        </div>
                      )}
                      {selectedCompetition.winners.second && (
                        <div className="flex items-center justify-between rounded-lg border px-3 py-2">
                          <div className="flex items-center gap-2">
                            <Medal className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{selectedCompetition.winners.second.name}</span>
                          </div>
                          <Badge variant="secondary">2nd</Badge>
                        </div>
                      )}
                      {selectedCompetition.winners.third && (
                        <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-amber-600" />
                            <span className="font-medium">{selectedCompetition.winners.third.name}</span>
                          </div>
                          <Badge className="bg-amber-100 text-amber-700">3rd</Badge>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* URLs */}
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm text-muted-foreground">Direct Competition Link</Label>
                    <div className="mt-1 flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2">
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
                  <div>
                    <Label className="text-sm text-muted-foreground">Registration Page (All Competitions)</Label>
                    <div className="mt-1 flex items-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-3 py-2">
                      <LinkIcon className="h-4 w-4 shrink-0 text-violet-600" />
                      <code className="flex-1 text-xs truncate text-violet-700">/compete/{eventId}</code>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/compete/${eventId}`)
                      }}>
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Users can select from all active competitions on this page</p>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-3 border-t">
                  <Calendar className="h-4 w-4" />
                  <span>{selectedCompetition.startDate} - {selectedCompetition.endDate}</span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Participants Management Modal */}
      <Dialog open={isParticipantsModalOpen} onOpenChange={setIsParticipantsModalOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
          <DialogHeader className="p-5 border-b">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Manage Participants - {selectedCompetition?.name}</DialogTitle>
                <DialogDescription>View and manage competition participants, process refunds, mark attendance</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          {selectedCompetition && (
            <>
              {/* Participant Stats */}
              <div className="grid grid-cols-7 gap-2 p-4 bg-muted/30 border-b">
                {(() => {
                  const stats = getParticipantStats(selectedCompetition)
                  return (
                    <>
                      <div className="text-center p-2 rounded-lg bg-background border">
                        <p className="text-lg font-bold">{stats.total}</p>
                        <p className="text-xs text-muted-foreground">Total</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-yellow-50 border border-yellow-200">
                        <p className="text-lg font-bold text-yellow-700">{stats.pending}</p>
                        <p className="text-xs text-yellow-600">Pending</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-green-50 border border-green-200">
                        <p className="text-lg font-bold text-green-700">{stats.paid}</p>
                        <p className="text-xs text-green-600">Paid</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-blue-50 border border-blue-200">
                        <p className="text-lg font-bold text-blue-700">{stats.participated}</p>
                        <p className="text-xs text-blue-600">Participated</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-orange-50 border border-orange-200">
                        <p className="text-lg font-bold text-orange-700">{stats.noShow}</p>
                        <p className="text-xs text-orange-600">No-Show</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-gray-50 border border-gray-200">
                        <p className="text-lg font-bold text-gray-700">{stats.cancelled}</p>
                        <p className="text-xs text-gray-600">Cancelled</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-purple-50 border border-purple-200">
                        <p className="text-lg font-bold text-purple-700">{stats.refunded}</p>
                        <p className="text-xs text-purple-600">Refunded</p>
                      </div>
                    </>
                  )
                })()}
              </div>

              {/* Filters & Actions */}
              <div className="flex flex-col sm:flex-row gap-3 p-4 border-b">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, mobile..."
                    value={participantSearch}
                    onChange={(e) => setParticipantSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={participantStatusFilter} onValueChange={setParticipantStatusFilter}>
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Pending">Pending Payment</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Participated">Participated</SelectItem>
                    <SelectItem value="No-Show">No-Show</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                    <SelectItem value="Refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" onClick={exportParticipants}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>

              {/* Bulk Actions */}
              {selectedParticipants.length > 0 && (
                <div className="flex items-center gap-3 px-4 py-2 bg-primary/5 border-b">
                  <span className="text-sm font-medium">{selectedParticipants.length} selected</span>
                  <Button size="sm" variant="outline" onClick={() => handleBulkMarkAttendance(true)}>
                    <UserCheck className="mr-2 h-4 w-4" />
                    Mark Participated
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkMarkAttendance(false)}>
                    <UserX className="mr-2 h-4 w-4" />
                    Mark No-Show
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setSelectedParticipants([])}>
                    Clear Selection
                  </Button>
                </div>
              )}

              {/* Participants Table */}
              <div className="flex-1 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">
                        <Checkbox
                          checked={selectedParticipants.length === filteredParticipants.filter(p => p.status === "Paid").length && filteredParticipants.filter(p => p.status === "Paid").length > 0}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedParticipants(filteredParticipants.filter(p => p.status === "Paid").map(p => p.id))
                            } else {
                              setSelectedParticipants([])
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead>Participant</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredParticipants.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No participants found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredParticipants.map((participant) => (
                        <TableRow key={participant.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedParticipants.includes(participant.id)}
                              disabled={participant.status !== "Paid"}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedParticipants([...selectedParticipants, participant.id])
                                } else {
                                  setSelectedParticipants(selectedParticipants.filter(id => id !== participant.id))
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{participant.name}</p>
                              {participant.organization && (
                                <p className="text-sm text-muted-foreground">{participant.organization}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1 text-sm">
                                <Mail className="h-3 w-3 text-muted-foreground" />
                                {participant.email}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Phone className="h-3 w-3" />
                                {participant.mobile}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {participant.paymentId ? (
                              <div>
                                <p className="font-medium">₹{participant.paymentAmount}</p>
                                <p className="text-xs text-muted-foreground">{participant.paymentId}</p>
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{participant.registeredAt}</span>
                          </TableCell>
                          <TableCell>
                            {getParticipantStatusBadge(participant.status)}
                            {participant.refundId && (
                              <p className="text-xs text-muted-foreground mt-1">Refund: {participant.refundId}</p>
                            )}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => { setSelectedParticipant(participant); setIsViewParticipantModalOpen(true) }}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                {participant.status === "Paid" && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleMarkAttendance(participant.id, true)}>
                                      <UserCheck className="mr-2 h-4 w-4 text-green-600" />
                                      Mark Participated
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleMarkAttendance(participant.id, false)}>
                                      <UserX className="mr-2 h-4 w-4 text-orange-600" />
                                      Mark No-Show
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => openRefundModal(participant)}>
                                      <RotateCcw className="mr-2 h-4 w-4 text-purple-600" />
                                      Process Refund
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleCancelParticipation(participant.id, "Admin cancelled")}>
                                      <Ban className="mr-2 h-4 w-4 text-red-600" />
                                      Cancel Participation
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {participant.status === "No-Show" && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => openRefundModal(participant)}>
                                      <RotateCcw className="mr-2 h-4 w-4 text-purple-600" />
                                      Process Refund
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {participant.status === "Pending" && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                      <RefreshCw className="mr-2 h-4 w-4" />
                                      Send Payment Reminder
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* View Participant Details Modal */}
      <Dialog open={isViewParticipantModalOpen} onOpenChange={setIsViewParticipantModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Participant Details</DialogTitle>
          </DialogHeader>
          {selectedParticipant && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{selectedParticipant.name}</p>
                  {selectedParticipant.organization && (
                    <p className="text-sm text-muted-foreground">{selectedParticipant.organization}</p>
                  )}
                </div>
                {getParticipantStatusBadge(selectedParticipant.status)}
              </div>

              <div className="grid gap-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{selectedParticipant.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Mobile</span>
                  <span className="font-medium">{selectedParticipant.mobile}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Registered On</span>
                  <span className="font-medium">{selectedParticipant.registeredAt}</span>
                </div>
              </div>

              {selectedParticipant.paymentId && (
                <div className="p-3 rounded-lg border bg-green-50 border-green-200">
                  <p className="text-sm font-medium text-green-800 mb-2">Payment Details</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-700">Amount</span>
                      <span className="font-medium text-green-800">₹{selectedParticipant.paymentAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Payment ID</span>
                      <span className="font-mono text-xs text-green-800">{selectedParticipant.paymentId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Date</span>
                      <span className="text-green-800">{selectedParticipant.paymentDate}</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedParticipant.refundId && (
                <div className="p-3 rounded-lg border bg-purple-50 border-purple-200">
                  <p className="text-sm font-medium text-purple-800 mb-2">Refund Details</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-700">Amount</span>
                      <span className="font-medium text-purple-800">₹{selectedParticipant.refundAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-700">Refund ID</span>
                      <span className="font-mono text-xs text-purple-800">{selectedParticipant.refundId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-700">Date</span>
                      <span className="text-purple-800">{selectedParticipant.refundDate}</span>
                    </div>
                    {selectedParticipant.refundReason && (
                      <div className="pt-2 border-t border-purple-200 mt-2">
                        <span className="text-purple-700">Reason: </span>
                        <span className="text-purple-800">{selectedParticipant.refundReason}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedParticipant.attendedAt && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <CheckCircle className="h-4 w-4" />
                  Attended on {selectedParticipant.attendedAt}
                </div>
              )}

              {selectedParticipant.cancelledAt && (
                <div className="p-3 rounded-lg border bg-gray-50">
                  <p className="text-sm text-gray-600">
                    Cancelled on {selectedParticipant.cancelledAt}
                    {selectedParticipant.cancelReason && ` - ${selectedParticipant.cancelReason}`}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Process Refund Modal */}
      <Dialog open={isRefundModalOpen} onOpenChange={setIsRefundModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-purple-600" />
              Process Refund
            </DialogTitle>
            <DialogDescription>
              Process a refund for {selectedParticipant?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedParticipant && (
            <div className="space-y-4 py-4">
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Original Payment</span>
                  <span className="font-medium">₹{selectedParticipant.paymentAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment ID</span>
                  <span className="font-mono text-xs">{selectedParticipant.paymentId}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Refund Amount (₹)</Label>
                <Input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(Number(e.target.value))}
                  max={selectedParticipant.paymentAmount}
                />
                {refundAmount < selectedParticipant.paymentAmount && (
                  <p className="text-xs text-yellow-600 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Partial refund of ₹{refundAmount} (Full: ₹{selectedParticipant.paymentAmount})
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Reason for Refund *</Label>
                <Textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="Enter reason for refund..."
                  rows={3}
                />
              </div>

              <div className="p-3 rounded-lg border border-yellow-200 bg-yellow-50">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> This will initiate a refund of ₹{refundAmount} to the participant&apos;s original payment method. This action cannot be undone.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRefundModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleProcessRefund} 
              disabled={isLoading || !refundReason || refundAmount <= 0}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Process Refund
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Select Winners Modal */}
      <Dialog open={isWinnersModalOpen} onOpenChange={setIsWinnersModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              Select Winners
            </DialogTitle>
            <DialogDescription>
              Choose winners from participants who have participated
            </DialogDescription>
          </DialogHeader>
          {selectedCompetition && (
            <div className="space-y-4 py-4">
              {(() => {
                const participatedOnly = selectedCompetition.participants.filter(p => p.status === "Participated")
                const [firstWinner, setFirstWinner] = useState<string>("")
                const [secondWinner, setSecondWinner] = useState<string>("")
                const [thirdWinner, setThirdWinner] = useState<string>("")

                if (participatedOnly.length === 0) {
                  return (
                    <div className="text-center py-8">
                      <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
                      <p className="font-medium">No Participated Users</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Mark participants as &quot;Participated&quot; before selecting winners
                      </p>
                    </div>
                  )
                }

                return (
                  <>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Crown className="h-4 w-4 text-yellow-500" />
                          1st Prize (₹{selectedCompetition.prizes.first.toLocaleString()})
                        </Label>
                        <Select value={firstWinner} onValueChange={setFirstWinner}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select 1st place winner" />
                          </SelectTrigger>
                          <SelectContent>
                            {participatedOnly.map(p => (
                              <SelectItem key={p.id} value={p.id} disabled={p.id === secondWinner || p.id === thirdWinner}>
                                {p.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Medal className="h-4 w-4 text-gray-400" />
                          2nd Prize (₹{selectedCompetition.prizes.second.toLocaleString()})
                        </Label>
                        <Select value={secondWinner} onValueChange={setSecondWinner}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select 2nd place winner" />
                          </SelectTrigger>
                          <SelectContent>
                            {participatedOnly.map(p => (
                              <SelectItem key={p.id} value={p.id} disabled={p.id === firstWinner || p.id === thirdWinner}>
                                {p.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-amber-600" />
                          3rd Prize (₹{selectedCompetition.prizes.third.toLocaleString()})
                        </Label>
                        <Select value={thirdWinner} onValueChange={setThirdWinner}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select 3rd place winner" />
                          </SelectTrigger>
                          <SelectContent>
                            {participatedOnly.map(p => (
                              <SelectItem key={p.id} value={p.id} disabled={p.id === firstWinner || p.id === secondWinner}>
                                {p.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <p className="text-sm text-muted-foreground mb-4">
                        Selecting winners will mark this competition as &quot;Completed&quot;
                      </p>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsWinnersModalOpen(false)}>
                          Cancel
                        </Button>
                        <Button 
                          onClick={() => handleSelectWinners(firstWinner, secondWinner, thirdWinner)}
                          disabled={!firstWinner}
                        >
                          <Trophy className="mr-2 h-4 w-4" />
                          Announce Winners
                        </Button>
                      </div>
                    </div>
                  </>
                )
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Competition?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{selectedCompetition?.name}&quot; and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCompetition} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
