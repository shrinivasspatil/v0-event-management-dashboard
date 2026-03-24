"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import {
  Trophy,
  IndianRupee,
  Users,
  Calendar,
  Clock,
  Crown,
  Medal,
  Award,
  CheckCircle,
  ArrowRight,
  Loader2,
  Shield,
  Gift,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

// Mock competition data
const competitionData: Record<string, {
  name: string
  description: string
  entryFee: number
  prizePool: number
  prizes: { first: number; second: number; third: number }
  maxParticipants: number
  currentParticipants: number
  startDate: string
  endDate: string
  rules: string[]
  eventName: string
  status: "Active" | "Completed" | "Upcoming"
}> = {
  "best-startup-pitch": {
    name: "Best Startup Pitch",
    description: "Pitch your innovative startup idea to our panel of judges and win exciting prizes! This is your chance to showcase your entrepreneurial skills and compete with the best minds.",
    entryFee: 500,
    prizePool: 50000,
    prizes: { first: 25000, second: 15000, third: 10000 },
    maxParticipants: 50,
    currentParticipants: 32,
    startDate: "Apr 15, 2026",
    endDate: "Apr 17, 2026",
    rules: [
      "Each participant gets 5 minutes to pitch",
      "Judges decision is final",
      "No plagiarism allowed",
      "Presentation must be original",
      "Q&A session of 3 minutes after pitch",
    ],
    eventName: "Tech Summit 2026",
    status: "Active",
  },
  "hackathon-challenge": {
    name: "Hackathon Challenge",
    description: "24-hour coding marathon to build innovative solutions. Form teams, code through the night, and create something amazing!",
    entryFee: 1000,
    prizePool: 100000,
    prizes: { first: 50000, second: 30000, third: 20000 },
    maxParticipants: 100,
    currentParticipants: 78,
    startDate: "Apr 16, 2026",
    endDate: "Apr 17, 2026",
    rules: [
      "Teams of 2-4 members",
      "Use any technology stack",
      "Submit working prototype",
      "Code must be written during the event",
      "APIs and libraries are allowed",
    ],
    eventName: "Tech Summit 2026",
    status: "Active",
  },
}

type Step = "details" | "register" | "payment" | "success"

export default function CompetitionPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const competition = competitionData[slug] || competitionData["best-startup-pitch"]
  
  const [step, setStep] = useState<Step>("details")
  const [isLoading, setIsLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    organization: "",
  })

  const [paymentData, setPaymentData] = useState({
    paymentId: "",
  })

  const spotsLeft = competition.maxParticipants - competition.currentParticipants
  const isFull = spotsLeft <= 0

  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.mobile || !agreedToTerms) return
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
    setStep("payment")
  }

  const handlePayment = async () => {
    setIsLoading(true)
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    setPaymentData({ paymentId: "PAY" + Math.random().toString(36).substr(2, 9).toUpperCase() })
    setIsLoading(false)
    setStep("success")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{competition.eventName}</p>
              <p className="text-xs text-muted-foreground">Competition</p>
            </div>
          </div>
          {step === "details" && !isFull && (
            <Button onClick={() => setStep("register")}>
              Register Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Details View */}
        {step === "details" && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-100">
                {competition.status === "Active" ? "Registration Open" : competition.status}
              </Badge>
              <h1 className="text-4xl font-bold text-foreground">{competition.name}</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{competition.description}</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-4">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 mx-auto mb-3">
                    <IndianRupee className="h-6 w-6 text-violet-600" />
                  </div>
                  <p className="text-2xl font-bold">{competition.entryFee}</p>
                  <p className="text-sm text-muted-foreground">Entry Fee</p>
                </CardContent>
              </Card>
              <Card className="text-center border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mx-auto mb-3">
                    <Gift className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-green-600">{competition.prizePool.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Prize Pool (INR)</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mx-auto mb-3">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold">{competition.currentParticipants}/{competition.maxParticipants}</p>
                  <p className="text-sm text-muted-foreground">Participants</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 mx-auto mb-3">
                    <Calendar className="h-6 w-6 text-yellow-600" />
                  </div>
                  <p className="text-lg font-bold">{competition.startDate}</p>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                </CardContent>
              </Card>
            </div>

            {/* Prize Distribution */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Prize Distribution
                </h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-400">
                      <Crown className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">1st Prize</p>
                      <p className="text-2xl font-bold text-yellow-700">{competition.prizes.first.toLocaleString()} INR</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-400">
                      <Medal className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">2nd Prize</p>
                      <p className="text-2xl font-bold text-gray-700">{competition.prizes.second.toLocaleString()} INR</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-600">
                      <Award className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">3rd Prize</p>
                      <p className="text-2xl font-bold text-amber-700">{competition.prizes.third.toLocaleString()} INR</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rules */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-4">Rules & Guidelines</h2>
                <ul className="space-y-3">
                  {competition.rules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600 text-sm font-medium">
                        {index + 1}
                      </div>
                      <span className="text-muted-foreground">{rule}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className="border-violet-200 bg-gradient-to-r from-violet-50 to-purple-50">
              <CardContent className="py-8 text-center">
                {isFull ? (
                  <div className="space-y-2">
                    <p className="text-xl font-semibold text-red-600">Registration Full</p>
                    <p className="text-muted-foreground">This competition has reached maximum participants</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-lg font-medium">
                      Only <span className="text-violet-600 font-bold">{spotsLeft} spots</span> left!
                    </p>
                    <Button size="lg" onClick={() => setStep("register")} className="px-8">
                      Register Now for {competition.entryFee} INR
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                      <Shield className="h-4 w-4" />
                      Secure payment powered by Razorpay
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Registration Form */}
        {step === "register" && (
          <div className="max-w-md mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 mx-auto mb-4">
                    <Users className="h-7 w-7 text-violet-600" />
                  </div>
                  <h2 className="text-xl font-semibold">Register for Competition</h2>
                  <p className="text-sm text-muted-foreground mt-1">{competition.name}</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Full Name <span className="text-destructive">*</span></Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email <span className="text-destructive">*</span></Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Mobile Number <span className="text-destructive">*</span></Label>
                    <Input
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      placeholder="Enter 10-digit mobile number"
                      maxLength={10}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Organization/Company</Label>
                    <Input
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="Enter your organization (optional)"
                    />
                  </div>

                  <div className="flex items-start gap-3 pt-2">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    />
                    <label htmlFor="terms" className="text-sm text-muted-foreground leading-tight cursor-pointer">
                      I agree to the competition rules and terms. I understand that the entry fee is non-refundable.
                    </label>
                  </div>

                  <div className="pt-4 space-y-3">
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={handleRegister}
                      disabled={isLoading || !formData.name || !formData.email || !formData.mobile || !agreedToTerms}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Continue to Payment
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                    <Button variant="ghost" className="w-full" onClick={() => setStep("details")}>
                      Back to Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Payment Step */}
        {step === "payment" && (
          <div className="max-w-md mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 mx-auto mb-4">
                    <IndianRupee className="h-7 w-7 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold">Complete Payment</h2>
                  <p className="text-sm text-muted-foreground mt-1">Secure payment via Razorpay</p>
                </div>

                {/* Order Summary */}
                <div className="rounded-lg border bg-muted/50 p-4 mb-6">
                  <h3 className="font-medium mb-3">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Competition</span>
                      <span>{competition.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Participant</span>
                      <span>{formData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email</span>
                      <span>{formData.email}</span>
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                      <span>Entry Fee</span>
                      <span className="text-green-600">{competition.entryFee} INR</span>
                    </div>
                  </div>
                </div>

                {/* Mock Payment Button */}
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700" 
                    size="lg"
                    onClick={handlePayment}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        Pay {competition.entryFee} INR
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-2">
                    <Shield className="h-3 w-3" />
                    256-bit SSL Encrypted Payment
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Success Step */}
        {step === "success" && (
          <div className="max-w-md mx-auto">
            <Card className="border-green-200">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-green-600 mb-2">Registration Successful!</h2>
                <p className="text-muted-foreground mb-6">
                  You have successfully registered for {competition.name}
                </p>

                <div className="rounded-lg border bg-muted/50 p-4 text-left mb-6">
                  <h3 className="font-medium mb-3 text-center">Registration Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment ID</span>
                      <span className="font-mono">{paymentData.paymentId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Competition</span>
                      <span>{competition.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name</span>
                      <span>{formData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount Paid</span>
                      <span className="text-green-600 font-medium">{competition.entryFee} INR</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Event Date</span>
                      <span>{competition.startDate}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 mb-6">
                  <p>A confirmation email has been sent to <strong>{formData.email}</strong> with all the details.</p>
                </div>

                <div className="space-y-3">
                  <Button variant="outline" className="w-full" onClick={() => window.print()}>
                    Download Receipt
                  </Button>
                  <Button variant="ghost" className="w-full" onClick={() => setStep("details")}>
                    Back to Competition Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Powered by Eventify</p>
        </div>
      </footer>
    </div>
  )
}
