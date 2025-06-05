"use client"

interface RevenueChartProps {
  period: string
}

export function RevenueChart({ period }: RevenueChartProps) {
  // Mock data baseado no período
  const chartData = {
    today: [
      { time: "08:00", revenue: 450, cost: 150, profit: 300 },
      { time: "10:00", revenue: 850, cost: 280, profit: 570 },
      { time: "14:00", revenue: 280, cost: 95, profit: 185 },
      { time: "16:00", revenue: 150, cost: 45, profit: 105 },
    ],
    week: [
      { day: "Seg", revenue: 2400, cost: 800, profit: 1600 },
      { day: "Ter", revenue: 3200, cost: 1100, profit: 2100 },
      { day: "Qua", revenue: 1800, cost: 650, profit: 1150 },
      { day: "Qui", revenue: 4100, cost: 1350, profit: 2750 },
      { day: "Sex", revenue: 3800, cost: 1200, profit: 2600 },
      { day: "Sáb", revenue: 1200, cost: 400, profit: 800 },
    ],
    month: [
      { week: "Sem 1", revenue: 15300, cost: 5200, profit: 10100 },
      { week: "Sem 2", revenue: 18700, cost: 6100, profit: 12600 },
      { week: "Sem 3", revenue: 16200, cost: 5800, profit: 10400 },
      { week: "Sem 4", revenue: 17300, cost: 5550, profit: 11750 },
    ],
  }

  const data = chartData[period] || chartData.today
  const maxValue = Math.max(...data.map((d) => d.revenue))

  return (
    <div className="space-y-4">
      {/* Legenda */}
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Receita</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Custo</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span>Lucro</span>
        </div>
      </div>

      {/* Gráfico */}
      <div className="space-y-3">
        {data.map((item, index) => {
          const revenueWidth = (item.revenue / maxValue) * 100
          const costWidth = (item.cost / maxValue) * 100
          const profitWidth = (item.profit / maxValue) * 100
          const label = item.time || item.day || item.week

          return (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{label}</span>
                <span className="text-gray-600">
                  R$ {item.revenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* Barra de Receita */}
              <div className="relative h-6 bg-gray-200 rounded">
                <div
                  className="absolute top-0 left-0 h-full bg-green-500 rounded transition-all duration-500"
                  style={{ width: `${revenueWidth}%` }}
                />
                <div
                  className="absolute top-0 left-0 h-full bg-red-500 rounded transition-all duration-500"
                  style={{ width: `${costWidth}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                  Lucro: R$ {item.profit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
              </div>

              {/* Detalhes */}
              <div className="flex justify-between text-xs text-gray-500">
                <span>Custo: R$ {item.cost.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                <span>Margem: {((item.profit / item.revenue) * 100).toFixed(1)}%</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Resumo */}
      <div className="pt-4 border-t">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-green-600">
              R${" "}
              {data.reduce((sum, item) => sum + item.revenue, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-gray-600">Receita Total</div>
          </div>
          <div>
            <div className="text-lg font-bold text-red-600">
              R$ {data.reduce((sum, item) => sum + item.cost, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-gray-600">Custo Total</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600">
              R${" "}
              {data.reduce((sum, item) => sum + item.profit, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-gray-600">Lucro Total</div>
          </div>
        </div>
      </div>
    </div>
  )
}
