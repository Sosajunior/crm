"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Bell, Plus, Settings } from "lucide-react" // Activity removido pois StatusBadge tem seu próprio
import { Sidebar } from "@/components/modern-sidebar"
import { DashboardOverview } from "@/components/dashboard-overview"
import { PatientManagement } from "@/components/patient-management"
import { FunnelAnalysis } from "@/components/funnel-analysis"
import { FinancialOverview } from "@/components/financial-overview"
import { ScheduleManagement } from "@/components/schedule-management"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { NewPatientModal } from "@/components/new-patient-modal"
import { SettingsModal } from "@/components/settings-modal"
import { PatientProfile } from "@/components/patient-profile"

// --- INÍCIO DAS INTERFACES (Idealmente em types/index.ts) ---
export interface MetricValues {
  atendimentosIniciados: number;
  duvidasSanadas: number;
  procedimentosOferecidos: number;
  agendamentosRealizados: number;
  confirmacoesAgendamento: number;
  comparecimentos: number;
  procedimentosRealizados: number;
  faturamento: number;
  gastos: number;
  lucro: number;
}

export interface PatientAppointment {
  id?: string;
  date: string; // ISO string
  time?: string; // HH:mm
  type: string;
  status: string;
  value?: number;
}

export interface PatientProcedure {
  id?: string;
  date: string; // YYYY-MM-DD
  name: string;
  status: string;
  value: number;
  cost: number;
  profit: number;
  category?: string;
  margin?: number;
}

export interface PatientListItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastContact: string | null;
  funnelStage: string;
  status: string;
  avatar?: string | null;
  nextAppointment?: string | null;
  totalValue?: number;
  procedures?: number; // contagem
}

export interface PatientDetail extends PatientListItem {
  birthDate?: string | null;
  address?: string | null;
  city?: string | null;
  zipCode?: string | null;
  emergencyContact?: string | null;
  emergencyPhone?: string | null;
  medicalHistory?: string | null;
  allergies?: string | null;
  medications?: string | null;
  insuranceProvider?: string | null;
  insuranceNumber?: string | null;
  preferredContact?: string | null;
  notes?: string | null;
  createdAt?: string;
  appointments: PatientAppointment[];
  procedures: PatientProcedure[]; // Anteriormente procedureHistory
  totalSpent: number;
  totalProfit: number;
}

export interface NotificationItem {
  id: string;
  type: "info" | "warning" | "success" | "error" | "reminder";
  title: string;
  message: string;
  time: string; // "X min atrás"
  read: boolean;
  createdAt?: string;
}

export interface ClinicSettings {
    clinicName?: string;
    doctorName?: string;
    email?: string;
    phone?: string;
    address?: string;
    cro?: string;
    specialty?: string;
    emailNotifications?: boolean;
    smsNotifications?: boolean;
    whatsappNotifications?: boolean;
    appointmentReminders?: boolean;
    reminderTime?: string;
    theme?: string;
    language?: string;
    dateFormat?: string;
    timeFormat?: string;
    currency?: string;
    workingHours?: any;
    appointmentDuration?: string;
    bufferTime?: string;
    maxAdvanceBooking?: string;
    taxRate?: string;
    paymentMethods?: any;
    sessionTimeout?: string;
    dataRetention?: string;
}
// --- FIM DAS INTERFACES ---

export default function ModernDentalCRM() {
  const [activeView, setActiveView] = useState("patients");
  const [selectedPeriod, setSelectedPeriod] = useState("today");

  const [currentMetrics, setCurrentMetrics] = useState<MetricValues | null>(null);
  const [patients, setPatients] = useState<PatientListItem[]>([]);
  const [selectedPatientDetail, setSelectedPatientDetail] = useState<PatientDetail | null>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [currentSettings, setCurrentSettings] = useState<ClinicSettings | null>(null);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({
    metrics: true,
    patients: true,
    notifications: true,
    settings: true,
    selectedPatient: false,
  });

  const setLoading = (key: string, value: boolean) => {
    setIsLoading(prev => ({ ...prev, [key]: value }));
  };

  const fetchMetrics = useCallback(async (period: string) => {
    setLoading("metrics", true);
    try {
      const response = await fetch(`/api/metrics?period=${period}`);
      if (!response.ok) throw new Error(`Metrics API error! status: ${response.status}`);
      const data = await response.json();
      setCurrentMetrics(data.metrics);
    } catch (error) {
      console.error("Error fetching metrics:", error);
      setCurrentMetrics(null);
    } finally {
      setLoading("metrics", false);
    }
  }, []);

  const fetchPatients = useCallback(async (period: string, searchTerm: string = "") => {
    setLoading("patients", true);
    try {
      const response = await fetch(`/api/patients?period=${period}&search=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) throw new Error(`Patients API error! status: ${response.status}`);
      const data = await response.json();
      setPatients(data.patients || []);
    } catch (error) {
      console.error("Error fetching patients:", error);
      setPatients([]);
    } finally {
      setLoading("patients", false);
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    setLoading("notifications", true);
    try {
      const response = await fetch('/api/notifications');
      if (!response.ok) throw new Error(`Notifications API error! status: ${response.status}`);
      const data = await response.json();
      setNotifications(data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    } finally {
      setLoading("notifications", false);
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    setLoading("settings", true);
    try {
      const response = await fetch('/api/settings');
      if (!response.ok) throw new Error(`Settings API error! status: ${response.status}`);
      const data: ClinicSettings = await response.json();
      setCurrentSettings(data || {});
    } catch (error) {
      console.error("Error fetching settings:", error);
      setCurrentSettings({});
    } finally {
      setLoading("settings", false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics(selectedPeriod);
  }, [selectedPeriod, fetchMetrics]);

  useEffect(() => {
    if (activeView === "patients" || activeView === "dashboard") {
      fetchPatients(selectedPeriod);
    }
  }, [activeView, selectedPeriod, fetchPatients]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, { method: 'PUT' });
      if (!response.ok) throw new Error('Failed to mark as read');
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (error) { console.error("Error marking notification as read:", error); }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read', { method: 'PUT' });
      if (!response.ok) throw new Error('Failed to mark all as read');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) { console.error("Error marking all notifications as read:", error); }
  };

  const handleDismissNotification = async (id: string) => {
     try {
      const response = await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to dismiss notification');
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) { console.error("Error dismissing notification:", error); }
  };

  const handleSaveNewPatient = async (patientData: Omit<PatientDetail, 'id' | 'appointments' | 'procedures' | 'totalSpent' | 'totalProfit' | 'lastContact' | 'funnelStage' | 'status' | 'avatar' | 'nextAppointment' | 'totalValue' | 'proceduresCount' | 'createdAt'>) => {
    try {
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || 'Failed to save patient');
      setPatients(prev => [result.patient, ...prev]);
      setShowNewPatientModal(false);
      alert("Paciente cadastrado com sucesso!");
    } catch (error) {
      console.error("Error saving new patient:", error);
      alert(`Erro: ${error.message}`);
    }
  };

  const handleSaveSettings = async (settingsData: ClinicSettings) => {
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsData),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || 'Failed to save settings');
      setCurrentSettings(result.settings);
      alert("Configurações salvas com sucesso!");
      setShowSettingsModal(false);
    } catch (error) {
      console.error("Error saving settings:", error);
      alert(`Erro: ${error.message}`);
    }
  };

  const handleSelectPatient = async (patientListItem: PatientListItem) => {
    if (!patientListItem?.id) { setSelectedPatientDetail(null); return; }
    setLoading("selectedPatient", true);
    try {
      const response = await fetch(`/api/patients/${patientListItem.id}`);
      if (!response.ok) throw new Error(`Failed to fetch patient details for ${patientListItem.name}`);
      const data = await response.json();
      setSelectedPatientDetail(data.patient as PatientDetail);
    } catch (error) {
      console.error(error);
      setSelectedPatientDetail(null);
      alert(`Erro ao carregar detalhes: ${error.message}`);
    } finally {
      setLoading("selectedPatient", false);
    }
  };

  const renderContent = () => {
    if (activeView === "patients" && selectedPatientDetail) {
        if (isLoading.selectedPatient) return <div className="flex justify-center items-center h-64"><p>Carregando perfil do paciente...</p></div>;
        return <PatientProfile patient={selectedPatientDetail} onBack={() => setSelectedPatientDetail(null)} />;
    }

    switch (activeView) {
      case "dashboard":
        if (isLoading.metrics || !currentMetrics) return <div className="flex justify-center items-center h-64"><p>Carregando dashboard...</p></div>;
        return <DashboardOverview metrics={currentMetrics} period={selectedPeriod} />;
      case "patients":
        if (isLoading.patients) return <div className="flex justify-center items-center h-64"><p>Carregando pacientes...</p></div>;
        return <PatientManagement patients={patients} onSelectPatient={handleSelectPatient} selectedPeriod={selectedPeriod} />;
      case "schedule":
        return <ScheduleManagement selectedPeriod={selectedPeriod} />; // Este componente gerenciará seu próprio estado de dados
      case "funnel":
        if (isLoading.metrics || !currentMetrics) return <div className="flex justify-center items-center h-64"><p>Carregando análise de funil...</p></div>;
        return <FunnelAnalysis metrics={currentMetrics} period={selectedPeriod} />;
      case "financial":
        if (isLoading.metrics || !currentMetrics) return <div className="flex justify-center items-center h-64"><p>Carregando financeiro...</p></div>;
        return <FinancialOverview metrics={currentMetrics} period={selectedPeriod} />;
      default:
        return <div className="flex justify-center items-center h-64"><p>Selecione uma visualização.</p></div>;
    }
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar
        activeView={activeView}
        onViewChange={(view) => {
          setSelectedPatientDetail(null);
          setActiveView(view);
        }}
        onSettingsClick={() => {
            if (!currentSettings) fetchSettings(); // Busca apenas se ainda não carregou
            setShowSettingsModal(true);
        }}
      />

      <div className="md:ml-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 md:px-6">
          <div className="flex flex-1 items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                {activeView === "dashboard" && "Dashboard Principal"}
                {activeView === "patients" && (selectedPatientDetail ? selectedPatientDetail.name : "Pacientes")}
                {activeView === "schedule" && "Agenda e Métricas"}
                {activeView === "funnel" && "Análise de Funil"}
                {activeView === "financial" && "Visão Financeira"}
              </h1>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <div className="hidden md:flex bg-muted rounded-md p-1">
                {["today", "week", "month"].map((p) => (
                  <Button
                    key={p}
                    variant={selectedPeriod === p ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedPeriod(p)}
                    className={`text-xs px-3 py-1 h-8 ${selectedPeriod === p ? 'shadow-sm text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}
                  >
                    {p === "today" && "Hoje"}
                    {p === "week" && "Semana"}
                    {p === "month" && "Mês"}
                  </Button>
                ))}
              </div>

              <Button size="sm" className="hidden md:flex bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setShowNewPatientModal(true)}>
                <Plus className="h-4 w-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Novo Paciente</span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-4 w-4" />
                {unreadNotificationsCount > 0 && (
                   <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {unreadNotificationsCount}
                  </span>
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                    if (!currentSettings && !isLoading.settings) fetchSettings();
                    setShowSettingsModal(true);
                }}
                className="hidden md:flex h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6">
          {renderContent()}
        </main>
      </div>

      {showNotifications && (
        <NotificationsDropdown
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onDismiss={handleDismissNotification}
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
        />
      )}

      <NewPatientModal
        isOpen={showNewPatientModal}
        onClose={() => setShowNewPatientModal(false)}
        onSave={handleSaveNewPatient}
      />

      {showSettingsModal && (
        <SettingsModal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          onSave={handleSaveSettings}
          // Passa as configurações atuais para o modal. O modal deve lidar com o estado de isLoadingSettings se necessário.
          // Ou você pode adicionar um spinner aqui: isLoading.settings ? <Spinner/> : <SettingsModal ... />
          initialSettings={currentSettings}
        />
      )}
    </div>
  );
}