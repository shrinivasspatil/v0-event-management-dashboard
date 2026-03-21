"use client"

import { useState, useRef, useEffect } from "react"
import { useParams } from "next/navigation"
import { CheckCircle2, ArrowLeft } from "lucide-react"

const eventData: Record<string, { name: string; date: string; location: string }> = {
  "1": { name: "Tech Summit 2026", date: "April 15-17, 2026", location: "San Francisco, CA" },
  "2": { name: "Design Conference", date: "May 8-9, 2026", location: "Virtual Event" },
}

const industries = [
  "Technology", "Healthcare", "Finance", "Education", "Manufacturing",
  "Retail", "Media & Entertainment", "Real Estate", "Consulting", "Other"
]

export default function PublicRegistrationPage() {
  const params = useParams()
  const eventId = params.eventId as string
  const event = eventData[eventId] || eventData["1"]

  const [step, setStep] = useState<"mobile" | "otp" | "form" | "success">("mobile")
  const [mobile, setMobile] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [formData, setFormData] = useState({ name: "", email: "", city: "", industry: "" })
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const handleSendOtp = async () => {
    if (mobile.length < 10) return
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
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
    if (value && index < 5) otpRefs.current[index + 1]?.focus()
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus()
  }

  const handleVerifyOtp = async () => {
    if (otp.some((d) => !d)) return
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setIsLoading(false)
    setStep("form")
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.city || !formData.industry) return
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setIsLoading(false)
    setStep("success")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-violet-50/30 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[420px]">
        
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 text-white text-xl font-bold mb-4 shadow-lg shadow-violet-500/25">
            E
          </div>
          <h1 className="text-xl font-semibold text-gray-900">{event.name}</h1>
          <p className="text-sm text-gray-500 mt-1">{event.date} &bull; {event.location}</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/60 p-8 sm:p-10">
          
          {/* Mobile Step */}
          {step === "mobile" && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-900">Get Started</h2>
                <p className="text-gray-500 mt-2">Enter your mobile number to continue</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="Enter 10-digit mobile number"
                  className="w-full h-14 px-5 text-lg bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all"
                />
              </div>

              <button
                onClick={handleSendOtp}
                disabled={mobile.length < 10 || isLoading}
                className="w-full h-14 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:from-gray-200 disabled:to-gray-200 disabled:text-gray-400 text-white font-semibold rounded-2xl transition-all duration-200 flex items-center justify-center shadow-lg shadow-violet-500/25 disabled:shadow-none"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Send OTP"
                )}
              </button>
            </div>
          )}

          {/* OTP Step */}
          {step === "otp" && (
            <div className="space-y-6">
              <button 
                onClick={() => { setStep("mobile"); setOtp(["","","","","",""]); }}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-900">Verify OTP</h2>
                <p className="text-gray-500 mt-2">Code sent to <span className="text-gray-900 font-medium">{mobile}</span></p>
              </div>

              <div className="flex justify-center gap-3">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-12 h-14 text-center text-2xl font-bold bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all"
                  />
                ))}
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={otp.some((d) => !d) || isLoading}
                className="w-full h-14 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:from-gray-200 disabled:to-gray-200 disabled:text-gray-400 text-white font-semibold rounded-2xl transition-all duration-200 flex items-center justify-center shadow-lg shadow-violet-500/25 disabled:shadow-none"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Verify"
                )}
              </button>

              <p className="text-center text-sm text-gray-500">
                {resendTimer > 0 ? (
                  <>Resend in <span className="font-medium text-gray-700">{resendTimer}s</span></>
                ) : (
                  <button onClick={() => { setResendTimer(30); setOtp(["","","","","",""]); }} className="text-violet-600 font-medium hover:underline">
                    Resend OTP
                  </button>
                )}
              </p>
            </div>
          )}

          {/* Form Step */}
          {step === "form" && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full mb-3">
                  <CheckCircle2 className="w-4 h-4" /> Verified
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Complete Registration</h2>
                <p className="text-gray-500 mt-2">Fill in your details</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your full name"
                    className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile</label>
                  <input
                    type="text"
                    value={mobile}
                    disabled
                    className="w-full h-12 px-4 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Your city"
                    className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Industry</label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select industry</option>
                    {industries.map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!formData.name || !formData.email || !formData.city || !formData.industry || isLoading}
                className="w-full h-14 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:from-gray-200 disabled:to-gray-200 disabled:text-gray-400 text-white font-semibold rounded-2xl transition-all duration-200 flex items-center justify-center shadow-lg shadow-violet-500/25 disabled:shadow-none"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Register"
                )}
              </button>
            </div>
          )}

          {/* Success */}
          {step === "success" && (
            <div className="text-center py-4">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Registration Complete!</h2>
              <p className="text-gray-500 mb-8">See you at {event.name}</p>
              
              <div className="bg-gray-50 rounded-2xl p-5 text-left space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Name</span><span className="font-medium text-gray-900">{formData.name}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="font-medium text-gray-900">{formData.email}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Mobile</span><span className="font-medium text-gray-900">{mobile}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Event</span><span className="font-medium text-gray-900">{event.name}</span></div>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          By registering, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  )
}
