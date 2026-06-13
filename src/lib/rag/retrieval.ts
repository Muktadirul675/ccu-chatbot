import { prisma } from "@/lib/prisma";
import { getEmbedding } from "./embedding";

type RetrievedChunk = {
  id: string;
  content: string;
  informationId: string;
  similarity: number;
};

function toVectorString(embedding: number[]) {
  return `[${embedding.join(",")}]`;
}

export async function retrieveInformation(
  query: string,
  topK: number = 5
): Promise<RetrievedChunk[]> {
  try {
    // 1. Create embedding from query
    const queryEmbedding = await getEmbedding(query);

    if (!queryEmbedding || !Array.isArray(queryEmbedding)) {
      throw new Error("Invalid embedding from getEmbedding()");
    }

    const vector = toVectorString(queryEmbedding);

    const chunks = await prisma.$queryRaw<RetrievedChunk[]>`
  SELECT 
    ic.id,
    ic.content,
    ic."informationId",
    1 - (ic.embedding <=> ${vector}::vector) AS similarity
  FROM "InformationChunk" ic
  WHERE ic.embedding IS NOT NULL
  ORDER BY ic.embedding <=> ${vector}::vector
  LIMIT ${topK};
`;

    return chunks;
  } catch (err) {
    console.error("retrieveInformation error:", err);
    return [];
  }
}