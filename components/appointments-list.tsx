"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, User, Phone, Search, MoreHorizontal, X, CheckCircle, AlertCircle, CheckSquare, XCircle } from "lucide-react"
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

// Interface do app/page.tsx ou types/index.ts
export interface AppointmentItem {
  id: string;
  time: string; // HH:mm
  dateFull: string; // ISO YYYY-MM-DDTHH:mm:ssZ
  patient: string;
  phone: string;
  type: string;
  status: string; // 'confirmed', 'pending', 'completed', 'cancelled'
  duration: number;
  notes?: string;
}

interface AppointmentsListProps {
  appointments: AppointmentItem[];
  selectedDate: Date; // Usada para o título se não for fullView
  viewMode: "day" | "week" | "month";
  fullView?: boolean;
  onUpdate: () => void; // Callback para o componente pai refazer o fetch
}

export function AppointmentsList({ appointments: initialAppointments, selectedDate, viewMode, fullView = false, onUpdate }: AppointmentsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  // O estado local de appointments é gerenciado pelo componente pai agora.

  const handleAction = async (action: 'reschedule' | 'cancel' | 'changeStatus', appointmentId: string, newStatus?: string) => {
    if (action === 'cancel') {
      if (!confirm(`Tem certeza que deseja cancelar o agendamento ${appointmentId}?`)) return;
      try {
        const response = await fetch(`/api/appointments/${appointmentId}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Falha ao cancelar');
        onUpdate(); // Sinaliza para o pai recarregar
        alert("Agendamento cancelado.");
      } catch (error) {
        console.error(error);
        alert("Erro ao cancelar agendamento.");
      }
    } else if (action === 'reschedule') {
      console.log(`Reagendando consulta ${appointmentId}`);
      alert(`Funcionalidade de reagendamento para ${appointmentId} a ser implementada.`);
      // Idealmente abriria um modal de reagendamento e depois chamaria a API PUT
    } else if (action === 'changeStatus' && newStatus) {
      try {
        const response = await fetch(`/api/appointments/${appointmentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
        });
        if (!response.ok) throw new Error('Falha ao alterar status');
        onUpdate();
        alert(`Status alterado para ${getStatusLabel(newStatus)}.`);
      } catch (error) {
        console.error(error);
        alert("Erro ao alterar status.");
      }
    }
  };


  const getStatusColorClass = (status: string): string => {
    switch (status) {
      case "confirmed": return "bg-success-muted text-success-foreground border-success-foreground/30";
      case "pending": return "bg-warning-muted text-warning-foreground border-warning-foreground/30";
      case "completed": return "bg-info-muted text-info-foreground border-info-foreground/30"; // Usando info para completed
      case "cancelled": return "bg-destructive text-destructive-foreground border-destructive/30";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case "confirmed": return "Confirmado";
      case "pending": return "Pendente";
      case "completed": return "Concluído";
      case "cancelled": return "Cancelado";
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const filteredAppointments = initialAppointments.filter((appointment) => {
    const matchesSearch =
      appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || appointment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <Card className="card-hover">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base md:text-lg font-semibold text-foreground flex items-center">
            <Calendar className="w-4 h-4 md:w-5 md:h-5 mr-2 text-primary" />
            Agendamentos
            {!fullView && selectedDate && ` - ${selectedDate.toLocaleDateString("pt-BR")}`}
          </CardTitle>
          {/* Botão Novo Agendamento movido para ScheduleManagement ou app/page.tsx se fullView */}
        </div>
        {fullView && (
          <div className="flex flex-col md:flex-row items-center gap-2 md:space-x-4 mt-3 md:mt-4">
            <div className="relative flex-1 w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar agendamentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-9 text-sm"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-9 px-3 py-2 w-full md:w-auto bg-background border border-input rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">Todos Status</option>
              <option value="confirmed">Confirmados</option>
              <option value="pending">Pendentes</option>
              <option value="completed">Concluídos</option>
              <option value="cancelled">Cancelados</option>
            </select>
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.slice(0, fullView ? undefined : 5).map((appointment) => (
            <div
              key={appointment.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-card border rounded-lg hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="text-center w-16 shrink-0">
                  <div className="text-sm md:text-base font-bold text-foreground">{appointment.time}</div>
                  <div className="text-xs text-muted-foreground">{appointment.duration}min</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="font-medium text-sm text-foreground truncate" title={appointment.patient}>{appointment.patient}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="text-xs text-muted-foreground truncate" title={appointment.phone}>{appointment.phone}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="text-xs text-muted-foreground truncate" title={appointment.type}>{appointment.type}</span>
                  </div>
                  {appointment.notes && <p className="text-xs text-muted-foreground/80 mt-1 truncate" title={appointment.notes}>{appointment.notes}</p>}
                </div>
              </div>

              <div className="flex items-center space-x-2 mt-2 sm:mt-0 sm:pl-3">
                <Badge className={`${getStatusColorClass(appointment.status)} text-xs`}>{getStatusLabel(appointment.status)}</Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleAction('reschedule', appointment.id)}>
                      <Calendar className="w-4 h-4 mr-2" /> Reagendar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAction('cancel', appointment.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                      <X className="w-4 h-4 mr-2" /> Cancelar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <Clock className="w-4 h-4 mr-2" /> Alterar Status
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem onClick={() => handleAction('changeStatus', appointment.id, "confirmed")}>
                          <CheckCircle className="w-4 h-4 mr-2" /> Confirmado
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('changeStatus', appointment.id, "pending")}>
                          <AlertCircle className="w-4 h-4 mr-2" /> Pendente
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('changeStatus', appointment.id, "completed")}>
                          <CheckSquare className="w-4 h-4 mr-2" /> Concluído
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('changeStatus', appointment.id, "cancelled")}>
                          <XCircle className="w-4 h-4 mr-2" /> Cancelado
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Nenhum agendamento para {fullView ? 'os filtros selecionados' : `o dia ${selectedDate.toLocaleDateString("pt-BR")}`}.</p>
            </div>
          )}

          {!fullView && initialAppointments.length > 5 && (
            <div className="text-center pt-3">
              <Button variant="ghost" size="sm" className="text-xs text-primary hover:bg-primary/10">
                Ver todos os agendamentos do dia
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}