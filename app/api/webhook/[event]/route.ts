import { type NextRequest, NextResponse } from "next/server"

// Tipos de eventos suportados
const SUPPORTED_EVENTS = [
  "atendimento_iniciado",
  "duvida_sanada",
  "procedimento_oferecido",
  "agendamento_consulta_realizado",
  "confirmacao_agendamento",
  "presenca_agendamento_confirmada",
  "procedimento_realizado",
]

export async function POST(request: NextRequest, { params }: { params: { event: string } }) {
  try {
    const event = params.event

    // Validar se o evento é suportado
    if (!SUPPORTED_EVENTS.includes(event)) {
      return NextResponse.json({ error: "Evento não suportado" }, { status: 400 })
    }

    const body = await request.json()

    // Validar dados obrigatórios
    const { identifier, email, phone, timestamp, ...additionalData } = body

    if (!identifier && !email && !phone) {
      return NextResponse.json(
        { error: "Pelo menos um identificador (identifier, email ou phone) é obrigatório" },
        { status: 400 },
      )
    }

    // Aqui você processaria o webhook
    // 1. Identificar/criar paciente
    // 2. Atualizar status no funil
    // 3. Incrementar contadores
    // 4. Registrar log do evento

    console.log(`Webhook recebido: ${event}`, {
      identifier,
      email,
      phone,
      timestamp: timestamp || new Date().toISOString(),
      additionalData,
    })

    // Simular processamento
    await processWebhookEvent(event, {
      identifier,
      email,
      phone,
      timestamp: timestamp || new Date().toISOString(),
      ...additionalData,
    })

    return NextResponse.json({
      success: true,
      message: `Evento ${event} processado com sucesso`,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erro ao processar webhook:", error)

    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

async function processWebhookEvent(event: string, data: any) {
  // Aqui você implementaria a lógica de processamento
  // Por exemplo:

  switch (event) {
    case "atendimento_iniciado":
      // Criar/atualizar paciente
      // Incrementar contador de atendimentos iniciados
      // Atualizar status do paciente no funil
      break

    case "duvida_sanada":
      // Atualizar status do paciente
      // Incrementar contador
      break

    case "procedimento_oferecido":
      // Registrar procedimentos oferecidos
      // Atualizar status
      break

    case "agendamento_consulta_realizado":
      // Criar agendamento
      // Atualizar status
      break

    case "confirmacao_agendamento":
      // Confirmar agendamento
      // Atualizar status
      break

    case "presenca_agendamento_confirmada":
      // Marcar presença
      // Atualizar status
      break

    case "procedimento_realizado":
      // Registrar procedimento realizado
      // Processar dados financeiros se fornecidos
      const { procedimento_nome, valor, custo } = data
      if (valor && custo) {
        const lucro = valor - custo
        // Atualizar métricas financeiras
        // Incrementar faturamento, gastos e lucro
        console.log(
          `Procedimento financeiro: ${procedimento_nome}, Valor: R$ ${valor}, Custo: R$ ${custo}, Lucro: R$ ${lucro}`,
        )
      }
      // Atualizar status final
      break
  }

  // Simular delay de processamento
  await new Promise((resolve) => setTimeout(resolve, 100))
}

// Endpoint para testar conectividade
export async function GET() {
  return NextResponse.json({
    status: "online",
    supportedEvents: SUPPORTED_EVENTS,
    timestamp: new Date().toISOString(),
  })
}
