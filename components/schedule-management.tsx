"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, ChevronLeft, ChevronRight, RefreshCw, Download, Settings } from "lucide-react"
import { ScheduleMetrics } from "@/components/schedule-metrics"
import { AppointmentsList } from "@/components/appointments-list"
import { ProceduresScheduleList } from "@/components/procedures-schedule-list" // Nome corrigido
import { CalendarView } from "@/components/calendar-view"
import { NewPatientModal } from "@/components/new-patient-modal" // Para o botão de Novo Agendamento

// Interfaces (podem vir de types/index.ts)
interface ScheduleMetricData { // Específico para ScheduleMetrics
  totalAppointments: number;
  confirmedAppointments: number;
  pendingAppointments: number;
  cancelledAppointments: number;
  completedProcedures: number;
  scheduledProcedures: number;
  occupancyRate: number;
  noShowRate: number;
}
export interface AppointmentItem { // Para AppointmentsList
  id: string;
  time: string;
  dateFull: string;
  patient: string;
  phone: string;
  type: string;
  status: string;
  duration: number;
  notes?: string;
}
export interface ProcedureScheduleItem { // Para ProceduresScheduleList
  id: string;
  time: string;
  dateFull: string;
  patient: string;
  procedure: string;
  status: string;
  duration: number;
  value?: number;
  profit?: number;
  notes?: string;
}
// Para NewPatientModal
interface PatientFormData { name: string; email: string; phone: string; /* ... outros campos */ }


interface ScheduleManagementProps {
  selectedPeriod: string; // "today", "week", "month" - usado para definir o viewMode inicial
}

export function ScheduleManagement({ selectedPeriod: initialPeriod }: ScheduleManagementProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">(initialPeriod === "today" ? "day" : initialPeriod as "week" | "month");
  const [activeTab, setActiveTab] = useState("overview");

  const [scheduleMetrics, setScheduleMetrics] = useState<ScheduleMetricData | null>(null);
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [procedures, setProcedures] = useState<ProcedureScheduleItem[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  // const [showNewProcedureModal, setShowNewProcedureModal] = useState(false); // Se houver um modal para isso

  const fetchDataForSchedule = useCallback(async () => {
    setIsLoading(true);
    const dateParam = selectedDate.toISOString().split('T')[0];
    try {
      // Fetch Metrics for Schedule
      const metricsRes = await fetch(`/api/metrics?period=${viewMode}&date=${dateParam}`); // Supondo que API de métricas aceita uma data específica
      if (!metricsRes.ok) throw new Error('Failed to fetch schedule metrics');
      const metricsData = await metricsRes.json();
      // A API de /api/metrics retorna um objeto { metrics: {...} }, precisamos adaptar
      // Para ScheduleMetrics, precisamos de uma estrutura diferente, então adaptaremos ou criaremos um endpoint específico
      // Por agora, vamos simular uma adaptação:
      setScheduleMetrics({
        totalAppointments: metricsData.metrics?.agendamentosRealizados || 0,
        confirmedAppointments: metricsData.metrics?.confirmacoesAgendamento || 0,
        pendingAppointments: (metricsData.metrics?.agendamentosRealizados || 0) - (metricsData.metrics?.confirmacoesAgendamento || 0) - (metricsData.metrics?.comparecimentos || 0) - (metricsData.metrics?.cancelledAppointments || 0), // Estimativa
        cancelledAppointments: metricsData.metrics?.cancelledAppointments || 0, // Supondo que a API de métricas tenha este campo
        completedProcedures: metricsData.metrics?.procedimentosRealizados || 0,
        scheduledProcedures: (metricsData.metrics?.procedimentosOferecidos || 0) - (metricsData.metrics?.procedimentosRealizados || 0), // Estimativa
        occupancyRate: metricsData.metrics?.occupancyRate || 75, // Supondo que a API de métricas tenha este campo
        noShowRate: metricsData.metrics?.noShowRate || 10, // Supondo que a API de métricas tenha este campo
      });


      // Fetch Appointments for the selected date/viewMode
      const appointmentsRes = await fetch(`/api/appointments?date=${dateParam}&viewMode=${viewMode}`);
      if (!appointmentsRes.ok) throw new Error('Failed to fetch appointments');
      const appointmentsData = await appointmentsRes.json();
      setAppointments(appointmentsData);

      // Fetch Procedures for the selected date/viewMode
      const proceduresRes = await fetch(`/api/procedures/performed?date=${dateParam}&viewMode=${viewMode}`); // Assumindo que a API aceita viewMode
      if (!proceduresRes.ok) throw new Error('Failed to fetch procedures');
      const proceduresData = await proceduresRes.json();
      // Adaptar a resposta da API de procedures/performed para ProcedureScheduleItem
       setProcedures(proceduresData.map(p => ({
        id: p.id,
        time: new Date(p.date).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'}), // Supondo que p.date tem hora
        dateFull: p.date,
        patient: p.patientName,
        procedure: p.procedureName,
        status: p.status,
        duration: p.defaultDurationMinutes || 60, // Precisaria buscar do catalog ou ter no performed
        value: p.value,
        profit: p.profit,
        notes: p.notes,
      })));


    } catch (error) {
      console.error("Error fetching schedule data:", error);
      setScheduleMetrics(null);
      setAppointments([]);
      setProcedures([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, viewMode]);

  useEffect(() => {
    fetchDataForSchedule();
  }, [fetchDataForSchedule]);


  const handleDateChangeFromCalendar = (date: Date) => {
    setSelectedDate(date);
    setViewMode("day"); // Ao selecionar um dia específico no calendário, mudar para visualização diária
  };


  const handleSaveNewAppointment = async (appointmentData: any) => {
    // Lógica para chamar API POST /api/appointments
    console.log("Saving new appointment:", appointmentData);
    try {
        const response = await fetch('/api/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appointmentData)
        });
        if (!response.ok) throw new Error("Failed to create appointment");
        fetchDataForSchedule(); // Re-fetch data
        setShowNewAppointmentModal(false);
        alert("Agendamento criado com sucesso!");
    } catch (error) {
        console.error("Error creating appointment:", error);
        alert("Erro ao criar agendamento.");
    }
  };

  const handleExportData = async () => {/* ... */};
  const handleRefreshData = () => fetchDataForSchedule();
  const handleGoToToday = () => setSelectedDate(new Date());

  const formatDate = (date: Date, mode: "day" | "week" | "month") => {
    if (mode === "day") return date.toLocaleDateString("pt-BR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    if (mode === "week") {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1)); // Seg
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Dom
        return `Semana de ${startOfWeek.toLocaleDateString("pt-BR", {day:'numeric', month:'short'})} à ${endOfWeek.toLocaleDateString("pt-BR", {day:'numeric', month:'short', year: 'numeric'})}`;
    }
    return date.toLocaleDateString("pt-BR", { year: "numeric", month: "long" });
  };

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    if (viewMode === "day") newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
    else if (viewMode === "week") newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    else newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    setSelectedDate(newDate);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Gerenciamento de Agenda</h2>
          <p className="text-sm text-muted-foreground">Controle completo de agendamentos e procedimentos</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleGoToToday} disabled={isLoading}>Hoje</Button>
          <Button variant="outline" size="sm" onClick={handleRefreshData} disabled={isLoading}>
            <RefreshCw className={`w-3 h-3 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Atualizando..." : "Atualizar"}
          </Button>
          {/* <Button variant="outline" size="sm" onClick={handleExportData} disabled={isLoading}>
            <Download className="w-3 h-3 mr-2" /> Exportar
          </Button> */}
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setShowNewAppointmentModal(true)} disabled={isLoading}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Agendamento
          </Button>
        </div>
      </div>

      <Card className="card-hover">
        <CardContent className="p-3 md:p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center">
              <Button variant="outline" size="icon" onClick={() => navigateDate("prev")} className="h-9 w-9 hover:bg-accent mr-2 md:mr-4">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="text-center min-w-[200px] md:min-w-[280px]">
                <h3 className="text-base md:text-lg font-semibold text-foreground capitalize truncate">
                  {formatDate(selectedDate, viewMode)}
                </h3>
              </div>
              <Button variant="outline" size="icon" onClick={() => navigateDate("next")} className="h-9 w-9 hover:bg-accent ml-2 md:ml-4">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex bg-muted rounded-md p-1">
              {(["day", "week", "month"] as const).map((mode) => (
                <Button
                  key={mode}
                  variant={viewMode === mode ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode(mode)}
                  className={`text-xs px-3 py-1 h-8 ${viewMode === mode ? 'shadow-sm text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}
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

      {isLoading && <div className="text-center py-8">Carregando dados da agenda...</div>}
      {!isLoading && scheduleMetrics && <ScheduleMetrics metrics={scheduleMetrics} viewMode={viewMode} />}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground">Visão Geral</TabsTrigger>
          <TabsTrigger value="appointments" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground">Agendamentos</TabsTrigger>
          <TabsTrigger value="procedures" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground">Procedimentos</TabsTrigger>
          <TabsTrigger value="calendar" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground">Calendário</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {!isLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AppointmentsList appointments={appointments} selectedDate={selectedDate} viewMode={viewMode} onUpdate={fetchDataForSchedule} />
              <ProceduresScheduleList procedures={procedures} selectedDate={selectedDate} viewMode={viewMode} onUpdate={fetchDataForSchedule} />
            </div>
          )}
        </TabsContent>
        <TabsContent value="appointments">
          {!isLoading && <AppointmentsList appointments={appointments} selectedDate={selectedDate} viewMode={viewMode} fullView onUpdate={fetchDataForSchedule}/>}
        </TabsContent>
        <TabsContent value="procedures">
          {!isLoading && <ProceduresScheduleList procedures={procedures} selectedDate={selectedDate} viewMode={viewMode} fullView onUpdate={fetchDataForSchedule}/>}
        </TabsContent>
        <TabsContent value="calendar">
            <CalendarView selectedDate={selectedDate} onDateSelect={handleDateChangeFromCalendar} />
        </TabsContent>
      </Tabs>

      {showNewAppointmentModal && (
        <NewPatientModal // Reutilizando NewPatientModal para simplicidade ou criar um NewAppointmentModal
          isOpen={showNewAppointmentModal}
          onClose={() => setShowNewAppointmentModal(false)}
          onSave={(patientData) => {
            // Adaptar para lógica de salvar agendamento
            // Aqui você pode ter um formulário mais específico para agendamento
            // Por agora, apenas loga e fecha
            console.log("Tentativa de novo agendamento com dados de paciente:", patientData);
            // handleSaveNewAppointment({patientId: ..., ...outrosDadosDoAgendamento});
            setShowNewAppointmentModal(false);
          }}
        />
      )}
    </div>
  );
}