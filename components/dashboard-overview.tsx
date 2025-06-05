"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, Calendar, CheckCircle, DollarSign, TrendingUp } from "lucide-react"
import { FunnelVisualization } from "@/components/funnel-visualization"
import { QuickStats } from "@/components/quick-stats"
import { RecentActivity } from "@/components/recent-activity" // Este componente precisará de fetch próprio

// Reutilizar MetricValues de app/page.tsx ou de um types/index.ts
interface MetricValues {
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

interface DashboardOverviewProps {
  metrics: MetricValues | null; // Pode ser nulo enquanto carrega
  period: string;
}

export function DashboardOverview({ metrics, period }: DashboardOverviewProps) {
  if (!metrics) {
    return <div className="flex justify-center items-center h-64"><p>Carregando métricas do dashboard...</p></div>;
  }

  const conversionRate = metrics.atendimentosIniciados > 0
    ? ((metrics.procedimentosRealizados / metrics.atendimentosIniciados) * 100).toFixed(1)
    : "0.0";
  const revenueGrowth = period === "today" ? 12.5 : period === "week" ? 8.3 : 15.2; // Isso ainda é mockado, idealmente viria da API

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="card-hover">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Atendimentos</p>
                <p className="text-2xl font-bold text-foreground">{metrics.atendimentosIniciados}</p>
                {/* Adicionar lógica para crescimento real se disponível */}
              </div>
              <div className="p-3 bg-info-muted rounded-full">
                <Users className="w-5 h-5 md:w-6 md:h-6 text-info-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Agendamentos</p>
                <p className="text-2xl font-bold text-foreground">{metrics.agendamentosRealizados}</p>
              </div>
              <div className="p-3 bg-success-muted rounded-full"> {/* Usando success para agendamentos */}
                <Calendar className="w-5 h-5 md:w-6 md:h-6 text-success-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversão</p>
                <p className="text-2xl font-bold text-foreground">{conversionRate}%</p>
              </div>
              <div className="p-3 bg-pending-muted rounded-full"> {/* Usando pending para conversão (ou outra cor) */}
                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-pending-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Receita ({period})</p>
                <p className="text-2xl font-bold text-foreground">
                  R$ {metrics.faturamento.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full"> {/* Usando primary para receita */}
                <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FunnelVisualization metrics={metrics} />
        </div>
        <div>
          <QuickStats metrics={metrics} />
        </div>
      </div>
      <RecentActivity />
    </div>
  );
}