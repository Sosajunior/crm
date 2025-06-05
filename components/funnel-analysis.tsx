"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Target, Users, Calendar as CalendarIcon, CheckCircle, BarChart3, AlertCircle, Download } from "lucide-react"
import { FunnelComponnent } from "./funnelComponnet" // Assume que está no mesmo diretório ou caminho correto

// Reutilizar MetricValues de app/page.tsx ou de um types/index.ts
interface MetricValues {
  atendimentosIniciados: number;
  duvidasSanadas: number;
  procedimentosOferecidos: number;
  agendamentosRealizados: number;
  confirmacoesAgendamento: number; // Adicionar à API de métricas se não existir
  comparecimentos: number;
  procedimentosRealizados: number;
  // ... outros campos de métricas se necessários para este componente
}

interface FunnelAnalysisProps {
  metrics: MetricValues | null; // Pode ser nulo enquanto carrega
  period: string;
}

export function FunnelAnalysis({ metrics, period }: FunnelAnalysisProps) {
  if (!metrics) {
    return <div className="flex justify-center items-center h-64"><p>Carregando análise de funil...</p></div>;
  }

  const funnelChartData = [
    { id: "atendimentos_iniciados", value: metrics.atendimentosIniciados, label: "Atend. Iniciados" },
    { id: "duvidas_sanadas", value: metrics.duvidasSanadas, label: "Dúvidas Sanadas" },
    { id: "procedimentos_oferecidos", value: metrics.procedimentosOferecidos, label: "Proced. Oferecidos" },
    { id: "agendamentos_realizados", value: metrics.agendamentosRealizados, label: "Agendamentos" },
    { id: "comparecimentos", value: metrics.comparecimentos, label: "Comparecimentos" },
    { id: "procedimentos_realizados", value: metrics.procedimentosRealizados, label: "Proced. Realizados" },
  ];

  const stagesForRateCalculation = [ // Para as taxas de conversão entre etapas
    { name: "Atendimentos Iniciados", value: metrics.atendimentosIniciados },
    { name: "Dúvidas Sanadas", value: metrics.duvidasSanadas },
    { name: "Procedimentos Oferecidos", value: metrics.procedimentosOferecidos },
    { name: "Agendamentos Realizados", value: metrics.agendamentosRealizados },
    { name: "Comparecimentos", value: metrics.comparecimentos },
    { name: "Procedimentos Realizados", value: metrics.procedimentosRealizados },
  ];

  const overallConversionRate = metrics.atendimentosIniciados > 0
    ? ((metrics.procedimentosRealizados / metrics.atendimentosIniciados) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Análise do Funil de Conversão</h2>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Visualização completa da jornada do paciente ({period === 'today' ? 'Hoje' : period === 'week' ? 'Esta Semana' : 'Este Mês'}).</p>
        </div>
        <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
          <div className="bg-card border border-border rounded-lg p-2 md:px-3 md:py-2 text-xs md:text-sm flex-1 md:flex-initial">
            <span className="text-muted-foreground">Conversão Geral: </span>
            <span className="font-bold text-primary">{overallConversionRate}%</span>
          </div>
          <Button variant="outline" size="sm" className="border-input text-foreground hover:bg-accent h-9">
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 card-hover shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/80 to-primary border-b">
            <CardTitle className="text-lg md:text-xl font-semibold text-primary-foreground flex items-center">
              <BarChart3 className="w-5 h-5 mr-2.5" />
              Funil Visual de Conversão
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-card p-4 md:p-6">
            <div className="h-[350px] md:h-[400px] bg-card"> {/* Ajuste a altura conforme necessário */}
              <FunnelComponnent data={funnelChartData} />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
            <Card className="card-hover shadow-sm">
                <CardHeader className="pb-3 border-b">
                    <CardTitle className="text-base md:text-lg font-semibold text-foreground flex items-center">
                        <TrendingUp className="w-4 h-4 md:w-5 md:h-5 mr-2 text-primary" />
                        Taxas de Conversão
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6 space-y-3">
                    {stagesForRateCalculation.slice(1).map((stage, index) => {
                    const prevStage = stagesForRateCalculation[index]; // Index é o do array original, então stages[index] é o anterior
                    const conversionRate = prevStage.value > 0 ? ((stage.value / prevStage.value) * 100).toFixed(1) : "0.0";
                    const isGood = parseFloat(conversionRate) >= 70;

                    return (
                        <div key={stage.name} className="flex items-center justify-between text-xs md:text-sm">
                        <div>
                            <p className="font-medium text-foreground">{prevStage.name} →</p>
                            <p className="text-muted-foreground">{stage.name}</p>
                        </div>
                        <div className={`font-semibold ${isGood ? "text-success-foreground" : "text-destructive"}`}>
                            {conversionRate}%
                        </div>
                        </div>
                    );
                    })}
                </CardContent>
            </Card>
             <Card className="card-hover shadow-sm">
                <CardHeader className="pb-3 border-b">
                    <CardTitle className="text-base md:text-lg font-semibold text-foreground flex items-center">
                        <Users className="w-4 h-4 md:w-5 md:h-5 mr-2 text-primary" />
                        Volume por Etapa
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6 space-y-3">
                    {stagesForRateCalculation.map((stage) => (
                        <div key={stage.name} className="flex items-center justify-between text-xs md:text-sm">
                            <p className="font-medium text-foreground">{stage.name}</p>
                            <p className="font-semibold text-primary">{stage.value}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="card-hover shadow-sm">
          <CardHeader className="border-b">
            <CardTitle className="text-base md:text-lg font-semibold text-foreground flex items-center">
              <CheckCircle className="w-4 h-4 md:w-5 md:h-5 mr-2 text-success-foreground" />
              Insights de Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 space-y-3">
             <div className="p-3 bg-success-muted rounded-lg border border-success-foreground/20">
                <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-success-foreground" />
                    <span className="font-medium text-sm text-success-foreground">Melhor Etapa de Conversão</span>
                </div>
                <p className="text-xs text-success-foreground/90">
                    {(() => {
                    const rates = stagesForRateCalculation.slice(1).map((s, i) => ({ name: `${stagesForRateCalculation[i].name} → ${s.name}`, rate: stagesForRateCalculation[i].value > 0 ? (s.value / stagesForRateCalculation[i].value) * 100 : 0 }));
                    if (rates.length === 0) return "N/A";
                    const best = rates.reduce((prev, current) => (prev.rate > current.rate ? prev : current));
                    return `${best.name}: ${best.rate.toFixed(1)}%`;
                    })()}
                </p>
            </div>
            <div className="p-3 bg-warning-muted rounded-lg border border-warning-foreground/20">
                <div className="flex items-center gap-2 mb-1">
                    <TrendingDown className="w-4 h-4 text-warning-foreground" />
                    <span className="font-medium text-sm text-warning-foreground">Ponto de Maior Perda</span>
                </div>
                 <p className="text-xs text-warning-foreground/90">
                    {(() => {
                    const losses = stagesForRateCalculation.slice(1).map((s, i) => ({ from: stagesForRateCalculation[i].name, to: s.name, lossPercentage: stagesForRateCalculation[i].value > 0 ? ((stagesForRateCalculation[i].value - s.value) / stagesForRateCalculation[i].value) * 100 : 0}));
                    if (losses.length === 0) return "N/A";
                    const biggest = losses.reduce((prev, current) => (prev.lossPercentage > current.lossPercentage ? prev : current));
                    return `Entre ${biggest.from} e ${biggest.to} (${biggest.lossPercentage.toFixed(1)}% de perda)`;
                    })()}
                </p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover shadow-sm">
          <CardHeader className="border-b">
            <CardTitle className="text-base md:text-lg font-semibold text-foreground flex items-center">
              <Target className="w-4 h-4 md:w-5 md:h-5 mr-2 text-primary" />
              Ações Recomendadas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 space-y-3">
             {(() => {
                const rates = stagesForRateCalculation.slice(1).map((s, i) => ({ from: stagesForRateCalculation[i].name, to: s.name, rate: stagesForRateCalculation[i].value > 0 ? (s.value / stagesForRateCalculation[i].value) * 100 : 100 }));
                const lowConversionPoints = rates.filter(r => r.rate < 60); // Exemplo de limiar
                if (lowConversionPoints.length === 0) return <div className="p-3 bg-success-muted rounded-lg border border-success-foreground/20 text-center text-sm text-success-foreground">Funil saudável!</div>;
                return lowConversionPoints.map(item => (
                    <div key={item.to} className="p-3 bg-warning-muted rounded-lg border border-warning-foreground/20">
                        <div className="flex items-center gap-2 mb-1">
                            <AlertCircle className="w-4 h-4 text-warning-foreground" />
                            <span className="font-medium text-sm text-warning-foreground">Otimizar: {item.from} → {item.to}</span>
                        </div>
                        <p className="text-xs text-warning-foreground/90">Taxa de conversão atual: {item.rate.toFixed(1)}%. Explorar melhorias nesta etapa.</p>
                    </div>
                ));
             })()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}