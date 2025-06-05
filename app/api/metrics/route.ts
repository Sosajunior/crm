import { type NextRequest, NextResponse } from "next/server"

// Mock data para métricas - Em produção, viria do banco de dados
const mockMetrics = {
  today: {
    atendimentosIniciados: 12,
    duvidasSanadas: 8,
    procedimentosOferecidos: 6,
    agendamentosRealizados: 4,
    confirmacoesAgendamento: 3,
    comparecimentos: 2,
    procedimentosRealizados: 1,
    faturamento: 850.0,
    gastos: 320.0,
    lucro: 530.0,
  },
  week: {
    atendimentosIniciados: 85,
    duvidasSanadas: 68,
    procedimentosOferecidos: 45,
    agendamentosRealizados: 32,
    confirmacoesAgendamento: 28,
    comparecimentos: 24,
    procedimentosRealizados: 18,
    faturamento: 15300.0,
    gastos: 5940.0,
    lucro: 9360.0,
  },
  month: {
    atendimentosIniciados: 340,
    duvidasSanadas: 285,
    procedimentosOferecidos: 198,
    agendamentosRealizados: 145,
    confirmacoesAgendamento: 128,
    comparecimentos: 112,
    procedimentosRealizados: 89,
    faturamento: 67500.0,
    gastos: 25650.0,
    lucro: 41850.0,
  },
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const period = searchParams.get("period") || "today"
  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")

  // Se datas específicas forem fornecidas, calcular métricas para o período
  if (startDate && endDate) {
    // Aqui você implementaria a lógica para calcular métricas
    // baseadas no período específico consultando o banco de dados
    return NextResponse.json({
      period: `${startDate} - ${endDate}`,
      metrics: mockMetrics.month, // Placeholder
    })
  }

  // Retornar métricas para o período solicitado
  const metrics = mockMetrics[period] || mockMetrics.today

  // Calcular taxas de conversão
  const conversionRates = {
    duvidasSanadas: ((metrics.duvidasSanadas / metrics.atendimentosIniciados) * 100).toFixed(1),
    procedimentosOferecidos: ((metrics.procedimentosOferecidos / metrics.duvidasSanadas) * 100).toFixed(1),
    agendamentos: ((metrics.agendamentosRealizados / metrics.procedimentosOferecidos) * 100).toFixed(1),
    confirmacoes: ((metrics.confirmacoesAgendamento / metrics.agendamentosRealizados) * 100).toFixed(1),
    comparecimentos: ((metrics.comparecimentos / metrics.confirmacoesAgendamento) * 100).toFixed(1),
    procedimentos: ((metrics.procedimentosRealizados / metrics.comparecimentos) * 100).toFixed(1),
  }

  // Calcular métricas financeiras adicionais
  const roi = ((metrics.lucro / metrics.gastos) * 100).toFixed(1)
  const ticketMedio =
    metrics.procedimentosRealizados > 0 ? (metrics.faturamento / metrics.procedimentosRealizados).toFixed(2) : "0.00"
  const custoMedio =
    metrics.procedimentosRealizados > 0 ? (metrics.gastos / metrics.procedimentosRealizados).toFixed(2) : "0.00"

  return NextResponse.json({
    period,
    metrics,
    conversionRates,
    financialMetrics: {
      roi,
      ticketMedio: Number.parseFloat(ticketMedio),
      custoMedio: Number.parseFloat(custoMedio),
      margemLucro: ((metrics.lucro / metrics.faturamento) * 100).toFixed(1),
    },
    timestamp: new Date().toISOString(),
  })
}
