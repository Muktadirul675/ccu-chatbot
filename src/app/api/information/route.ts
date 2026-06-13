import { createInformation } from "@/services/information";
import { NextRequest, NextResponse } from "next/server";

function validateNonEmptyTitleAndContent(title: string, content: string) {
    if (title.trim() !== '' && content.trim() !== '') {
        return true;
    }
    return false;
}

export async function POST(req: NextRequest) {
    const { title, content } = await req.json()
    const valid = validateNonEmptyTitleAndContent(title, content)
    if (!valid) {
        return NextResponse.json({
            error: "Title and Content isn't valid"
        }, { status: 400 })
    }
    await createInformation(title, content);
    return NextResponse.json({
        success: "Information added successfully"
    }, { status: 201 })
}
