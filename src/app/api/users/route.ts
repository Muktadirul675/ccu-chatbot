import { UserRole } from "@/generated/prisma/enums";
import { createUser } from "@/services/users";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { username, password, role } = await req.json()
    if (!(username as string).trim().length || !(password as string).trim().length || !(role as string).length) {
        return NextResponse.json({
            error: "Username and Password can't be empty"
        }, { status: 400 })
    }
    if (!(role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN)) {
        return NextResponse.json({
            error: "Role doesn't exist"
        }, { status: 400 })
    }
    const user = await createUser(username, password, role)
    return NextResponse.json({
        user
    }, { status: 201 })
}