import { Sidebar } from "@/components/dashboard/sidebar"
import { TopNavbar } from "@/components/dashboard/top-navbar"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { EventsTable } from "@/components/dashboard/events-table"

export default function DashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top navbar */}
        <TopNavbar />

        {/* Dashboard content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Page header */}
            <div>
              <h2 className="text-2xl font-bold text-foreground">Welcome back, John</h2>
              <p className="text-muted-foreground">
                Here's what's happening with your events today.
              </p>
            </div>

            {/* Stats cards */}
            <StatsCards />

            {/* Events table */}
            <EventsTable />
          </div>
        </main>
      </div>
    </div>
  )
}
