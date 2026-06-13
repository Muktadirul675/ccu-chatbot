import { MessageRole } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

export async function createMessage(chatId: string, role: MessageRole, content: string) {
    const res = await prisma.message.create({
        data: {
            content: content,
            role: role,
            chat: {
                connect: {
                    id: chatId
                }
            }
        },
        select:{id:true}
    })
    return res.id;
}