// components/patient-profile.tsx
"use client"

import { useState } from "react";
// Importa os tipos de app/page.tsx para garantir consistência
import type { PatientDetail } from "@/app/page";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/status-badge";
import { StatCard } from "@/components/ui/stat-card";
import { StyledTabs, StyledTabsList, StyledTabsTrigger, TabsContent } from "@/components/ui/tabs-styled";
import { ArrowLeft, Phone, Mail, Calendar, CheckCircle, DollarSign, TrendingUp } from "lucide-react";

interface PatientProfileProps {
  patient: PatientDetail; // CORRETO: Usa a interface unificada
  onBack: () => void;
}

// ... (Restante do componente como na resposta anterior, pois ele já está correto
//      e espera `patient.procedures` e `patient.appointments`)

const stageLabels: { [key: string]: { label: string; variant: "success" | "warning" | "info" | "default" | "destructive" } } = {
  atendimento_iniciado: { label: "Atendimento Iniciado", variant: "info" },
  duvida_sanada: { label: "Dúvida Sanada", variant: "info" },
  procedimento_oferecido: { label: "Procedimento Oferecido", variant: "warning" },
  agendamento_realizado: { label: "Agendamento Realizado", variant: "warning" },
  agendamento_confirmado: { label: "Agendamento Confirmado", variant: "success" },
  comparecimento_confirmado: { label: "Compareceu", variant: "success" },
  procedimento_realizado: { label: "Procedimento Realizado", variant: "success" },
  lead_created: { label: "Lead Criado", variant: "default" },
};

export function PatientProfile({ patient, onBack }: PatientProfileProps) {
  const [activeTab, setActiveTab] = useState("appointments");
  const stageInfo = stageLabels[patient.funnelStage] || { label: patient.funnelStage, variant: "default" };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "realizado":
      case "concluído":
      case "completed":
        return "success";
      case "confirmado":
      case "confirmed":
        return "info";
      case "pendente":
      case "pending":
      case "scheduled":
        return "warning";
      case "cancelado":
      case "cancelled":
        return "destructive";
      default:
        return "default";
    }
  };

  const safeAppointments = patient.appointments || [];
  const safeProcedures = patient.procedures || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Patient Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-card rounded-lg border shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onBack} className="h-9 w-9 shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <Avatar initials={getInitials(patient.name)} size="lg" className="animate-scale" />

          <div>
            <h2 className="text-xl font-semibold">{patient.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge variant={stageInfo.variant as any}>{stageInfo.label}</StatusBadge>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
          <Button size="sm" className="btn-hover">
            <Calendar className="h-4 w-4 mr-2" />
            Agendar
          </Button>
          <Button variant="outline" size="sm" className="btn-hover">
            <Phone className="h-4 w-4 mr-2" />
            Contatar
          </Button>
        </div>
      </div>

      {/* Patient Info & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 card-hover animate-slide-up">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Informações de Contato</h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{patient.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{patient.phone}</span>
              </div>
              {patient.lastContact && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Último contato: {new Date(patient.lastContact).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div
          className="md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-3 animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          <StatCard
            value={`R$ ${(patient.totalSpent || 0).toLocaleString("pt-BR")}`}
            label="Total Gasto"
            icon={<DollarSign className="h-4 w-4 text-primary" />}
            variant="primary"
          />

          <StatCard
            value={`R$ ${(patient.totalProfit || 0).toLocaleString("pt-BR")}`}
            label="Lucro Gerado"
            icon={<TrendingUp className="h-4 w-4 text-success-foreground" />}
            variant="success"
          />

          <StatCard
            value={`${patient.totalSpent > 0 ? (((patient.totalProfit || 0) / patient.totalSpent) * 100).toFixed(1) : "0.0"}%`}
            label="Margem Média"
            icon={<DollarSign className="h-4 w-4 text-info-foreground" />}
            variant="info"
          />
        </div>
      </div>

      {/* Tabbed Content */}
      <Card className="card-hover animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <CardContent className="p-0">
          <StyledTabs defaultValue="appointments" onValueChange={setActiveTab} value={activeTab}>
            <StyledTabsList className="px-6 pt-6" tabStyle="underline">
              <StyledTabsTrigger
                value="appointments"
                tabStyle="underline"
                icon={<Calendar className="h-4 w-4" />}
                count={safeAppointments.length}
              >
                Agendamentos
              </StyledTabsTrigger>

              <StyledTabsTrigger
                value="procedures"
                tabStyle="underline"
                icon={<CheckCircle className="h-4 w-4" />}
                count={safeProcedures.length}
              >
                Procedimentos
              </StyledTabsTrigger>

              <StyledTabsTrigger value="financial" tabStyle="underline" icon={<DollarSign className="h-4 w-4" />}>
                Financeiro
              </StyledTabsTrigger>
            </StyledTabsList>

            <TabsContent value="appointments" className="p-6 pt-4 animate-fade-in">
              {safeAppointments.length > 0 ? (
                <div className="space-y-3">
                  {safeAppointments.map((appointment, index) => (
                    <div
                      key={appointment.id || index}
                      className="flex items-center justify-between p-4 bg-card border rounded-lg hover:border-primary/20 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-full bg-info-muted">
                          <Calendar className="h-4 w-4 text-info-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{appointment.type}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(appointment.date).toLocaleDateString("pt-BR", {timeZone: 'UTC'})}
                            {appointment.time ? ` às ${appointment.time}`: ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {appointment.value && (
                          <span className="text-sm font-medium">R$ {appointment.value.toLocaleString("pt-BR")}</span>
                        )}
                        <StatusBadge variant={getStatusVariant(appointment.status) as any}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </StatusBadge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
                  <p className="text-muted-foreground">Nenhum agendamento encontrado</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="procedures" className="p-6 pt-4 animate-fade-in">
              {safeProcedures.length > 0 ? (
                <div className="space-y-3">
                  {safeProcedures.map((procedure, index) => (
                    <div
                      key={procedure.id || index}
                      className="flex items-center justify-between p-4 bg-card border rounded-lg hover:border-primary/20 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-full bg-success-muted">
                          <CheckCircle className="h-4 w-4 text-success-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{procedure.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(procedure.date + "T00:00:00Z").toLocaleDateString("pt-BR", {timeZone: 'UTC'})}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">R$ {procedure.value.toLocaleString("pt-BR")}</p>
                        <p className="text-sm text-success-foreground">
                          Lucro: R$ {procedure.profit.toLocaleString("pt-BR")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
                  <p className="text-muted-foreground">Nenhum procedimento realizado</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="financial" className="p-6 pt-4 animate-fade-in">
              <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card><CardContent className="p-6 text-center"><DollarSign className="h-8 w-8 mx-auto mb-2 text-primary/60" /><p className="text-2xl font-bold">R$ {(patient.totalSpent || 0).toLocaleString("pt-BR")}</p><p className="text-sm text-muted-foreground">Total Gasto</p></CardContent></Card>
                  <Card><CardContent className="p-6 text-center"><CheckCircle className="h-8 w-8 mx-auto mb-2 text-success-foreground/60" /><p className="text-2xl font-bold">{safeProcedures.length}</p><p className="text-sm text-muted-foreground">Procedimentos</p></CardContent></Card>
                  <Card><CardContent className="p-6 text-center"><Calendar className="h-8 w-8 mx-auto mb-2 text-info-foreground/60" /><p className="text-2xl font-bold">{safeAppointments.length}</p><p className="text-sm text-muted-foreground">Agendamentos</p></CardContent></Card>
                </div>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Histórico Financeiro</h3>
                    <div className="space-y-4">
                      {safeProcedures.length > 0 ? (
                        safeProcedures.map((procedure, index) => (
                          <div key={index} className="flex justify-between items-center pb-4 border-b last:border-0">
                            <div><p className="font-medium">{procedure.name}</p><p className="text-sm text-muted-foreground">{new Date(procedure.date + "T00:00:00Z").toLocaleDateString("pt-BR", {timeZone: 'UTC'})}</p></div>
                            <div className="text-right"><p className="font-medium">R$ {procedure.value.toLocaleString("pt-BR")}</p><div className="flex items-center gap-1 text-sm text-success-foreground"><TrendingUp className="h-3 w-3" /><span>R$ {procedure.profit.toLocaleString("pt-BR")}</span></div></div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8"><DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" /><p className="text-muted-foreground">Nenhum histórico financeiro disponível</p></div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </StyledTabs>
        </CardContent>
      </Card>
    </div>
  )
}