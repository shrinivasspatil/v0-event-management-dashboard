"use client"

import { useState, useRef, useEffect } from "react"
import { useParams } from "next/navigation"
import {
  CheckCircle2, ArrowLeft, Sparkles, Users, GraduationCap,
  ShoppingBag, Rocket, Target, Trophy, MapPin, Calendar, Clock, Star
} from "lucide-react"

const eventData: Record<string, { name: string; date: string; location: string; tagline: string; attendees: string }> = {
  "1": { name: "Tech Summit 2026", date: "April 15–17, 2026", location: "San Francisco, CA", tagline: "Where Technology Meets Innovation", attendees: "5,000+" },
  "2": { name: "Beautify Expo 2026", date: "May 8–9, 2026", location: "Mumbai, India", tagline: "India's Premier Beauty & Wellness Trade Show", attendees: "10,000+" },
}

const highlights = [
  { icon: Sparkles, title: "Discover Latest Trends", desc: "Explore new product launches in cosmetics, skincare, haircare, nails & wellness", color: "bg-pink-50 text-pink-600 border-pink-100" },
  { icon: Users, title: "Network with Leaders", desc: "Meet top brands, salon owners, distributors & professionals under one roof", color: "bg-violet-50 text-violet-600 border-violet-100" },
  { icon: GraduationCap, title: "Learn from Experts", desc: "Live demos, masterclasses & workshops by leading beauty educators", color: "bg-blue-50 text-blue-600 border-blue-100" },
  { icon: ShoppingBag, title: "Source Products Directly", desc: "Compare brands, negotiate bulk deals & find new suppliers for your business", color: "bg-amber-50 text-amber-600 border-amber-100" },
  { icon: Rocket, title: "Grow Your Business", desc: "Franchise opportunities, distribution partnerships & collaborations", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  { icon: Target, title: "Upgrade Your Skills", desc: "Stay competitive by learning advanced techniques & upcoming trends", color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
  { icon: Trophy, title: "Live Competitions & Awards", desc: "Witness talent showcases & industry recognition that inspire growth", color: "bg-yellow-50 text-yellow-600 border-yellow-100" },
]

const industries = [
  "Salon Owner", "Spa Owner", "Beautician", "Hair Stylist", "Makeup Artist",
  "Nail Technician", "Skin Care Specialist", "Distributor", "Retailer",
  "Brand Representative", "Trainer/Educator", "Student", "Other"
]

export default function PublicRegistrationPage() {
  const params = useParams()
  const eventId = params.eventId as string
  const event = eventData[eventId] || eventData["2"]

  const [step, setStep] = useState<"mobile" | "otp" | "form" | "success">("mobile")
  const [mobile, setMobile] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [formData, setFormData] = useState({ name: "", email: "", city: "", industry: "" })
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(t)
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
    const next = [...otp]
    next[index] = value.slice(-1)
    setOtp(next)
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

  const stepIndex = step === "mobile" ? 0 : step === "otp" ? 1 : step === "form" ? 2 : 3
  const steps = ["Mobile", "Verify", "Details"]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Topbar */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
            B
          </div>
          <span className="font-semibold text-gray-900 text-sm hidden sm:block">{event.name}</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-rose-400" />
            {event.date}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-rose-400" />
            {event.location}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full">

        {/* LEFT — 60% content */}
        <div className="flex-1 lg:w-3/5 px-6 lg:px-10 py-10">

          {/* Hero */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-medium rounded-full px-3 py-1.5 mb-5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Registration Open — Free Entry
            </div>
            <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
              {event.name}
            </h1>
            <p className="text-lg text-gray-600 mb-6 max-w-xl">{event.tagline}</p>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-700 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
                <Calendar className="w-4 h-4 text-rose-500" /> {event.date}
              </div>
              <div className="flex items-center gap-2 text-gray-700 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
                <MapPin className="w-4 h-4 text-rose-500" /> {event.location}
              </div>
              <div className="flex items-center gap-2 text-gray-700 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
                <Clock className="w-4 h-4 text-rose-500" /> 10:00 AM – 6:00 PM
              </div>
              <div className="flex items-center gap-2 text-gray-700 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
                <Users className="w-4 h-4 text-rose-500" /> {event.attendees} Expected
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-4 mb-10 p-4 bg-white border border-gray-200 rounded-2xl shadow-sm w-fit">
            <div className="flex -space-x-2">
              {["Priya", "Ankit", "Sara", "Rahul", "Meena"].map((name, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-sm"
                  style={{ background: ["#f43f5e", "#8b5cf6", "#3b82f6", "#f59e0b", "#10b981"][i] }}
                >
                  {name[0]}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 mb-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-sm text-gray-600"><strong className="text-gray-900">2,400+ professionals</strong> already registered</p>
            </div>
          </div>

          {/* Why Attend */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Why You Should Attend</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {highlights.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-2xl hover:shadow-md hover:border-gray-300 transition-all duration-200"
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer note */}
          <p className="text-xs text-gray-400 pb-10">
            Powered by Eventify &nbsp;·&nbsp; By registering, you agree to our Terms & Privacy Policy
          </p>
        </div>

        {/* RIGHT — 40% sticky form */}
        <div className="lg:w-2/5 min-w-[340px] shrink-0 px-4 lg:px-8 py-10 lg:border-l border-gray-200 bg-white lg:bg-gray-50">
          <div className="lg:sticky lg:top-24">

            {/* Progress */}
            {step !== "success" && (
              <div className="flex items-center gap-1.5 mb-6">
                {steps.map((label, i) => {
                  const done = i < stepIndex
                  const active = i === stepIndex
                  return (
                    <div key={label} className="flex items-center gap-1.5 flex-1">
                      <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all shrink-0 ${
                        done ? "bg-green-500 text-white" :
                        active ? "bg-gradient-to-br from-rose-500 to-violet-600 text-white ring-4 ring-rose-100" :
                        "bg-gray-100 text-gray-400"
                      }`}>
                        {done ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                      </div>
                      <span className={`text-xs font-medium ${active ? "text-gray-900" : "text-gray-400"}`}>{label}</span>
                      {i < 2 && <div className={`flex-1 h-px ${done ? "bg-green-400" : "bg-gray-200"}`} />}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 lg:bg-transparent lg:border-0 lg:p-0 lg:shadow-none">

              {/* Mobile Step */}
              {step === "mobile" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Register Now</h3>
                    <p className="text-base text-gray-500 mt-1">Enter your mobile to get started</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">Mobile Number</label>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="10-digit mobile number"
                      className="w-full h-14 px-4 text-base bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 transition-all"
                    />
                  </div>
                  <button
                    onClick={handleSendOtp}
                    disabled={mobile.length < 10 || isLoading}
                    className="w-full h-14 bg-gradient-to-r from-rose-500 to-violet-600 hover:opacity-90 disabled:opacity-40 text-white font-semibold rounded-xl transition-all flex items-center justify-center shadow-md shadow-rose-500/20 text-base"
                  >
                    {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Send OTP"}
                  </button>
                  <p className="text-sm text-center text-gray-400">Free entry. No payment required.</p>
                </div>
              )}

              {/* OTP Step */}
              {step === "otp" && (
                <div className="space-y-6">
                  <button onClick={() => { setStep("mobile"); setOtp(["","","","","",""]) }} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Change number
                  </button>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Enter OTP</h3>
                    <p className="text-base text-gray-500 mt-1">Sent to <span className="font-medium text-gray-700">{mobile}</span></p>
                  </div>
                  <div className="flex justify-between gap-2">
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
                    className="w-full h-14 bg-gradient-to-r from-rose-500 to-violet-600 hover:opacity-90 disabled:opacity-40 text-white font-semibold rounded-xl transition-all flex items-center justify-center shadow-md shadow-rose-500/20 text-base"
                  >
                    {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Verify & Continue"}
                  </button>
                  <p className="text-sm text-center text-gray-500">
                    {resendTimer > 0 ? (
                      <>Resend in <span className="font-medium text-gray-700">{resendTimer}s</span></>
                    ) : (
                      <button onClick={() => { setResendTimer(30); setOtp(["","","","","",""]) }} className="text-rose-600 font-medium hover:underline">Resend OTP</button>
                    )}
                  </p>
                </div>
              )}

              {/* Form Step */}
              {step === "form" && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-full border border-green-100 w-fit">
                    <CheckCircle2 className="w-4 h-4" /> Mobile Verified
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Complete Registration</h3>
                    <p className="text-base text-gray-500 mt-1">Just a few more details</p>
                  </div>
                  {[
                    { label: "Full Name", key: "name", type: "text", placeholder: "Your full name" },
                    { label: "Email Address", key: "email", type: "email", placeholder: "your@email.com" },
                    { label: "Mobile Number", key: "_mobile", type: "text", placeholder: mobile, disabled: true },
                    { label: "City", key: "city", type: "text", placeholder: "Your city" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">{field.label}</label>
                      <input
                        type={field.type}
                        value={field.key === "_mobile" ? mobile : formData[field.key as keyof typeof formData]}
                        onChange={(e) => field.key !== "_mobile" && setFormData({ ...formData, [field.key]: e.target.value })}
                        placeholder={field.placeholder}
                        disabled={field.key === "_mobile"}
                        className={`w-full h-13 px-4 border rounded-xl text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 transition-all ${
                          field.key === "_mobile" ? "bg-gray-100 border-gray-200 cursor-not-allowed text-gray-500" : "bg-gray-50 border-gray-200"
                        }`}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">Profession</label>
                    <select
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      className="w-full h-13 px-4 bg-gray-50 border border-gray-200 rounded-xl text-base text-gray-900 focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 transition-all cursor-pointer"
                    >
                      <option value="">Select your profession</option>
                      {industries.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
                    </select>
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={!formData.name || !formData.email || !formData.city || !formData.industry || isLoading}
                    className="w-full h-14 bg-gradient-to-r from-rose-500 to-violet-600 hover:opacity-90 disabled:opacity-40 text-white font-semibold rounded-xl transition-all flex items-center justify-center shadow-md shadow-rose-500/20 text-base"
                  >
                    {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Complete Registration"}
                  </button>
                </div>
              )}

              {/* Success */}
              {step === "success" && (
                <div className="text-center py-2">
                  <div className="relative w-16 h-16 mx-auto mb-4">
                    <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20" />
                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">You&apos;re Registered!</h3>
                  <p className="text-sm text-gray-500 mb-5">See you at {event.name}</p>
                  <div className="text-left space-y-2 bg-gray-50 rounded-xl p-4 border border-gray-100 text-xs">
                    {[
                      ["Name", formData.name],
                      ["Email", formData.email],
                      ["Mobile", mobile],
                      ["City", formData.city],
                      ["Profession", formData.industry],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between gap-2 py-1 border-b border-gray-200 last:border-0">
                        <span className="text-gray-500">{label}</span>
                        <span className="font-semibold text-gray-900 text-right">{value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-rose-50 rounded-xl border border-rose-100">
                    <p className="text-xs text-rose-700">Confirmation sent to your email & mobile.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
