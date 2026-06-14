import { summarizeURL } from "@/lib/extraction/url";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const sParams = req.nextUrl.searchParams;
    const url = sParams.get("url")
    if (!url) {
        return NextResponse.json({
            error: "URL is required"
        }, { status: 400 })
    }
    try {
        const summary = await summarizeURL(url)
        return NextResponse.json({
            content: summary
        }, { status: 200 });
    } catch (e) {
        return NextResponse.json({
            error: JSON.stringify(e),
        }, { status: 400 })
    }
}