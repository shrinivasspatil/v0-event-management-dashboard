"use client"

import { useState, useRef } from "react"
import { useParams } from "next/navigation"
import {
  Upload,
  FileSpreadsheet,
  Download,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  AlertCircle,
  X,
  Check,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

interface UploadedVisitor {
  id: string
  name: string
  email: string
  mobileNo: string
  city: string
  industry: string
  status: "Registered" | "Attended" | "Rejected"
  isValid: boolean
  errors: string[]
}

// Sample template data structure
const sampleData = [
  { name: "John Doe", email: "john@example.com", mobileNo: "+1234567890", city: "New York", industry: "Technology" },
  { name: "Jane Smith", email: "jane@example.com", mobileNo: "+0987654321", city: "Los Angeles", industry: "Healthcare" },
]

export default function BulkUploadPage() {
  const params = useParams()
  const eventId = params.id as string
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedVisitors, setUploadedVisitors] = useState<UploadedVisitor[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [bulkAction, setBulkAction] = useState<"Attended" | "Rejected" | "delete" | null>(null)
  const [registrationForm, setRegistrationForm] = useState<string>("")

  // Registration forms
  const registrationForms = [
    { id: "1", name: "Shrinivas" },
    { id: "2", name: "Vinay" },
    { id: "3", name: "Ravi" },
  ]

  // Stats
  const stats = {
    total: uploadedVisitors.length,
    registered: uploadedVisitors.filter(v => v.status === "Registered").length,
    attended: uploadedVisitors.filter(v => v.status === "Attended").length,
    rejected: uploadedVisitors.filter(v => v.status === "Rejected").length,
    invalid: uploadedVisitors.filter(v => !v.isValid).length,
  }

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || 
          file.type === "application/vnd.ms-excel" ||
          file.name.endsWith('.xlsx') ||
          file.name.endsWith('.xls') ||
          file.name.endsWith('.csv')) {
        setUploadedFile(file)
      } else {
        alert("Please upload an Excel file (.xlsx, .xls) or CSV file")
      }
    }
  }

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) {
      if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || 
          file.type === "application/vnd.ms-excel" ||
          file.name.endsWith('.xlsx') ||
          file.name.endsWith('.xls') ||
          file.name.endsWith('.csv')) {
        setUploadedFile(file)
      } else {
        alert("Please upload an Excel file (.xlsx, .xls) or CSV file")
      }
    }
  }

  // Process uploaded file (simulated)
  const processFile = () => {
    if (!uploadedFile || !registrationForm) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate file processing with progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          
          // Generate sample uploaded data
          const mockVisitors: UploadedVisitor[] = [
            { id: "1", name: "Rajesh Kumar", email: "rajesh@techcorp.com", mobileNo: "+91 9876543210", city: "Mumbai", industry: "Technology", status: "Registered", isValid: true, errors: [] },
            { id: "2", name: "Priya Sharma", email: "priya@healthcare.in", mobileNo: "+91 9876543211", city: "Delhi", industry: "Healthcare", status: "Registered", isValid: true, errors: [] },
            { id: "3", name: "Amit Patel", email: "amit@finance.com", mobileNo: "+91 9876543212", city: "Ahmedabad", industry: "Finance", status: "Registered", isValid: true, errors: [] },
            { id: "4", name: "Sneha Reddy", email: "sneha@retail.in", mobileNo: "+91 9876543213", city: "Hyderabad", industry: "Retail", status: "Registered", isValid: true, errors: [] },
            { id: "5", name: "Vikram Singh", email: "vikram@manufacturing.com", mobileNo: "+91 9876543214", city: "Pune", industry: "Manufacturing", status: "Registered", isValid: true, errors: [] },
            { id: "6", name: "Anita Desai", email: "", mobileNo: "+91 9876543215", city: "Chennai", industry: "Education", status: "Registered", isValid: false, errors: ["Email is required"] },
            { id: "7", name: "Rahul Verma", email: "rahul@logistics.in", mobileNo: "", city: "Bangalore", industry: "Logistics", status: "Registered", isValid: false, errors: ["Mobile number is required"] },
            { id: "8", name: "Kavitha Nair", email: "kavitha@pharma.com", mobileNo: "+91 9876543217", city: "Kochi", industry: "Pharmaceutical", status: "Registered", isValid: true, errors: [] },
            { id: "9", name: "Suresh Iyer", email: "suresh@energy.in", mobileNo: "+91 9876543218", city: "Coimbatore", industry: "Energy", status: "Registered", isValid: true, errors: [] },
            { id: "10", name: "Meena Gupta", email: "meena@hospitality.com", mobileNo: "+91 9876543219", city: "Jaipur", industry: "Hospitality", status: "Registered", isValid: true, errors: [] },
            { id: "11", name: "", email: "unknown@test.com", mobileNo: "+91 9876543220", city: "Lucknow", industry: "Other", status: "Registered", isValid: false, errors: ["Name is required"] },
            { id: "12", name: "Deepak Joshi", email: "deepak@media.in", mobileNo: "+91 9876543221", city: "Indore", industry: "Media", status: "Registered", isValid: true, errors: [] },
          ]
          
          setUploadedVisitors(mockVisitors)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  // Download sample template
  const downloadTemplate = () => {
    // Create CSV content
    const headers = ["Name", "Email", "Mobile No", "City", "Industry"]
    const csvContent = [
      headers.join(","),
      ...sampleData.map(row => `${row.name},${row.email},${row.mobileNo},${row.city},${row.industry}`)
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "visitor_upload_template.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  // Filter visitors
  const filteredVisitors = uploadedVisitors.filter(visitor => {
    const matchesSearch = 
      visitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visitor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visitor.city.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "invalid" ? !visitor.isValid : visitor.status === statusFilter)
    
    return matchesSearch && matchesStatus
  })

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredVisitors.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredVisitors.map(v => v.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  // Status update handlers
  const updateStatus = (id: string, status: "Registered" | "Attended" | "Rejected") => {
    setUploadedVisitors(prev =>
      prev.map(v => v.id === id ? { ...v, status } : v)
    )
  }

  const handleBulkAction = (action: "Attended" | "Rejected" | "delete") => {
    if (selectedIds.length === 0) return
    setBulkAction(action)
    setIsConfirmModalOpen(true)
  }

  const confirmBulkAction = () => {
    if (!bulkAction) return

    if (bulkAction === "delete") {
      setUploadedVisitors(prev => prev.filter(v => !selectedIds.includes(v.id)))
    } else {
      setUploadedVisitors(prev =>
        prev.map(v => selectedIds.includes(v.id) ? { ...v, status: bulkAction } : v)
      )
    }

    setSelectedIds([])
    setIsConfirmModalOpen(false)
    setBulkAction(null)
  }

  // Import valid visitors
  const importVisitors = () => {
    const validVisitors = uploadedVisitors.filter(v => v.isValid)
    // In real app, this would send to API
    alert(`Successfully imported ${validVisitors.length} visitors to the event!`)
    setUploadedVisitors([])
    setUploadedFile(null)
    setRegistrationForm("")
  }

  // Clear all data
  const clearAll = () => {
    setUploadedVisitors([])
    setUploadedFile(null)
    setSelectedIds([])
    setRegistrationForm("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Registered":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Registered</Badge>
      case "Attended":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Attended</Badge>
      case "Rejected":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Bulk Upload Visitors</h1>
        <p className="mt-1 text-muted-foreground">
          Upload an Excel file to import multiple visitors at once
        </p>
      </div>

      {/* Upload Section */}
      {uploadedVisitors.length === 0 ? (
        <div className="space-y-6">
          {/* Registration Form Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Registration Form</CardTitle>
              <CardDescription>Choose which registration form these visitors will be tagged to</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-sm">
                <Select value={registrationForm} onValueChange={setRegistrationForm}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a registration form" />
                  </SelectTrigger>
                  <SelectContent>
                    {registrationForms.map(form => (
                      <SelectItem key={form.id} value={form.name}>{form.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Upload Area */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upload Excel File</CardTitle>
              <CardDescription>
                Supported formats: .xlsx, .xls, .csv
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Drag and Drop Zone */}
              <div
                className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
                  uploadedFile 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                {uploadedFile ? (
                  <div className="space-y-3">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <FileSpreadsheet className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{uploadedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(uploadedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setUploadedFile(null)
                        if (fileInputRef.current) fileInputRef.current.value = ""
                      }}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Remove File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                      <Upload className="h-7 w-7 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        Drag and drop your file here, or{" "}
                        <button
                          className="text-primary hover:underline"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          browse
                        </button>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Maximum file size: 10MB
                      </p>
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Processing file...</span>
                    <span className="font-medium">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4">
                <Button variant="outline" onClick={downloadTemplate}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Template
                </Button>
                <Button 
                  onClick={processFile} 
                  disabled={!uploadedFile || !registrationForm || isUploading}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Process File
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
                <li>Select the registration form to tag uploaded visitors</li>
                <li>Download the template file to see the required format</li>
                <li>Fill in your visitor data in the template</li>
                <li>Upload the completed file (Excel or CSV)</li>
                <li>Review and validate the imported data</li>
                <li>Mark attendance status as needed</li>
                <li>Import valid visitors to the event</li>
              </ol>
              <div className="mt-4 rounded-lg bg-yellow-50 p-4">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 shrink-0 text-yellow-600" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium">Required Fields</p>
                    <p>Name, Email, and Mobile No are required fields. Rows with missing required fields will be marked as invalid.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-5">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.total}</p>
                    <p className="text-xs text-muted-foreground">Total Uploaded</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{stats.registered}</p>
                    <p className="text-xs text-muted-foreground">Registered</p>
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
                    <p className="text-2xl font-bold text-green-600">{stats.attended}</p>
                    <p className="text-xs text-muted-foreground">Attended</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                    <XCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                    <p className="text-xs text-muted-foreground">Rejected</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">{stats.invalid}</p>
                    <p className="text-xs text-muted-foreground">Invalid</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* File Info & Actions */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <FileSpreadsheet className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{uploadedFile?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Tagged to: <Badge variant="outline">{registrationForm}</Badge>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={clearAll}>
                    <X className="mr-2 h-4 w-4" />
                    Clear All
                  </Button>
                  <Button onClick={importVisitors} disabled={stats.invalid === stats.total}>
                    <Check className="mr-2 h-4 w-4" />
                    Import {stats.total - stats.invalid} Valid Visitors
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters & Bulk Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Input
                placeholder="Search visitors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Registered">Registered</SelectItem>
                  <SelectItem value="Attended">Attended</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="invalid">Invalid Rows</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedIds.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedIds.length} selected
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Bulk Actions
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleBulkAction("Attended")}>
                      <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                      Mark as Attended
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction("Rejected")}>
                      <XCircle className="mr-2 h-4 w-4 text-red-600" />
                      Mark as Rejected
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => handleBulkAction("delete")}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove Selected
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          {/* Data Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedIds.length === filteredVisitors.length && filteredVisitors.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Mobile No</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Validation</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVisitors.map((visitor) => (
                    <TableRow 
                      key={visitor.id}
                      className={!visitor.isValid ? "bg-red-50" : ""}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(visitor.id)}
                          onCheckedChange={() => toggleSelect(visitor.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {visitor.name || <span className="text-red-500 italic">Missing</span>}
                      </TableCell>
                      <TableCell>
                        {visitor.email || <span className="text-red-500 italic">Missing</span>}
                      </TableCell>
                      <TableCell>
                        {visitor.mobileNo || <span className="text-red-500 italic">Missing</span>}
                      </TableCell>
                      <TableCell>{visitor.city}</TableCell>
                      <TableCell>{visitor.industry}</TableCell>
                      <TableCell>{getStatusBadge(visitor.status)}</TableCell>
                      <TableCell>
                        {visitor.isValid ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Valid
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                            <XCircle className="mr-1 h-3 w-3" />
                            {visitor.errors[0]}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => updateStatus(visitor.id, "Registered")}>
                              <Clock className="mr-2 h-4 w-4 text-blue-600" />
                              Mark as Registered
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateStatus(visitor.id, "Attended")}>
                              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                              Mark as Attended
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateStatus(visitor.id, "Rejected")}>
                              <XCircle className="mr-2 h-4 w-4 text-red-600" />
                              Mark as Rejected
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => setUploadedVisitors(prev => prev.filter(v => v.id !== visitor.id))}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredVisitors.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-lg font-medium text-foreground">No visitors found</p>
                  <p className="text-sm text-muted-foreground">Try adjusting your search or filter</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bulk Action Confirmation Modal */}
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="sm:max-w-md" aria-describedby="bulk-action-description">
          <DialogHeader>
            <DialogTitle>
              {bulkAction === "delete" ? "Remove Visitors" : `Mark as ${bulkAction}`}
            </DialogTitle>
            <DialogDescription id="bulk-action-description">
              {bulkAction === "delete" 
                ? `Are you sure you want to remove ${selectedIds.length} selected visitor(s)? This action cannot be undone.`
                : `Are you sure you want to mark ${selectedIds.length} selected visitor(s) as ${bulkAction}?`
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant={bulkAction === "delete" ? "destructive" : "default"}
              onClick={confirmBulkAction}
            >
              {bulkAction === "delete" ? "Remove" : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
