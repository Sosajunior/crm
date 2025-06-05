"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StatusBadge } from "@/components/ui/status-badge"
import { Avatar } from "@/components/ui/avatar"
import {
  Search,
  Filter,
  Plus,
  Phone,
  Mail,
  Calendar,
  MoreHorizontal,
  User,
  CheckCircle,
  DollarSign,
} from "lucide-react"
import { PatientProfile } from "@/components/patient-profile"

interface Patient {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  status: string
  nextAppointment: string
  totalValue: number
  procedures: number
  funnelStage: string
  appointments: Array<{
    date: string
    time: string
    type: string
    status: string
    value?: number
  }>
  procedureHistory: Array<{
    date: string
    name: string
    status: string
    value: number
    cost: number
    profit: number
  }>
  pendingReturns?: Array<{
    date: string
    type: string
    reason: string
  }>
  totalSpent: number
  totalProfit: number
  lastContact: string
}

interface PatientManagementProps {
  patients: Patient[]
  onSelectPatient?: (patient: Patient) => void
  selectedPeriod?: string
}

export function PatientManagement({ patients, onSelectPatient, selectedPeriod = "today" }: PatientManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "success"
      case "pending":
        return "warning"
      case "inactive":
        return "default"
      default:
        return "default"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo"
      case "pending":
        return "Pendente"
      case "inactive":
        return "Inativo"
      default:
        return status
    }
  }

  const getStageLabel = (stage: string) => {
    const stages = {
      atendimento_iniciado: "Atendimento Iniciado",
      duvida_sanada: "Dúvida Sanada",
      procedimento_oferecido: "Procedimento Oferecido",
      agendamento_realizado: "Agendamento Realizado",
      agendamento_confirmado: "Agendamento Confirmado",
      comparecimento_confirmado: "Compareceu",
      procedimento_realizado: "Procedimento Realizado",
    }
    return stages[stage] || stage
  }

  const getAppointmentStatusVariant = (status: string) => {
    switch (status) {
      case "realizado":
        return "success"
      case "confirmado":
        return "info"
      case "pendente":
        return "warning"
      case "cancelado":
        return "default"
      default:
        return "default"
    }
  }

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm),
  )

  const periodFilteredPatients = filteredPatients.filter((patient) => {
    const lastContactDate = new Date(patient.lastContact)
    const now = new Date()

    switch (selectedPeriod) {
      case "today":
        return lastContactDate.toDateString() === now.toDateString()
      case "week":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return lastContactDate >= weekAgo
      case "month":
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        return lastContactDate >= monthAgo
      default:
        return true
    }
  })

  // Enhanced mock data with appointments and procedures - ensure arrays exist
  const enhancedPatients = periodFilteredPatients.map((patient) => ({
    ...patient,
    appointments: patient.appointments || [
      { date: "2024-01-20", time: "14:30", type: "Consulta", status: "confirmado", value: 100 },
      { date: "2024-01-15", time: "09:00", type: "Limpeza", status: "realizado", value: 150 },
      { date: "2024-01-10", time: "16:00", type: "Avaliação", status: "realizado", value: 80 },
    ],
    procedureHistory: patient.procedureHistory || [
      { date: "2024-01-15", name: "Limpeza Dental", status: "concluído", value: 150, cost: 45, profit: 105 },
      { date: "2024-01-10", name: "Avaliação Inicial", status: "concluído", value: 80, cost: 20, profit: 60 },
    ],
    pendingReturns: patient.pendingReturns || [
      { date: "2024-02-15", type: "Retorno Limpeza", reason: "Verificação pós-procedimento" },
    ],
    totalSpent: patient.totalSpent || 1250,
    totalProfit: patient.totalProfit || 850,
  }))

  const handlePatientClick = (patient: Patient) => {
    // Ensure the patient object has the required procedures array for PatientProfile
    const patientWithProcedures = {
      ...patient,
      procedures: Array.isArray(patient.procedureHistory) ? patient.procedureHistory : [], // Ensure it's an array
      totalSpent: patient.totalSpent || 0,
      totalProfit: patient.totalProfit || 0,
    }
    setSelectedPatient(patientWithProcedures)
    if (onSelectPatient) {
      onSelectPatient(patientWithProcedures)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  if (selectedPatient) {
    return <PatientProfile patient={selectedPatient} onBack={() => setSelectedPatient(null)} />
  }

  return (
    <div className="space-y-6 page-transition">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Pacientes</h1>
          <p className="text-muted-foreground">
            {periodFilteredPatients.length} pacientes
            {selectedPeriod === "today" && " - contatos de hoje"}
            {selectedPeriod === "week" && " - últimos 7 dias"}
            {selectedPeriod === "month" && " - últimos 30 dias"}
          </p>
        </div>
        <Button className="btn-hover">
          <Plus className="h-4 w-4 mr-2" />
          Novo Paciente
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="card-hover">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por nome, email ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="all">Todos os Status</option>
                <option value="active">Ativos</option>
                <option value="pending">Pendentes</option>
                <option value="inactive">Inativos</option>
              </select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {periodFilteredPatients.map((patient, index) => (
          <Card
            key={patient.id}
            className="card-hover cursor-pointer animate-slide-up overflow-hidden"
            style={{ animationDelay: `${index * 0.05}s` }}
            onClick={() => handlePatientClick(patient)}
          >
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar initials={getInitials(patient.name)} size="md" />
                  <div>
                    <h3 className="font-medium">{patient.name}</h3>
                    <StatusBadge variant={getStatusVariant(patient.status) as any}>
                      {getStatusLabel(patient.status)}
                    </StatusBadge>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{patient.email}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{patient.phone}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>Próximo: {new Date(patient.nextAppointment).toLocaleDateString("pt-BR")}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <DollarSign className="h-3 w-3 text-primary" />
                    <p className="text-sm font-medium">{(patient.totalValue || 0).toLocaleString("pt-BR")}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <CheckCircle className="h-3 w-3 text-success-foreground" />
                    <p className="text-sm font-medium">
                      {typeof patient.procedures === "number"
                        ? patient.procedures
                        : Array.isArray(patient.procedureHistory)
                          ? patient.procedureHistory.length
                          : 0}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">Proc.</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Calendar className="h-3 w-3 text-info-foreground" />
                    <p className="text-sm font-medium">
                      {Array.isArray(patient.appointments) ? patient.appointments.length : 0}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">Agend.</p>
                </div>
              </div>

              {/* Expandable Procedures and Appointments */}
              <div className="mt-4 space-y-2">
                {/* Procedures Container */}
                <div className="border rounded-lg overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between p-3 bg-secondary/50 hover:bg-secondary transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      const content = e.currentTarget.nextElementSibling
                      const arrow = e.currentTarget.querySelector(".arrow-icon")
                      if (content.style.display === "none" || !content.style.display) {
                        content.style.display = "block"
                        arrow.style.transform = "rotate(90deg)"
                      } else {
                        content.style.display = "none"
                        arrow.style.transform = "rotate(0deg)"
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success-foreground" />
                      <span className="text-sm font-medium">
                        Procedimentos ({Array.isArray(patient.procedureHistory) ? patient.procedureHistory.length : 0})
                      </span>
                    </div>
                    <svg
                      className="arrow-icon h-4 w-4 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <div style={{ display: "none" }} className="p-3 bg-background border-t">
                    {Array.isArray(patient.procedureHistory) && patient.procedureHistory.length > 0 ? (
                      <div className="space-y-2">
                        {patient.procedureHistory.slice(0, 3).map((procedure, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <div>
                              <p className="font-medium">{procedure.name}</p>
                              <p className="text-muted-foreground">
                                {new Date(procedure.date).toLocaleDateString("pt-BR")}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">R$ {procedure.value.toLocaleString("pt-BR")}</p>
                              <p className="text-success-foreground">+R$ {procedure.profit.toLocaleString("pt-BR")}</p>
                            </div>
                          </div>
                        ))}
                        {patient.procedureHistory.length > 3 && (
                          <p className="text-xs text-muted-foreground text-center pt-1">
                            +{patient.procedureHistory.length - 3} mais
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground text-center">Nenhum procedimento realizado</p>
                    )}
                  </div>
                </div>

                {/* Appointments Container */}
                <div className="border rounded-lg overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between p-3 bg-secondary/50 hover:bg-secondary transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      const content = e.currentTarget.nextElementSibling
                      const arrow = e.currentTarget.querySelector(".arrow-icon")
                      if (content.style.display === "none" || !content.style.display) {
                        content.style.display = "block"
                        arrow.style.transform = "rotate(90deg)"
                      } else {
                        content.style.display = "none"
                        arrow.style.transform = "rotate(0deg)"
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-info-foreground" />
                      <span className="text-sm font-medium">
                        Agendamentos ({Array.isArray(patient.appointments) ? patient.appointments.length : 0})
                      </span>
                    </div>
                    <svg
                      className="arrow-icon h-4 w-4 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <div style={{ display: "none" }} className="p-3 bg-background border-t">
                    {Array.isArray(patient.appointments) && patient.appointments.length > 0 ? (
                      <div className="space-y-2">
                        {patient.appointments.slice(0, 3).map((appointment, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <div>
                              <p className="font-medium">{appointment.type}</p>
                              <p className="text-muted-foreground">
                                {new Date(appointment.date).toLocaleDateString("pt-BR")} às {appointment.time}
                              </p>
                            </div>
                            <div className="text-right">
                              <StatusBadge
                                variant={getAppointmentStatusVariant(appointment.status) as any}
                                className="text-xs px-1.5 py-0.5"
                              >
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                              </StatusBadge>
                              {appointment.value && (
                                <p className="text-xs font-medium mt-1">
                                  R$ {appointment.value.toLocaleString("pt-BR")}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                        {patient.appointments.length > 3 && (
                          <p className="text-xs text-muted-foreground text-center pt-1">
                            +{patient.appointments.length - 3} mais
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground text-center">Nenhum agendamento encontrado</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {periodFilteredPatients.length === 0 && (
        <Card className="py-12 text-center animate-fade-in">
          <CardContent>
            <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-lg font-medium">Nenhum paciente encontrado</p>
            <p className="text-muted-foreground mb-6">Tente ajustar os filtros de busca</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Paciente
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
