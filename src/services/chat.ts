import { Pagination } from "@/globals";
import { prisma } from "@/lib/prisma";
import { generateChatId } from "@/lib/utils/chat";
import { IntentLabel } from "@/generated/prisma/enums";

export async function getOrCreateChatBySession(sessionId: string) {
    const existingChat = await prisma.chat.findUnique({
        where: {
            sessionId,
        },
        select: {
            id: true,
        },
    });

    if (existingChat) {
        return {
            id: existingChat.id,
            created: false,
        };
    }

    const chat = await prisma.chat.create({
        data: {
            id: generateChatId(),
            sessionId,
        },
        select: {
            id: true,
        },
    });

    return {
        id: chat.id,
        created: true,
    };
}

export async function getRecentChats(count: number = 10) {
    const chats = await prisma.chat.findMany({
        take: count,
        select:{
            id: true,
            createdAt: true,
            intent: true,
            leadCaptured: true,
            lead:{
                select:{
                    firstName: true,
                    email: true,
                    bestPhone: true,
                }
            },
            _count:{
                select:{
                    messages: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    })
    return chats;
}

type ChatFilters = {
    dateStart?: string;
    dateEnd?: string;
    intent?: IntentLabel;
};

export async function getChats(
    page: number = 1,
    count: number = 20,
    filters?: ChatFilters
) {
    const safePage = Math.max(1, page);
    const safeCount = Math.max(1, count);
    const skip = (safePage - 1) * safeCount;

    const where = {
        ...(filters?.intent && {
            intent: filters.intent,
        }),

        ...((filters?.dateStart || filters?.dateEnd) && {
            createdAt: {
                ...(filters?.dateStart && {
                    gte: new Date(filters.dateStart),
                }),

                ...(filters?.dateEnd && {
                    lte: new Date(
                        `${filters.dateEnd}T23:59:59.999Z`
                    ),
                }),
            },
        }),
    };

    const [chats, totalItems] = await prisma.$transaction([
        prisma.chat.findMany({
            where,
            skip,
            take: safeCount,
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                createdAt: true,
                leadCaptured: true,
                intent: true,
                lead: {
                    select: {
                        bestPhone: true,
                        email: true,
                        firstName: true,
                    },
                },
                _count: {
                    select: {
                        messages: true,
                    },
                },
            },
        }),

        prisma.chat.count({
            where,
        }),
    ]);

    const totalPages = Math.ceil(totalItems / safeCount);

    return {
        data: chats,
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

export async function getChat(id: string) {
    const chat = await prisma.chat.findUnique({
        where: { id },
        select: {
            id: true,
            createdAt: true,
            intent: true,
            leadCaptured: true,
            lead: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                }
            },
            messages: {
                select: {
                    role: true,
                    content: true,
                    createdAt: true
                }
            }
        }
    })
    return chat;
}
