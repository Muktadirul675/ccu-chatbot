import { generateChunks } from "./ai";
import { getEmbeddings } from "./embedding";

export async function getChunks(text: string): Promise<string[]> {
    const chunks = await generateChunks(text)
    return chunks;
}

export async function embedChunks(chunks: string[]) {
    const embeddings = await getEmbeddings(chunks)
    return embeddings.map((emb, index)=>{
        return {
            embedding: emb,
            content: chunks[index]
        }
    })
}
