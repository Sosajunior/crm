"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Target, Users, Calendar, CheckCircle, BarChart3, AlertCircle } from "lucide-react"
import dynamic from "next/dynamic"
import { FunnelComponnent } from "./funnelComponnet"


// The ApexCharts component needs to be loaded dynamically because it requires the window object
const DynamicApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center">Carregando gráfico...</div>,
})

interface FunnelAnalysisProps {
  metrics: any
  period: string
}

const data = [
  {
    "id": "step_initiated",
    "value": 34,
    "label": "Atendimentos Iniciados"
  },
  {
    "id": "step_answered",
    "value": 29,
    "label": "Dúvidas Sanadas"
  },
  {
    "id": "step_clicked",
    "value": 26,
    "label": "Oferta de Procedimentos"
  },
  {
    "id": "step_scheduled",
    "value": 18,
    "label": "Agendamentos"
  },
  {
    "id": "step_attended",
    "value": 10,
    "label": "Comparecimentos"
  },
  {
    "id": "step_completed",
    "value": 7,
    "label": "Procedimentos Realizados"
  }
]

export function FunnelAnalysis({ metrics, period }: FunnelAnalysisProps) {
  const stages = [
    {
      name: "Atendimentos Iniciados",
      value: metrics.atendimentosIniciados,
      icon: Users,
      color: "bg-slate-100 text-slate-700 border-slate-200",
      description: "Primeiro contato com potenciais pacientes",
    },
    {
      name: "Dúvidas Sanadas",
      value: metrics.duvidasSanadas,
      icon: CheckCircle,
      color: "bg-slate-100 text-slate-700 border-slate-200",
      description: "Esclarecimentos e informações fornecidas",
    },
    {
      name: "Procedimentos Oferecidos",
      value: metrics.procedimentosOferecidos,
      icon: Target,
      color: "bg-slate-100 text-slate-700 border-slate-200",
      description: "Propostas de tratamento apresentadas",
    },
    {
      name: "Agendamentos Realizados",
      value: metrics.agendamentosRealizados,
      icon: Calendar,
      color: "bg-slate-100 text-slate-700 border-slate-200",
      description: "Consultas efetivamente marcadas",
    },
    {
      name: "Comparecimentos",
      value: metrics.comparecimentos,
      icon: CheckCircle,
      color: "bg-slate-100 text-slate-700 border-slate-200",
      description: "Pacientes que compareceram às consultas",
    },
    {
      name: "Procedimentos Realizados",
      value: metrics.procedimentosRealizados,
      icon: CheckCircle,
      color: "bg-slate-100 text-slate-700 border-slate-200",
      description: "Tratamentos efetivamente concluídos",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Análise do Funil de Conversão</h2>
            <p className="text-slate-600 mt-1">Visualização completa da jornada do paciente</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
              <span className="text-sm text-slate-600">Taxa de Conversão Geral:</span>
              <span className="ml-2 text-lg font-bold text-slate-900">
                {((metrics.procedimentosRealizados / metrics.atendimentosIniciados) * 100).toFixed(1)}%
              </span>
            </div>
            <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50">
              Exportar Relatório
            </Button>
          </div>
        </div>
      </div>
      {/* Conversion Metrics Below Chart */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 bg">
            {stages.map((stage, index) => {
              const conversionRate = index > 0 ? ((stage.value / stages[index - 1].value) * 100).toFixed(1) : "100.0"
              const isGoodConversion = Number.parseFloat(conversionRate) >= 70

              return (
                <div key={stage.name} className="bg-[#86c3da]  backdrop-blur-xlm text-center p-3 rounded-lg">
                  <div className="text-xs font-semibold text-slate-100 mb-1">{stage.name}</div>
                  <div className="text-3xl font-bold text-white mt-4">{stage.value}</div>
                </div>
              )
            })}
          </div>

      {/* Visual Funnel */}
      <div className="flex">
        <Card className="border-slate-200 shadow-lg overflow-hidden w-[800px]">
          <CardHeader className="bg-gradient-to-r from-[#7ac1db] to-[#63c3e6f3] border-b border-slate-200">
            <CardTitle className="text-xl font-bold text-slate-100 flex items-center">
              <BarChart3 className="w-6 h-6 mr-3 text-slate-100" />
              Funil Visual de Conversão
            </CardTitle>
            <p className="text-slate-100">Acompanhe o fluxo completo dos pacientes através de cada etapa</p>
          </CardHeader>
          <CardContent className="bg-white p-6">   
            <div className="bg-white h-96">
            <FunnelComponnent data={data}/>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm w-[400px] ml-32">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center">
              Taxas de Conversão
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {stages.slice(1).map((stage, index) => {
                const prevStage = stages[index]
                const conversionRate = ((stage.value / prevStage.value) * 100).toFixed(1)
                const isGood = Number.parseFloat(conversionRate) >= 70

                return (
                  <div key={stage.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{prevStage.name}</p>
                      <p className="text-xs text-slate-500">para {stage.name}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${isGood ? "text-[#77C293]" : "text-[#C27777]"}`}>
                        {conversionRate}%
                      </div>
                      <div className="flex items-center">
                        {isGood ? (
                          <TrendingUp className="w-3 h-3 text-[#77C293] mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-[#C27777] mr-1" />
                        )}
                        <span className={`text-xs ${isGood ? "text-[#77C293]" : "text-[#C27777]"}`}>
                          {isGood ? "Excelente" : "Atenção"}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
      

      {/* Detailed Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Performance Insights */}
  <Card className="border-slate-200 shadow-sm flex flex-col h-full min-h-[220px]">
    <CardHeader className="border-b border-slate-100">
      <CardTitle className="text-lg font-semibold text-slate-900 flex items-center">
        <CheckCircle className="w-5 h-5 mr-2 text-[#77C293]" />
        Insights de Performance
      </CardTitle>
    </CardHeader>
    <CardContent className="p-6 flex-1 flex flex-col justify-between">
      <div className="space-y-4">
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[#77C293]" />
            <span className="font-medium text-green-800">Melhor Etapa</span>
          </div>
          <p className="text-sm text-green-700">
            {(() => {
              const rates = stages.slice(1).map((stage, index) => ({
                name: stage.name,
                rate: (stage.value / stages[index].value) * 100,
              }))
              const best = rates.reduce((prev, current) => (prev.rate > current.rate ? prev : current))
              return `${best.name}: ${best.rate.toFixed(1)}% de conversão`
            })()}
          </p>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-[#C27777]" />
            <span className="font-medium text-orange-800">Maior Perda</span>
          </div>
          <p className="text-sm text-orange-700">
            {(() => {
              const losses = stages.slice(1).map((stage, index) => ({
                from: stages[index].name,
                to: stage.name,
                loss: stages[index].value - stage.value,
                percentage: ((stages[index].value - stage.value) / stages[index].value) * 100,
              }))
              const biggest = losses.reduce((prev, current) => (prev.loss > current.loss ? prev : current))
              return `${biggest.loss} pacientes perdidos entre ${biggest.from} e ${biggest.to}`
            })()}
          </p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-800">Eficiência Geral</span>
          </div>
          <p className="text-sm text-blue-700">
            {((metrics.procedimentosRealizados / metrics.atendimentosIniciados) * 100).toFixed(1)}% dos contatos iniciais resultam em procedimentos
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
  {/* Action Items */}
  <Card className="border-slate-200 shadow-sm flex flex-col h-full min-h-[220px]">
    <CardHeader className="border-b border-slate-100">
      <CardTitle className="text-lg font-semibold text-slate-900 flex items-center">
        <Target className="w-5 h-5 mr-2 text-purple-600" />
        Ações Recomendadas
      </CardTitle>
    </CardHeader>
    <CardContent className="p-6 flex-1 flex flex-col justify-between">
      <div className="space-y-4">
        {(() => {
          const conversionRates = stages.slice(1).map((stage, index) => ({
            stage: stage.name,
            rate: (stage.value / stages[index].value) * 100,
            index: index + 1,
          }))
          const lowConversion = conversionRates.filter((r) => r.rate < 70)
          return lowConversion.length > 0 ? (
            lowConversion.map((item, index) => (
              <div key={index} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-4 h-4 text-[#C27777]" />
                  <span className="font-medium text-slate-800">Melhorar {item.stage}</span>
                </div>
                <p className="text-sm text-slate-600">
                  Taxa atual: {item.rate.toFixed(1)}%. Foque em estratégias para aumentar a conversão nesta etapa.
                </p>
              </div>
            ))
          ) : (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
              <CheckCircle className="w-8 h-8 text-[#77C293] mx-auto mb-2" />
              <p className="text-sm text-green-700 font-medium">Excelente Performance!</p>
              <p className="text-xs text-[#77C293] mt-1">Todas as etapas estão com boa conversão</p>
            </div>
          )
        })()}
      </div>
    </CardContent>
  </Card>
</div>

      {/* Summary Statistics */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-lg font-semibold text-slate-900">Resumo Estatístico</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900 mb-1">{metrics.atendimentosIniciados}</div>
              <p className="text-sm text-slate-600">Contatos Iniciais</p>
              <p className="text-xs text-slate-500 mt-1">Base do funil</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">{metrics.procedimentosRealizados}</div>
              <p className="text-sm text-slate-600">Procedimentos Realizados</p>
              <p className="text-xs text-slate-500 mt-1">Resultado final</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#77C293] mb-1">
                {((metrics.procedimentosRealizados / metrics.atendimentosIniciados) * 100).toFixed(1)}%
              </div>
              <p className="text-sm text-slate-600">Taxa de Conversão</p>
              <p className="text-xs text-slate-500 mt-1">Eficiência geral</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#C27777] mb-1">
                {metrics.atendimentosIniciados - metrics.procedimentosRealizados}
              </div>
              <p className="text-sm text-slate-600">Oportunidades Perdidas</p>
              <p className="text-xs text-slate-500 mt-1">Potencial de melhoria</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
