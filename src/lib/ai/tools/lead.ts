import { z } from "zod";
import { tool } from "ai";
import { prisma } from "@/lib/prisma";

const BLOCKED_STATES = new Set([
  "MN",
  "DC",
  "AL",
  "AR",
  "RI",
  "NY",
  "NC",
  "ND",
]);

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
    .enum(["YEARS_1_2", "YEARS_2_3", "YEARS_3_4", "YEARS_4_5", "YEARS_5_10"])
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

  execute: async ({
    chatId,
    state,
    programName,
    firstName,
    lastName,
    email,
    bestPhone,
    isAgeConfirmed,
    educationLevel,
    completionTimeline,
    motivation,
    isFieldRelated,
  }) => {
    let isDisqualified = false;
    let eligibilityReason = "Eligible";

    const normalizedState = state?.toUpperCase();

    // Blocked state logic
    if (normalizedState && BLOCKED_STATES.has(normalizedState)) {
      isDisqualified = true;
      eligibilityReason = `Disqualified: State ${normalizedState} is restricted from enrollment.`;
    }

    await prisma.chat.update({
      where: { id: chatId },
      data: { leadCaptured: true }
    })

    const finalCountry = normalizedState ? "US" : undefined;

    try {
      const lead = await prisma.lead.upsert({
        where: { chatId },

        update: {
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
          ...(email && { email }),
          ...(bestPhone && { bestPhone }),

          ...(typeof isAgeConfirmed === "boolean" && {
            isAgeConfirmed,
          }),

          ...(educationLevel && { educationLevel }),
          ...(completionTimeline && { completionTimeline }),
          ...(motivation && { motivation }),
          ...(isFieldRelated && { isFieldRelated }),

          ...(normalizedState && { state: normalizedState }),
          ...(programName && { programName }),
          ...(finalCountry && { country: finalCountry }),
        },

        create: {
          chatId,

          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
          ...(email && { email }),
          ...(bestPhone && { bestPhone }),

          ...(typeof isAgeConfirmed === "boolean" && {
            isAgeConfirmed,
          }),

          ...(educationLevel && { educationLevel }),
          ...(completionTimeline && { completionTimeline }),
          ...(motivation && { motivation }),
          ...(isFieldRelated && { isFieldRelated }),

          ...(normalizedState && { state: normalizedState }),
          ...(programName && { programName }),
          ...(finalCountry && { country: finalCountry }),
        },
      });

      return {
        success: true,
        leadId: lead.id,
        isDisqualified,
        eligibilityReason,
        message: isDisqualified
          ? "Lead processed with restrictions."
          : "Lead synced successfully.",
      };
    } catch (error: any) {
      return {
        success: false,
        leadId: null,
        isDisqualified: false,
        eligibilityReason: "Error encountered during operation",
        message: "Failed to parse database lead operation pipeline.",
        error: error?.message || "Unknown database error",
      };
    }
  },
});