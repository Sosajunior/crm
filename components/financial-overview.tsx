"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DollarSign, TrendingUp, TrendingDown, Target, Download, Edit } from "lucide-react"
import { FinancialProceduresHistory } from "@/components/financial-procedures-history"

interface FinancialOverviewProps {
  metrics: any
  period: string
}

export function FinancialOverview({ metrics, period }: FinancialOverviewProps) {
  const profitMargin = ((metrics.lucro / metrics.faturamento) * 100).toFixed(1)
  const avgTicket = (metrics.faturamento / metrics.procedimentosRealizados).toFixed(0)
  const roi = ((metrics.lucro / metrics.gastos) * 100).toFixed(1)

  const procedures = [
    { name: "Limpeza Dental", price: 150, cost: 45, quantity: 25, revenue: 3750, profit: 2625 },
    { name: "Restauração", price: 280, cost: 95, quantity: 18, revenue: 5040, profit: 3330 },
    { name: "Canal", price: 850, cost: 280, quantity: 8, revenue: 6800, profit: 4560 },
    { name: "Extração", price: 200, cost: 60, quantity: 12, revenue: 2400, profit: 1680 },
    { name: "Clareamento", price: 450, cost: 120, quantity: 6, revenue: 2700, profit: 1980 },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Visão Financeira</h2>
            <p className="text-slate-600 mt-1">Análise de receitas, custos e performance.</p>
          </div>
          <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
            <Download className="w-4 h-4 mr-2" />
            Exportar Relatório
          </Button>
        </div>

        {/* Quick Stats Cards - Simplified Colors */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"> {/* Reduced to 5 cols after removing ROI */}
          <Card className="border border-slate-200 shadow-sm bg-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-slate-700">{metrics.procedimentosRealizados}</div>
              <p className="text-xs text-slate-500 font-medium mt-1">Procedimentos</p>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm bg-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-slate-700">{metrics.agendamentosRealizados || 32}</div>
              <p className="text-xs text-slate-500 font-medium mt-1">Agendamentos</p>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm bg-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-slate-700">R$ {avgTicket}</div>
              <p className="text-xs text-slate-500 font-medium mt-1">Ticket Médio</p>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm bg-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-slate-700">{profitMargin}%</div>
              <p className="text-xs text-slate-500 font-medium mt-1">Margem</p>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm bg-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-slate-700">
                {((metrics.comparecimentos / (metrics.agendamentosRealizados || 32)) * 100).toFixed(0)}%
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">Comparecimento</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Financial KPIs - Simplified Colors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-slate-200 shadow-lg bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Receita Total</p>
                <p className="text-3xl font-bold text-[#77C293]">R$ {metrics.faturamento.toLocaleString("pt-BR")}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-[#77C293] mr-1" />
                  <span className="text-sm text-[#77C293]">+15.2%</span>
                </div>
              </div>
              <div className="p-3 bg-slate-100 rounded-full">
                <DollarSign className="w-6 h-6 text-slate-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-lg bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Lucro Líquido</p>
                <p className="text-3xl font-bold text-[#77C293]">R$ {metrics.lucro.toLocaleString("pt-BR")}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-[#77C293] mr-1" />
                  <span className="text-sm text-[#77C293]">+18.5%</span>
                </div>
              </div>
              <div className="p-3 bg-slate-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-slate-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-lg bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Margem de Lucro</p>
                <p className="text-3xl font-bold text-slate-800">{profitMargin}%</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-[#77C293] mr-1" /> {/* Assuming positive change */}
                  <span className="text-sm text-[#77C293]">+2.1%</span>
                </div>
              </div>
              <div className="p-3 bg-slate-100 rounded-full">
                <Target className="w-6 h-6 text-slate-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-lg bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Ticket Médio</p>
                <p className="text-3xl font-bold text-slate-800">R$ {avgTicket}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-[#77C293] mr-1" /> {/* Assuming positive change */}
                  <span className="text-sm text-[#77C293]">+8.3%</span>
                </div>
              </div>
              <div className="p-3 bg-slate-100 rounded-full">
                <DollarSign className="w-6 h-6 text-slate-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Procedures Performance - Simplified Colors */}
      <Card className="border border-slate-200 shadow-lg bg-white">
        <CardHeader className="bg-slate-50 border-b border-slate-200">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-bold text-slate-900">Performance por Procedimento</CardTitle>
              <p className="text-slate-600 mt-1">Análise de lucratividade por tratamento.</p>
            </div>
            <Button variant="outline" size="sm" className="border-slate-400 text-slate-700 hover:bg-slate-100 hover:border-slate-500">
              <Edit className="w-4 h-4 mr-2" />
              Gerenciar Preços
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {procedures.map((procedure, index) => {
              const margin = ((procedure.profit / procedure.revenue) * 100).toFixed(1)
              const isHighMargin = Number.parseFloat(margin) >= 70

              return (
                <div
                  key={procedure.name}
                  className="group hover:bg-slate-50 transition-colors duration-200 rounded-lg p-4 border border-slate-200"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                    <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 text-slate-600 font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 text-base">{procedure.name}</h3>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <span className="text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full">
                            {procedure.quantity} realizados
                          </span>
                          <span className="text-xs text-slate-500">
                            Preço: R$ {procedure.price.toLocaleString("pt-BR")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 sm:space-x-5 w-full sm:w-auto justify-end">
                      <div className="text-right">
                        <p className="text-base font-medium text-slate-700">
                          R$ {procedure.revenue.toLocaleString("pt-BR")}
                        </p>
                        <p className="text-xs text-slate-500">Receita</p>
                      </div>

                      <div className="text-right">
                        <p className="text-base font-medium text-[#77C293]">
                          R$ {procedure.profit.toLocaleString("pt-BR")}
                        </p>
                        <p className="text-xs text-slate-500">Lucro</p>
                      </div>

                      <div className="text-center">
                        <Badge
                          variant="outline"
                          className={`text-xs px-2 py-0.5 ${isHighMargin ? "border-green-300 bg-green-50 text-[#77C293]" : "border-red-300 bg-red-50 text-[#C27777]"}`}
                        >
                          {isHighMargin ? (
                            <TrendingUp className="w-3 h-3 mr-1" />
                          ) : (
                            <TrendingDown className="w-3 h-3 mr-1" />
                          )}
                          {margin}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Financial Goals - Simplified Colors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-slate-200 shadow-lg bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
              <Target className="w-5 h-5 mr-2 text-slate-500" />
              Meta de Receita
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Progresso</span>
                <span className="font-semibold text-slate-800">75%</span> {/* Simplified */}
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-[#77C293] h-2 rounded-full"
                  style={{ width: "75%" }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Atual: R$ 90.000</span>
                <span>Meta: R$ 120.000</span>
              </div>
               {/* Simplified message, can be removed if too much */}
              <p className="text-xs text-slate-500 bg-slate-100 p-1.5 rounded-md border border-slate-200 text-center">Faltam R$ 30.000</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-lg bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-slate-500" />
              Meta de Margem
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Progresso</span>
                <span className="font-semibold text-slate-800">92%</span> {/* Simplified */}
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-[#77C293] h-2 rounded-full" // Green for positive goal
                  style={{ width: "92%" }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Atual: {profitMargin}%</span>
                <span>Meta: 65%</span>
              </div>
              <Badge variant="outline" className="border-green-300 bg-green-50 text-[#77C293] w-full justify-center text-xs py-1">
                Excelente performance!
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-lg bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-slate-500" />
              Eficiência (ROI)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              <div className="text-center mb-2">
                <div className="text-3xl font-bold text-slate-800">{roi}%</div>
                <p className="text-sm text-slate-500 font-medium">Retorno sobre Investimento</p>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Procedimentos/Dia:</span>
                  <span className="font-medium text-slate-700">
                    {(metrics.procedimentosRealizados / 30).toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Agendamentos/Dia:</span>
                  <span className="font-medium text-slate-700">
                    {((metrics.agendamentosRealizados || 32) / 30).toFixed(1)}
                  </span>
                </div>
              </div>
              <Badge variant="outline" className="border-green-300 bg-green-50 text-[#77C293] w-full justify-center text-xs py-1 mt-1.5">
                Performance otimizada
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Procedures History */}
      <Card className="border border-slate-200 shadow-lg bg-white">
        <CardHeader className="bg-slate-50 border-b border-slate-200">
          <CardTitle className="text-xl font-bold text-slate-900">Histórico Completo de Procedimentos</CardTitle>
          <p className="text-slate-600 mt-1">Detalhes de todos os procedimentos realizados.</p>
        </CardHeader>
        <CardContent className="p-6">
          <FinancialProceduresHistory period={period} />
        </CardContent>
      </Card>
    </div>
  )
}