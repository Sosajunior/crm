"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, User, Phone, Search, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { X, CheckCircle, AlertCircle, CheckSquare, XCircle } from "lucide-react"

interface AppointmentsListProps {
  selectedDate: Date
  viewMode: "day" | "week" | "month"
  fullView?: boolean
}

export function AppointmentsList({ selectedDate, viewMode, fullView = false }: AppointmentsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [appointments, setAppointments] = useState([
    {
      id: "1",
      time: "08:30",
      patient: "Maria Silva",
      phone: "(11) 99999-9999",
      type: "Consulta",
      status: "confirmed",
      duration: 30,
      notes: "Primeira consulta",
    },
    {
      id: "2",
      time: "09:00",
      patient: "João Santos",
      phone: "(11) 88888-8888",
      type: "Limpeza",
      status: "confirmed",
      duration: 45,
      notes: "Retorno",
    },
    {
      id: "3",
      time: "10:30",
      patient: "Ana Costa",
      phone: "(11) 77777-7777",
      type: "Canal",
      status: "pending",
      duration: 90,
      notes: "Procedimento complexo",
    },
    {
      id: "4",
      time: "14:00",
      patient: "Carlos Lima",
      phone: "(11) 66666-6666",
      type: "Restauração",
      status: "confirmed",
      duration: 60,
      notes: "",
    },
    {
      id: "5",
      time: "15:30",
      patient: "Lucia Oliveira",
      phone: "(11) 55555-5555",
      type: "Consulta",
      status: "completed",
      duration: 30,
      notes: "Avaliação ortodôntica",
    },
    {
      id: "6",
      time: "16:30",
      patient: "Pedro Alves",
      phone: "(11) 44444-4444",
      type: "Extração",
      status: "cancelled",
      duration: 45,
      notes: "Cancelado pelo paciente",
    },
  ])

  const handleReschedule = (appointmentId: string) => {
    // In a real app, this would open a modal or form to reschedule
    console.log(`Reagendando consulta ${appointmentId}`)
    alert(`Reagendando consulta ${appointmentId}`)
  }

  const handleCancel = (appointmentId: string) => {
    if (confirm(`Tem certeza que deseja cancelar o agendamento ${appointmentId}?`)) {
      // Update the appointments array with the cancelled status
      setAppointments(appointments.map((app) => (app.id === appointmentId ? { ...app, status: "cancelled" } : app)))
      console.log(`Consulta ${appointmentId} cancelada`)
    }
  }

  const handleChangeStatus = (appointmentId: string, newStatus: string) => {
    // Update the appointments array with the new status
    setAppointments(appointments.map((app) => (app.id === appointmentId ? { ...app, status: newStatus } : app)))
    console.log(`Status da consulta ${appointmentId} alterado para ${newStatus}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-900 text-green-300"
      case "pending":
        return "bg-yellow-900 text-yellow-300"
      case "completed":
        return "bg-blue-900 text-blue-300"
      case "cancelled":
        return "bg-red-900 text-red-300"
      default:
        return "bg-gray-700 text-gray-300"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmado"
      case "pending":
        return "Pendente"
      case "completed":
        return "Concluído"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || appointment.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <Card className="card-hover">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-info-foreground" />
            Agendamentos
            {!fullView && ` - ${selectedDate.toLocaleDateString("pt-BR")}`}
          </CardTitle>
          {fullView && (
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              Novo Agendamento
            </Button>
          )}
        </div>
        {fullView && (
          <div className="flex items-center space-x-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar agendamentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-background border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Todos os Status</option>
              <option value="confirmed">Confirmados</option>
              <option value="pending">Pendentes</option>
              <option value="completed">Concluídos</option>
              <option value="cancelled">Cancelados</option>
            </select>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredAppointments.slice(0, fullView ? undefined : 5).map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-foreground">{appointment.time}</div>
                  <div className="text-xs text-muted-foreground">{appointment.duration}min</div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">{appointment.patient}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{appointment.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{appointment.type}</span>
                  </div>
                  {appointment.notes && <p className="text-xs text-muted-foreground mt-1">{appointment.notes}</p>}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(appointment.status)}>{getStatusLabel(appointment.status)}</Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleReschedule(appointment.id)}>
                      <Calendar className="w-4 h-4 mr-2" />
                      Reagendar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleCancel(appointment.id)}>
                      <X className="w-4 h-4 mr-2" />
                      Cancelar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <Clock className="w-4 h-4 mr-2" />
                        Alterar Status
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem onClick={() => handleChangeStatus(appointment.id, "confirmed")}>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Confirmado
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleChangeStatus(appointment.id, "pending")}>
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Pendente
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleChangeStatus(appointment.id, "completed")}>
                          <CheckSquare className="w-4 h-4 mr-2" />
                          Concluído
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleChangeStatus(appointment.id, "cancelled")}>
                          <XCircle className="w-4 h-4 mr-2" />
                          Cancelado
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}

          {filteredAppointments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum agendamento encontrado</p>
            </div>
          )}

          {!fullView && filteredAppointments.length > 5 && (
            <div className="text-center pt-4">
              <Button variant="outline" size="sm" className="border-gray-600 text-muted-foreground hover:bg-gray-700">
                Ver todos os agendamentos
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
