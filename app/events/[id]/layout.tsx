"use client"

import { useParams, usePathname } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  Users,
  Building2,
  Settings,
  ArrowLeft,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

const eventData: Record<string, { name: string; date: string; status: string }> = {
  "1": { name: "Tech Summit 2026", date: "Apr 15-17, 2026", status: "Published" },
  "2": { name: "Design Conference", date: "May 8-9, 2026", status: "Published" },
  "3": { name: "Product Launch Event", date: "Jun 1, 2026", status: "Draft" },
  "4": { name: "Developer Workshop", date: "Jun 20, 2026", status: "Published" },
  "5": { name: "Annual Company Meetup", date: "Jul 10-12, 2026", status: "Draft" },
  "6": { name: "Marketing Summit", date: "Aug 5, 2026", status: "Published" },
}

const sidebarItems = [
  { name: "Overview", href: "", icon: LayoutDashboard },
  { name: "Visitors", href: "/visitors", icon: Users },
  { name: "Exhibitors", href: "/exhibitors", icon: Building2 },
  { name: "Settings", href: "/settings", icon: Settings },
]

export default function EventLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const pathname = usePathname()
  const eventId = params.id as string
  const event = eventData[eventId] || { name: "Event", date: "", status: "Draft" }

  const getActiveTab = () => {
    const path = pathname.replace(`/events/${eventId}`, "")
    return path || ""
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col border-r border-border bg-card">
        {/* Back to Events */}
        <div className="border-b border-border p-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Link>
        </div>

        {/* Event Selector */}
        <div className="border-b border-border p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-between px-3 py-6">
                <div className="text-left">
                  <p className="font-semibold text-foreground">{event.name}</p>
                  <p className="text-xs text-muted-foreground">{event.date}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {Object.entries(eventData).map(([id, e]) => (
                <DropdownMenuItem key={id} asChild>
                  <Link href={`/events/${id}`}>{e.name}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Badge
            variant={event.status === "Published" ? "default" : "secondary"}
            className="mt-2"
          >
            {event.status}
          </Badge>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3">
          {sidebarItems.map((item) => {
            const isActive = getActiveTab() === item.href
            return (
              <Link
                key={item.name}
                href={`/events/${eventId}${item.href}`}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>

      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1">{children}</main>
    </div>
  )
}
