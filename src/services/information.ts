import { Pagination } from "@/globals";
import { prisma } from "@/lib/prisma";
import { embedChunks, getChunks } from "@/lib/rag/chunking";

export async function getInformation(id: string) {
    const infos = await prisma.information.findUnique({
        where: { id },
        select: {
            id: true,
            title: true,
            content: true,
            createdAt: true
        }
    })
    return infos;
}

export async function getLatestInformations(count: number = 10) {
    const infos = await prisma.information.findMany({
        select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
        },
        orderBy: {
            createdAt: "desc"
        },
        take: count
    })
    return infos;
}

export async function getInformations(
    page: number = 1,
    count: number = 20,
    search?: string
) {
    const safePage = Math.max(1, page);
    const safeCount = Math.max(1, count);
    const skip = (safePage - 1) * safeCount;

    const where = search?.trim()
        ? {
              OR: [
                  {
                      title: {
                          contains: search,
                          mode: "insensitive" as const,
                      },
                  },
                  {
                      content: {
                          contains: search,
                          mode: "insensitive" as const,
                      },
                  },
              ],
          }
        : {};

    const [infos, totalItems] = await Promise.all([
        prisma.information.findMany({
            skip,
            take: safeCount,
            where,
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        }),

        prisma.information.count({
            where,
        }),
    ]);

    const totalPages = Math.ceil(totalItems / safeCount);

    return {
        data: infos,
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

export async function createInformation(title: string, content: string) {
    const { id: infoId } = await prisma.information.create({
        data: {
            title: title,
            content: content,
        },
        select: {
            id: true
        }
    })
    const chunks = await getChunks(content);
    const embededChunks = await embedChunks(chunks);
    for (const chunk of embededChunks) {
        await prisma.$executeRaw`
            INSERT INTO "InformationChunk"
            (id, content, "informationId", embedding, "createdAt")
            VALUES (
                gen_random_uuid(),
                ${chunk.content},
                ${infoId},
                ${`[${chunk.embedding.join(",")}]`}::vector,
                now()
            )
        `;
    }
    return infoId;
}

export async function updateInformation(id: string, title: string, content: string) {
    const oldInfo = await prisma.information.findUnique({
        where: { id }
    })
    if (!oldInfo) {
        return new Error("Information Not Found")
    }
    await prisma.information.update({
        where: { id },
        data: {
            title: title,
            content: content
        }
    })
    if (oldInfo.content !== content) {
        await prisma.informationChunk.deleteMany({
            where: {
                informationId: id
            }
        })
        const chunks = await getChunks(content);
        const embededChunks = await embedChunks(chunks);
        for (const chunk of embededChunks) {
            await prisma.$executeRaw`
            INSERT INTO "InformationChunk"
            (id, content, "informationId", embedding, "createdAt")
            VALUES (
                gen_random_uuid(),
                ${chunk.content},
                ${id},
                ${`[${chunk.embedding.join(",")}]`}::vector,
                now()
            )
        `;
        }
    }
    return id;
}

export async function deleteInformation(id: string) {
    await prisma.information.delete({ where: { id } })
}
