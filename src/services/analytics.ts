import { prisma } from "@/lib/prisma";

export async function getAnalytics() {
    const [leadCount, chatCount] = await Promise.all([
        prisma.lead.count(),
        prisma.chat.count(),
    ]);

    const leadCaptureRate =
        chatCount > 0 ? (leadCount / chatCount) * 100 : 0;

    return {
        leadCount,
        chatCount,
        leadCaptureRate,
    };
}