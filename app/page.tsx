"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { Bell, Activity, Plus, Settings } from "lucide-react"
import { Sidebar } from "@/components/modern-sidebar"
import { DashboardOverview } from "@/components/dashboard-overview"
import { PatientManagement } from "@/components/patient-management"
import { FunnelAnalysis } from "@/components/funnel-analysis"
import { FinancialOverview } from "@/components/financial-overview"
import { ScheduleManagement } from "@/components/schedule-management"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { NewPatientModal } from "@/components/new-patient-modal"
import { SettingsModal } from "@/components/settings-modal"

// Mock data
const mockData = {
  today: {
    atendimentosIniciados: 12,
    duvidasSanadas: 8,
    procedimentosOferecidos: 6,
    agendamentosRealizados: 4,
    confirmacoesAgendamento: 3,
    comparecimentos: 2,
    procedimentosRealizados: 1,
    faturamento: 850.0,
    gastos: 320.0,
    lucro: 530.0,
  },
  week: {
    atendimentosIniciados: 85,
    duvidasSanadas: 68,
    procedimentosOferecidos: 45,
    agendamentosRealizados: 32,
    confirmacoesAgendamento: 28,
    comparecimentos: 24,
    procedimentosRealizados: 18,
    faturamento: 15300.0,
    gastos: 5940.0,
    lucro: 9360.0,
  },
  month: {
    atendimentosIniciados: 340,
    duvidasSanadas: 285,
    procedimentosOferecidos: 198,
    agendamentosRealizados: 145,
    confirmacoesAgendamento: 128,
    comparecimentos: 112,
    procedimentosRealizados: 89,
    faturamento: 67500.0,
    gastos: 25650.0,
    lucro: 41850.0,
  },
}

const mockPatients = [
  {
    id: "1",
    name: "Maria Silva",
    email: "maria.silva@email.com",
    phone: "(11) 99999-9999",
    lastContact: new Date().toISOString().split("T")[0], // Today's date
    funnelStage: "procedimento_realizado",
    avatar: "MS",
    status: "active",
    nextAppointment: "2024-02-15",
    totalValue: 1250.0,
    procedures: 3,
    appointments: [
      { date: "2024-01-15", time: "14:30", type: "Limpeza", status: "realizado", value: 150 },
      { date: "2024-01-10", time: "10:00", type: "Consulta", status: "realizado", value: 100 },
    ],
    procedureHistory: [
      { date: "2024-01-15", name: "Limpeza Dental", status: "concluído", value: 150, cost: 45, profit: 105 },
      { date: "2024-01-10", name: "Avaliação Inicial", status: "concluído", value: 100, cost: 25, profit: 75 },
      { date: "2024-01-05", name: "Consulta Inicial", status: "concluído", value: 80, cost: 20, profit: 60 },
    ],
    totalSpent: 1250.0,
    totalProfit: 850.0,
  },
  {
    id: "2",
    name: "João Santos",
    email: "joao.santos@email.com",
    phone: "(11) 88888-8888",
    lastContact: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0], // Yesterday
    funnelStage: "agendamento_confirmado",
    avatar: "JS",
    status: "pending",
    nextAppointment: "2024-01-20",
    totalValue: 0,
    procedures: 0,
    appointments: [{ date: "2024-01-20", time: "15:00", type: "Consulta", status: "confirmado", value: 100 }],
    procedureHistory: [],
    totalSpent: 0,
    totalProfit: 0,
  },
  {
    id: "3",
    name: "Ana Costa",
    email: "ana.costa@email.com",
    phone: "(11) 77777-7777",
    lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 2 days ago
    funnelStage: "duvida_sanada",
    avatar: "AC",
    status: "active",
    nextAppointment: "2024-01-25",
    totalValue: 800.0,
    procedures: 2,
    appointments: [{ date: "2024-01-25", time: "09:30", type: "Avaliação", status: "confirmado", value: 120 }],
    procedureHistory: [
      { date: "2024-01-12", name: "Consulta Inicial", status: "concluído", value: 80, cost: 20, profit: 60 },
      { date: "2024-01-18", name: "Radiografia", status: "concluído", value: 120, cost: 30, profit: 90 },
    ],
    totalSpent: 800.0,
    totalProfit: 600.0,
  },
]

export default function ModernDentalCRM() {
  const [activeView, setActiveView] = useState("patients")
  const [selectedPeriod, setSelectedPeriod] = useState("today")
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "info",
      title: "Novo agendamento",
      message: "Maria Silva agendou consulta para amanhã",
      time: "5 min atrás",
      read: false,
    },
    {
      id: 2,
      type: "warning",
      title: "Confirmação pendente",
      message: "João Santos precisa confirmar consulta",
      time: "1 hora atrás",
      read: false,
    },
    {
      id: 3,
      type: "success",
      title: "Procedimento concluído",
      message: "Limpeza dental finalizada com sucesso",
      time: "2 horas atrás",
      read: true,
    },
  ])
  const [showNotifications, setShowNotifications] = useState(false)
  const [showNewPatientModal, setShowNewPatientModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  const handleMarkAsRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const handleDismissNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const handleSaveNewPatient = (patientData: any) => {
    console.log("Saving new patient:", patientData)
    // In a real app, this would make an API call
    alert("Paciente cadastrado com sucesso!")
  }

  const handleSaveSettings = (settingsData: any) => {
    console.log("Saving settings:", settingsData)
    // In a real app, this would make an API call
    alert("Configurações salvas com sucesso!")
  }

  const currentMetrics = mockData[selectedPeriod]

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardOverview metrics={currentMetrics} period={selectedPeriod} />
      case "patients":
        return (
          <PatientManagement
            patients={mockPatients}
            onSelectPatient={setSelectedPatient}
            selectedPeriod={selectedPeriod}
            onNewPatient={() => setShowNewPatientModal(true)}
          />
        )
      case "schedule":
        return <ScheduleManagement selectedPeriod={selectedPeriod} />
      case "funnel":
        return <FunnelAnalysis metrics={currentMetrics} period={selectedPeriod} />
      case "financial":
        return <FinancialOverview metrics={currentMetrics} period={selectedPeriod} />
      default:
        return (
          <PatientManagement
            patients={mockPatients}
            onSelectPatient={setSelectedPatient}
            selectedPeriod={selectedPeriod}
            onNewPatient={() => setShowNewPatientModal(true)}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        onSettingsClick={() => setShowSettingsModal(true)}
      />

      {/* Main Content */}
      <div className="md:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
          <div className="flex flex-1 items-center justify-between">
            <div>
              <h1 className="text-lg font-medium">
                {activeView === "dashboard" && "Dashboard"}
                {activeView === "patients" && "Pacientes"}
                {activeView === "schedule" && "Agenda"}
                {activeView === "funnel" && "Análise de Funil"}
                {activeView === "financial" && "Financeiro"}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {/* Period Selector */}
              <div className="hidden md:flex bg-secondary rounded-lg p-1">
                {["today", "week", "month"].map((period) => (
                  <Button
                    key={period}
                    variant={selectedPeriod === period ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedPeriod(period)}
                    className="text-xs"
                  >
                    {period === "today" && "Hoje"}
                    {period === "week" && "Semana"}
                    {period === "month" && "Mês"}
                  </Button>
                ))}
              </div>

              {/* Quick Actions */}
              <Button size="sm" className="hidden md:flex" onClick={() => setShowNewPatientModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Paciente
              </Button>

              {/* Notifications */}
              <Button
                variant="outline"
                size="icon"
                className="relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {notifications.filter((n) => !n.read).length}
                </span>
              </Button>

              {/* Settings */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowSettingsModal(true)}
                className="hidden md:flex"
              >
                <Settings className="h-4 w-4" />
              </Button>

              {/* Status */}
              <StatusBadge variant="success" className="hidden md:flex">
                <Activity className="h-3 w-3 mr-1" />
                Online
              </StatusBadge>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-6">
          <div className="mx-auto max-w-7xl">{renderContent()}</div>
        </main>
      </div>

      {/* Notifications Dropdown */}
      <NotificationsDropdown
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onDismiss={handleDismissNotification}
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      {/* New Patient Modal */}
      <NewPatientModal
        isOpen={showNewPatientModal}
        onClose={() => setShowNewPatientModal(false)}
        onSave={handleSaveNewPatient}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        onSave={handleSaveSettings}
      />
    </div>
  )
}
