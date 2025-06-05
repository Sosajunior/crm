"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calendar,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Phone,
  Search,
  Plus,
  User,
  Mail,
  MessageSquare,
} from "lucide-react"
import { ActionModal } from "@/components/ui/action-modal"
import { DatePicker } from "@/components/ui/date-picker"
import { TimePicker } from "@/components/ui/time-picker"
import { FormSection } from "@/components/ui/form-section"
import { EnhancedTable } from "@/components/ui/enhanced-table"
import CalendarComponent from "./calender"

interface ScheduleMetricsProps {
  metrics: {
    totalAppointments: number
    confirmedAppointments: number
    pendingAppointments: number
    cancelledAppointments: number
    completedProcedures: number
    scheduledProcedures: number
    occupancyRate: number
    noShowRate: number
  }
  viewMode: "day" | "week" | "month"
}

type ModalType =
  | "newAppointment"
  | "pending"
  | "nextPatient"
  | "emergency"
  | "waitlist"
  | "noShow"
  | "reschedule"
  | null

export function ScheduleMetrics({ metrics, viewMode }: ScheduleMetricsProps) {
  // Provide default values if metrics is undefined
  const safeMetrics = {
    totalAppointments: 0,
    confirmedAppointments: 0,
    pendingAppointments: 0,
    cancelledAppointments: 0,
    completedProcedures: 0,
    scheduledProcedures: 0,
    occupancyRate: 0,
    noShowRate: 0,
    ...metrics,
  }

  const confirmationRate =
    safeMetrics.totalAppointments > 0
      ? ((safeMetrics.confirmedAppointments / safeMetrics.totalAppointments) * 100).toFixed(1)
      : "0.0"

  const completionRate =
    safeMetrics.completedProcedures + safeMetrics.scheduledProcedures > 0
      ? (
          (safeMetrics.completedProcedures / (safeMetrics.completedProcedures + safeMetrics.scheduledProcedures)) *
          100
        ).toFixed(1)
      : "0.0"

  // Single state to manage which modal is currently open
  const [activeModal, setActiveModal] = useState<ModalType>(null)

  // Form states
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>()
  const [selectedPatient, setSelectedPatient] = useState<any>(null)

  // Helper function to open a specific modal
  const openModal = (modalType: ModalType) => {
    setActiveModal(modalType)
  }

  // Helper function to close the active modal
  const closeModal = () => {
    setActiveModal(null)
    // Reset form states
    setSelectedDate(undefined)
    setSelectedTime(undefined)
    setSelectedPatient(null)
  }

  // Helper function to switch between modals
  const switchModal = (fromModal: ModalType, toModal: ModalType, patientData?: any) => {
    if (patientData) {
      setSelectedPatient(patientData)
    }
    setActiveModal(toModal)
  }

  // Action handlers
  const handleConfirmAppointment = (appointmentId: string) => {
    console.log(`Confirmando agendamento ${appointmentId}`)
    // In a real app, this would make an API call
    alert(`Agendamento ${appointmentId} confirmado com sucesso!`)
  }

  const handleRescheduleFromPending = (patientData: any) => {
    setSelectedPatient(patientData)
    switchModal("pending", "reschedule", patientData)
  }

  const handleCallPatient = (phone: string, patientName: string) => {
    console.log(`Ligando para ${patientName}: ${phone}`)
    // In a real app, this would integrate with a phone system
    alert(`Iniciando ligação para ${patientName} (${phone})`)
  }

  const handleWhatsAppContact = (phone: string, patientName: string) => {
    console.log(`Enviando WhatsApp para ${patientName}: ${phone}`)
    // In a real app, this would open WhatsApp or send a message
    const message = encodeURIComponent(
      `Olá ${patientName}, gostaríamos de reagendar sua consulta. Quando seria um bom horário para você?`,
    )
    window.open(`https://wa.me/${phone.replace(/\D/g, "")}?text=${message}`, "_blank")
  }

  const handleScheduleFromWaitlist = (patientData: any) => {
    setSelectedPatient(patientData)
    switchModal("waitlist", "newAppointment", patientData)
  }

  const handleStartTreatment = () => {
    console.log("Iniciando atendimento")
    alert("Atendimento iniciado! Redirecionando para o prontuário do paciente...")
    closeModal()
  }

  const handleScheduleEmergency = () => {
    console.log("Agendando emergência")
    alert("Emergência agendada com sucesso!")
    closeModal()
  }

  const handleScheduleAppointment = () => {
    console.log("Agendando nova consulta")
    alert("Consulta agendada com sucesso!")
    closeModal()
  }

  const handleConfirmReschedule = () => {
    console.log("Confirmando reagendamento")
    alert("Reagendamento confirmado com sucesso!")
    closeModal()
  }

  // Render the New Appointment Modal Content
  const renderNewAppointmentContent = () => (
    <div className="space-y-6">
      <FormSection title="Informações do Paciente">
        <div className="space-y-4">
          <div>
            <Label htmlFor="patient-search" className="text-sm font-medium text-slate-700">
              Paciente
            </Label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                id="patient-search"
                placeholder="Digite o nome do paciente..."
                className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                defaultValue={selectedPatient?.name || ""}
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">Novo Paciente</p>
                <p className="text-xs text-blue-600">Cadastrar durante o agendamento</p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-100">
              <Plus className="w-3 h-3 mr-1" />
              Cadastrar
            </Button>
          </div>
        </div>
      </FormSection>

      <FormSection title="Data e Horário">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-slate-700">Data da Consulta</Label>
            <DatePicker
              date={selectedDate}
              onDateChange={setSelectedDate}
              placeholder="Selecionar data"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-slate-700">Horário</Label>
            <TimePicker
              time={selectedTime}
              onTimeChange={setSelectedTime}
              placeholder="Selecionar horário"
              className="mt-1"
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Detalhes da Consulta">
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-slate-700">Tipo de Consulta</Label>
            <Select>
              <SelectTrigger className="mt-1 bg-slate-50 border-slate-200 focus:bg-white">
                <SelectValue placeholder="Selecionar tipo de consulta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inicial">Consulta Inicial</SelectItem>
                <SelectItem value="retorno">Retorno</SelectItem>
                <SelectItem value="limpeza">Limpeza Dental</SelectItem>
                <SelectItem value="restauracao">Restauração</SelectItem>
                <SelectItem value="canal">Tratamento de Canal</SelectItem>
                <SelectItem value="extracao">Extração</SelectItem>
                <SelectItem value="ortodontia">Ortodontia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700">Observações</Label>
            <Textarea
              placeholder="Adicione observações sobre a consulta..."
              className="mt-1 bg-slate-50 border-slate-200 focus:bg-white transition-colors resize-none"
              rows={3}
            />
          </div>
        </div>
      </FormSection>
    </div>
  )

  // Render the Pending Appointments Modal Content
  const renderPendingContent = () => (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-lg font-semibold text-slate-900">Agendamentos Pendentes</h4>
          <p className="text-sm text-slate-500">
            {safeMetrics.pendingAppointments} agendamentos aguardando confirmação
          </p>
        </div>
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 w-fit">
          {safeMetrics.pendingAppointments} Pendentes
        </Badge>
      </div>

      {/* Search Section */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <Input
          placeholder="Buscar por paciente ou procedimento..."
          className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
        />
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {[
          {
            id: "1",
            name: "João Santos",
            phone: "(11) 98765-4321",
            date: "15/06/2024",
            time: "14:30",
            procedure: "Consulta Inicial",
          },
          {
            id: "2",
            name: "Maria Oliveira",
            phone: "(11) 99876-5432",
            date: "15/06/2024",
            time: "15:00",
            procedure: "Limpeza Dental",
          },
          {
            id: "3",
            name: "Carlos Silva",
            phone: "(11) 97654-3210",
            date: "16/06/2024",
            time: "09:00",
            procedure: "Restauração",
          },
        ].map((appointment, index) => (
          <div
            key={index}
            className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Patient Info */}
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-slate-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h5 className="font-medium text-slate-900 truncate">{appointment.name}</h5>
                  <div className="flex items-center text-sm text-slate-500 mt-1">
                    <Phone className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span className="truncate">{appointment.phone}</span>
                  </div>
                </div>
              </div>

              {/* Date/Time Info */}
              <div className="flex items-center space-x-4 lg:space-x-6">
                <div className="text-center">
                  <div className="text-sm font-medium text-slate-900">{appointment.date}</div>
                  <div className="text-xs text-slate-500 flex items-center justify-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {appointment.time}
                  </div>
                </div>

                {/* Procedure */}
                <div className="hidden sm:block">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {appointment.procedure}
                  </Badge>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 flex-shrink-0">
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleConfirmAppointment(appointment.id)}
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    <span className="hidden sm:inline">Confirmar</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-slate-700 border-slate-200"
                    onClick={() => handleRescheduleFromPending(appointment)}
                  >
                    <Calendar className="w-3 h-3 mr-1" />
                    <span className="hidden sm:inline">Reagendar</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile Procedure Badge */}
            <div className="sm:hidden mt-3">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {appointment.procedure}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {safeMetrics.pendingAppointments === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-slate-400" />
          </div>
          <h5 className="text-lg font-medium text-slate-900 mb-2">Nenhum agendamento pendente</h5>
          <p className="text-slate-500">Todos os agendamentos foram confirmados!</p>
        </div>
      )}
    </div>
  )

  // Render the Next Patient Modal Content
  const renderNextPatientContent = () => (
    <div className="space-y-6">
      <FormSection title="Informações do Paciente">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xl mr-4">
                MS
              </div>
              <div>
                <h4 className="text-lg font-semibold text-slate-900">Maria Silva</h4>
                <p className="text-sm text-slate-600 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Consulta às 14:30 • Limpeza Dental
                </p>
                <p className="text-xs text-green-600 mt-1">Próximo atendimento em 15 minutos</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-200">Confirmado</Badge>
          </div>
        </div>
      </FormSection>

      <FormSection title="Detalhes">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <h5 className="font-medium text-slate-900 mb-3 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Informações do Paciente
              </h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Idade:</span>
                  <span className="font-medium text-slate-900">32 anos</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Telefone:</span>
                  <div className="flex items-center">
                    <span className="font-medium text-slate-900 mr-2">(11) 99999-9999</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={() => handleCallPatient("(11) 99999-9999", "Maria Silva")}
                    >
                      <Phone className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Email:</span>
                  <div className="flex items-center">
                    <span className="font-medium text-slate-900 mr-2">maria@email.com</span>
                    <Button size="icon" variant="ghost" className="h-6 w-6">
                      <Mail className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <h5 className="font-medium text-slate-900 mb-3 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Detalhes da Consulta
              </h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Duração:</span>
                  <span className="font-medium text-slate-900">45 minutos</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Valor:</span>
                  <span className="font-medium text-slate-900">R$ 120,00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Status:</span>
                  <Badge className="bg-green-100 text-green-800">Confirmado</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FormSection>

      <FormSection title="Observações">
        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
          <h5 className="font-medium text-slate-900 mb-2 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 text-amber-600" />
            Observações Importantes
          </h5>
          <p className="text-sm text-slate-700">
            Paciente relatou sensibilidade nos dentes anteriores. Verificar durante o procedimento e considerar uso de
            anestesia tópica.
          </p>
        </div>
      </FormSection>
    </div>
  )

  // Render the Emergency Modal Content
  const renderEmergencyContent = () => (
    <div className="space-y-6">
      <FormSection title="Slots de Emergência">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="font-medium text-purple-900 mb-2 flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Horários Disponíveis
          </h4>
          <p className="text-purple-800 text-sm mb-3">Selecione um horário disponível para hoje:</p>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-100">
              11:30 - 12:00
            </Button>
            <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-100">
              16:00 - 16:30
            </Button>
          </div>
        </div>
      </FormSection>

      <FormSection title="Informações do Paciente">
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input placeholder="Buscar paciente..." className="pl-10 bg-slate-50 border-slate-200 focus:bg-white" />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-1" />
            Novo
          </Button>
        </div>
      </FormSection>

      <FormSection title="Detalhes da Emergência">
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-slate-700">Tipo de Emergência</Label>
            <Select>
              <SelectTrigger className="mt-1 bg-slate-50 border-slate-200 focus:bg-white">
                <SelectValue placeholder="Selecionar tipo de emergência" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dor">Dor aguda</SelectItem>
                <SelectItem value="trauma">Trauma dental</SelectItem>
                <SelectItem value="infeccao">Inchaço/Infecção</SelectItem>
                <SelectItem value="sangramento">Sangramento</SelectItem>
                <SelectItem value="restauracao">Restauração perdida</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700">Descrição do Problema</Label>
            <Textarea
              placeholder="Descreva detalhadamente o problema do paciente..."
              className="mt-1 bg-slate-50 border-slate-200 focus:bg-white transition-colors resize-none"
              rows={3}
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700 mb-3 block">Nível de Urgência</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" className="flex-1 border-yellow-200 text-yellow-700 hover:bg-yellow-50">
                <div className="text-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-400 mx-auto mb-1"></div>
                  <span className="text-xs">Baixa</span>
                </div>
              </Button>
              <Button variant="outline" className="flex-1 border-orange-200 text-orange-700 hover:bg-orange-50">
                <div className="text-center">
                  <div className="w-3 h-3 rounded-full bg-orange-400 mx-auto mb-1"></div>
                  <span className="text-xs">Média</span>
                </div>
              </Button>
              <Button variant="outline" className="flex-1 border-red-200 text-red-700 hover:bg-red-50">
                <div className="text-center">
                  <div className="w-3 h-3 rounded-full bg-red-400 mx-auto mb-1"></div>
                  <span className="text-xs">Alta</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </FormSection>
    </div>
  )

  // Render the Waitlist Modal Content
  const renderWaitlistContent = () => (
    <div className="space-y-6">
      <FormSection title="Gerenciar Lista de Espera">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h4 className="text-sm font-medium text-slate-900">Pacientes Aguardando</h4>
            <p className="text-xs text-slate-500">5 pacientes aguardando agendamento</p>
          </div>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-1" />
            Adicionar Paciente
          </Button>
        </div>
      </FormSection>

      <FormSection title="Lista de Espera">
        <EnhancedTable searchable searchPlaceholder="Buscar na lista de espera...">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Paciente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Procedimento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Desde
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Prioridade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {[
                {
                  name: "Ana Costa",
                  procedure: "Limpeza",
                  since: "15/05/2024",
                  priority: "Alta",
                  phone: "(11) 91765-4321",
                },
                {
                  name: "Carlos Lima",
                  procedure: "Restauração",
                  since: "20/05/2024",
                  priority: "Média",
                  phone: "(11) 92765-4321",
                },
                {
                  name: "Lucia Oliveira",
                  procedure: "Avaliação",
                  since: "25/05/2024",
                  priority: "Baixa",
                  phone: "(11) 93765-4321",
                },
                {
                  name: "Pedro Alves",
                  procedure: "Canal",
                  since: "28/05/2024",
                  priority: "Alta",
                  phone: "(11) 94765-4321",
                },
                {
                  name: "Fernanda Santos",
                  procedure: "Extração",
                  since: "01/06/2024",
                  priority: "Média",
                  phone: "(11) 95765-4321",
                },
              ].map((patient, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mr-3">
                        <User className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{patient.name}</div>
                        <div className="text-sm text-slate-500 flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {patient.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {patient.procedure}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-900">{patient.since}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      className={
                        patient.priority === "Alta"
                          ? "bg-red-100 text-red-800 border-red-200"
                          : patient.priority === "Média"
                            ? "bg-orange-100 text-orange-800 border-orange-200"
                            : "bg-yellow-100 text-yellow-800 border-yellow-200"
                      }
                    >
                      {patient.priority}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handleScheduleFromWaitlist(patient)}
                    >
                      <Calendar className="w-3 h-3 mr-1" />
                      Agendar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </EnhancedTable>
      </FormSection>
    </div>
  )

  // Render the No Show Modal Content (REDESIGNED)
  const renderNoShowContent = () => (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-lg font-semibold text-slate-900">Pacientes Faltosos</h4>
          <p className="text-sm text-slate-500">
            {Math.round((safeMetrics.noShowRate / 100) * safeMetrics.totalAppointments)} pacientes faltaram às consultas
            recentemente
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 w-fit">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-red-900">Taxa de Faltas</p>
              <p className="text-xs text-red-700">{safeMetrics.noShowRate}% das consultas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <Input
          placeholder="Buscar pacientes faltosos..."
          className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
        />
      </div>

      {/* Patients List */}
      <div className="space-y-4">
        {[
          {
            id: "1",
            name: "Roberto Silva",
            date: "01/06/2024",
            procedure: "Consulta",
            phone: "(11) 91432-5678",
            missedCount: 2,
            lastContact: "30/05/2024",
          },
          {
            id: "2",
            name: "Mariana Costa",
            date: "31/05/2024",
            procedure: "Limpeza",
            phone: "(11) 92432-5678",
            missedCount: 1,
            lastContact: "01/06/2024",
          },
          {
            id: "3",
            name: "José Pereira",
            date: "30/05/2024",
            procedure: "Avaliação",
            phone: "(11) 93432-5678",
            missedCount: 3,
            lastContact: "28/05/2024",
          },
        ].map((patient, index) => (
          <div
            key={index}
            className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Patient Info */}
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 border border-red-200">
                  <User className="w-6 h-6 text-red-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h5 className="font-medium text-slate-900 truncate">{patient.name}</h5>
                    {patient.missedCount > 1 && (
                      <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">
                        {patient.missedCount} faltas
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-slate-500 mt-1">
                    <Phone className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span className="truncate">{patient.phone}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Último contato: {patient.lastContact}</div>
                </div>
              </div>

              {/* Appointment Info */}
              <div className="flex items-center space-x-4 lg:space-x-6">
                <div className="text-center">
                  <div className="text-sm font-medium text-slate-900">Falta em {patient.date}</div>
                  <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 mt-1">
                    {patient.procedure}
                  </Badge>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 flex-shrink-0">
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleCallPatient(patient.phone, patient.name)}
                  >
                    <Phone className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">Ligar</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-700 border-green-200 hover:bg-green-50"
                    onClick={() => handleWhatsAppContact(patient.phone, patient.name)}
                  >
                    <MessageSquare className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-blue-700 border-blue-200 hover:bg-blue-50"
                    onClick={() => handleRescheduleFromPending(patient)}
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">Reagendar</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Additional Info on Mobile */}
            <div className="sm:hidden mt-3 pt-3 border-t border-slate-100">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Faltas: {patient.missedCount}</span>
                <span>Último contato: {patient.lastContact}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {safeMetrics.noShowRate === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h5 className="text-lg font-medium text-slate-900 mb-2">Nenhuma falta registrada</h5>
          <p className="text-slate-500">Todos os pacientes compareceram às suas consultas!</p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
        <h5 className="font-medium text-slate-900 mb-3">Ações em Massa</h5>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" className="text-slate-700 border-slate-200">
            <MessageSquare className="h-3 w-3 mr-1" />
            Enviar WhatsApp para Todos
          </Button>
          <Button size="sm" variant="outline" className="text-slate-700 border-slate-200">
            <Calendar className="h-3 w-3 mr-1" />
            Reagendar em Lote
          </Button>
          <Button size="sm" variant="outline" className="text-slate-700 border-slate-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Marcar como Contatados
          </Button>
        </div>
      </div>
    </div>
  )

  // Render the Reschedule Modal Content
  const renderRescheduleContent = () => (
    <div className="space-y-6">
      <FormSection title="Buscar Agendamento">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Digite o nome do paciente ou número do agendamento..."
            className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
            defaultValue={selectedPatient?.name || ""}
          />
        </div>
      </FormSection>

      <FormSection title="Consulta Original">
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <h4 className="font-medium text-slate-900 mb-3 flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Detalhes da Consulta
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Paciente:</span>
                <span className="text-slate-900 font-medium">{selectedPatient?.name || "Maria Silva"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Data:</span>
                <span className="text-slate-900 font-medium">{selectedPatient?.date || "01/06/2024"}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Horário:</span>
                <span className="text-slate-900 font-medium">{selectedPatient?.time || "14:30"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Procedimento:</span>
                <span className="text-slate-900 font-medium">{selectedPatient?.procedure || "Consulta Inicial"}</span>
              </div>
            </div>
          </div>
        </div>
      </FormSection>

      <FormSection title="Nova Data e Horário">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-slate-700">Nova Data</Label>
            <DatePicker
              date={selectedDate}
              onDateChange={setSelectedDate}
              placeholder="Selecionar nova data"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-slate-700">Novo Horário</Label>
            <TimePicker
              time={selectedTime}
              onTimeChange={setSelectedTime}
              placeholder="Selecionar novo horário"
              className="mt-1"
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Motivo e Observações">
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-slate-700">Motivo do Reagendamento</Label>
            <Select>
              <SelectTrigger className="mt-1 bg-slate-50 border-slate-200 focus:bg-white">
                <SelectValue placeholder="Selecionar motivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paciente">Solicitação do paciente</SelectItem>
                <SelectItem value="profissional">Indisponibilidade do profissional</SelectItem>
                <SelectItem value="emergencia">Emergência</SelectItem>
                <SelectItem value="falta">Falta anterior</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700">Observações</Label>
            <Textarea
              placeholder="Adicione observações sobre o reagendamento..."
              className="mt-1 bg-slate-50 border-slate-200 focus:bg-white transition-colors resize-none"
              rows={2}
            />
          </div>
        </div>
      </FormSection>
    </div>
  )

  // Get modal configuration based on active modal type
  const getModalConfig = () => {
    switch (activeModal) {
      case "newAppointment":
        return {
          title: "Novo Agendamento",
          content: renderNewAppointmentContent(),
          size: "lg" as const,
          footer: (
            <>
              <Button variant="outline" onClick={closeModal}>
                Cancelar
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleScheduleAppointment}>
                <Calendar className="w-4 h-4 mr-1" />
                Agendar Consulta
              </Button>
            </>
          ),
        }
      case "pending":
        return {
          title: "Confirmar Agendamentos Pendentes",
          content: renderPendingContent(),
          size: "xl" as const,
          footer: (
            <Button variant="outline" onClick={closeModal}>
              Fechar
            </Button>
          ),
        }
      case "nextPatient":
        return {
          title: "Próximo Paciente",
          content: renderNextPatientContent(),
          size: "lg" as const,
          footer: (
            <>
              <Button variant="outline" className="border-slate-200 text-slate-700 mr-auto">
                <User className="w-4 h-4 mr-1" />
                Ver Histórico
              </Button>
              <Button variant="outline" onClick={closeModal}>
                Fechar
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleStartTreatment}>
                <CheckCircle className="w-4 h-4 mr-1" />
                Iniciar Atendimento
              </Button>
            </>
          ),
        }
      case "emergency":
        return {
          title: "Atendimento de Emergência",
          content: renderEmergencyContent(),
          size: "lg" as const,
          footer: (
            <>
              <Button variant="outline" onClick={closeModal}>
                Cancelar
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleScheduleEmergency}>
                <AlertCircle className="w-4 h-4 mr-1" />
                Agendar Emergência
              </Button>
            </>
          ),
        }
      case "waitlist":
        return {
          title: "Lista de Espera",
          content: renderWaitlistContent(),
          size: "xl" as const,
          footer: (
            <Button variant="outline" onClick={closeModal}>
              Fechar
            </Button>
          ),
        }
      case "noShow":
        return {
          title: "Contatar Pacientes Faltosos",
          content: renderNoShowContent(),
          size: "xl" as const,
          footer: (
            <Button variant="outline" onClick={closeModal}>
              Fechar
            </Button>
          ),
        }
      case "reschedule":
        return {
          title: "Reagendar Consulta",
          content: renderRescheduleContent(),
          size: "lg" as const,
          footer: (
            <>
              <Button variant="outline" onClick={closeModal}>
                Cancelar
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleConfirmReschedule}>
                <Calendar className="w-4 h-4 mr-1" />
                Confirmar Reagendamento
              </Button>
            </>
          ),
        }
      default:
        return {
          title: "",
          content: null,
          size: "md" as const,
          footer: null,
        }
    }
  }

  const modalConfig = getModalConfig()

  return (
    <div >
      {/* Total Appointments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Agendamentos</p>
                <p className="text-2xl font-bold text-foreground">{safeMetrics.totalAppointments}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 text-success-foreground mr-1" />
                  <span className="text-xs text-success-foreground">+12%</span>
                </div>
              </div>
              <div className="p-3 bg-info-muted rounded-full">
                <Calendar className="w-6 h-6 text-info-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Confirmed Appointments */}
      <Card className="card-hover">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Confirmados</p>
              <p className="text-2xl font-bold text-foreground">{safeMetrics.confirmedAppointments}</p>
              <div className="flex items-center mt-1">
                <Badge className="bg-success-muted text-success-foreground text-xs">{confirmationRate}%</Badge>
              </div>
            </div>
            <div className="p-3 bg-success-muted rounded-full">
              <CheckCircle className="w-6 h-6 text-success-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Occupancy Rate */}
      <Card className="card-hover">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Taxa de Ocupação</p>
              <p className="text-2xl font-bold text-foreground">{safeMetrics.occupancyRate}%</p>
              <div className="flex items-center mt-1">
                {safeMetrics.occupancyRate >= 80 ? (
                  <TrendingUp className="w-3 h-3 text-success-foreground mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-warning-foreground mr-1" />
                )}
                <span
                  className={`text-xs ${safeMetrics.occupancyRate >= 80 ? "text-success-foreground" : "text-warning-foreground"}`}
                >
                  {safeMetrics.occupancyRate >= 80 ? "Excelente" : "Moderado"}
                </span>
              </div>
            </div>
            <div className="p-3 bg-pending-muted rounded-full">
              <Users className="w-6 h-6 text-pending-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Procedures */}
      <Card className="card-hover">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Procedimentos</p>
              <p className="text-2xl font-bold text-foreground">
                {safeMetrics.completedProcedures + safeMetrics.scheduledProcedures}
              </p>
              <div className="flex items-center mt-1">
                <Badge className="bg-info-muted text-info-foreground text-xs">{completionRate}% concluídos</Badge>
              </div>
            </div>
            <div className="p-3 bg-warning-muted rounded-full">
              <Clock className="w-6 h-6 text-warning-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
      
      

      

      {/* Enhanced Financial Overview Section */}
      <div className="w-full  p-4 md:p-6">
        <CalendarComponent />
      </div>

      {/* Render the ActionModal with dynamic content */}
      {activeModal && (
        <ActionModal
          isOpen={!!activeModal}
          onClose={closeModal}
          title={modalConfig.title}
          size={modalConfig.size}
          footer={modalConfig.footer}
        >
          {modalConfig.content}
        </ActionModal>
      )}
    </div>
  )
}
