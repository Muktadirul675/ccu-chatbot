import { Lead } from "@/generated/prisma/client";
import { Pagination } from "@/globals";
import { prisma } from "@/lib/prisma";

export async function getLead(id: string) {
    const lead = await prisma.lead.findUnique({
        where: { id }
    })
    return lead;
}

export async function updateLead(id: string, data: Lead) {
    const lead = await prisma.lead.update({
        where: { id },
        data: data
    })
    return lead;
}

export async function deleteLead(id: string) {
    const res = await prisma.lead.delete({ where: { id } })
    return res;
}

export async function getLeadsCompact(page: number = 1, count: number = 20) {
    const safePage = Math.max(1, page);
    const safeCount = Math.max(1, count);
    const skip = (safePage - 1) * safeCount;

    const [leads, totalItems] = await Promise.all([
        prisma.lead.findMany({
            skip,
            take: safeCount,
            select: {
                id: true,
                chatId: true,
                firstName: true,
                email: true,
                country: true,
                programName: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        }),

        prisma.lead.count(),
    ]);

    const totalPages = Math.ceil(totalItems / safeCount);

    return {
        data: leads,
        pagination: {
            totalItems,
            totalPages,
            currentPage: safePage,
            perPage: safeCount,
            hasNextPage: safePage < totalPages,
            hasPrevPage: safePage > 1,
        } satisfies Pagination,
    };
}

export async function getRecentLeads(count: number = 10) {
    const leads = await prisma.lead.findMany({
        take: count,
        orderBy: {
            createdAt: "desc"
        }
    })
    return leads;
}
