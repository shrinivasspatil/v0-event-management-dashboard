"use client"

import { useState } from "react"
import {
  Settings,
  Users,
  Mail,
  MessageSquare,
  Plus,
  Trash2,
  Pencil,
  CheckCircle,
  XCircle,
  Loader2,
  Eye,
  EyeOff,
  RefreshCw,
  Shield,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"

// Types
interface Executive {
  id: string
  name: string
  email: string
  role: "Admin" | "Manager" | "Coordinator"
  status: "Active" | "Invited" | "Inactive"
  addedAt: string
}

interface EmailConfig {
  provider: "smtp" | "sendgrid" | "mailgun" | "ses"
  host?: string
  port?: number
  username?: string
  password?: string
  apiKey?: string
  fromEmail: string
  fromName: string
  isConnected: boolean
  lastTested?: string
}

interface SMSConfig {
  provider: "twilio" | "msg91" | "textlocal" | "nexmo"
  accountSid?: string
  authToken?: string
  apiKey?: string
  senderId: string
  isConnected: boolean
  lastTested?: string
}

// Initial Data
const initialExecutives: Executive[] = [
  { id: "1", name: "Rahul Sharma", email: "rahul@company.com", role: "Admin", status: "Active", addedAt: "Mar 1, 2026" },
  { id: "2", name: "Priya Patel", email: "priya@company.com", role: "Manager", status: "Active", addedAt: "Mar 5, 2026" },
  { id: "3", name: "Amit Kumar", email: "amit@company.com", role: "Coordinator", status: "Invited", addedAt: "Mar 15, 2026" },
]

const initialEmailConfig: EmailConfig = {
  provider: "smtp",
  host: "smtp.gmail.com",
  port: 587,
  username: "",
  password: "",
  fromEmail: "events@company.com",
  fromName: "Event Team",
  isConnected: false,
}

const initialSMSConfig: SMSConfig = {
  provider: "twilio",
  accountSid: "",
  authToken: "",
  senderId: "EVNTMGR",
  isConnected: false,
}

export default function SettingsPage() {
  // General Settings State
  const [eventName, setEventName] = useState("Tech Summit 2026")
  const [eventDescription, setEventDescription] = useState("Annual technology conference bringing together industry leaders and innovators.")
  const [eventTimezone, setEventTimezone] = useState("Asia/Kolkata")
  const [registrationOpen, setRegistrationOpen] = useState(true)
  const [generalSaving, setGeneralSaving] = useState(false)
  const [generalSaved, setGeneralSaved] = useState(false)

  // Executives State
  const [executives, setExecutives] = useState<Executive[]>(initialExecutives)
  const [isAddExecModalOpen, setIsAddExecModalOpen] = useState(false)
  const [isEditExecModalOpen, setIsEditExecModalOpen] = useState(false)
  const [isDeleteExecDialogOpen, setIsDeleteExecDialogOpen] = useState(false)
  const [selectedExec, setSelectedExec] = useState<Executive | null>(null)
  const [newExec, setNewExec] = useState({ name: "", email: "", role: "Coordinator" as Executive["role"] })
  const [execSaving, setExecSaving] = useState(false)

  // Email Config State
  const [emailConfig, setEmailConfig] = useState<EmailConfig>(initialEmailConfig)
  const [showEmailPassword, setShowEmailPassword] = useState(false)
  const [emailTesting, setEmailTesting] = useState(false)
  const [emailSaving, setEmailSaving] = useState(false)
  const [emailTestResult, setEmailTestResult] = useState<"success" | "error" | null>(null)

  // SMS Config State
  const [smsConfig, setSMSConfig] = useState<SMSConfig>(initialSMSConfig)
  const [showSMSToken, setShowSMSToken] = useState(false)
  const [smsTesting, setSmsTesting] = useState(false)
  const [smsSaving, setSmsSaving] = useState(false)
  const [smsTestResult, setSmsTestResult] = useState<"success" | "error" | null>(null)

  // Handlers - General Settings
  const handleSaveGeneral = async () => {
    setGeneralSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setGeneralSaving(false)
    setGeneralSaved(true)
    setTimeout(() => setGeneralSaved(false), 3000)
  }

  // Handlers - Executives
  const handleAddExecutive = async () => {
    if (!newExec.name || !newExec.email) return
    setExecSaving(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const exec: Executive = {
      id: String(Date.now()),
      name: newExec.name,
      email: newExec.email,
      role: newExec.role,
      status: "Invited",
      addedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    }
    setExecutives([...executives, exec])
    setNewExec({ name: "", email: "", role: "Coordinator" })
    setIsAddExecModalOpen(false)
    setExecSaving(false)
  }

  const handleEditExecutive = async () => {
    if (!selectedExec) return
    setExecSaving(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    
    setExecutives(executives.map(e => e.id === selectedExec.id ? selectedExec : e))
    setIsEditExecModalOpen(false)
    setSelectedExec(null)
    setExecSaving(false)
  }

  const handleDeleteExecutive = async () => {
    if (!selectedExec) return
    setExecutives(executives.filter(e => e.id !== selectedExec.id))
    setIsDeleteExecDialogOpen(false)
    setSelectedExec(null)
  }

  const handleResendInvite = async (exec: Executive) => {
    // Simulate resend
    await new Promise(resolve => setTimeout(resolve, 500))
    alert(`Invitation resent to ${exec.email}`)
  }

  // Handlers - Email Config
  const handleTestEmailConnection = async () => {
    setEmailTesting(true)
    setEmailTestResult(null)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Simulate validation
    const isValid = emailConfig.host && emailConfig.fromEmail && 
      (emailConfig.provider === "smtp" ? emailConfig.username && emailConfig.password : emailConfig.apiKey)
    
    setEmailTestResult(isValid ? "success" : "error")
    if (isValid) {
      setEmailConfig({ ...emailConfig, isConnected: true, lastTested: new Date().toLocaleString() })
    }
    setEmailTesting(false)
  }

  const handleSaveEmailConfig = async () => {
    setEmailSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setEmailSaving(false)
  }

  // Handlers - SMS Config
  const handleTestSMSConnection = async () => {
    setSmsTesting(true)
    setSmsTestResult(null)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Simulate validation
    const isValid = smsConfig.senderId && 
      (smsConfig.provider === "twilio" ? smsConfig.accountSid && smsConfig.authToken : smsConfig.apiKey)
    
    setSmsTestResult(isValid ? "success" : "error")
    if (isValid) {
      setSMSConfig({ ...smsConfig, isConnected: true, lastTested: new Date().toLocaleString() })
    }
    setSmsTesting(false)
  }

  const handleSaveSMSConfig = async () => {
    setSmsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSmsSaving(false)
  }

  const getRoleBadgeVariant = (role: Executive["role"]) => {
    switch (role) {
      case "Admin": return "default"
      case "Manager": return "secondary"
      case "Coordinator": return "outline"
    }
  }

  const getStatusBadge = (status: Executive["status"]) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
      case "Invited":
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Invited</Badge>
      case "Inactive":
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Inactive</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground">Manage event settings, team, and integrations</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full max-w-xl grid-cols-4">
            <TabsTrigger value="general" className="gap-2">
              <Settings className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="executives" className="gap-2">
              <Users className="h-4 w-4" />
              Executives
            </TabsTrigger>
            <TabsTrigger value="email" className="gap-2">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="sms" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              SMS
            </TabsTrigger>
          </TabsList>

          {/* General Settings Tab */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Basic event configuration and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="eventName">Event Name</Label>
                    <Input
                      id="eventName"
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                      placeholder="Enter event name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={eventTimezone} onValueChange={setEventTimezone}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                        <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                        <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                        <SelectItem value="Asia/Dubai">Asia/Dubai (GST)</SelectItem>
                        <SelectItem value="Asia/Singapore">Asia/Singapore (SGT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Event Description</Label>
                  <Textarea
                    id="description"
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    placeholder="Enter event description"
                    rows={4}
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="space-y-0.5">
                    <Label>Registration Status</Label>
                    <p className="text-sm text-muted-foreground">
                      {registrationOpen ? "Registrations are currently open" : "Registrations are closed"}
                    </p>
                  </div>
                  <Switch
                    checked={registrationOpen}
                    onCheckedChange={setRegistrationOpen}
                  />
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <Button onClick={handleSaveGeneral} disabled={generalSaving}>
                    {generalSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : generalSaved ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Saved!
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Executives Tab */}
          <TabsContent value="executives" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Event Executives</CardTitle>
                    <CardDescription>Manage team members who can access this event</CardDescription>
                  </div>
                  <Button onClick={() => setIsAddExecModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Executive
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Role Legend */}
                <div className="mb-6 flex flex-wrap items-center gap-4 rounded-lg bg-muted/50 p-4">
                  <span className="text-sm font-medium text-muted-foreground">Roles:</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">Admin</Badge>
                    <span className="text-xs text-muted-foreground">Full access to all settings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Manager</Badge>
                    <span className="text-xs text-muted-foreground">Manage registrations & templates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Coordinator</Badge>
                    <span className="text-xs text-muted-foreground">View & check-in only</span>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Added</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {executives.map((exec) => (
                      <TableRow key={exec.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {exec.name.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{exec.name}</p>
                              <p className="text-sm text-muted-foreground">{exec.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(exec.role)}>{exec.role}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(exec.status)}</TableCell>
                        <TableCell className="text-muted-foreground">{exec.addedAt}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {exec.status === "Invited" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleResendInvite(exec)}
                              >
                                <RefreshCw className="mr-1 h-3.5 w-3.5" />
                                Resend
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedExec(exec)
                                setIsEditExecModalOpen(true)
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => {
                                setSelectedExec(exec)
                                setIsDeleteExecDialogOpen(true)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Configuration Tab */}
          <TabsContent value="email" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Email Configuration
                      {emailConfig.isConnected ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Connected
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <XCircle className="mr-1 h-3 w-3" />
                          Not Connected
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>Configure email service for sending notifications</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Provider Selection */}
                <div className="space-y-2">
                  <Label>Email Provider</Label>
                  <Select
                    value={emailConfig.provider}
                    onValueChange={(value: EmailConfig["provider"]) =>
                      setEmailConfig({ ...emailConfig, provider: value, isConnected: false })
                    }
                  >
                    <SelectTrigger className="w-full md:w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="smtp">SMTP Server</SelectItem>
                      <SelectItem value="sendgrid">SendGrid</SelectItem>
                      <SelectItem value="mailgun">Mailgun</SelectItem>
                      <SelectItem value="ses">Amazon SES</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* SMTP Configuration */}
                {emailConfig.provider === "smtp" && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>SMTP Host</Label>
                      <Input
                        value={emailConfig.host || ""}
                        onChange={(e) => setEmailConfig({ ...emailConfig, host: e.target.value })}
                        placeholder="smtp.example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Port</Label>
                      <Input
                        type="number"
                        value={emailConfig.port || ""}
                        onChange={(e) => setEmailConfig({ ...emailConfig, port: parseInt(e.target.value) })}
                        placeholder="587"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Username</Label>
                      <Input
                        value={emailConfig.username || ""}
                        onChange={(e) => setEmailConfig({ ...emailConfig, username: e.target.value })}
                        placeholder="your@email.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <div className="relative">
                        <Input
                          type={showEmailPassword ? "text" : "password"}
                          value={emailConfig.password || ""}
                          onChange={(e) => setEmailConfig({ ...emailConfig, password: e.target.value })}
                          placeholder="Enter password"
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowEmailPassword(!showEmailPassword)}
                        >
                          {showEmailPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* API Key Configuration (SendGrid/Mailgun/SES) */}
                {emailConfig.provider !== "smtp" && (
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <div className="relative">
                      <Input
                        type={showEmailPassword ? "text" : "password"}
                        value={emailConfig.apiKey || ""}
                        onChange={(e) => setEmailConfig({ ...emailConfig, apiKey: e.target.value })}
                        placeholder={`Enter ${emailConfig.provider} API key`}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowEmailPassword(!showEmailPassword)}
                      >
                        {showEmailPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                )}

                {/* From Settings */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>From Email</Label>
                    <Input
                      type="email"
                      value={emailConfig.fromEmail}
                      onChange={(e) => setEmailConfig({ ...emailConfig, fromEmail: e.target.value })}
                      placeholder="noreply@company.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>From Name</Label>
                    <Input
                      value={emailConfig.fromName}
                      onChange={(e) => setEmailConfig({ ...emailConfig, fromName: e.target.value })}
                      placeholder="Event Team"
                    />
                  </div>
                </div>

                {/* Test Result */}
                {emailTestResult && (
                  <div className={`flex items-center gap-2 rounded-lg p-4 ${
                    emailTestResult === "success" 
                      ? "bg-green-50 text-green-700 border border-green-200" 
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}>
                    {emailTestResult === "success" ? (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Connection Successful!</p>
                          <p className="text-sm">Email service is properly configured and ready to send.</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Connection Failed</p>
                          <p className="text-sm">Please check your credentials and try again.</p>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Last Tested */}
                {emailConfig.lastTested && (
                  <p className="text-sm text-muted-foreground">
                    Last tested: {emailConfig.lastTested}
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t">
                  <Button onClick={handleTestEmailConnection} variant="outline" disabled={emailTesting}>
                    {emailTesting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Testing Connection...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Test Connection
                      </>
                    )}
                  </Button>
                  <Button onClick={handleSaveEmailConfig} disabled={emailSaving}>
                    {emailSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Configuration"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SMS Configuration Tab */}
          <TabsContent value="sms" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      SMS Configuration
                      {smsConfig.isConnected ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Connected
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <XCircle className="mr-1 h-3 w-3" />
                          Not Connected
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>Configure SMS gateway for sending notifications</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Provider Selection */}
                <div className="space-y-2">
                  <Label>SMS Provider</Label>
                  <Select
                    value={smsConfig.provider}
                    onValueChange={(value: SMSConfig["provider"]) =>
                      setSMSConfig({ ...smsConfig, provider: value, isConnected: false })
                    }
                  >
                    <SelectTrigger className="w-full md:w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twilio">Twilio</SelectItem>
                      <SelectItem value="msg91">MSG91</SelectItem>
                      <SelectItem value="textlocal">Textlocal</SelectItem>
                      <SelectItem value="nexmo">Vonage (Nexmo)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Twilio Configuration */}
                {smsConfig.provider === "twilio" && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Account SID</Label>
                      <Input
                        value={smsConfig.accountSid || ""}
                        onChange={(e) => setSMSConfig({ ...smsConfig, accountSid: e.target.value })}
                        placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Auth Token</Label>
                      <div className="relative">
                        <Input
                          type={showSMSToken ? "text" : "password"}
                          value={smsConfig.authToken || ""}
                          onChange={(e) => setSMSConfig({ ...smsConfig, authToken: e.target.value })}
                          placeholder="Enter auth token"
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowSMSToken(!showSMSToken)}
                        >
                          {showSMSToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* API Key Configuration (MSG91/Textlocal/Nexmo) */}
                {smsConfig.provider !== "twilio" && (
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <div className="relative">
                      <Input
                        type={showSMSToken ? "text" : "password"}
                        value={smsConfig.apiKey || ""}
                        onChange={(e) => setSMSConfig({ ...smsConfig, apiKey: e.target.value })}
                        placeholder={`Enter ${smsConfig.provider} API key`}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowSMSToken(!showSMSToken)}
                      >
                        {showSMSToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Sender ID */}
                <div className="space-y-2 md:w-64">
                  <Label>Sender ID</Label>
                  <Input
                    value={smsConfig.senderId}
                    onChange={(e) => setSMSConfig({ ...smsConfig, senderId: e.target.value.toUpperCase().slice(0, 6) })}
                    placeholder="EVNTMG"
                    maxLength={6}
                  />
                  <p className="text-xs text-muted-foreground">Max 6 characters, uppercase letters only</p>
                </div>

                {/* Test Result */}
                {smsTestResult && (
                  <div className={`flex items-center gap-2 rounded-lg p-4 ${
                    smsTestResult === "success" 
                      ? "bg-green-50 text-green-700 border border-green-200" 
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}>
                    {smsTestResult === "success" ? (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Connection Successful!</p>
                          <p className="text-sm">SMS gateway is properly configured and ready to send.</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Connection Failed</p>
                          <p className="text-sm">Please check your credentials and try again.</p>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Last Tested */}
                {smsConfig.lastTested && (
                  <p className="text-sm text-muted-foreground">
                    Last tested: {smsConfig.lastTested}
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t">
                  <Button onClick={handleTestSMSConnection} variant="outline" disabled={smsTesting}>
                    {smsTesting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Testing Connection...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Test Connection
                      </>
                    )}
                  </Button>
                  <Button onClick={handleSaveSMSConfig} disabled={smsSaving}>
                    {smsSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Configuration"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Security Note */}
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="flex items-start gap-3 p-4">
                <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">Security Note</p>
                  <p className="text-sm text-yellow-700">
                    Your API keys and credentials are encrypted and stored securely. Never share these credentials with unauthorized personnel.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Executive Modal */}
      <Dialog open={isAddExecModalOpen} onOpenChange={setIsAddExecModalOpen}>
        <DialogContent className="sm:max-w-md" aria-describedby="add-exec-description">
          <DialogHeader>
            <DialogTitle>Add Executive</DialogTitle>
            <DialogDescription id="add-exec-description">
              Invite a team member to manage this event
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Full Name <span className="text-destructive">*</span></Label>
              <Input
                value={newExec.name}
                onChange={(e) => setNewExec({ ...newExec, name: e.target.value })}
                placeholder="Enter full name"
              />
            </div>
            <div className="space-y-2">
              <Label>Email Address <span className="text-destructive">*</span></Label>
              <Input
                type="email"
                value={newExec.email}
                onChange={(e) => setNewExec({ ...newExec, email: e.target.value })}
                placeholder="Enter email address"
              />
            </div>
            <div className="space-y-2">
              <Label>Role <span className="text-destructive">*</span></Label>
              <Select
                value={newExec.role}
                onValueChange={(value: Executive["role"]) => setNewExec({ ...newExec, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin - Full access to all settings</SelectItem>
                  <SelectItem value="Manager">Manager - Manage registrations & templates</SelectItem>
                  <SelectItem value="Coordinator">Coordinator - View & check-in only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddExecModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddExecutive} disabled={execSaving || !newExec.name || !newExec.email}>
              {execSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Invite...
                </>
              ) : (
                "Send Invite"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Executive Modal */}
      <Dialog open={isEditExecModalOpen} onOpenChange={setIsEditExecModalOpen}>
        <DialogContent className="sm:max-w-md" aria-describedby="edit-exec-description">
          <DialogHeader>
            <DialogTitle>Edit Executive</DialogTitle>
            <DialogDescription id="edit-exec-description">
              Update team member details and permissions
            </DialogDescription>
          </DialogHeader>
          {selectedExec && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={selectedExec.name}
                  onChange={(e) => setSelectedExec({ ...selectedExec, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input
                  type="email"
                  value={selectedExec.email}
                  onChange={(e) => setSelectedExec({ ...selectedExec, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={selectedExec.role}
                  onValueChange={(value: Executive["role"]) => setSelectedExec({ ...selectedExec, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Coordinator">Coordinator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={selectedExec.status}
                  onValueChange={(value: Executive["status"]) => setSelectedExec({ ...selectedExec, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Invited">Invited</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditExecModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditExecutive} disabled={execSaving}>
              {execSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Executive Confirmation */}
      <AlertDialog open={isDeleteExecDialogOpen} onOpenChange={setIsDeleteExecDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Executive</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{selectedExec?.name}</strong> from this event? 
              They will no longer have access to manage this event.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteExecutive}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
