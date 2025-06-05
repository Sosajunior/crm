"use client"
import { useState, useEffect, useCallback } from "react";
import { TrendingUp, DollarSign, AlertTriangle } from "lucide-react"; // Usar ícones consistentes

interface RevenueChartDataPoint {
  time?: string; // For 'today'
  day?: string;  // For 'week'
  week?: string; // For 'month'
  revenue: number;
  cost: number;
  profit: number;
}

interface RevenueChartProps {
  period: "today" | "week" | "month";
}

export function RevenueChart({ period }: RevenueChartProps) {
  const [chartData, setChartData] = useState<RevenueChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // A API de métricas já retorna faturamento, gastos, lucro totais.
      // Para um gráfico de evolução, precisaríamos de um endpoint que retorne dados agrupados por dia/hora/semana.
      // Ex: /api/metrics/revenue-evolution?period=week
      // const response = await fetch(`/api/metrics/revenue-evolution?period=${period}`);
      // if (!response.ok) throw new Error('Failed to fetch revenue data');
      // const data = await response.json();
      // setChartData(data);

      // Simulação da API, pois não temos esse endpoint detalhado:
      let simulatedData: RevenueChartDataPoint[] = [];
      if (period === "today") {
        simulatedData = [
          { time: "08:00", revenue: Math.random()*500 + 200, cost: Math.random()*150+50, get profit() { return this.revenue - this.cost;} },
          { time: "10:00", revenue: Math.random()*800 + 300, cost: Math.random()*250+100, get profit() { return this.revenue - this.cost;} },
          { time: "14:00", revenue: Math.random()*400 + 100, cost: Math.random()*100+50, get profit() { return this.revenue - this.cost;} },
          { time: "16:00", revenue: Math.random()*300 + 50,  cost: Math.random()*80+20, get profit() { return this.revenue - this.cost;} },
        ];
      } else if (period === "week") {
        simulatedData = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(day => ({
          day,
          revenue: Math.random()*4000 + 1000,
          cost: Math.random()*1200 + 400,
          get profit() { return this.revenue - this.cost;}
        }));
      } else { // month
        simulatedData = ["Sem 1", "Sem 2", "Sem 3", "Sem 4"].map(week => ({
          week,
          revenue: Math.random()*15000 + 5000,
          cost: Math.random()*5000 + 2000,
          get profit() { return this.revenue - this.cost;}
        }));
      }
      setChartData(simulatedData);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      setChartData([]);
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) return <div className="text-center py-10 text-muted-foreground">Carregando gráfico de receita...</div>;
  if (error) return <div className="text-center py-10 text-destructive flex items-center justify-center gap-2"><AlertTriangle className="w-5 h-5" /> Erro: {error}</div>;
  if (chartData.length === 0) return <div className="text-center py-10 text-muted-foreground">Sem dados de receita para exibir.</div>;

  const maxValue = Math.max(1, ...chartData.map((d) => d.revenue)); // Max de 1 para evitar divisão por zero

  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);
  const totalCost = chartData.reduce((sum, item) => sum + item.cost, 0);
  const totalProfit = chartData.reduce((sum, item) => sum + item.profit, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-success-foreground rounded-sm"></div><span>Receita</span></div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-destructive rounded-sm"></div><span>Custo</span></div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-primary rounded-sm"></div><span>Lucro</span></div>
      </div>

      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
        {chartData.map((item, index) => {
          const revenueWidth = (item.revenue / maxValue) * 100;
          // const costWidth = (item.cost / maxValue) * 100; // Custo é parte da receita
          const profitWidth = (item.profit / maxValue) * 100;
          const label = item.time || item.day || item.week;

          return (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-foreground">{label}</span>
                <span className="text-muted-foreground">
                  R$ {item.revenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="relative h-5 bg-muted rounded">
                <div
                  className="absolute top-0 left-0 h-full bg-success-foreground rounded transition-all duration-300 ease-out"
                  style={{ width: `${revenueWidth}%` }}
                  title={`Receita: R$ ${item.revenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                />
                 {/* Barra de Lucro sobrepõe parte da de Receita, Custo é a diferença */}
                <div
                  className="absolute top-0 left-0 h-full bg-primary rounded transition-all duration-300 ease-out"
                  style={{ width: `${profitWidth}%` }}
                  title={`Lucro: R$ ${item.profit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground/80">
                <span>Custo: R$ {item.cost.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                <span>Margem: {item.revenue > 0 ? ((item.profit / item.revenue) * 100).toFixed(1) : 0}%</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-4 border-t">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-sm md:text-base font-bold text-success-foreground">
              R$ {totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] md:text-xs text-muted-foreground">Receita Total</div>
          </div>
          <div>
            <div className="text-sm md:text-base font-bold text-destructive">
              R$ {totalCost.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] md:text-xs text-muted-foreground">Custo Total</div>
          </div>
          <div>
            <div className="text-sm md:text-base font-bold text-primary">
              R$ {totalProfit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] md:text-xs text-muted-foreground">Lucro Total</div>
          </div>
        </div>
      </div>
    </div>
  );
}