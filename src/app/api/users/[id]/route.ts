import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { username, role } = await req.json()
    const user = await prisma.user.update({
        where: { id },
        data: {
            username,
            role
        }
    })
    return NextResponse.json({
        user,
    }, { status: 200 })
}

export async function DELETE(req: NextRequest,{ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await prisma.user.delete({ where: { id } })
    return NextResponse.json({
        user,
    }, { status: 200 })
}
