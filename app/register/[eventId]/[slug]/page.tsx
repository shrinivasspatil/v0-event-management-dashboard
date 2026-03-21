"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { Phone, ArrowRight, CheckCircle, Loader2, Shield, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Manufacturing",
  "Retail",
  "Education",
  "Real Estate",
  "Hospitality",
  "Media & Entertainment",
  "Other",
]

// Mock event data
const eventData: Record<string, { name: string; date: string; location: string; forms: Record<string, string> }> = {
  "1": {
    name: "Tech Summit 2026",
    date: "Apr 15-17, 2026",
    location: "San Francisco, CA",
    forms: {
      "shrinivas": "Shrinivas",
      "vinay": "Vinay",
      "ravi": "Ravi",
    }
  },
  "2": {
    name: "Design Conference",
    date: "May 8-9, 2026",
    location: "Virtual",
    forms: {
      "shrinivas": "Shrinivas",
      "vinay": "Vinay",
      "ravi": "Ravi",
    }
  },
}

type Step = "mobile" | "otp" | "form" | "success"

export default function VisitorRegistrationPage() {
  const params = useParams()
  const eventId = params.eventId as string
  const slug = params.slug as string
  
  const [step, setStep] = useState<Step>("mobile")
  const [mobileNumber, setMobileNumber] = useState("")
  const [countryCode, setCountryCode] = useState("+91")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [resendTimer, setResendTimer] = useState(0)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])
  
  // Form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNo: "",
    city: "",
    industry: "",
  })

  const event = eventData[eventId]
  const formName = event?.forms[slug]

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const handleMobileSubmit = async () => {
    if (mobileNumber.length < 10) {
      setError("Please enter a valid mobile number")
      return
    }
    
    setIsLoading(true)
    setError("")
    
    // Simulate API call to send OTP
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsLoading(false)
    setFormData(prev => ({ ...prev, mobileNo: `${countryCode} ${mobileNumber}` }))
    setStep("otp")
    setResendTimer(30)
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError("")
    
    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 6)
    const newOtp = [...otp]
    pastedData.split("").forEach((char, index) => {
      if (index < 6 && /\d/.test(char)) {
        newOtp[index] = char
      }
    })
    setOtp(newOtp)
  }

  const handleVerifyOtp = async () => {
    const otpValue = otp.join("")
    if (otpValue.length !== 6) {
      setError("Please enter complete OTP")
      return
    }
    
    setIsLoading(true)
    setError("")
    
    // Simulate OTP verification (accept any 6 digits for demo)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // For demo, accept "123456" or any 6 digits
    setIsLoading(false)
    setStep("form")
  }

  const handleResendOtp = async () => {
    if (resendTimer > 0) return
    
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    setResendTimer(30)
    setOtp(["", "", "", "", "", ""])
  }

  const handleFormSubmit = async () => {
    if (!formData.name || !formData.email || !formData.city || !formData.industry) {
      setError("Please fill all required fields")
      return
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address")
      return
    }
    
    setIsLoading(true)
    setError("")
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsLoading(false)
    setStep("success")
  }

  if (!event || !formName) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mx-auto mb-4">
              <span className="text-2xl text-red-600">!</span>
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Registration Form Not Found</h2>
            <p className="text-muted-foreground">
              The registration form you are looking for does not exist or has been deactivated.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Event Info Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">{event.name}</h1>
          <p className="text-muted-foreground mt-1">{event.date} • {event.location}</p>
          <p className="text-sm text-primary mt-2 font-medium">Visitor Registration - {formName}</p>
        </div>

        {/* Step 1: Mobile Number */}
        {step === "mobile" && (
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center pb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mx-auto mb-3">
                <Phone className="h-7 w-7 text-primary" />
              </div>
              <CardTitle className="text-xl">Enter Your Mobile Number</CardTitle>
              <CardDescription>
                We will send you a verification code to confirm your identity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Select value={countryCode} onValueChange={setCountryCode}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+91">+91</SelectItem>
                    <SelectItem value="+1">+1</SelectItem>
                    <SelectItem value="+44">+44</SelectItem>
                    <SelectItem value="+971">+971</SelectItem>
                    <SelectItem value="+65">+65</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="tel"
                  placeholder="Enter mobile number"
                  value={mobileNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 10)
                    setMobileNumber(value)
                    setError("")
                  }}
                  className="flex-1"
                />
              </div>
              
              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}
              
              <Button 
                className="w-full" 
                onClick={handleMobileSubmit}
                disabled={isLoading || mobileNumber.length < 10}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                By continuing, you agree to receive SMS for verification
              </p>
            </CardContent>
          </Card>
        )}

        {/* Step 2: OTP Verification */}
        {step === "otp" && (
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center pb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mx-auto mb-3">
                <Shield className="h-7 w-7 text-primary" />
              </div>
              <CardTitle className="text-xl">Verify OTP</CardTitle>
              <CardDescription>
                Enter the 6-digit code sent to<br />
                <span className="font-medium text-foreground">{countryCode} {mobileNumber}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => { otpRefs.current[index] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ""))}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-11 h-12 text-center text-lg font-semibold"
                  />
                ))}
              </div>
              
              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}
              
              <Button 
                className="w-full" 
                onClick={handleVerifyOtp}
                disabled={isLoading || otp.join("").length !== 6}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify & Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              
              <div className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0 || isLoading}
                  className="text-muted-foreground"
                >
                  {resendTimer > 0 ? (
                    <>Resend OTP in {resendTimer}s</>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Resend OTP
                    </>
                  )}
                </Button>
              </div>
              
              <Button
                variant="link"
                size="sm"
                className="w-full text-muted-foreground"
                onClick={() => {
                  setStep("mobile")
                  setOtp(["", "", "", "", "", ""])
                  setError("")
                }}
              >
                Change mobile number
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Registration Form */}
        {step === "form" && (
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center pb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 mx-auto mb-3">
                <CheckCircle className="h-7 w-7 text-green-600" />
              </div>
              <CardTitle className="text-xl">Complete Your Registration</CardTitle>
              <CardDescription>
                Mobile verified! Please fill in your details below
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Mobile Number</Label>
                <Input
                  value={formData.mobileNo}
                  disabled
                  className="bg-muted"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="city">City <span className="text-destructive">*</span></Label>
                <Input
                  id="city"
                  placeholder="Enter your city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="industry">Industry <span className="text-destructive">*</span></Label>
                <Select
                  value={formData.industry}
                  onValueChange={(value) => setFormData({ ...formData, industry: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}
              
              <Button 
                className="w-full" 
                onClick={handleFormSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Complete Registration"
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Success */}
        {step === "success" && (
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mx-auto mb-5">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Registration Successful!</h2>
              <p className="text-muted-foreground mb-6">
                Thank you for registering for {event.name}. You will receive a confirmation email shortly.
              </p>
              
              <div className="rounded-lg bg-muted/50 p-4 text-left space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium">{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{formData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mobile</span>
                  <span className="font-medium">{formData.mobileNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Event</span>
                  <span className="font-medium">{event.name}</span>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Please save this confirmation for your records.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Powered by Eventify
        </p>
      </div>
    </div>
  )
}
