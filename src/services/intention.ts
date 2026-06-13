import { IntentLabel } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

export async function markIntention(
  chatId: string,
  intention: IntentLabel
) {
  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    select: { lead: { select: { id: true } } }
  });

  await prisma.chat.update({
    where: { id: chatId },
    data: {
      intent: intention,
      ...(chat?.lead && {
        lead: {
          update: {
            intent: intention
          }
        }
      })
    }
  });
}