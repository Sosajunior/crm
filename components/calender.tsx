"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Bell, Settings, CalendarIcon, X, Edit, Trash2, Check, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import {
  format,
  addDays,
  startOfDay,
  endOfDay,
  isWithinInterval,
  isSameDay,
  differenceInDays,
  eachDayOfInterval,
  compareAsc,
} from "date-fns"
import type { DateRange } from "react-day-picker"
import { useMediaQuery } from "@/hooks/use-media-query"

// Sample data with more events across different dates
const events = [
  {
    id: 1,
    title: "Hope Meeting",
    time: "9:00 AM",
    endTime: "10:00 AM",
    duration: "1h",
    description: "Weekly team sync to discuss project progress and upcoming milestones.",
    participants: [
      { name: "John Doe", avatar: "/placeholder.svg?height=32&width=32", email: "john@example.com" },
      { name: "Jane Smith", avatar: "/placeholder.svg?height=32&width=32", email: "jane@example.com" },
    ],
    category: "work",
    color: "border-l-blue-500",
    date: new Date(2024, 7, 13), // August 13, 2024
    timeSlot: 9,
  },
  {
    id: 2,
    title: "Morning Gym",
    time: "7:00 AM",
    endTime: "8:00 AM",
    duration: "1h",
    description: "Daily workout session focusing on cardio and strength training.",
    participants: [{ name: "Mike Johnson", avatar: "/placeholder.svg?height=32&width=32", email: "mike@example.com" }],
    category: "personal",
    color: "border-l-green-500",
    date: new Date(2024, 7, 14), // August 14, 2024
    timeSlot: 7,
  },
  {
    id: 3,
    title: "Styling for Twitter",
    time: "10:00 AM",
    endTime: "12:00 PM",
    duration: "2h",
    description: "Design review and implementation of new Twitter integration features.",
    participants: [
      { name: "Sarah Wilson", avatar: "/placeholder.svg?height=32&width=32", email: "sarah@example.com" },
      { name: "Tom Brown", avatar: "/placeholder.svg?height=32&width=32", email: "tom@example.com" },
    ],
    category: "work",
    color: "border-l-purple-500",
    date: new Date(2024, 7, 13), // August 13, 2024
    timeSlot: 10,
  },
  {
    id: 4,
    title: "Meeting Breakfast",
    time: "8:00 AM",
    endTime: "9:00 AM",
    duration: "1h",
    description: "Informal breakfast meeting with potential clients to discuss partnership opportunities.",
    participants: [
      { name: "Alex Davis", avatar: "/placeholder.svg?height=32&width=32", email: "alex@example.com" },
      { name: "Emma Taylor", avatar: "/placeholder.svg?height=32&width=32", email: "emma@example.com" },
    ],
    category: "work",
    color: "border-l-pink-500",
    date: new Date(2024, 7, 15), // August 15, 2024
    timeSlot: 8,
  },
  {
    id: 5,
    title: "Evaluation",
    time: "2:00 PM",
    endTime: "3:00 PM",
    duration: "1h",
    description: "Quarterly performance evaluation and goal setting session.",
    participants: [{ name: "David Lee", avatar: "/placeholder.svg?height=32&width=32", email: "david@example.com" }],
    category: "work",
    color: "border-l-orange-500",
    date: new Date(2024, 7, 16), // August 16, 2024
    timeSlot: 14,
  },
  {
    id: 6,
    title: "Client Call",
    time: "11:00 AM",
    endTime: "12:00 PM",
    duration: "1h",
    description: "Weekly check-in with key client to review project status.",
    participants: [{ name: "Lisa Chen", avatar: "/placeholder.svg?height=32&width=32", email: "lisa@example.com" }],
    category: "work",
    color: "border-l-indigo-500",
    date: new Date(2024, 7, 17), // August 17, 2024
    timeSlot: 11,
  },
  {
    id: 7,
    title: "Team Lunch",
    time: "12:00 PM",
    endTime: "1:00 PM",
    duration: "1h",
    description: "Monthly team building lunch at the new restaurant downtown.",
    participants: [
      { name: "Mark Wilson", avatar: "/placeholder.svg?height=32&width=32", email: "mark@example.com" },
      { name: "Anna Garcia", avatar: "/placeholder.svg?height=32&width=32", email: "anna@example.com" },
    ],
    category: "team",
    color: "border-l-yellow-500",
    date: new Date(2024, 7, 18), // August 18, 2024
    timeSlot: 12,
  },
  {
    id: 8,
    title: "Doctor Appointment",
    time: "3:00 PM",
    endTime: "4:00 PM",
    duration: "1h",
    description: "Annual health checkup with Dr. Smith.",
    participants: [{ name: "Dr. Smith", avatar: "/placeholder.svg?height=32&width=32", email: "dr.smith@clinic.com" }],
    category: "personal",
    color: "border-l-red-500",
    date: new Date(2024, 7, 19), // August 19, 2024
    timeSlot: 15,
  },
]

const timeSlots = [
  { hour: 7, label: "7:00 AM" },
  { hour: 8, label: "8:00 AM" },
  { hour: 9, label: "9:00 AM" },
  { hour: 10, label: "10:00 AM" },
  { hour: 11, label: "11:00 AM" },
  { hour: 12, label: "12:00 PM" },
  { hour: 13, label: "1:00 PM" },
  { hour: 14, label: "2:00 PM" },
  { hour: 15, label: "3:00 PM" },
  { hour: 16, label: "4:00 PM" },
  { hour: 17, label: "5:00 PM" },
  { hour: 18, label: "6:00 PM" },
]

export default function CalendarComponent() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2024, 7, 13), // August 13, 2024
    to: undefined,
  })
  const [selectedEvent, setSelectedEvent] = useState<(typeof events)[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  // Use media query to detect mobile view
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Determine if we have a single date or date range
  const isSingleDate = !dateRange?.to || isSameDay(dateRange.from!, dateRange.to)
  const displayDate = dateRange?.from || new Date()

  // Generate display dates based on selection
  const getDisplayDates = () => {
    if (!dateRange?.from) return []

    if (isSingleDate) {
      // Single day: show just that day
      return [dateRange.from]
    } else {
      // Date range: show all days in the range (max 7 days for UI purposes)
      const days = eachDayOfInterval({
        start: dateRange.from,
        end: dateRange.to!,
      })
      return days.slice(0, 7) // Limit to 7 days for display
    }
  }

  const displayDates = getDisplayDates()

  // Filter events based on selected date or date range
  const getFilteredEvents = () => {
    if (!dateRange?.from) return []

    return events.filter((event) => {
      const eventDate = startOfDay(event.date)

      if (isSingleDate) {
        return isSameDay(eventDate, dateRange.from!)
      } else {
        return isWithinInterval(eventDate, {
          start: startOfDay(dateRange.from!),
          end: endOfDay(dateRange.to!),
        })
      }
    })
  }

  const filteredEvents = getFilteredEvents()

  // Group events by date for mobile view
  const getEventsByDate = () => {
    const eventsByDate: Record<string, typeof events> = {}

    filteredEvents.forEach((event) => {
      const dateKey = format(event.date, "yyyy-MM-dd")
      if (!eventsByDate[dateKey]) {
        eventsByDate[dateKey] = []
      }
      eventsByDate[dateKey].push(event)
    })

    // Sort events by time within each date
    Object.keys(eventsByDate).forEach((dateKey) => {
      eventsByDate[dateKey].sort((a, b) => a.timeSlot - b.timeSlot)
    })

    return eventsByDate
  }

  const handleEventClick = (event: (typeof events)[0]) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  const handleEventAction = (action: "edit" | "cancel" | "complete") => {
    console.log(`${action} event:`, selectedEvent?.title)
    setIsModalOpen(false)
    setSelectedEvent(null)
  }

  const getEventsForDayAndTime = (day: Date, timeSlot: number) => {
    return filteredEvents.filter((event) => isSameDay(event.date, day) && event.timeSlot === timeSlot)
  }

  const handleDateSelect = (range: DateRange | undefined) => {
    setDateRange(range)
    // Don't close the calendar immediately to allow range selection
  }

  const handleCalendarClose = () => {
    setIsCalendarOpen(false)
  }

  const navigateDate = (direction: "prev" | "next") => {
    if (!dateRange?.from) return

    if (isSingleDate) {
      const newDate = addDays(dateRange.from, direction === "next" ? 1 : -1)
      setDateRange({ from: newDate, to: undefined })
    } else {
      const daysDiff = differenceInDays(dateRange.to!, dateRange.from!)
      const newStart = addDays(dateRange.from, direction === "next" ? daysDiff + 1 : -(daysDiff + 1))
      const newEnd = addDays(newStart, daysDiff)
      setDateRange({ from: newStart, to: newEnd })
    }
  }

  const getDateRangeText = () => {
    if (!dateRange?.from) return "Select Date"

    if (isSingleDate) {
      return format(dateRange.from, "MMM dd, yyyy")
    } else {
      return `${format(dateRange.from, "MMM dd")} - ${format(dateRange.to!, "MMM dd, yyyy")}`
    }
  }

  const getHeaderTitle = () => {
    if (!dateRange?.from) return "Calendar"

    if (isSingleDate) {
      return format(dateRange.from, "MMMM yyyy")
    } else {
      const startMonth = format(dateRange.from, "MMMM")
      const endMonth = format(dateRange.to!, "MMMM")
      const startYear = format(dateRange.from, "yyyy")
      const endYear = format(dateRange.to!, "yyyy")

      if (startMonth === endMonth && startYear === endYear) {
        return `${startMonth} ${startYear}`
      } else if (startYear === endYear) {
        return `${startMonth} - ${endMonth} ${startYear}`
      } else {
        return `${startMonth} ${startYear} - ${endMonth} ${endYear}`
      }
    }
  }

  // Render mobile view with dates as vertical list
  const renderMobileView = () => {
    const eventsByDate = getEventsByDate()
    const sortedDates = Object.keys(eventsByDate).sort((a, b) => compareAsc(new Date(a), new Date(b)))

    return (
      <div className="space-y-6">
        {sortedDates.map((dateKey) => {
          const date = new Date(dateKey)
          const dayEvents = eventsByDate[dateKey]

          return (
            <div key={dateKey} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Date Header */}
              <div className="bg-gray-50 p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">{format(date, "EEEE").toUpperCase()}</div>
                    <div className="text-xl font-semibold text-gray-900">{format(date, "MMMM d, yyyy")}</div>
                  </div>
                  <Badge variant="outline" className="text-sm">
                    {dayEvents.length} {dayEvents.length === 1 ? "event" : "events"}
                  </Badge>
                </div>
              </div>

              {/* Events List */}
              <div className="divide-y divide-gray-100">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleEventClick(event)}
                  >
                    <div className={`flex border-l-4 ${event.color} pl-3`}>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{event.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {event.time} - {event.endTime}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex -space-x-1">
                            {event.participants.length > 3 && (
                              <div className="w-5 h-5 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                                <span className="text-xs text-gray-600">+{event.participants.length - 3}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {sortedDates.length === 0 && (
          <div className="text-center py-12">
            <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Events</h3>
            <p className="text-gray-500">No events found for the selected date range.</p>
          </div>
        )}
      </div>
    )
  }

  // Render desktop view with time slots
  const renderDesktopView = () => {
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {timeSlots.map((timeSlot) => (
          <div
            key={timeSlot.hour}
            className="grid border-b border-gray-100 last:border-b-0"
            style={{ gridTemplateColumns: `80px repeat(${displayDates.length}, 1fr)` }}
          >
            {/* Time Label */}
            <div className="w-20 p-4 text-sm text-gray-500 border-r border-gray-100 bg-gray-50 flex items-start">
              {timeSlot.label}
            </div>

            {/* Day Columns */}
            {displayDates.map((day) => (
              <div
                key={`${day.toISOString()}-${timeSlot.hour}`}
                className="min-h-[80px] p-2 border-r border-gray-100 last:border-r-0"
              >
                {getEventsForDayAndTime(day, timeSlot.hour).map((event) => (
                  <Card
                    key={event.id}
                    className={`mb-2 border-l-4 ${event.color} hover:shadow-md transition-all cursor-pointer hover:scale-[1.02]`}
                    onClick={() => handleEventClick(event)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm text-gray-900 leading-tight">{event.title}</h4>
                        <span className="text-xs text-gray-500">{event.duration}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-1">
                          
                          {event.participants.length > 3 && (
                            <div className="w-5 h-5 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                              <span className="text-xs text-gray-600">+{event.participants.length - 3}</span>
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">{event.time}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <header className="border-b border-gray-200 px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <nav className="hidden md:flex items-center gap-8">
            <span className="text-gray-500 hover:text-gray-700 cursor-pointer">Contacts</span>
            <span className="text-gray-500 hover:text-gray-700 cursor-pointer">Files</span>
            <span className="text-gray-500 hover:text-gray-700 cursor-pointer">Chat</span>
            <span className="text-blue-500 border-b-2 border-blue-500 pb-1 font-medium">Calendar</span>
          </nav>

          <h1 className="text-xl font-semibold text-gray-900 md:hidden">Calendar</h1>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Calendar Header */}
      <div className="px-4 md:px-6 py-4 md:py-6">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="flex items-center gap-2 md:gap-4">
            <h1 className="text-xl md:text-3xl font-semibold text-gray-900">{getHeaderTitle()}</h1>
            {!isSingleDate && (
              <Badge variant="secondary" className="text-xs md:text-sm">
                {differenceInDays(dateRange?.to!, dateRange?.from!) + 1} days
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  <span className="hidden md:inline">{getDateRangeText()}</span>
                  <span className="md:hidden">Date</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <div className="p-3 border-b">
                  <p className="text-sm text-gray-600 mb-2">Select a single date or drag to select a range</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDateRange({ from: new Date(), to: undefined })
                        setIsCalendarOpen(false)
                      }}
                    >
                      Today
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const today = new Date()
                        setDateRange({
                          from: today,
                          to: addDays(today, 6),
                        })
                        setIsCalendarOpen(false)
                      }}
                    >
                      This Week
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleCalendarClose}>
                      Done
                    </Button>
                  </div>
                </div>
                <Calendar mode="range" selected={dateRange} onSelect={handleDateSelect} initialFocus />
              </PopoverContent>
            </Popover>
            <Button variant="ghost" size="sm" onClick={() => navigateDate("prev")}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigateDate("next")}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Day Headers - Only show on desktop or single date mobile view */}
        {displayDates.length > 0 && !isMobile && (
          <div
            className="hidden md:grid gap-4 mb-4"
            style={{ gridTemplateColumns: `80px repeat(${displayDates.length}, 1fr)` }}
          >
            <div className="w-20"></div> {/* Time column spacer */}
            {displayDates.map((day) => (
              <div key={day.toISOString()} className="text-center">
                <div className="text-sm text-gray-500 mb-1">{format(day, "EEE").toUpperCase()}</div>
                <div
                  className={`text-2xl font-semibold ${isSameDay(day, new Date()) ? "text-blue-500" : "text-gray-900"}`}
                >
                  {format(day, "dd")}
                </div>
                <div className="text-xs text-gray-400">{format(day, "MMM")}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Calendar Grid */}
      <div className="px-4 md:px-6 pb-6">
        {displayDates.length > 0 ? (
          <>
            {/* Mobile view with stacked list for date range */}
            {isMobile && !isSingleDate ? (
              renderMobileView()
            ) : isMobile && isSingleDate ? (
              // Single date on mobile still shows time slots
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {timeSlots.map((timeSlot) => (
                  <div key={timeSlot.hour} className="border-b border-gray-100 last:border-b-0">
                    {/* Time Label */}
                    <div className="p-3 text-sm text-gray-500 bg-gray-50 border-b border-gray-100">
                      {timeSlot.label}
                    </div>

                    {/* Events */}
                    <div className="p-2">
                      {getEventsForDayAndTime(displayDates[0], timeSlot.hour).map((event) => (
                        <Card
                          key={event.id}
                          className={`mb-2 border-l-4 ${event.color} hover:shadow-md transition-all cursor-pointer`}
                          onClick={() => handleEventClick(event)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-sm text-gray-900 leading-tight">{event.title}</h4>
                              <span className="text-xs text-gray-500">{event.duration}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="flex -space-x-1">
                                {event.participants.length > 3 && (
                                  <div className="w-5 h-5 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                                    <span className="text-xs text-gray-600">+{event.participants.length - 3}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      {getEventsForDayAndTime(displayDates[0], timeSlot.hour).length === 0 && (
                        <div className="h-4"></div> // Empty space to maintain height
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Desktop view with time slots
              renderDesktopView()
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Date Selected</h3>
            <p className="text-gray-500">Please select a date or date range to view appointments.</p>
          </div>
        )}
      </div>

      {/* Event Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedEvent?.title}</span>
              <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-1">Time</h4>
                <p className="text-sm text-gray-600">
                  {selectedEvent.time} - {selectedEvent.endTime} ({selectedEvent.duration})
                </p>
              </div>

              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-1">Date</h4>
                <p className="text-sm text-gray-600">{format(selectedEvent.date, "EEEE, MMMM dd, yyyy")}</p>
              </div>

              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-1">Description</h4>
                <p className="text-sm text-gray-600">{selectedEvent.description}</p>
              </div>

              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-2">Participants</h4>
                <div className="space-y-2">
                  {selectedEvent.participants.map((participant, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{participant.name}</p>
                        <p className="text-xs text-gray-500">{participant.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => handleEventAction("cancel")} className="flex-1">
              <Trash2 className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button variant="outline" onClick={() => handleEventAction("edit")} className="flex-1">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button onClick={() => handleEventAction("complete")} className="flex-1">
              <Check className="w-4 h-4 mr-2" />
              Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
