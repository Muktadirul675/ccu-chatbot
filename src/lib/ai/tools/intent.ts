import { IntentLabel } from "@/generated/prisma/enums";
import { markIntention } from "@/services/intention";
import { tool } from "ai";
import z from "zod";

const intentionSchema = z.object({
    chatId: z.string().describe("The active chat ID"),
    intention: z.enum([IntentLabel.admission, IntentLabel.inquiry, IntentLabel.other]).describe("Intention of the user: admission, inquiry or others.")
})

export const intentTool = tool({
    description: "Call this tool when a user intention is understood - admission, inquiry or others.",
    inputSchema: intentionSchema,
    execute: async ({ chatId, intention })=>{
        await markIntention(chatId, intention)
        return {
            success: true,
            intention,
        }
    }
})
