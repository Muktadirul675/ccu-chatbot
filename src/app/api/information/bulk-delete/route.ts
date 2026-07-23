import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    const { ids } = await req.json()
    try {
        await prisma.information.deleteMany({
            where: {
                id: {
                    in: ids
                }
            }
        })
        return NextResponse.json({
            success: true,
            message: 'Information deleted'
        }, { status: 200 })
    } catch (e) {
        return NextResponse.json({
            error: true,
            message: JSON.stringify(e)
        }, { status: 500 })
    }
}