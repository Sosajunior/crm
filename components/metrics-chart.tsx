"use client"

interface MetricsChartProps {
  period: string
}

export function MetricsChart({ period }: MetricsChartProps) {
  // Mock data for different periods
  const chartData = {
    today: [
      { hour: "08:00", value: 2 },
      { hour: "10:00", value: 5 },
      { hour: "12:00", value: 3 },
      { hour: "14:00", value: 8 },
      { hour: "16:00", value: 4 },
      { hour: "18:00", value: 1 },
    ],
    week: [
      { day: "Seg", value: 12 },
      { day: "Ter", value: 15 },
      { day: "Qua", value: 8 },
      { day: "Qui", value: 18 },
      { day: "Sex", value: 22 },
      { day: "Sáb", value: 6 },
      { day: "Dom", value: 4 },
    ],
    month: [
      { week: "Sem 1", value: 85 },
      { week: "Sem 2", value: 92 },
      { week: "Sem 3", value: 78 },
      { week: "Sem 4", value: 85 },
    ],
  }

  const data = chartData[period] || chartData.today
  const maxValue = Math.max(...data.map((d) => d.value))

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-blue-600 font-medium">Taxa de Agendamento</div>
          <div className="text-2xl font-bold text-blue-700">68.5%</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-green-600 font-medium">Taxa de Comparecimento</div>
          <div className="text-2xl font-bold text-green-700">85.7%</div>
        </div>
      </div>

      <div className="space-y-2">
        {data.map((item, index) => {
          const width = (item.value / maxValue) * 100
          const label = item.hour || item.day || item.week

          return (
            <div key={index} className="flex items-center gap-3">
              <div className="w-12 text-xs text-gray-600">{label}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full flex items-center justify-end pr-2 text-white text-xs transition-all duration-500"
                  style={{ width: `${width}%` }}
                >
                  {width > 15 && item.value}
                </div>
              </div>
              <div className="w-8 text-xs text-gray-600">{item.value}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
