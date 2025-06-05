"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, Calculator, Download, Plus } from "lucide-react"
import { ProceduresList } from "@/components/procedures-list"
import { RevenueChart } from "@/components/revenue-chart"
import { ProfitabilityChart } from "@/components/profitability-chart"

interface FinancialDashboardProps {
  period: string
  metrics: {
    faturamento: number
    gastos: number
    lucro: number
    procedimentosRealizados: number
  }
}

// Mock data para procedimentos
const mockProcedures = [
  {
    id: "1",
    name: "Limpeza Dental",
    category: "Preventivo",
    price: 150.0,
    cost: 45.0,
    profit: 105.0,
    margin: 70.0,
    quantity: 25,
    totalRevenue: 3750.0,
    totalCost: 1125.0,
    totalProfit: 2625.0,
  },
  {
    id: "2",
    name: "Restauração",
    category: "Restaurador",
    price: 280.0,
    cost: 95.0,
    profit: 185.0,
    margin: 66.1,
    quantity: 18,
    totalRevenue: 5040.0,
    totalCost: 1710.0,
    totalProfit: 3330.0,
  },
  {
    id: "3",
    name: "Canal",
    category: "Endodontia",
    price: 850.0,
    cost: 280.0,
    profit: 570.0,
    margin: 67.1,
    quantity: 8,
    totalRevenue: 6800.0,
    totalCost: 2240.0,
    totalProfit: 4560.0,
  },
  {
    id: "4",
    name: "Extração",
    category: "Cirurgia",
    price: 200.0,
    cost: 60.0,
    profit: 140.0,
    margin: 70.0,
    quantity: 12,
    totalRevenue: 2400.0,
    totalCost: 720.0,
    totalProfit: 1680.0,
  },
  {
    id: "5",
    name: "Clareamento",
    category: "Estético",
    price: 450.0,
    cost: 120.0,
    profit: 330.0,
    margin: 73.3,
    quantity: 6,
    totalRevenue: 2700.0,
    totalCost: 720.0,
    totalProfit: 1980.0,
  },
]

export function FinancialDashboard({ period, metrics }: FinancialDashboardProps) {
  const marginPercentage = ((metrics.lucro / metrics.faturamento) * 100).toFixed(1)
  const averageTicket = metrics.faturamento / metrics.procedimentosRealizados
  const averageCost = metrics.gastos / metrics.procedimentosRealizados

  // Calcular totais dos procedimentos
  const totalProcedures = mockProcedures.reduce((sum, proc) => sum + proc.quantity, 0)
  const totalRevenue = mockProcedures.reduce((sum, proc) => sum + proc.totalRevenue, 0)
  const totalCosts = mockProcedures.reduce((sum, proc) => sum + proc.totalCost, 0)
  const totalProfit = mockProcedures.reduce((sum, proc) => sum + proc.totalProfit, 0)

  // Procedimento mais lucrativo
  const mostProfitable = mockProcedures.reduce((prev, current) =>
    prev.totalProfit > current.totalProfit ? prev : current,
  )

  // Procedimento com maior margem
  const highestMargin = mockProcedures.reduce((prev, current) => (prev.margin > current.margin ? prev : current))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Financeiro</h2>
          <p className="text-gray-600">Análise de faturamento, custos e lucratividade</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar Relatório
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Novo Procedimento
          </Button>
        </div>
      </div>

      {/* Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento Total</CardTitle>
            <DollarSign className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {metrics.faturamento.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-green-100">{metrics.procedimentosRealizados} procedimentos realizados</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custos Totais</CardTitle>
            <TrendingDown className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {metrics.gastos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-red-100">
              {((metrics.gastos / metrics.faturamento) * 100).toFixed(1)}% do faturamento
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
            <TrendingUp className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {metrics.lucro.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-blue-100">Margem de {marginPercentage}%</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <Calculator className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {averageTicket.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-purple-100">
              Custo médio: R$ {averageCost.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Insights Rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Mais Lucrativo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-semibold text-lg">{mostProfitable.name}</p>
              <p className="text-sm text-gray-600">{mostProfitable.quantity} realizados</p>
              <p className="text-green-600 font-medium">
                R$ {mostProfitable.totalProfit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} lucro total
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-600" />
              Maior Margem
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-semibold text-lg">{highestMargin.name}</p>
              <p className="text-sm text-gray-600">Margem de {highestMargin.margin}%</p>
              <p className="text-blue-600 font-medium">
                R$ {highestMargin.profit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} por procedimento
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              Performance Geral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">ROI Médio:</span>
                <span className="font-medium">{((totalProfit / totalCosts) * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Procedimentos:</span>
                <span className="font-medium">{totalProcedures}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Eficiência:</span>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Excelente
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para análises detalhadas */}
      <Tabs defaultValue="procedures" className="space-y-4">
        <TabsList>
          <TabsTrigger value="procedures">Procedimentos</TabsTrigger>
          <TabsTrigger value="revenue">Receita</TabsTrigger>
          <TabsTrigger value="profitability">Lucratividade</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
        </TabsList>

        <TabsContent value="procedures">
          <ProceduresList procedures={mockProcedures} />
        </TabsContent>

        <TabsContent value="revenue">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Evolução da Receita</CardTitle>
                <CardDescription>Faturamento ao longo do tempo</CardDescription>
              </CardHeader>
              <CardContent>
                <RevenueChart period={period} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Categoria</CardTitle>
                <CardDescription>Receita por tipo de procedimento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Preventivo", "Restaurador", "Endodontia", "Cirurgia", "Estético"].map((category, index) => {
                    const categoryRevenue = mockProcedures
                      .filter((p) => p.category === category)
                      .reduce((sum, p) => sum + p.totalRevenue, 0)
                    const percentage = (categoryRevenue / totalRevenue) * 100

                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{category}</span>
                          <span className="text-sm text-gray-600">
                            R$ {categoryRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} (
                            {percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="profitability">
          <ProfitabilityChart procedures={mockProcedures} />
        </TabsContent>

        <TabsContent value="trends">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Análise de Tendências</CardTitle>
                <CardDescription>Projeções e insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-800">Tendência Positiva</span>
                    </div>
                    <p className="text-sm text-green-700">Faturamento cresceu 15% em relação ao período anterior</p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <PieChart className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-800">Oportunidade</span>
                    </div>
                    <p className="text-sm text-blue-700">Procedimentos estéticos têm a maior margem de lucro</p>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calculator className="w-4 h-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Recomendação</span>
                    </div>
                    <p className="text-sm text-yellow-700">Considere aumentar o foco em procedimentos de endodontia</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Metas e Projeções</CardTitle>
                <CardDescription>Objetivos para o próximo período</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Meta de Faturamento</span>
                      <span className="text-sm text-gray-600">75% atingido</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-green-600 h-3 rounded-full" style={{ width: "75%" }} />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">R$ 90.000,00 / R$ 120.000,00</p>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Meta de Margem</span>
                      <span className="text-sm text-gray-600">85% atingido</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-blue-600 h-3 rounded-full" style={{ width: "85%" }} />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">62% / 65% margem alvo</p>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Procedimentos/Mês</span>
                      <span className="text-sm text-gray-600">92% atingido</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-purple-600 h-3 rounded-full" style={{ width: "92%" }} />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">89 / 100 procedimentos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
