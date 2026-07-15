import { groq } from "@ai-sdk/groq";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

const GENERATE_CHUNK_SYSTEM_PROMPT = `
You are an expert in creating chunks from given text paragraph. These chunks will be used for embedding.
Return a list of strings where each string is a chunk. Even if there is only one chunk, include that in the list too. 
IMPORTANT: You must return a list of strings. No extra texts.
OUTPUT FORMAT:
[chunk1, chunk2, chunk3...]
`

export async function generateChunks(prompt: string): Promise<string[]> {
    const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: `PARAGRAPH: ${prompt}`,
        system: GENERATE_CHUNK_SYSTEM_PROMPT
    })
    const chunks: string[] = JSON.parse(text)
    return chunks;
}