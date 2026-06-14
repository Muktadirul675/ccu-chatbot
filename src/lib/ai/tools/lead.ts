import { z } from "zod";
import { tool } from "ai";
import { leadQueue } from "@/queues/lead";

const leadParametersSchema = z.object({
  chatId: z.string(),

  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),

  state: z.string().max(2).optional(),
  bestPhone: z.string().optional(),

  programName: z.string().optional(),

  isAgeConfirmed: z.boolean().optional(),
  educationLevel: z.string().optional(),

  completionTimeline: z
    .enum([
      "YEARS_1_2",
      "YEARS_2_3",
      "YEARS_3_4",
      "YEARS_4_5",
      "YEARS_5_10",
    ])
    .optional(),

  motivation: z
    .array(
      z.enum([
        "PAY_INCREASE_PROMOTION",
        "PERSONAL_ACHIEVEMENT",
        "LIFELONG_LEARNING",
        "EDUCATIONAL_GAIN_DEGREE_COMPLETION",
        "INDUSTRY_COMPETITION",
        "OTHER",
      ])
    )
    .optional(),

  isFieldRelated: z.enum(["YES", "NO", "OTHER"]).optional(),
});

export const captureOrUpdateLead = tool({
  description:
    "Captures or updates a prospective student's lead data incrementally.",

  inputSchema: leadParametersSchema,

  execute: async (input) => {
    try {
      await leadQueue.add(
        "capture-lead",
        input,
        {
          attempts: 5,
          backoff: {
            type: "exponential",
            delay: 3000,
          },
          removeOnComplete: 1000,
          removeOnFail: 1000,
        }
      );

      return {
        success: true,
        message: "Lead captured successfully.",
      };
    } catch (error: any) {
      console.error("Failed to queue lead:", error);

      return {
        success: false,
        message: "Failed to capture lead.",
        error: error?.message ?? "Unknown error",
      };
    }
  },
});