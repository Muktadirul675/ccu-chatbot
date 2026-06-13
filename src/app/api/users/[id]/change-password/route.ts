import { updateUserPassword } from "@/services/users";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { password } = await req.json()
    const { id } = await params;
    if (!((password as string).trim().length)) {
        return NextResponse.json({
            error: "Password can't be empty"
        }, { status: 400 })
    }
    const user = await updateUserPassword(id, password)
    return NextResponse.json({
        user,
    }, { status: 200 })
}