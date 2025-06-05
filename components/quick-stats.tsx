"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Clock, Target } from "lucide-react"

interface QuickStatsProps {
  metrics: any
}

export function QuickStats({ metrics }: QuickStatsProps) {
  const profitMargin = ((metrics.lucro / metrics.faturamento) * 100).toFixed(1)
  const avgTicket = (metrics.faturamento / metrics.procedimentosRealizados).toFixed(0)

  return (
    <div className="space-y-4">
      {/* Performance Card */}
      <Card className="card-hover">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center text-foreground">
            <Target className="w-4 h-4 mr-2 text-blue-400" />
            Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Taxa de Conversão</span>
            <Badge className="bg-success-muted text-success-foreground">
              {((metrics.procedimentosRealizados / metrics.atendimentosIniciados) * 100).toFixed(1)}%
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Margem de Lucro</span>
            <Badge className="bg-success-muted text-success-foreground">{profitMargin}%</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Ticket Médio</span>
            <Badge className="bg-success-muted text-success-foreground">R$ {avgTicket}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Financial Summary */}
      <Card className="card-hover">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center text-foreground">
            <TrendingUp className="w-4 h-4 mr-2 text-green-400" />
            Resumo Financeiro
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Receita</span>
              <span className="font-medium text-green-400">R$ {metrics.faturamento.toLocaleString("pt-BR")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Custos</span>
              <span className="font-medium text-red-400">R$ {metrics.gastos.toLocaleString("pt-BR")}</span>
            </div>
            <div className="border-t border-gray-700 pt-2">
              <div className="flex justify-between">
                <span className="font-medium text-foreground">Lucro</span>
                <span className="font-bold text-blue-400">R$ {metrics.lucro.toLocaleString("pt-BR")}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Actions */}
      <Card className="card-hover">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center text-foreground">
            <Clock className="w-4 h-4 mr-2 text-orange-400" />
            Próximas Ações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Agendamentos hoje</span>
              <Badge variant="outline" className="border-gray-600 text-muted-foreground">
                3
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Confirmações pendentes</span>
              <Badge variant="outline" className="border-gray-600 text-muted-foreground">
                2
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Follow-ups</span>
              <Badge variant="outline" className="border-gray-600 text-muted-foreground">
                5
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
