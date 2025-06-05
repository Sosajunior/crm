import { type NextRequest, NextResponse } from "next/server"

// Mock database - mesmo array do route principal
const patients = [
  {
    id: "1",
    name: "Maria Silva",
    email: "maria.silva@email.com",
    phone: "(11) 99999-9999",
    lastContact: "2024-01-15",
    funnelStage: "procedimento_realizado",
    createdAt: "2024-01-10",
    appointments: [
      { date: "2024-01-15", type: "Limpeza", status: "realizado" },
      { date: "2024-01-10", type: "Consulta", status: "realizado" },
    ],
    procedures: [{ date: "2024-01-15", name: "Limpeza Dental", status: "concluído" }],
  },
  {
    id: "2",
    name: "João Santos",
    email: "joao.santos@email.com",
    phone: "(11) 88888-8888",
    lastContact: "2024-01-14",
    funnelStage: "agendamento_confirmado",
    createdAt: "2024-01-12",
    appointments: [{ date: "2024-01-20", type: "Consulta", status: "confirmado" }],
    procedures: [],
  },
]

// GET - Buscar paciente por ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const patient = patients.find((p) => p.id === params.id)

  if (!patient) {
    return NextResponse.json({ error: "Paciente não encontrado" }, { status: 404 })
  }

  return NextResponse.json({ patient })
}

// PUT - Atualizar paciente
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const patientIndex = patients.findIndex((p) => p.id === params.id)

    if (patientIndex === -1) {
      return NextResponse.json({ error: "Paciente não encontrado" }, { status: 404 })
    }

    // Atualizar dados
    patients[patientIndex] = {
      ...patients[patientIndex],
      ...body,
      id: params.id, // Garantir que o ID não seja alterado
    }

    return NextResponse.json({
      success: true,
      patient: patients[patientIndex],
    })
  } catch (error) {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

// DELETE - Excluir paciente
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const patientIndex = patients.findIndex((p) => p.id === params.id)

  if (patientIndex === -1) {
    return NextResponse.json({ error: "Paciente não encontrado" }, { status: 404 })
  }

  // Remover paciente
  patients.splice(patientIndex, 1)

  return NextResponse.json({
    success: true,
    message: "Paciente excluído com sucesso",
  })
}
