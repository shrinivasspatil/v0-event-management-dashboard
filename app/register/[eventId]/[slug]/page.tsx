"use client"

import { useState, useRef, useEffect } from "react"
import { useParams } from "next/navigation"
import { ArrowRight, CheckCircle2, MapPin, Calendar, Clock, Users } from "lucide-react"

const eventData: Record<string, { name: string; date: string; location: string; time: string }> = {
  "1": { name: "Tech Summit 2026", date: "April 15-17, 2026", location: "San Francisco, CA", time: "9:00 AM PST" },
  "2": { name: "Design Conference", date: "May 8-9, 2026", location: "Virtual Event", time: "10:00 AM EST" },
}

const formData: Record<string, { name: string; description: string }> = {
  "shrinivas": { name: "Shrinivas", description: "VIP Registration" },
  "vinay": { name: "Vinay", description: "General Admission" },
  "ravi": { name: "Ravi", description: "Early Bird Registration" },
}

const industries = [
  "Technology", "Healthcare", "Finance", "Education", "Manufacturing",
  "Retail", "Media & Entertainment", "Real Estate", "Consulting", "Other"
]

export default function PublicRegistrationPage() {
  const params = useParams()
  const eventId = params.eventId as string
  const slug = params.slug as string
  
  const event = eventData[eventId] || eventData["1"]
  const form = formData[slug] || formData["shrinivas"]

  const [step, setStep] = useState<"mobile" | "otp" | "form" | "success">("mobile")
  const [mobileNumber, setMobileNumber] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    city: "",
    industry: "",
  })

  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const handleSendOTP = async () => {
    if (mobileNumber.length < 10) return
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setIsLoading(false)
    setStep("otp")
    setResendTimer(30)
    setTimeout(() => otpRefs.current[0]?.focus(), 100)
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleVerifyOTP = async () => {
    if (otp.some((d) => !d)) return
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setIsLoading(false)
    setStep("form")
  }

  const handleSubmitForm = async () => {
    if (!formValues.name || !formValues.email || !formValues.city || !formValues.industry) return
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 2000))
    setIsLoading(false)
    setStep("success")
  }

  const handleResendOTP = async () => {
    if (resendTimer > 0) return
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setIsLoading(false)
    setResendTimer(30)
    setOtp(["", "", "", "", "", ""])
    otpRefs.current[0]?.focus()
  }

  return (
    <div className="min-h-screen bg-[#F5F0EB] relative overflow-hidden">
      {/* Warm Gradient Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[70%] h-full bg-gradient-to-bl from-[#C4A484]/30 via-[#D4B896]/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-gradient-to-tr from-[#E8DFD8]/50 to-transparent" />
      </div>

      <div className="relative min-h-screen">
        {/* Minimal Header */}
        <header className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-6">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="text-xl font-serif font-medium tracking-tight text-[#2C2C2C]">
              Eventify
            </div>
            <div className="hidden md:block text-sm text-[#6B6B6B]">
              {form.description}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="min-h-screen flex flex-col lg:flex-row">
          {/* Left Side - Hero Text */}
          <div className="lg:w-1/2 flex flex-col justify-center px-6 lg:px-16 xl:px-24 pt-32 pb-12 lg:py-0">
            <div className="max-w-xl">
              <p className="text-sm uppercase tracking-[0.2em] text-[#8B7355] mb-6">
                {event.date}
              </p>
              
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal text-[#1A1A1A] leading-[0.95] mb-8 tracking-tight">
                {event.name.split(" ").map((word, i) => (
                  <span key={i} className="block">{word}</span>
                ))}
              </h1>

              <p className="text-lg text-[#6B6B6B] leading-relaxed mb-12 max-w-md">
                Join us for an extraordinary gathering of minds. Register now to secure your exclusive access.
              </p>

              {/* Event Meta */}
              <div className="flex flex-wrap gap-8 text-sm text-[#6B6B6B]">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#8B7355]" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#8B7355]" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#8B7355]" />
                  <span>2,500+ Attendees</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="lg:w-1/2 flex items-center justify-center px-6 lg:px-12 py-12 lg:py-0">
            <div className="w-full max-w-md">
              {/* Form Card */}
              <div className="bg-white rounded-3xl shadow-2xl shadow-[#C4A484]/10 overflow-hidden">
                {/* Progress */}
                <div className="h-1 bg-[#F5F0EB]">
                  <div 
                    className="h-full bg-[#8B7355] transition-all duration-700 ease-out"
                    style={{ 
                      width: step === "mobile" ? "25%" : step === "otp" ? "50%" : step === "form" ? "75%" : "100%"
                    }}
                  />
                </div>

                <div className="p-8 lg:p-10">
                  {/* Mobile Step */}
                  {step === "mobile" && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="font-serif text-3xl text-[#1A1A1A] mb-2">
                          Let's begin
                        </h2>
                        <p className="text-[#6B6B6B]">
                          Enter your mobile number to get started
                        </p>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-[#8B7355] mb-3">
                            Mobile Number
                          </label>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-16 h-14 bg-[#F5F0EB] rounded-xl text-[#6B6B6B] text-sm font-medium">
                              +91
                            </div>
                            <input
                              type="tel"
                              value={mobileNumber}
                              onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                              placeholder="9876543210"
                              className="flex-1 h-14 px-5 bg-[#F5F0EB] rounded-xl text-[#1A1A1A] text-lg placeholder:text-[#C4A484] focus:outline-none focus:ring-2 focus:ring-[#8B7355]/20 transition-all"
                            />
                          </div>
                        </div>

                        <button
                          onClick={handleSendOTP}
                          disabled={mobileNumber.length < 10 || isLoading}
                          className="w-full h-14 bg-[#1A1A1A] hover:bg-[#2C2C2C] disabled:bg-[#E8DFD8] disabled:text-[#C4A484] text-white rounded-xl font-medium flex items-center justify-center gap-3 transition-all duration-300"
                        >
                          {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              Send OTP
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>

                      <p className="text-center text-xs text-[#A0A0A0]">
                        We'll send a verification code to this number
                      </p>
                    </div>
                  )}

                  {/* OTP Step */}
                  {step === "otp" && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="font-serif text-3xl text-[#1A1A1A] mb-2">
                          Verification
                        </h2>
                        <p className="text-[#6B6B6B]">
                          Enter the code sent to <span className="text-[#1A1A1A]">+91 {mobileNumber}</span>
                        </p>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-[#8B7355] mb-3">
                            Enter OTP
                          </label>
                          <div className="flex justify-between gap-3">
                            {otp.map((digit, index) => (
                              <input
                                key={index}
                                ref={(el) => { otpRefs.current[index] = el }}
                                type="text"
                                inputMode="numeric"
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                className="w-full aspect-square max-w-[56px] bg-[#F5F0EB] rounded-xl text-2xl font-semibold text-center text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 transition-all"
                              />
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={handleVerifyOTP}
                          disabled={otp.some((d) => !d) || isLoading}
                          className="w-full h-14 bg-[#1A1A1A] hover:bg-[#2C2C2C] disabled:bg-[#E8DFD8] disabled:text-[#C4A484] text-white rounded-xl font-medium flex items-center justify-center gap-3 transition-all duration-300"
                        >
                          {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              Verify
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <button
                          onClick={() => { setStep("mobile"); setOtp(["", "", "", "", "", ""]) }}
                          className="text-[#8B7355] hover:text-[#6B5544] transition-colors"
                        >
                          Change number
                        </button>
                        <button
                          onClick={handleResendOTP}
                          disabled={resendTimer > 0}
                          className="text-[#8B7355] hover:text-[#6B5544] disabled:text-[#C4A484] transition-colors"
                        >
                          {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Form Step */}
                  {step === "form" && (
                    <div className="space-y-6">
                      <div>
                        <div className="inline-flex items-center gap-2 text-green-600 text-sm mb-3">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Mobile verified</span>
                        </div>
                        <h2 className="font-serif text-3xl text-[#1A1A1A] mb-2">
                          Your details
                        </h2>
                        <p className="text-[#6B6B6B]">
                          Complete your registration
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-[#8B7355] mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={formValues.name}
                            onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                            placeholder="Enter your name"
                            className="w-full h-12 px-4 bg-[#F5F0EB] rounded-xl text-[#1A1A1A] placeholder:text-[#C4A484] focus:outline-none focus:ring-2 focus:ring-[#8B7355]/20 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase tracking-wider text-[#8B7355] mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            value={formValues.email}
                            onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
                            placeholder="your@email.com"
                            className="w-full h-12 px-4 bg-[#F5F0EB] rounded-xl text-[#1A1A1A] placeholder:text-[#C4A484] focus:outline-none focus:ring-2 focus:ring-[#8B7355]/20 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase tracking-wider text-[#8B7355] mb-2">
                            Mobile
                          </label>
                          <input
                            type="text"
                            value={`+91 ${mobileNumber}`}
                            disabled
                            className="w-full h-12 px-4 bg-[#E8DFD8]/50 rounded-xl text-[#6B6B6B] cursor-not-allowed"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase tracking-wider text-[#8B7355] mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            value={formValues.city}
                            onChange={(e) => setFormValues({ ...formValues, city: e.target.value })}
                            placeholder="Your city"
                            className="w-full h-12 px-4 bg-[#F5F0EB] rounded-xl text-[#1A1A1A] placeholder:text-[#C4A484] focus:outline-none focus:ring-2 focus:ring-[#8B7355]/20 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase tracking-wider text-[#8B7355] mb-2">
                            Industry
                          </label>
                          <select
                            value={formValues.industry}
                            onChange={(e) => setFormValues({ ...formValues, industry: e.target.value })}
                            className="w-full h-12 px-4 bg-[#F5F0EB] rounded-xl text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#8B7355]/20 transition-all appearance-none cursor-pointer"
                          >
                            <option value="" className="text-[#C4A484]">Select industry</option>
                            {industries.map((ind) => (
                              <option key={ind} value={ind}>{ind}</option>
                            ))}
                          </select>
                        </div>

                        <button
                          onClick={handleSubmitForm}
                          disabled={!formValues.name || !formValues.email || !formValues.city || !formValues.industry || isLoading}
                          className="w-full h-14 bg-[#1A1A1A] hover:bg-[#2C2C2C] disabled:bg-[#E8DFD8] disabled:text-[#C4A484] text-white rounded-xl font-medium flex items-center justify-center gap-3 transition-all duration-300 mt-2"
                        >
                          {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              Complete Registration
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Success Step */}
                  {step === "success" && (
                    <div className="text-center py-6">
                      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-50 flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                      </div>

                      <h2 className="font-serif text-3xl text-[#1A1A1A] mb-2">
                        You're in!
                      </h2>
                      <p className="text-[#6B6B6B] mb-8">
                        Your registration is confirmed for {event.name}
                      </p>

                      <div className="bg-[#F5F0EB] rounded-2xl p-6 text-left space-y-4 mb-6">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[#8B7355]">Name</span>
                          <span className="font-medium text-[#1A1A1A]">{formValues.name}</span>
                        </div>
                        <div className="h-px bg-[#E8DFD8]" />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[#8B7355]">Email</span>
                          <span className="font-medium text-[#1A1A1A]">{formValues.email}</span>
                        </div>
                        <div className="h-px bg-[#E8DFD8]" />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[#8B7355]">Mobile</span>
                          <span className="font-medium text-[#1A1A1A]">+91 {mobileNumber}</span>
                        </div>
                        <div className="h-px bg-[#E8DFD8]" />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[#8B7355]">Reg. ID</span>
                          <span className="font-mono font-medium text-[#8B7355]">
                            EVT-{Math.random().toString(36).substring(2, 8).toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-[#A0A0A0]">
                        Confirmation email sent to {formValues.email}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Text */}
              <p className="text-center text-xs text-[#A0A0A0] mt-6">
                Powered by Eventify
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
