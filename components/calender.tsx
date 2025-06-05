"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Bell, Settings, CalendarIcon, X, Edit, Trash2, Check } from "lucide-react"
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
} from "date-fns"
import type { DateRange } from "react-day-picker"

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
      { name: "John Doe", email: "john@example.com" },
      { name: "Jane Smith", email: "jane@example.com" },
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
    participants: [{ name: "Mike Johnson", email: "mike@example.com" }],
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
      { name: "Sarah Wilson", email: "sarah@example.com" },
      { name: "Tom Brown", email: "tom@example.com" },
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
      { name: "Alex Davis",  email: "alex@example.com" },
      { name: "Emma Taylor",  email: "emma@example.com" },
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
    participants: [{ name: "David Lee",  email: "david@example.com" }],
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
    participants: [{ name: "Lisa Chen",  email: "lisa@example.com" }],
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
      { name: "Mark Wilson",  email: "mark@example.com" },
      { name: "Anna Garcia",  email: "anna@example.com" },
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
    participants: [{ name: "Dr. Smith",  email: "dr.smith@clinic.com" }],
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

  return (
    <div className="min-w-screen bg-white">
      {/* Calendar Header */}
      <div className="px-6 py-6 ">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-semibold text-gray-900">{getHeaderTitle()}</h1>
            {!isSingleDate && (
              <Badge variant="secondary" className="text-sm">
                {differenceInDays(dateRange?.to!, dateRange?.from!) + 1} days
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {getDateRangeText()}
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

        {/* Day Headers */}
        {displayDates.length > 0 && (
          <div
            className={`grid gap-4 mb-4`}
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
      <div className="w-full px-6">
        {displayDates.length > 0 ? (
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
                {displayDates.map((day, dayIndex) => (
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
