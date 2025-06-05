import { type NextRequest, NextResponse } from "next/server";
// import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  // const catalog = await query("SELECT * FROM procedure_catalog WHERE is_active = TRUE ORDER BY category, name");
  // Mock
  const catalog = [
    { id: "1", name: "Limpeza Dental", category: "Preventivo", default_price: 150.00, default_cost: 45.00 },
    { id: "2", name: "Restauração (Resina)", category: "Restaurador", default_price: 280.00, default_cost: 95.00 },
  ];
  return NextResponse.json(catalog);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  // const { name, description, category, default_price, default_cost, default_duration_minutes } = body;
  // Validação
  // const result = await query("INSERT INTO procedure_catalog (...) VALUES (...)");
  // Mock
  const newItem = { id: Date.now().toString(), ...body };
  return NextResponse.json({ success: true, item: newItem }, { status: 201 });
}