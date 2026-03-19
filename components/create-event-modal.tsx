"use client"

import { useState } from "react"
import { CalendarDays, Globe, MapPin, Video, Users } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface CreateEventModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type EventType = "venue" | "online" | "hybrid"

const eventTypes: { value: EventType; label: string; icon: React.ReactNode; description: string }[] = [
  {
    value: "venue",
    label: "In Person",
    icon: <MapPin className="h-5 w-5" />,
    description: "Host at a physical location",
  },
  {
    value: "online",
    label: "Online",
    icon: <Video className="h-5 w-5" />,
    description: "Virtual event via video",
  },
  {
    value: "hybrid",
    label: "Hybrid",
    icon: <Users className="h-5 w-5" />,
    description: "Both in-person and online",
  },
]

const timezones = [
  { value: "America/New_York", label: "(GMT-05:00) Eastern Time" },
  { value: "America/Chicago", label: "(GMT-06:00) Central Time" },
  { value: "America/Denver", label: "(GMT-07:00) Mountain Time" },
  { value: "America/Los_Angeles", label: "(GMT-08:00) Pacific Time" },
  { value: "Europe/London", label: "(GMT+00:00) London" },
  { value: "Europe/Paris", label: "(GMT+01:00) Paris" },
  { value: "Asia/Tokyo", label: "(GMT+09:00) Tokyo" },
  { value: "Asia/Singapore", label: "(GMT+08:00) Singapore" },
  { value: "Australia/Sydney", label: "(GMT+11:00) Sydney" },
]

const categories = [
  "Conference",
  "Workshop",
  "Seminar",
  "Meetup",
  "Webinar",
  "Trade Show",
  "Product Launch",
  "Networking",
  "Training",
  "Other",
]

export function CreateEventModal({ open, onOpenChange }: CreateEventModalProps) {
  const [eventType, setEventType] = useState<EventType>("venue")
  const [eventName, setEventName] = useState("")
  const [startDate, setStartDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endDate, setEndDate] = useState("")
  const [endTime, setEndTime] = useState("")
  const [timezone, setTimezone] = useState("America/New_York")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    onOpenChange(false)
    
    // Reset form
    setEventName("")
    setStartDate("")
    setStartTime("")
    setEndDate("")
    setEndTime("")
    setDescription("")
    setCategory("")
    setEventType("venue")
  }

  const isFormValid = eventName && startDate && startTime && endDate && endTime

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Event</DialogTitle>
          <DialogDescription>
            Fill in the details below to create your event. You can always edit these later.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Type Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Event Type</Label>
            <div className="grid grid-cols-3 gap-3">
              {eventTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setEventType(type.value)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-lg border-2 p-4 text-center transition-all",
                    eventType === type.value
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:border-muted-foreground/50"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full",
                      eventType === type.value
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {type.icon}
                  </div>
                  <span className="text-sm font-medium">{type.label}</span>
                  <span className="text-xs text-muted-foreground">{type.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Event Name */}
          <div className="space-y-2">
            <Label htmlFor="event-name" className="text-sm font-medium">
              Event Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="event-name"
              placeholder="Enter your event name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="h-11"
            />
          </div>

          {/* Date and Time */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Date & Time <span className="text-destructive">*</span>
            </Label>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="start-date" className="text-xs text-muted-foreground">
                  Start
                </Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="h-11 pl-10"
                    />
                  </div>
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="h-11 w-28"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date" className="text-xs text-muted-foreground">
                  End
                </Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="h-11 pl-10"
                    />
                  </div>
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="h-11 w-28"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Timezone */}
          <div className="space-y-2">
            <Label htmlFor="timezone" className="text-sm font-medium">
              Timezone <span className="text-destructive">*</span>
            </Label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger className="h-11">
                <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                {timezones.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">
              Category
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat.toLowerCase()}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Tell attendees what your event is about..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <DialogFooter className="gap-2 pt-4 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isFormValid || isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
