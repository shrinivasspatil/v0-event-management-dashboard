"use client"

import { useState, useRef, useEffect } from "react"
import { useParams } from "next/navigation"
import { CheckCircle2, ArrowLeft, Sparkles, Users, GraduationCap, ShoppingBag, Rocket, Target, Trophy, MapPin, Calendar, Clock } from "lucide-react"

const eventData: Record<string, { name: string; date: string; location: string; tagline: string }> = {
  "1": { name: "Tech Summit 2026", date: "April 15-17, 2026", location: "San Francisco, CA", tagline: "Where Technology Meets Innovation" },
  "2": { name: "Beautify Expo 2026", date: "May 8-9, 2026", location: "Mumbai, India", tagline: "India's Premier Beauty & Wellness Trade Show" },
}

const highlights = [
  { icon: Sparkles, title: "Discover Latest Trends", desc: "Explore new product launches in cosmetics, skincare, haircare, nails & wellness", color: "from-pink-500 to-rose-500" },
  { icon: Users, title: "Network with Leaders", desc: "Meet top brands, salon owners, distributors & professionals under one roof", color: "from-violet-500 to-purple-500" },
  { icon: GraduationCap, title: "Learn from Experts", desc: "Live demos, masterclasses & workshops by leading beauty educators", color: "from-blue-500 to-cyan-500" },
  { icon: ShoppingBag, title: "Source Products", desc: "Compare brands, negotiate bulk deals & find new suppliers", color: "from-amber-500 to-orange-500" },
  { icon: Rocket, title: "Grow Your Business", desc: "Franchise opportunities, distribution partnerships & collaborations", color: "from-emerald-500 to-teal-500" },
  { icon: Target, title: "Upgrade Skills", desc: "Advanced techniques & upcoming beauty trends", color: "from-indigo-500 to-blue-500" },
  { icon: Trophy, title: "Live Competitions", desc: "Witness talent showcases & industry recognition awards", color: "from-yellow-500 to-amber-500" },
]

const industries = [
  "Salon Owner", "Spa Owner", "Beautician", "Hair Stylist", "Makeup Artist",
  "Nail Technician", "Skin Care Specialist", "Distributor", "Retailer", "Brand Representative",
  "Trainer/Educator", "Student", "Other"
]

export default function PublicRegistrationPage() {
  const params = useParams()
  const eventId = params.eventId as string
  const slug = params.slug as string
  const event = eventData[eventId] || eventData["2"]

  const [step, setStep] = useState<"landing" | "mobile" | "otp" | "form" | "success">("landing")
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

  // Landing Page
  if (step === "landing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-violet-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-300/30 to-rose-300/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-violet-300/30 to-purple-300/30 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-6xl mx-auto px-4 pt-12 pb-16">
            {/* Event Badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-rose-100 rounded-full px-4 py-2 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium text-gray-700">Registration Open</span>
              </div>
            </div>

            {/* Logo & Title */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-rose-500 via-pink-500 to-violet-500 text-white text-3xl font-bold mb-6 shadow-2xl shadow-rose-500/30">
                B
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                {event.name}
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 font-medium mb-8">
                {event.tagline}
              </p>

              {/* Event Details Pills */}
              <div className="flex flex-wrap justify-center gap-3 mb-10">
                <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
                  <Calendar className="w-4 h-4 text-rose-500" />
                  <span className="text-sm font-medium text-gray-700">{event.date}</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span className="text-sm font-medium text-gray-700">{event.location}</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
                  <Clock className="w-4 h-4 text-rose-500" />
                  <span className="text-sm font-medium text-gray-700">10:00 AM - 6:00 PM</span>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => setStep("mobile")}
                className="inline-flex items-center justify-center h-14 px-10 bg-gradient-to-r from-rose-500 via-pink-500 to-violet-500 hover:from-rose-600 hover:via-pink-600 hover:to-violet-600 text-white text-lg font-semibold rounded-full transition-all duration-300 shadow-xl shadow-rose-500/30 hover:shadow-2xl hover:shadow-rose-500/40 hover:scale-105"
              >
                Register Now - It&apos;s Free
              </button>
              <p className="text-sm text-gray-500 mt-4">Join 10,000+ beauty professionals</p>
            </div>
          </div>
        </div>

        {/* Highlights Section */}
        <div className="max-w-6xl mx-auto px-4 pb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Why Attend?</h2>
            <p className="text-gray-600">Everything you need to grow your beauty business</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {highlights.map((item, i) => (
              <div
                key={i}
                className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-transparent transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <div className="inline-block bg-gradient-to-r from-rose-50 to-violet-50 border border-rose-100 rounded-3xl p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Ready to Transform Your Business?</h3>
              <p className="text-gray-600 mb-6 max-w-xl mx-auto">Register now and get exclusive access to all sessions, workshops, and networking opportunities.</p>
              <button
                onClick={() => setStep("mobile")}
                className="inline-flex items-center justify-center h-12 px-8 bg-gradient-to-r from-rose-500 to-violet-500 hover:from-rose-600 hover:to-violet-600 text-white font-semibold rounded-full transition-all duration-300 shadow-lg shadow-rose-500/25 hover:shadow-xl"
              >
                Register for Free
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 py-6">
          <p className="text-center text-sm text-gray-400">
            Powered by Eventify | Contact: support@eventify.com
          </p>
        </div>
      </div>
    )
  }

  // Registration Flow (Mobile, OTP, Form, Success)
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-violet-50 flex items-center justify-center px-4 py-12">
      {/* Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-300/20 to-rose-300/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-violet-300/20 to-purple-300/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-[420px]">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 via-pink-500 to-violet-500 text-white text-2xl font-bold mb-4 shadow-xl shadow-rose-500/25">
            B
          </div>
          <h1 className="text-xl font-semibold text-gray-900">{event.name}</h1>
          <p className="text-sm text-gray-500 mt-1">{event.date}</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {["Mobile", "OTP", "Details"].map((label, i) => {
            const stepIndex = step === "mobile" ? 0 : step === "otp" ? 1 : 2
            const isActive = i <= stepIndex
            const isCurrent = i === stepIndex
            return (
              <div key={label} className="flex items-center gap-2">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all duration-300 ${
                  isActive 
                    ? "bg-gradient-to-br from-rose-500 to-violet-500 text-white shadow-lg shadow-rose-500/25" 
                    : "bg-gray-100 text-gray-400"
                } ${isCurrent ? "ring-4 ring-rose-100" : ""}`}>
                  {i + 1}
                </div>
                {i < 2 && (
                  <div className={`w-8 h-1 rounded-full transition-all duration-300 ${isActive ? "bg-gradient-to-r from-rose-500 to-violet-500" : "bg-gray-200"}`} />
                )}
              </div>
            )
          })}
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/60 p-8 sm:p-10 border border-gray-100">
          
          {/* Mobile Step */}
          {step === "mobile" && (
            <div className="space-y-6">
              <button 
                onClick={() => setStep("landing")}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to event
              </button>

              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">Get Started</h2>
                <p className="text-gray-500 mt-2">Enter your mobile number to continue</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="Enter 10-digit mobile number"
                  className="w-full h-14 px-5 text-lg bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 transition-all"
                />
              </div>

              <button
                onClick={handleSendOtp}
                disabled={mobile.length < 10 || isLoading}
                className="w-full h-14 bg-gradient-to-r from-rose-500 to-violet-500 hover:from-rose-600 hover:to-violet-600 disabled:from-gray-200 disabled:to-gray-200 disabled:text-gray-400 text-white font-semibold rounded-2xl transition-all duration-200 flex items-center justify-center shadow-lg shadow-rose-500/25 disabled:shadow-none"
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
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Change number
              </button>

              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">Verify OTP</h2>
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
                    className="w-12 h-14 text-center text-2xl font-bold bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 transition-all"
                  />
                ))}
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={otp.some((d) => !d) || isLoading}
                className="w-full h-14 bg-gradient-to-r from-rose-500 to-violet-500 hover:from-rose-600 hover:to-violet-600 disabled:from-gray-200 disabled:to-gray-200 disabled:text-gray-400 text-white font-semibold rounded-2xl transition-all duration-200 flex items-center justify-center shadow-lg shadow-rose-500/25 disabled:shadow-none"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Verify & Continue"
                )}
              </button>

              <p className="text-center text-sm text-gray-500">
                {resendTimer > 0 ? (
                  <>Resend in <span className="font-medium text-gray-700">{resendTimer}s</span></>
                ) : (
                  <button onClick={() => { setResendTimer(30); setOtp(["","","","","",""]); }} className="text-rose-600 font-medium hover:underline">
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
                <div className="inline-flex items-center gap-1.5 text-sm text-green-600 bg-green-50 px-3 py-1.5 rounded-full mb-3 border border-green-100">
                  <CheckCircle2 className="w-4 h-4" /> Mobile Verified
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Almost Done!</h2>
                <p className="text-gray-500 mt-2">Complete your registration</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile Number</label>
                  <input
                    type="text"
                    value={mobile}
                    disabled
                    className="w-full h-12 px-4 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">City *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Your city"
                    className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Profession *</label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select your profession</option>
                    {industries.map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!formData.name || !formData.email || !formData.city || !formData.industry || isLoading}
                className="w-full h-14 bg-gradient-to-r from-rose-500 to-violet-500 hover:from-rose-600 hover:to-violet-600 disabled:from-gray-200 disabled:to-gray-200 disabled:text-gray-400 text-white font-semibold rounded-2xl transition-all duration-200 flex items-center justify-center shadow-lg shadow-rose-500/25 disabled:shadow-none"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Complete Registration"
                )}
              </button>
            </div>
          )}

          {/* Success */}
          {step === "success" && (
            <div className="text-center py-4">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full animate-ping opacity-20" />
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-xl shadow-green-500/30">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">You&apos;re Registered!</h2>
              <p className="text-gray-500 mb-8">We can&apos;t wait to see you at {event.name}</p>
              
              <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-6 text-left space-y-3 text-sm border border-gray-100">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-500">Name</span>
                  <span className="font-semibold text-gray-900">{formData.name}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-500">Email</span>
                  <span className="font-semibold text-gray-900">{formData.email}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-500">Mobile</span>
                  <span className="font-semibold text-gray-900">{mobile}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-500">Profession</span>
                  <span className="font-semibold text-gray-900">{formData.industry}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-500">Event</span>
                  <span className="font-semibold text-gray-900">{event.name}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-rose-50 rounded-xl border border-rose-100">
                <p className="text-sm text-rose-700">
                  A confirmation has been sent to your email & mobile. Save this for entry at the venue.
                </p>
              </div>

              <button
                onClick={() => setStep("landing")}
                className="mt-6 text-rose-600 font-medium hover:underline text-sm"
              >
                Back to Event Page
              </button>
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
