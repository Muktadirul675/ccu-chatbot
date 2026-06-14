import { Worker } from "bullmq";
import { redisConnection } from "@/lib/redis";
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

const now = () => new Date().toISOString();

console.log(`[${now()}] 🚀 Lead worker booting up...`);

new Worker(
  "lead-processing",
  async (job) => {
    const startTime = Date.now();

    console.log(
      `[${now()}] 📥 Job received | id=${job.id} | chatId=${job.data.chatId}`
    );

    try {
      const {
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
      } = job.data;

      let isDisqualified = false;
      let eligibilityReason = "Eligible";

      const normalizedState = state?.toUpperCase();

      if (normalizedState && BLOCKED_STATES.has(normalizedState)) {
        isDisqualified = true;
        eligibilityReason = `Disqualified: State ${normalizedState} is restricted from enrollment.`;
      }

      const finalCountry = normalizedState ? "US" : undefined;

      await prisma.chat.update({
        where: { id: chatId },
        data: {
          leadCaptured: true,
        },
      });

      const lead = await prisma.lead.upsert({
        where: { chatId },

        update: {
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
          ...(email && { email }),
          ...(bestPhone && { bestPhone }),

          ...(typeof isAgeConfirmed === "boolean" && { isAgeConfirmed }),
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

          ...(typeof isAgeConfirmed === "boolean" && { isAgeConfirmed }),
          ...(educationLevel && { educationLevel }),
          ...(completionTimeline && { completionTimeline }),
          ...(motivation && { motivation }),
          ...(isFieldRelated && { isFieldRelated }),

          ...(normalizedState && { state: normalizedState }),
          ...(programName && { programName }),
          ...(finalCountry && { country: finalCountry }),
        },
      });

      const duration = Date.now() - startTime;

      console.log(
        `[${now()}] ✅ Job completed | id=${job.id} | leadId=${lead.id} | duration=${duration}ms`
      );

      return {
        success: true,
        leadId: lead.id,
        isDisqualified,
        eligibilityReason,
      };
    } catch (error: any) {
      const duration = Date.now() - startTime;

      console.error(
        `[${now()}] ❌ Job failed | id=${job.id} | duration=${duration}ms`
      );
      console.error(error);

      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: 10,
  }
);

// Worker lifecycle logs
console.log(`[${now()}] 🟢 Lead worker is running and listening for jobs`);