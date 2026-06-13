import { deleteInformation, updateInformation } from "@/services/information";
import { NextRequest, NextResponse } from "next/server";

function validateNonEmptyTitleAndContent(title: string, content: string) {
    if (title.trim() !== '' && content.trim() !== '') {
        return true;
    }
    return false;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { title, content } = await req.json()
    const valid = validateNonEmptyTitleAndContent(title, content)
    if (!valid) {
        return NextResponse.json({
            error: "Title and Content isn't valid"
        }, { status: 400 })
    }
    await updateInformation(id, title, content)
    return NextResponse.json({
        success: "Information updated successfully"
    }, { status: 200 })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    await deleteInformation(id);
    return NextResponse.json({}, { status: 200 })
}
