"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  Trophy,
  IndianRupee,
  Users,
  Calendar,
  Crown,
  Medal,
  Award,
  CheckCircle,
  ArrowRight,
  Loader2,
  ChevronDown,
  Gift,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Mock event data with competitions
const eventData: Record<string, {
  eventName: string
  competitions: {
    id: string
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
    status: "Active" | "Completed" | "Upcoming"
    slug: string
  }[]
}> = {
  "1": {
    eventName: "Tech Summit 2026",
    competitions: [
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
        rules: ["Each participant gets 5 minutes to pitch", "Judges decision is final", "No plagiarism allowed"],
        status: "Active",
        slug: "best-startup-pitch",
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
        rules: ["Teams of 2-4 members", "Use any technology stack", "Submit working prototype"],
        status: "Active",
        slug: "hackathon-challenge",
      },
      {
        id: "3",
        name: "UI/UX Design Contest",
        description: "Design the best user interface for a given problem statement",
        entryFee: 300,
        prizePool: 30000,
        prizes: { first: 15000, second: 10000, third: 5000 },
        maxParticipants: 40,
        currentParticipants: 25,
        startDate: "Apr 15, 2026",
        endDate: "Apr 16, 2026",
        rules: ["Use Figma or Adobe XD", "Submit high-fidelity mockups", "Include user flow"],
        status: "Active",
        slug: "ui-ux-design-contest",
      },
    ],
  },
}

type Step = "select" | "register" | "payment" | "success"

export default function CompetitionsPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.eventId as string

  const event = eventData[eventId] || eventData["1"]

  const [step, setStep] = useState<Step>("select")
  const [selectedCompetition, setSelectedCompetition] = useState<string>("")
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

  const competition = event.competitions.find(c => c.id === selectedCompetition)
  const spotsLeft = competition ? competition.maxParticipants - competition.currentParticipants : 0
  const isFull = spotsLeft <= 0

  const handleSelectCompetition = (value: string) => {
    setSelectedCompetition(value)
  }

  const handleProceedToRegister = () => {
    if (!selectedCompetition) return
    setStep("register")
  }

  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.mobile || !agreedToTerms) return
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
    setStep("payment")
  }

  const handlePayment = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setPaymentData({ paymentId: "PAY" + Math.random().toString(36).substr(2, 9).toUpperCase() })
    setIsLoading(false)
    setStep("success")
  }

  const handleBack = () => {
    if (step === "register") setStep("select")
    else if (step === "payment") setStep("register")
  }

  const resetForm = () => {
    setStep("select")
    setSelectedCompetition("")
    setFormData({ name: "", email: "", mobile: "", organization: "" })
    setAgreedToTerms(false)
    setPaymentData({ paymentId: "" })
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
              <p className="font-semibold text-foreground">{event.eventName}</p>
              <p className="text-xs text-muted-foreground">Competitions</p>
            </div>
          </div>
          {step !== "select" && step !== "success" && (
            <Button variant="ghost" onClick={handleBack}>
              Back
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Step: Select Competition */}
        {step === "select" && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Choose Your Competition</h1>
              <p className="text-muted-foreground">Select a competition to participate and win exciting prizes</p>
            </div>

            {/* Competition Cards */}
            <div className="space-y-4">
              {event.competitions.map((comp) => {
                const spots = comp.maxParticipants - comp.currentParticipants
                const full = spots <= 0
                const isSelected = selectedCompetition === comp.id

                return (
                  <Card
                    key={comp.id}
                    className={`cursor-pointer transition-all ${
                      isSelected
                        ? "border-violet-500 ring-2 ring-violet-500/20"
                        : "hover:border-violet-300"
                    } ${full ? "opacity-60" : ""}`}
                    onClick={() => !full && handleSelectCompetition(comp.id)}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg text-foreground">{comp.name}</h3>
                            {full ? (
                              <Badge variant="secondary">Full</Badge>
                            ) : comp.status === "Active" ? (
                              <Badge className="bg-green-100 text-green-700">Active</Badge>
                            ) : (
                              <Badge variant="outline">{comp.status}</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{comp.description}</p>

                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <IndianRupee className="h-4 w-4" />
                              <span className="font-medium text-foreground">{comp.entryFee}</span>
                              <span>Entry</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Gift className="h-4 w-4" />
                              <span className="font-medium text-foreground">{comp.prizePool.toLocaleString()}</span>
                              <span>Prize Pool</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span className={`font-medium ${spots <= 5 ? "text-orange-600" : "text-foreground"}`}>
                                {spots}
                              </span>
                              <span>spots left</span>
                            </div>
                          </div>

                          {/* Prize Distribution */}
                          <div className="flex items-center gap-3 pt-2">
                            <div className="flex items-center gap-1 text-xs">
                              <Crown className="h-3.5 w-3.5 text-yellow-500" />
                              <span className="text-muted-foreground">1st:</span>
                              <span className="font-medium">{comp.prizes.first.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              <Medal className="h-3.5 w-3.5 text-gray-400" />
                              <span className="text-muted-foreground">2nd:</span>
                              <span className="font-medium">{comp.prizes.second.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              <Award className="h-3.5 w-3.5 text-amber-600" />
                              <span className="text-muted-foreground">3rd:</span>
                              <span className="font-medium">{comp.prizes.third.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        {/* Selection Indicator */}
                        <div
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                            isSelected
                              ? "border-violet-500 bg-violet-500"
                              : "border-gray-300"
                          }`}
                        >
                          {isSelected && <CheckCircle className="h-4 w-4 text-white" />}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Proceed Button */}
            <Button
              className="w-full h-12 text-base"
              disabled={!selectedCompetition}
              onClick={handleProceedToRegister}
            >
              Proceed to Register
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Step: Register */}
        {step === "register" && competition && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-foreground">Register for {competition.name}</h1>
              <p className="text-muted-foreground">Fill in your details to participate</p>
            </div>

            {/* Selected Competition Summary */}
            <Card className="bg-violet-50 border-violet-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100">
                      <Trophy className="h-5 w-5 text-violet-600" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{competition.name}</p>
                      <p className="text-sm text-muted-foreground">{spotsLeft} spots remaining</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-violet-600">
                      <IndianRupee className="inline h-4 w-4" />
                      {competition.entryFee}
                    </p>
                    <p className="text-xs text-muted-foreground">Entry Fee</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Registration Form */}
            <Card>
              <CardContent className="p-6 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number <span className="text-red-500">*</span></Label>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    maxLength={10}
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, "") })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organization">Organization / College</Label>
                  <Input
                    id="organization"
                    placeholder="Enter your organization or college name"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  />
                </div>

                {/* Rules */}
                <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                  <p className="text-sm font-medium text-foreground">Competition Rules:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {competition.rules.map((rule, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-violet-500">-</span>
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                    I agree to the competition rules and terms. I understand that the entry fee is non-refundable.
                  </label>
                </div>
              </CardContent>
            </Card>

            <Button
              className="w-full h-12 text-base"
              disabled={!formData.name || !formData.email || !formData.mobile || !agreedToTerms || isLoading}
              onClick={handleRegister}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Proceed to Payment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        )}

        {/* Step: Payment */}
        {step === "payment" && competition && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-foreground">Complete Payment</h1>
              <p className="text-muted-foreground">Pay the entry fee to confirm your participation</p>
            </div>

            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-muted-foreground">Competition</span>
                  <span className="font-medium">{competition.name}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-muted-foreground">Participant</span>
                  <span className="font-medium">{formData.name}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{formData.email}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-muted-foreground">Entry Fee</span>
                  <span className="font-medium">
                    <IndianRupee className="inline h-3.5 w-3.5" />
                    {competition.entryFee}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 bg-violet-50 rounded-lg px-3 -mx-3">
                  <span className="font-semibold text-foreground">Total Amount</span>
                  <span className="text-xl font-bold text-violet-600">
                    <IndianRupee className="inline h-4 w-4" />
                    {competition.entryFee}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 border-violet-500 bg-violet-50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                    <span className="text-sm font-bold text-blue-600">RP</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Razorpay</p>
                    <p className="text-sm text-muted-foreground">Cards, UPI, Net Banking, Wallets</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-violet-500" />
                </div>
              </CardContent>
            </Card>

            <Button
              className="w-full h-12 text-base bg-violet-600 hover:bg-violet-700"
              disabled={isLoading}
              onClick={handlePayment}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  Pay <IndianRupee className="mx-1 h-4 w-4" />{competition.entryFee}
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Your payment is secured with 256-bit SSL encryption
            </p>
          </div>
        )}

        {/* Step: Success */}
        {step === "success" && competition && (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">Registration Successful!</h1>
              <p className="text-muted-foreground">You have successfully registered for the competition</p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-4 text-left">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-muted-foreground">Competition</span>
                  <span className="font-medium">{competition.name}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-muted-foreground">Participant</span>
                  <span className="font-medium">{formData.name}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{formData.email}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-muted-foreground">Mobile</span>
                  <span className="font-medium">{formData.mobile}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-muted-foreground">Payment ID</span>
                  <span className="font-mono text-sm font-medium text-green-600">{paymentData.paymentId}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="font-medium">
                    <IndianRupee className="inline h-3.5 w-3.5" />
                    {competition.entryFee}
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
              <p className="text-sm text-violet-700">
                A confirmation email has been sent to <strong>{formData.email}</strong> with all the competition details.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button onClick={resetForm} className="w-full">
                Register for Another Competition
              </Button>
              <Button variant="outline" className="w-full" onClick={() => window.close()}>
                Close
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
