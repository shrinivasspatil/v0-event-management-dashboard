"use client"

import { useState } from "react"
import { Plus, Search, Calendar, MapPin, Users, Building2, MoreHorizontal, Filter, Grid3X3, List, Tags, Pencil, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CreateEventModal } from "@/components/create-event-modal"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Link from "next/link"

interface Category {
  id: string
  name: string
  color: string
  eventsCount: number
}

const initialCategories: Category[] = [
  { id: "1", name: "Conference", color: "#6366f1", eventsCount: 2 },
  { id: "2", name: "Workshop", color: "#10b981", eventsCount: 1 },
  { id: "3", name: "Webinar", color: "#f59e0b", eventsCount: 1 },
  { id: "4", name: "Trade Show", color: "#ef4444", eventsCount: 2 },
]

const colorOptions = [
  "#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899", 
  "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16",
  "#22c55e", "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9",
]

const events = [
  {
    id: "1",
    name: "Tech Summit 2026",
    date: "Apr 15-17, 2026",
    location: "San Francisco, CA",
    type: "In Person",
    visitors: 1250,
    exhibitors: 78,
    status: "Published",
    category: "Conference",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop",
  },
  {
    id: "2",
    name: "Design Conference",
    date: "May 8-9, 2026",
    location: "Virtual",
    type: "Virtual",
    visitors: 3500,
    exhibitors: 42,
    status: "Published",
    category: "Conference",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=200&fit=crop",
  },
  {
    id: "3",
    name: "Product Launch Event",
    date: "Jun 1, 2026",
    location: "New York, NY",
    type: "Hybrid",
    visitors: 850,
    exhibitors: 65,
    status: "Draft",
    category: "Trade Show",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=200&fit=crop",
  },
  {
    id: "4",
    name: "Developer Workshop",
    date: "Jun 20, 2026",
    location: "Austin, TX",
    type: "In Person",
    visitors: 200,
    exhibitors: 15,
    status: "Published",
    category: "Workshop",
    image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400&h=200&fit=crop",
  },
  {
    id: "5",
    name: "Annual Company Meetup",
    date: "Jul 10-12, 2026",
    location: "Chicago, IL",
    type: "In Person",
    visitors: 500,
    exhibitors: 30,
    status: "Draft",
    category: "Trade Show",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=200&fit=crop",
  },
  {
    id: "6",
    name: "Marketing Summit",
    date: "Aug 5, 2026",
    location: "Virtual",
    type: "Virtual",
    visitors: 2000,
    exhibitors: 55,
    status: "Published",
    category: "Webinar",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=200&fit=crop",
  },
]

export default function EventsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  
  // Categories state
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false)
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false)
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false)
  const [isDeleteCategoryDialogOpen, setIsDeleteCategoryDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [newCategory, setNewCategory] = useState({ name: "", color: "#6366f1" })
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null)

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategoryFilter ? event.category === selectedCategoryFilter : true
    return matchesSearch && matchesCategory
  })

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) return
    const category: Category = {
      id: String(Date.now()),
      name: newCategory.name.trim(),
      color: newCategory.color,
      eventsCount: 0,
    }
    setCategories([...categories, category])
    setNewCategory({ name: "", color: "#6366f1" })
    setIsAddCategoryModalOpen(false)
  }

  const handleEditCategory = () => {
    if (!selectedCategory || !selectedCategory.name.trim()) return
    setCategories(categories.map(cat => 
      cat.id === selectedCategory.id ? selectedCategory : cat
    ))
    setIsEditCategoryModalOpen(false)
    setSelectedCategory(null)
  }

  const handleDeleteCategory = () => {
    if (!selectedCategory) return
    setCategories(categories.filter(cat => cat.id !== selectedCategory.id))
    setIsDeleteCategoryDialogOpen(false)
    setSelectedCategory(null)
  }

  const openEditModal = (category: Category) => {
    setSelectedCategory({ ...category })
    setIsEditCategoryModalOpen(true)
  }

  const openDeleteDialog = (category: Category) => {
    setSelectedCategory(category)
    setIsDeleteCategoryDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <CreateEventModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
      
      {/* Top Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Calendar className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">Eventify</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              Help
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <span>John Doe</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/">Sign out</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Events</h1>
            <p className="mt-1 text-muted-foreground">
              Manage and organize all your events in one place
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2" onClick={() => setIsCategoriesModalOpen(true)}>
              <Tags className="h-4 w-4" />
              Categories
            </Button>
            <Button className="gap-2" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4" />
              Create Event
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mb-8 grid gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm font-medium text-muted-foreground">Total Events</p>
            <p className="mt-1 text-3xl font-bold text-foreground">{events.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm font-medium text-muted-foreground">Total Visitors</p>
            <p className="mt-1 text-3xl font-bold text-foreground">
              {events.reduce((sum, e) => sum + e.visitors, 0).toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm font-medium text-muted-foreground">Total Exhibitors</p>
            <p className="mt-1 text-3xl font-bold text-foreground">
              {events.reduce((sum, e) => sum + e.exhibitors, 0).toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm font-medium text-muted-foreground">Published Events</p>
            <p className="mt-1 text-3xl font-bold text-foreground">
              {events.filter((e) => e.status === "Published").length}
            </p>
          </div>
        </div>

        {/* Categories Filter Pills */}
        {categories.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground mr-2">Filter by:</span>
            <Button
              variant={selectedCategoryFilter === null ? "default" : "outline"}
              size="sm"
              className="rounded-full"
              onClick={() => setSelectedCategoryFilter(null)}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategoryFilter === category.name ? "default" : "outline"}
                size="sm"
                className="rounded-full gap-2"
                onClick={() => setSelectedCategoryFilter(category.name)}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                {category.name}
              </Button>
            ))}
          </div>
        )}

        {/* Filters & Search */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <div className="flex rounded-lg border border-border">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                className="rounded-r-none"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                className="rounded-l-none"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {viewMode === "grid" ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => {
              const category = categories.find(c => c.name === event.category)
              return (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      crossOrigin="anonymous"
                    />
                    <div className="absolute right-3 top-3 flex items-center gap-2">
                      {category && (
                        <Badge 
                          variant="secondary" 
                          className="text-white"
                          style={{ backgroundColor: category.color }}
                        >
                          {event.category}
                        </Badge>
                      )}
                      <Badge
                        variant={event.status === "Published" ? "default" : "secondary"}
                      >
                        {event.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-2 flex items-start justify-between">
                      <h3 className="font-semibold text-foreground group-hover:text-primary">
                        {event.name}
                      </h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{event.visitors.toLocaleString()} visitors</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        <span>{event.exhibitors} exhibitors</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Badge variant="outline">{event.type}</Badge>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEvents.map((event) => {
              const category = categories.find(c => c.name === event.category)
              return (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md"
                >
                  <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={event.image}
                      alt={event.name}
                      className="h-full w-full object-cover"
                      crossOrigin="anonymous"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary">
                      {event.name}
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {event.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {event.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {event.visitors.toLocaleString()} visitors
                      </span>
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5" />
                        {event.exhibitors} exhibitors
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {category && (
                      <Badge 
                        variant="secondary" 
                        className="text-white"
                        style={{ backgroundColor: category.color }}
                      >
                        {event.category}
                      </Badge>
                    )}
                    <Badge variant="outline">{event.type}</Badge>
                    <Badge variant={event.status === "Published" ? "default" : "secondary"}>
                      {event.status}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>

      {/* Categories Management Modal */}
      <Dialog open={isCategoriesModalOpen} onOpenChange={setIsCategoriesModalOpen}>
        <DialogContent className="sm:max-w-md" aria-describedby="categories-description">
          <DialogHeader>
            <DialogTitle>Manage Categories</DialogTitle>
            <DialogDescription id="categories-description">
              Create and manage event categories to organize your events.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {categories.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No categories yet. Add your first category.
              </div>
            ) : (
              <div className="space-y-2">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="font-medium">{category.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {category.eventsCount} events
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEditModal(category)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => openDeleteDialog(category)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCategoriesModalOpen(false)}>
              Close
            </Button>
            <Button onClick={() => setIsAddCategoryModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Category Modal */}
      <Dialog open={isAddCategoryModalOpen} onOpenChange={setIsAddCategoryModalOpen}>
        <DialogContent className="sm:max-w-md" aria-describedby="add-category-description">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription id="add-category-description">
              Create a new category for organizing your events.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">Category Name</Label>
              <Input
                id="category-name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="Enter category name"
              />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`h-8 w-8 rounded-full transition-transform hover:scale-110 ${
                      newCategory.color === color ? "ring-2 ring-offset-2 ring-primary" : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewCategory({ ...newCategory, color })}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCategoryModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCategory} disabled={!newCategory.name.trim()}>
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Modal */}
      <Dialog open={isEditCategoryModalOpen} onOpenChange={setIsEditCategoryModalOpen}>
        <DialogContent className="sm:max-w-md" aria-describedby="edit-category-description">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription id="edit-category-description">
              Update the category name or color.
            </DialogDescription>
          </DialogHeader>
          {selectedCategory && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category-name">Category Name</Label>
                <Input
                  id="edit-category-name"
                  value={selectedCategory.name}
                  onChange={(e) => setSelectedCategory({ ...selectedCategory, name: e.target.value })}
                  placeholder="Enter category name"
                />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`h-8 w-8 rounded-full transition-transform hover:scale-110 ${
                        selectedCategory.color === color ? "ring-2 ring-offset-2 ring-primary" : ""
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedCategory({ ...selectedCategory, color })}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCategoryModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCategory} disabled={!selectedCategory?.name.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Confirmation */}
      <AlertDialog open={isDeleteCategoryDialogOpen} onOpenChange={setIsDeleteCategoryDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedCategory?.name}"? This action cannot be undone.
              Events using this category will be uncategorized.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
