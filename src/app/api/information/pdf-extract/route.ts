import { getInformationsFromPdf, getPdfText } from "@/lib/extraction/pdf";
import { createInformationFromPdf } from "@/services/information";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // 1. Read Form Data from the incoming request
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    // 2. Validate file presence & type
    if (!file) {
      return NextResponse.json(
        { error: "No PDF file uploaded" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      return NextResponse.json(
        { error: "File must be a valid PDF document" },
        { status: 400 }
      );
    }

    // 3. Convert File to ArrayBuffer for pdf-parse
    const bytes = await file.arrayBuffer();

    // 4. Extract raw text from the PDF
    const pdfText = await getPdfText(bytes);

    if (!pdfText || pdfText.trim().length === 0) {
      return NextResponse.json(
        { error: "Could not extract any readable text from the PDF" },
        { status: 422 }
      );
    }

    // 5. Categorize text into structured information using gpt-4o
    const informations = await getInformationsFromPdf(pdfText);
    await createInformationFromPdf(informations)
    // 6. Return response
    return NextResponse.json({
      success: true,
      data: informations,
    });
  } catch (error) {
    console.error("Error processing PDF upload:", error);
    return NextResponse.json(
      { error: "Internal server error during PDF parsing" },
      { status: 500 }
    );
  }
}