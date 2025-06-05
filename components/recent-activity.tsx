"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Calendar as CalendarIcon, CheckCircle, AlertCircle, Info, Activity as ActivityIcon } from "lucide-react"; // Renomeado Calendar para CalendarIcon

interface ActivityLogItem {
  id: string;
  type: "appointment" | "procedure" | "patient_interaction" | "system_update" | "webhook_event";
  description: string; // Ex: "Agendamento confirmado para Maria Silva" ou "Webhook 'atendimento_iniciado' recebido"
  timestamp: string; // ISO string
  patientName?: string; // Opcional
  status?: string; // Opcional, para dar cor/contexto
  icon?: React.ElementType; // Lucide Icon
  eventType?: string; // Para webhooks
}

// Função para formatar o tempo (pode ser movida para um utils)
function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.round((now.getTime() - date.getTime()) / 1000);
    if (diffSeconds < 2) return `agora`;
    if (diffSeconds < 60) return `há ${diffSeconds} seg`;
    const diffMinutes = Math.round(diffSeconds / 60);
    if (diffMinutes < 60) return `há ${diffMinutes} min`;
    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) return `há ${diffHours} h`;
    const diffDays = Math.round(diffHours / 24);
    if (diffDays < 7) return `há ${diffDays} d`;
    return date.toLocaleDateString('pt-BR');
}

const getEventDetails = (activity: ActivityLogItem): { icon: React.ElementType, badgeText?: string, badgeVariant?: "success" | "info" | "warning" | "default" } => {
    switch (activity.eventType || activity.type) {
        case "atendimento_iniciado":
        case "patient_interaction":
            return { icon: User, badgeText: "Interação", badgeVariant: "info" };
        case "duvida_sanada":
            return { icon: CheckCircle, badgeText: "Dúvida Sanada", badgeVariant: "success" };
        case "procedimento_oferecido":
            return { icon: Info, badgeText: "Oferta", badgeVariant: "info" };
        case "agendamento_consulta_realizado":
        case "appointment": // Genérico para appointment
            return { icon: CalendarIcon, badgeText: activity.status || "Agendamento", badgeVariant: activity.status === "confirmado" || activity.status === "completed" ? "success" : "info" };
        case "confirmacao_agendamento":
            return { icon: CheckCircle, badgeText: "Confirmado", badgeVariant: "success" };
        case "presenca_agendamento_confirmada":
            return { icon: CheckCircle, badgeText: "Compareceu", badgeVariant: "success" };
        case "procedimento_realizado":
        case "procedure": // Genérico para procedure
            return { icon: CheckCircle, badgeText: "Procedimento", badgeVariant: "success" };
        default:
            return { icon: ActivityIcon, badgeText: "Sistema", badgeVariant: "default" };
    }
};


export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentActivity() {
      setIsLoading(true);
      try {
        // Idealmente, você teria um endpoint específico para log de atividades.
        // Por agora, vamos simular buscando os últimos webhooks como exemplo de atividade.
        const response = await fetch('/api/webhook/_internal_test_connection_?limit=5&sort=desc'); // Adicionei _internal_test_connection_ para usar seu GET
        if (!response.ok) {
            // Se o endpoint de teste não for adequado, tentaremos outro ou mostraremos erro
            const webhookResponse = await fetch('/api/webhook/some_event_placeholder?limit=5&sort=desc'); // Tentativa com outro endpoint, ajuste conforme sua API real
            if(!webhookResponse.ok) throw new Error('Failed to fetch recent activity');
            const data = await webhookResponse.json();
            // Adapte a resposta da sua API de webhooks para o formato ActivityLogItem
            const formattedActivities: ActivityLogItem[] = (data.events || []).map((event: any) => ({
                id: event.id.toString(),
                type: "webhook_event",
                description: `${event.event_type} para ${event.email_at_event || event.phone_at_event || event.identifier || 'Paciente Desconhecido'}`,
                timestamp: event.event_timestamp,
                patientName: event.email_at_event || event.phone_at_event || event.identifier,
                eventType: event.event_type,
            }));
            setActivities(formattedActivities);
        } else {
             const data = await response.json();
             // Se o endpoint de teste retornar uma lista de eventos suportados, não é o que precisamos aqui.
             // Esta parte precisaria de um endpoint que retorne LOGS DE EVENTOS.
             // Vou manter um mock para demonstração se o fetch falhar ou não retornar o formato esperado.
             console.warn("Endpoint /api/webhook/_internal_test_connection_ não retornou logs de eventos. Usando mock data para RecentActivity.");
             setActivities([
                { id: "1", type: "appointment", eventType: "confirmacao_agendamento", description: "Agendamento confirmado para Maria Silva", timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), patientName: "Maria Silva", status: "success" },
                { id: "2", type: "procedure", eventType: "procedimento_realizado", description: "Procedimento Limpeza realizado em João Santos", timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), patientName: "João Santos", status: "completed"},
             ]);
        }

      } catch (error) {
        console.error("Error fetching recent activity:", error);
        // Fallback para mock em caso de erro, para a UI não quebrar
        setActivities([
            { id: "1", type: "appointment", eventType: "confirmacao_agendamento", description: "Agendamento confirmado para Maria Silva", timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), patientName: "Maria Silva", status: "success" },
            { id: "2", type: "procedure", eventType: "procedimento_realizado", description: "Procedimento Limpeza realizado em João Santos", timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), patientName: "João Santos", status: "completed"},
            { id: "3", type: "patient_interaction", eventType: "atendimento_iniciado", description: "Primeiro contato com Ana Costa", timestamp: new Date(Date.now() - 32 * 60 * 1000).toISOString(), patientName: "Ana Costa", status: "new" },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRecentActivity();
  }, []);


  if (isLoading) {
    return (
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center text-foreground">
            <Clock className="w-5 h-5 mr-2 text-muted-foreground" />
            Atividade Recente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-3">
                <div className="p-2 bg-muted rounded-full w-8 h-8 animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-muted rounded w-1/2 animate-pulse"></div>
                </div>
                <div className="h-5 bg-muted rounded-full w-20 animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (activities.length === 0) {
      return (
          <Card className="card-hover">
              <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center text-foreground">
                      <Clock className="w-5 h-5 mr-2 text-muted-foreground" />
                      Atividade Recente
                  </CardTitle>
              </CardHeader>
              <CardContent className="text-center py-8 text-muted-foreground">
                  Nenhuma atividade recente registrada.
              </CardContent>
          </Card>
      )
  }

  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center text-foreground">
          <Clock className="w-5 h-5 mr-2 text-muted-foreground" />
          Atividade Recente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {activities.map((activity) => {
            const { icon: Icon, badgeText, badgeVariant } = getEventDetails(activity);
            return (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-3 rounded-md hover:bg-accent transition-colors"
              >
                <div className={`mt-1 p-1.5 rounded-full bg-muted flex items-center justify-center ${badgeVariant ? `bg-${badgeVariant}-muted` : 'bg-muted'}`}>
                  <Icon className={`w-4 h-4 ${badgeVariant ? `text-${badgeVariant}-foreground` : 'text-muted-foreground'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground leading-tight">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{formatTimeAgo(activity.timestamp)}</p>
                </div>
                {badgeText && (
                    <Badge variant={badgeVariant || "default"} className="text-xs whitespace-nowrap self-start">
                        {badgeText}
                    </Badge>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}