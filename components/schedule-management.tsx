"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { ScheduleMetrics } from "@/components/schedule-metrics"
import { AppointmentsList } from "@/components/appointments-list"
import { ProceduresList } from "@/components/procedures-schedule-list"
import { CalendarView } from "@/components/calendar-view"

interface ScheduleManagementProps {
  selectedPeriod?: string
}

export function ScheduleManagement({ selectedPeriod = "today" }: ScheduleManagementProps) {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day")
  const [activeTab, setActiveTab] = useState("overview")

  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false)
  const [showNewProcedureModal, setShowNewProcedureModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleNewAppointment = () => {
    setShowNewAppointmentModal(true)
  }

  const handleNewProcedure = () => {
    setShowNewProcedureModal(true)
  }

  const handleExportData = async () => {
    setIsLoading(true)
    try {
      // Simulate export functionality
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("Dados exportados com sucesso")
    } catch (error) {
      console.error("Erro ao exportar dados:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefreshData = async () => {
    setIsLoading(true)
    try {
      // Simulate data refresh
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Dados atualizados")
    } catch (error) {
      console.error("Erro ao atualizar dados:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoToToday = () => {
    setSelectedDate(new Date())
  }

  // Replace the static scheduleMetrics object with dynamic data based on selectedDate
  const getMetricsForDate = (date: Date, mode: "day" | "week" | "month") => {
    const dayOfWeek = date.getDay()
    const dayOfMonth = date.getDate()

    if (mode === "day") {
      // Generate different metrics based on the specific day
      const baseMetrics = {
        totalAppointments: 5 + dayOfWeek * 2 + (dayOfMonth % 3),
        confirmedAppointments: 3 + dayOfWeek + (dayOfMonth % 2),
        pendingAppointments: 1 + (dayOfMonth % 2),
        cancelledAppointments: dayOfMonth % 4 === 0 ? 1 : 0,
        completedProcedures: 2 + (dayOfWeek % 3) + (dayOfMonth % 2),
        scheduledProcedures: 1 + (dayOfMonth % 3),
        occupancyRate: 60 + dayOfWeek * 3 + (dayOfMonth % 15),
        noShowRate: 3 + (dayOfMonth % 8),
      }
      return baseMetrics
    } else if (mode === "week") {
      return {
        totalAppointments: 45,
        confirmedAppointments: 38,
        pendingAppointments: 5,
        cancelledAppointments: 2,
        completedProcedures: 28,
        scheduledProcedures: 15,
        occupancyRate: 82,
        noShowRate: 8,
      }
    } else {
      return {
        totalAppointments: 180,
        confirmedAppointments: 152,
        pendingAppointments: 18,
        cancelledAppointments: 10,
        completedProcedures: 125,
        scheduledProcedures: 45,
        occupancyRate: 78,
        noShowRate: 12,
      }
    }
  }

  // Replace the currentMetrics calculation
  const currentMetrics = getMetricsForDate(
    selectedDate,
    selectedPeriod === "today" ? "day" : selectedPeriod === "week" ? "week" : "month",
  )

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate)
    if (viewMode === "day") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1))
    } else if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7))
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1))
    }
    setSelectedDate(newDate)
  }

  // Get current metrics based on view mode - map "day" to "today"
  const metricsKey = viewMode === "day" ? "today" : viewMode
  // const currentMetrics = scheduleMetrics[metricsKey] || scheduleMetrics.today

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "n":
            e.preventDefault()
            handleNewAppointment()
            break
          case "r":
            e.preventDefault()
            handleRefreshData()
            break
          case "t":
            e.preventDefault()
            handleGoToToday()
            break
        }
      }

      // Arrow key navigation
      if (!e.ctrlKey && !e.metaKey) {
        switch (e.key) {
          case "ArrowLeft":
            e.preventDefault()
            navigateDate("prev")
            break
          case "ArrowRight":
            e.preventDefault()
            navigateDate("next")
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [selectedDate, viewMode])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Gerenciamento de Agenda</h2>
          <p className="text-sm text-muted-foreground">Controle completo de agendamentos e procedimentos</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleGoToToday} disabled={isLoading}>
            Hoje
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefreshData} disabled={isLoading}>
            {isLoading ? "Atualizando..." : "Atualizar"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportData} disabled={isLoading}>
            Exportar
          </Button>
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={handleNewAppointment}
            disabled={isLoading}
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Agendamento
          </Button>
        </div>
      </div>

      {/* Date Navigation */}
      <Card className="card-hover">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate("prev")}
                className="hover:bg-secondary mr-4"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="text-center w-80">
                <h3 className="text-lg font-semibold text-foreground capitalize truncate">
                  {formatDate(selectedDate)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {viewMode === "day" && "Visualização diária"}
                  {viewMode === "week" && "Visualização semanal"}
                  {viewMode === "month" && "Visualização mensal"}
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate("next")}
                className="hover:bg-secondary ml-4"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex bg-secondary rounded-lg p-1">
              {["day", "week", "month"].map((mode) => (
                <Button
                  key={mode}
                  variant={viewMode === mode ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode(mode as "day" | "week" | "month")}
                  className={`text-xs ${
                    viewMode === mode
                      ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                      : "text-muted-foreground hover:bg-background hover:text-foreground"
                  }`}
                >
                  {mode === "day" && "Dia"}
                  {mode === "week" && "Semana"}
                  {mode === "month" && "Mês"}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Metrics */}
      <ScheduleMetrics metrics={currentMetrics} viewMode={viewMode} />

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-secondary">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground"
          >
            Visão Geral
          </TabsTrigger>
          <TabsTrigger
            value="appointments"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground"
          >
            Agendamentos
          </TabsTrigger>
          <TabsTrigger
            value="procedures"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground"
          >
            Procedimentos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AppointmentsList selectedDate={selectedDate} viewMode={viewMode} />
            <ProceduresList selectedDate={selectedDate} viewMode={viewMode} />
          </div>
        </TabsContent>

        <TabsContent value="appointments">
          <AppointmentsList selectedDate={selectedDate} viewMode={viewMode} fullView />
        </TabsContent>

        <TabsContent value="procedures">
          <ProceduresList selectedDate={selectedDate} viewMode={viewMode} fullView />
        </TabsContent>

        <TabsContent value="calendar">
          <CalendarView selectedDate={selectedDate} onDateSelect={setSelectedDate} />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {showNewAppointmentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Novo Agendamento</h3>
            <p className="text-muted-foreground mb-4">Funcionalidade em desenvolvimento...</p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowNewAppointmentModal(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setShowNewAppointmentModal(false)}>Salvar</Button>
            </div>
          </div>
        </div>
      )}

      {showNewProcedureModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Novo Procedimento</h3>
            <p className="text-muted-foreground mb-4">Funcionalidade em desenvolvimento...</p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowNewProcedureModal(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setShowNewProcedureModal(false)}>Salvar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
