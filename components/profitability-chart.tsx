"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Procedure {
  id: string
  name: string
  category: string
  price: number
  cost: number
  profit: number
  margin: number
  quantity: number
  totalRevenue: number
  totalCost: number
  totalProfit: number
}

interface ProfitabilityChartProps {
  procedures: Procedure[]
}

export function ProfitabilityChart({ procedures }: ProfitabilityChartProps) {
  // Ordenar por lucratividade total
  const sortedByProfit = [...procedures].sort((a, b) => b.totalProfit - a.totalProfit)

  // Ordenar por margem
  const sortedByMargin = [...procedures].sort((a, b) => b.margin - a.margin)

  const maxProfit = Math.max(...procedures.map((p) => p.totalProfit))
  const maxMargin = Math.max(...procedures.map((p) => p.margin))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Ranking por Lucro Total */}
      <Card>
        <CardHeader>
          <CardTitle>Ranking por Lucro Total</CardTitle>
          <CardDescription>Procedimentos ordenados por lucro absoluto</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedByProfit.map((procedure, index) => {
              const width = (procedure.totalProfit / maxProfit) * 100
              const isTop3 = index < 3

              return (
                <div key={procedure.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center text-white ${
                          index === 0
                            ? "bg-yellow-500"
                            : index === 1
                              ? "bg-gray-400"
                              : index === 2
                                ? "bg-orange-600"
                                : "bg-gray-300"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span className="font-medium">{procedure.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">
                        R$ {procedure.totalProfit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-xs text-gray-500">{procedure.quantity} realizados</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        isTop3 ? "bg-gradient-to-r from-green-500 to-green-600" : "bg-green-400"
                      }`}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Ranking por Margem */}
      <Card>
        <CardHeader>
          <CardTitle>Ranking por Margem de Lucro</CardTitle>
          <CardDescription>Procedimentos ordenados por percentual de margem</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedByMargin.map((procedure, index) => {
              const width = (procedure.margin / maxMargin) * 100
              const isTop3 = index < 3

              return (
                <div key={procedure.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center text-white ${
                          index === 0
                            ? "bg-yellow-500"
                            : index === 1
                              ? "bg-gray-400"
                              : index === 2
                                ? "bg-orange-600"
                                : "bg-gray-300"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span className="font-medium">{procedure.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600">{procedure.margin.toFixed(1)}%</div>
                      <div className="text-xs text-gray-500">
                        R$ {procedure.profit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} por unidade
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        isTop3 ? "bg-gradient-to-r from-blue-500 to-blue-600" : "bg-blue-400"
                      }`}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Análise de Eficiência */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Matriz de Eficiência</CardTitle>
          <CardDescription>Análise combinada de volume vs margem de lucro</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {procedures.map((procedure) => {
              // Classificar baseado em volume e margem
              const isHighVolume = procedure.quantity >= 15
              const isHighMargin = procedure.margin >= 65

              let classification = ""
              let bgColor = ""

              if (isHighVolume && isHighMargin) {
                classification = "Estrela"
                bgColor = "bg-green-100 border-green-300"
              } else if (isHighVolume && !isHighMargin) {
                classification = "Vaca Leiteira"
                bgColor = "bg-blue-100 border-blue-300"
              } else if (!isHighVolume && isHighMargin) {
                classification = "Oportunidade"
                bgColor = "bg-yellow-100 border-yellow-300"
              } else {
                classification = "Questionável"
                bgColor = "bg-red-100 border-red-300"
              }

              return (
                <div key={procedure.id} className={`p-4 rounded-lg border-2 ${bgColor}`}>
                  <div className="font-medium text-sm mb-2">{procedure.name}</div>
                  <div className="text-xs text-gray-600 mb-2">{classification}</div>
                  <div className="space-y-1 text-xs">
                    <div>Volume: {procedure.quantity}</div>
                    <div>Margem: {procedure.margin.toFixed(1)}%</div>
                    <div>Lucro: R$ {procedure.totalProfit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-200 border border-green-300 rounded"></div>
              <span>Estrela (Alto Volume + Alta Margem)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-200 border border-blue-300 rounded"></div>
              <span>Vaca Leiteira (Alto Volume + Baixa Margem)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-200 border border-yellow-300 rounded"></div>
              <span>Oportunidade (Baixo Volume + Alta Margem)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-200 border border-red-300 rounded"></div>
              <span>Questionável (Baixo Volume + Baixa Margem)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
