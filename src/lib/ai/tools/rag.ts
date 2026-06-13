import { retrieveInformation } from "@/lib/rag/retrieval";
import { tool } from "ai";
import { z } from "zod";

export const searchInformation = tool({
  description: "Retrieve information from the CCU database",
  inputSchema: z.object({
    query: z.string().describe("The search query to find relevant information"),
  }),
  execute: async ({ query }) => {
    const res = await retrieveInformation(query);
    if(!res.length){
        return []
    }
    return res;
  },
});