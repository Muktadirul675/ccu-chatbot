import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { PDFParse } from "pdf-parse";
import { z } from "zod";
import * as fs from "fs";

// 1. Zod Schemas
const informationSchema = z.object({
  title: z
    .string()
    .describe("The overarching category or topic name (e.g., 'Sports', 'Automotive', 'Faculty Directory')."),
  content: z
    .string()
    .describe(
      "The FULL, unsummarized details extracted from the text belonging to this category. Retain all original facts, statistics, lists, and depth."
    ),
});

const informationArraySchema = z.object({
  informations: z.array(informationSchema),
});

// 2. PDF Text Extraction
export async function getPdfText(pdfInput: Buffer | ArrayBuffer | Uint8Array): Promise<string> {
  const data = pdfInput instanceof Uint8Array ? pdfInput : new Uint8Array(pdfInput);

  const parser = new PDFParse({
    data,
    verbosity: 0,
  });

  if ((parser as any).PDFJS) {
    (parser as any).PDFJS.GlobalWorkerOptions.workerSrc = "";
    (parser as any).PDFJS.disableWorker = true;
  }

  try {
    const result = await parser.getText();
    return result.text;
  } finally {
    if (typeof parser.destroy === "function") {
      await parser.destroy();
    }
  }
}

// 3. AI Information Extraction & Categorization
export async function getInformationsFromPdf(text: string) {
  const { object } = await generateObject({
    model: openai("gpt-4o"),
    schema: informationArraySchema,
    system: `
      You are an expert document organizer and verbatim text extractor. 
      Your only job is to read the provided text, identify the distinct topics (e.g., Executive Leadership, Deans, Faculty by Department, Staff Roles, etc.), and reorganize ALL the original information into those categories.

      CRITICAL RULES:
      1. DO NOT SUMMARIZE: Do not condense, truncate, or paraphrase the information. Your goal is maximum extraction.
      2. RETAIN ALL DETAILS: If the source text contains 3 paragraphs of deep details about 'Faculty', the 'content' field for 'Faculty' must contain all those details, names, and nuances.
      3. CATEGORIZE & COMPILE: Group related sentences and data under the appropriate 'title'. 
      4. PRESERVE ORIGINAL DEPTH: If a topic only has one sentence in the source, extract that one sentence. If it has two pages of detail, extract and compile all of it into the 'content' field.
    `,
    prompt: `Please categorize and extract the full details from the following text without summarizing:\n\n${text}`,
  });

  return object.informations;
}

// 4. Execution Workflow
async function main() {
  try {
    // Read your target PDF document
    const pdfBuffer = fs.readFileSync("./university_catalog.pdf");

    console.log("Extracting raw text from PDF...");
    const rawText = await getPdfText(pdfBuffer);

    console.log("Processing and categorizing information with GPT-4o...");
    const extractedInformations = await getInformationsFromPdf(rawText);

    // Display the structured output
    console.log("\n--- Extracted Categories & Content ---\n");
    console.log(JSON.stringify(extractedInformations, null, 2));

  } catch (error) {
    console.error("Error generating information:", error);
  }
}

// Execute the workflow
// main();