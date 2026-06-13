import { embed, embedMany } from "ai";
import { openai } from "@ai-sdk/openai";

// Best default for RAG
const embeddingModel = openai.textEmbeddingModel("text-embedding-3-small");

export async function getEmbeddings(texts: string[]) {
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: texts,
  });

  return embeddings;
}

export async function getEmbedding(query: string) {
  const { embedding } = await embed({
    model: embeddingModel,
    value: query,
  });

  return embedding;
}