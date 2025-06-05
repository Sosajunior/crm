"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, Calendar, CheckCircle, DollarSign, TrendingUp } from "lucide-react"
import { FunnelVisualization } from "@/components/funnel-visualization"
import { QuickStats } from "@/components/quick-stats"
import { RecentActivity } from "@/components/recent-activity"

interface DashboardOverviewProps {
  metrics: any
  period: string
}

export function DashboardOverview({ metrics, period }: DashboardOverviewProps) {
  const conversionRate = ((metrics.procedimentosRealizados / metrics.atendimentosIniciados) * 100).toFixed(1)
  const revenueGrowth = period === "today" ? 12.5 : period === "week" ? 8.3 : 15.2

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Atendimentos</p>
                <p className="text-2xl font-bold text-foreground">{metrics.atendimentosIniciados}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 text-success-foreground mr-1" />
                  <span className="text-xs text-success-foreground">+12%</span>
                </div>
              </div>
              <div className="p-3 bg-info-muted rounded-full">
                <Users className="w-6 h-6 text-info-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Agendamentos</p>
                <p className="text-2xl font-bold text-foreground">{metrics.agendamentosRealizados}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 text-success-foreground mr-1" />
                  <span className="text-xs text-success-foreground">+8%</span>
                </div>
              </div>
              <div className="p-3 bg-green-900 rounded-full">
                <Calendar className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversão</p>
                <p className="text-2xl font-bold text-foreground">{conversionRate}%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 text-success-foreground mr-1" />
                  <span className="text-xs text-success-foreground">+2.1%</span>
                </div>
              </div>
              <div className="p-3 bg-purple-900 rounded-full">
                <CheckCircle className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Receita</p>
                <p className="text-2xl font-bold text-foreground">
                  R$ {metrics.faturamento.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 text-success-foreground mr-1" />
                  <span className="text-xs text-success-foreground">+{revenueGrowth}%</span>
                </div>
              </div>
              <div className="p-3 bg-orange-900 rounded-full">
                <DollarSign className="w-6 h-6 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Funnel Visualization */}
        <div className="lg:col-span-2">
          <FunnelVisualization metrics={metrics} />
        </div>

        {/* Quick Stats */}
        <div>
          <QuickStats metrics={metrics} />
        </div>
      </div>

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  )
}
