"use client"

import { Calendar, Ticket, DollarSign, Users, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const stats = [
  {
    title: "Total Events",
    value: "24",
    change: "+12%",
    trend: "up",
    icon: Calendar,
    description: "vs last month",
  },
  {
    title: "Tickets Sold",
    value: "2,847",
    change: "+8.2%",
    trend: "up",
    icon: Ticket,
    description: "vs last month",
  },
  {
    title: "Revenue",
    value: "$48,294",
    change: "+23.1%",
    trend: "up",
    icon: DollarSign,
    description: "vs last month",
  },
  {
    title: "Attendees",
    value: "3,156",
    change: "-2.4%",
    trend: "down",
    icon: Users,
    description: "vs last month",
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-medium ${
                  stat.trend === "up" ? "text-success" : "text-destructive"
                }`}
              >
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
