import { type NextRequest, NextResponse } from "next/server";
// import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  // Extrair filtros: patientId, dateRange, category, status, paymentStatus
  // const procedures = await query("SELECT pp.*, p.full_name as patient_name, pc.name as procedure_name, pc.category FROM procedures_performed pp JOIN patients p ON pp.patient_id = p.id JOIN procedure_catalog pc ON pp.procedure_catalog_id = pc.id WHERE ...");
  // Mock
  const procedures = [
    { id: "1", date: "2024-07-13", patientName: "Maria Silva (DB)", procedureName: "Limpeza Dental", category: "Preventivo", status: "completed", value: 150, cost: 45, profit: 105, margin: 70, paymentMethod: "Cartão", paymentStatus: "paid" },
  ];
  return NextResponse.json(procedures);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  // const { patient_id, appointment_id, procedure_catalog_id, user_id, procedure_date, status, price_charged, cost_incurred, notes, payment_method, payment_status } = body;
  // Validação
  // const result = await query("INSERT INTO procedures_performed (...) VALUES (...)");
  // Mock
  const newPerformedProcedure = { id: Date.now().toString(), ...body };
  return NextResponse.json({ success: true, procedure: newPerformedProcedure }, { status: 201 });
}