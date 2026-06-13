import { deleteLead, updateLead } from "@/services/lead";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const data = await req.json()
    const res = await updateLead(id, data);
    return NextResponse.json(res, { status: 200 })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const res = await deleteLead(id)
    return NextResponse.json(res, { status: 200 })
}
