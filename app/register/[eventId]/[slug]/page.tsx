"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { Phone, ArrowRight, CheckCircle, Loader2, Shield, RefreshCw, MapPin, Calendar, Users, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
const eventData: Record<string, { name: string; date: string; location: string; attendees: number; forms: Record<string, string> }> = {
  "1": {
    name: "Tech Summit 2026",
    date: "Apr 15-17, 2026",
    location: "San Francisco, CA",
    attendees: 2500,
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
    attendees: 5000,
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
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
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
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address")
      return
    }
    
    setIsLoading(true)
    setError("")
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsLoading(false)
    setStep("success")
  }

  if (!event || !formName) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center bg-[#141414] rounded-2xl border border-white/10 p-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 mx-auto mb-5">
            <span className="text-3xl text-red-400">!</span>
          </div>
          <h2 className="text-xl font-semibold text-white mb-3">Registration Form Not Found</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            The registration form you are looking for does not exist or has been deactivated.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Left Side - Event Info (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-800" />
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-pink-500/20 to-violet-500/20 rounded-full blur-3xl" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl">Eventify</span>
          </div>
          
          {/* Event Details */}
          <div className="space-y-8">
            <div>
              <p className="text-white/60 text-sm uppercase tracking-widest mb-3">You are registering for</p>
              <h1 className="text-5xl font-bold text-white leading-tight text-balance">{event.name}</h1>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-white/80">
                <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5" />
                </div>
                <span className="text-lg">{event.date}</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5" />
                </div>
                <span className="text-lg">{event.location}</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <Users className="h-5 w-5" />
                </div>
                <span className="text-lg">{event.attendees.toLocaleString()}+ Expected Attendees</span>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-purple-700 flex items-center justify-center text-xs font-medium text-white">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <p className="text-white/60 text-sm">Join thousands of professionals at this event</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Event Header */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-violet-600 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-white font-bold">Eventify</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">{event.name}</h1>
            <p className="text-gray-400 text-sm">{event.date} | {event.location}</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {["mobile", "otp", "form", "success"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`h-2 w-8 rounded-full transition-all duration-300 ${
                  step === s ? "bg-violet-500" : 
                  ["mobile", "otp", "form", "success"].indexOf(step) > i ? "bg-violet-500/50" : "bg-white/10"
                }`} />
              </div>
            ))}
          </div>

          {/* Step 1: Mobile Number */}
          {step === "mobile" && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 border border-violet-500/20 mb-5">
                  <Phone className="h-7 w-7 text-violet-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Enter your mobile number</h2>
                <p className="text-gray-400">We will send you a verification code</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Select value={countryCode} onValueChange={setCountryCode}>
                    <SelectTrigger className="w-28 bg-white/5 border-white/10 text-white h-14 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-white/10">
                      <SelectItem value="+91">+91 IN</SelectItem>
                      <SelectItem value="+1">+1 US</SelectItem>
                      <SelectItem value="+44">+44 UK</SelectItem>
                      <SelectItem value="+971">+971 UAE</SelectItem>
                      <SelectItem value="+65">+65 SG</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="tel"
                    placeholder="Mobile number"
                    value={mobileNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 10)
                      setMobileNumber(value)
                      setError("")
                    }}
                    className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-14 rounded-xl text-lg"
                  />
                </div>
                
                {error && (
                  <p className="text-sm text-red-400 text-center">{error}</p>
                )}
                
                <Button 
                  className="w-full h-14 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-base font-medium transition-all duration-200" 
                  onClick={handleMobileSubmit}
                  disabled={isLoading || mobileNumber.length < 10}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
              
              <p className="text-xs text-center text-gray-500">
                By continuing, you agree to receive SMS for verification purposes
              </p>
            </div>
          )}

          {/* Step 2: OTP Verification */}
          {step === "otp" && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 border border-violet-500/20 mb-5">
                  <Shield className="h-7 w-7 text-violet-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Verify OTP</h2>
                <p className="text-gray-400">
                  Enter the 6-digit code sent to<br />
                  <span className="text-white font-medium">{countryCode} {mobileNumber}</span>
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-center gap-3" onPaste={handleOtpPaste}>
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
                      className="w-12 h-14 text-center text-xl font-bold bg-white/5 border-white/10 text-white rounded-xl focus:border-violet-500 focus:ring-violet-500/20"
                    />
                  ))}
                </div>
                
                {error && (
                  <p className="text-sm text-red-400 text-center">{error}</p>
                )}
                
                <Button 
                  className="w-full h-14 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-base font-medium" 
                  onClick={handleVerifyOtp}
                  disabled={isLoading || otp.join("").length !== 6}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify & Continue
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
                
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setStep("mobile")
                      setOtp(["", "", "", "", "", ""])
                      setError("")
                    }}
                    className="text-gray-400 hover:text-white hover:bg-white/5"
                  >
                    Change number
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResendOtp}
                    disabled={resendTimer > 0 || isLoading}
                    className="text-gray-400 hover:text-white hover:bg-white/5"
                  >
                    {resendTimer > 0 ? (
                      <>Resend in {resendTimer}s</>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Resend OTP
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Registration Form */}
          {step === "form" && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10 border border-green-500/20 mb-5">
                  <CheckCircle className="h-7 w-7 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Complete your registration</h2>
                <p className="text-gray-400">Mobile verified! Fill in your details below</p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300 text-sm">Full Name <span className="text-red-400">*</span></Label>
                  <Input
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-12 rounded-xl"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-300 text-sm">Email Address <span className="text-red-400">*</span></Label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-12 rounded-xl"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-300 text-sm">Mobile Number</Label>
                  <Input
                    value={formData.mobileNo}
                    disabled
                    className="bg-white/5 border-white/10 text-gray-400 h-12 rounded-xl"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300 text-sm">City <span className="text-red-400">*</span></Label>
                    <Input
                      placeholder="Your city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-12 rounded-xl"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-gray-300 text-sm">Industry <span className="text-red-400">*</span></Label>
                    <Select
                      value={formData.industry}
                      onValueChange={(value) => setFormData({ ...formData, industry: value })}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white h-12 rounded-xl">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-white/10">
                        {industries.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {error && (
                  <p className="text-sm text-red-400 text-center">{error}</p>
                )}
                
                <Button 
                  className="w-full h-14 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-base font-medium" 
                  onClick={handleFormSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Complete Registration"
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === "success" && (
            <div className="space-y-6 text-center">
              <div>
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20 mb-5">
                  <CheckCircle className="h-10 w-10 text-green-400" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">You are all set!</h2>
                <p className="text-gray-400">
                  Thank you for registering. A confirmation email has been sent to your inbox.
                </p>
              </div>
              
              <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-left space-y-4">
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Registration Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-gray-400">Name</span>
                    <span className="font-medium text-white">{formData.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-gray-400">Email</span>
                    <span className="font-medium text-white">{formData.email}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-gray-400">Mobile</span>
                    <span className="font-medium text-white">{formData.mobileNo}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-400">Event</span>
                    <span className="font-medium text-white">{event.name}</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <p className="text-gray-500 text-sm mb-4">Add this event to your calendar</p>
                <div className="flex justify-center gap-3">
                  <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-lg">
                    Google Calendar
                  </Button>
                  <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-lg">
                    Apple Calendar
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <p className="text-center text-xs text-gray-600 mt-8">
            Powered by Eventify | Free Registration
          </p>
        </div>
      </div>
    </div>
  )
}
