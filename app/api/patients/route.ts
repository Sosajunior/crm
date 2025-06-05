import { type NextRequest, NextResponse } from "next/server"

// Mock database - Em produção, usar um banco de dados real
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

// GET - Listar pacientes
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search")
  const stage = searchParams.get("stage")

  let filteredPatients = patients

  if (search) {
    filteredPatients = filteredPatients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(search.toLowerCase()) ||
        patient.email.toLowerCase().includes(search.toLowerCase()) ||
        patient.phone.includes(search),
    )
  }

  if (stage && stage !== "all") {
    filteredPatients = filteredPatients.filter((patient) => patient.funnelStage === stage)
  }

  return NextResponse.json({
    patients: filteredPatients,
    total: filteredPatients.length,
  })
}

// POST - Criar novo paciente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone } = body

    // Validações básicas
    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Nome, email e telefone são obrigatórios" }, { status: 400 })
    }

    // Verificar se já existe
    const existingPatient = patients.find((p) => p.email === email || p.phone === phone)

    if (existingPatient) {
      return NextResponse.json({ error: "Paciente já cadastrado com este email ou telefone" }, { status: 409 })
    }

    // Criar novo paciente
    const newPatient = {
      id: (patients.length + 1).toString(),
      name,
      email,
      phone,
      lastContact: new Date().toISOString().split("T")[0],
      funnelStage: "atendimento_iniciado",
      createdAt: new Date().toISOString().split("T")[0],
      appointments: [],
      procedures: [],
    }

    patients.push(newPatient)

    return NextResponse.json(
      {
        success: true,
        patient: newPatient,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
