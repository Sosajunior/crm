import { NextRequest, NextResponse } from "next/server";
import { query, execute } from '@/lib/db';

// Reutilizando interface de `route.ts` da lista
interface PerformedProcedureListItem {
    id: string;
    date: string; // YYYY-MM-DD
    patientName: string;
    procedureName: string;
    category: string;
    status: "completed" | "pending" | "cancelled" | "in_progress" | "aborted";
    value: number; // price_charged
    cost: number; // cost_incurred
    profit: number;
    margin: number; // percentage
    paymentMethod?: string;
    paymentStatus?: "paid" | "pending" | "overdue" | "waived";
    notes?: string;
    // Adicionar campos que podem ser específicos para o detalhe
    patientId?: string;
    appointmentId?: string;
    procedureCatalogId?: string;
    userId?: string;
}


interface UpdatePerformedProcedurePayload {
    procedureDate?: string; // YYYY-MM-DD or ISO
    status?: PerformedProcedureListItem['status'];
    priceCharged?: number;
    costIncurred?: number;
    notes?: string;
    paymentMethod?: string;
    paymentStatus?: PerformedProcedureListItem['paymentStatus'];
    // Não permitir mudar patientId, appointmentId, procedureCatalogId via PUT simples
}

function mapDbToPerformedProcedureDetail(dbRow: any): PerformedProcedureListItem {
    const price = parseFloat(dbRow.price_charged || 0);
    const cost = parseFloat(dbRow.cost_incurred || 0);
    const profit = price - cost;
    const margin = price > 0 ? (profit / price) * 100 : 0;

    return {
        id: dbRow.id.toString(),
        date: new Date(dbRow.procedure_date).toISOString().split('T')[0],
        patientName: dbRow.patient_name,
        procedureName: dbRow.procedure_name,
        category: dbRow.category,
        status: dbRow.status,
        value: price,
        cost: cost,
        profit: profit,
        margin: parseFloat(margin.toFixed(1)),
        paymentMethod: dbRow.payment_method,
        paymentStatus: dbRow.payment_status,
        notes: dbRow.notes,
        patientId: dbRow.patient_id?.toString(),
        appointmentId: dbRow.appointment_id?.toString(),
        procedureCatalogId: dbRow.procedure_catalog_id?.toString(),
        userId: dbRow.user_id?.toString(),
    };
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const performedId = params.id;
        const result = await query(
            `SELECT 
                pp.*, pat.full_name as patient_name, pc.name as procedure_name, pc.category
            FROM procedures_performed pp
            JOIN patients pat ON pp.patient_id = pat.id
            JOIN procedure_catalog pc ON pp.procedure_catalog_id = pc.id
            WHERE pp.id = ?`, [performedId]
        );
        if (!result || result.length === 0) {
            return NextResponse.json({ error: "Procedimento realizado não encontrado." }, { status: 404 });
        }
        return NextResponse.json(mapDbToPerformedProcedureDetail(result[0]));
    } catch (error) {
        console.error(`API GET /api/procedures/performed/${params.id} Error:`, error);
        const errorMessage = error instanceof Error ? error.message : "Erro desconhecido.";
        return NextResponse.json({ error: "Erro ao buscar procedimento realizado.", details: errorMessage }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const performedId = params.id;
        const body: UpdatePerformedProcedurePayload = await request.json();

        const allowedUpdates: Record<string, string> = {
            procedureDate: "procedure_date", status: "status", priceCharged: "price_charged",
            costIncurred: "cost_incurred", notes: "notes", paymentMethod: "payment_method",
            paymentStatus: "payment_status"
        };
        const updates: string[] = [];
        const values: any[] = [];

        for (const key in body) {
            if (Object.prototype.hasOwnProperty.call(body, key) && allowedUpdates[key] && body[key] !== undefined) {
                updates.push(`${allowedUpdates[key]} = ?`);
                let value = body[key];
                if (key === 'procedureDate' && value) {
                    value = new Date(value).toISOString().slice(0,10); // Formato YYYY-MM-DD
                }
                values.push(value);
            }
        }

        if (updates.length === 0) {
          return NextResponse.json({ error: "Nenhum campo válido para atualização." }, { status: 400 });
        }

        const sql = `UPDATE procedures_performed SET ${updates.join(", ")} WHERE id = ?`;
        values.push(performedId);
        const result = await execute(sql, values);

        if (result.affectedRows === 0) {
          return NextResponse.json({ error: "Procedimento realizado não encontrado ou dados inalterados." }, { status: 404 });
        }
        // Re-fetch para retornar o objeto atualizado
        const getRequest = new NextRequest(request.url, { headers: request.headers });
        return GET(getRequest, { params });

    } catch (error) {
        console.error(`API PUT /api/procedures/performed/${params.id} Error:`, error);
        const errorMessage = error instanceof Error ? error.message : "Erro desconhecido.";
        return NextResponse.json({ error: "Erro ao atualizar procedimento realizado.", details: errorMessage }, { status: 500 });
    }
}