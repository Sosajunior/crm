"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"

interface CalendarViewProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
}

export function CalendarView({ selectedDate, onDateSelect }: CalendarViewProps) {
  const currentMonth = selectedDate.getMonth()
  const currentYear = selectedDate.getFullYear()

  // Mock calendar data
  const calendarEvents = {
    "2024-01-15": [
      { type: "appointment", count: 3, status: "confirmed" },
      { type: "procedure", count: 2, status: "completed" },
    ],
    "2024-01-16": [
      { type: "appointment", count: 5, status: "confirmed" },
      { type: "procedure", count: 3, status: "scheduled" },
    ],
    "2024-01-17": [
      { type: "appointment", count: 2, status: "pending" },
      { type: "procedure", count: 1, status: "completed" },
    ],
    "2024-01-18": [
      { type: "appointment", count: 4, status: "confirmed" },
      { type: "procedure", count: 4, status: "scheduled" },
    ],
    "2024-01-19": [
      { type: "appointment", count: 6, status: "confirmed" },
      { type: "procedure", count: 2, status: "completed" },
    ],
  }

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay()
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate)
    if (direction === "next") {
      newDate.setMonth(newDate.getMonth() + 1)
    } else {
      newDate.setMonth(newDate.getMonth() - 1)
    }
    onDateSelect(newDate)
  }

  const daysInMonth = getDaysInMonth(currentMonth, currentYear)
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear)
  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]
  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

  const formatDateKey = (day: number) => {
    return `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const isToday = (day: number) => {
    const today = new Date()
    return today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear
  }

  const isSelected = (day: number) => {
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth &&
      selectedDate.getFullYear() === currentYear
    )
  }

  return (
    <Card className="card-hover">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")} className="hover:bg-secondary">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-foreground font-medium min-w-[150px] text-center">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <Button variant="outline" size="sm" onClick={() => navigateMonth("next")} className="hover:bg-secondary">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day Headers */}
          {dayNames.map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}

          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDay }, (_, i) => (
            <div key={`empty-${i}`} className="p-2 h-20" />
          ))}

          {/* Calendar Days */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1
            const dateKey = formatDateKey(day)
            const events = calendarEvents[dateKey] || []
            const hasEvents = events.length > 0

            return (
              <div
                key={day}
                className={`p-2 h-20 border border-border rounded cursor-pointer transition-colors ${
                  isSelected(day)
                    ? "bg-primary border-primary text-primary-foreground"
                    : isToday(day)
                      ? "bg-secondary border-border"
                      : "hover:bg-secondary/50"
                }`}
                onClick={() => {
                  const newDate = new Date(currentYear, currentMonth, day)
                  onDateSelect(newDate)
                }}
              >
                <div className="flex flex-col h-full">
                  <span
                    className={`text-sm font-medium ${
                      isSelected(day) ? "text-primary-foreground" : isToday(day) ? "text-foreground" : "text-foreground"
                    }`}
                  >
                    {day}
                  </span>

                  {hasEvents && (
                    <div className="flex-1 mt-1 space-y-1">
                      {events.slice(0, 2).map((event, index) => (
                        <div key={index} className="text-xs">
                          <Badge
                            className={`text-xs px-1 py-0 ${
                              event.type === "appointment" ? "bg-blue-900 text-blue-300" : "bg-green-900 text-green-300"
                            }`}
                          >
                            {event.count} {event.type === "appointment" ? "ag." : "proc."}
                          </Badge>
                        </div>
                      ))}
                      {events.length > 2 && <div className="text-xs text-gray-400">+{events.length - 2} mais</div>}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 mt-6 pt-4 border-t border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded"></div>
            <span className="text-sm text-gray-400">Agendamentos</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-600 rounded"></div>
            <span className="text-sm text-gray-400">Procedimentos</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-600 rounded border border-gray-500"></div>
            <span className="text-sm text-gray-400">Hoje</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
