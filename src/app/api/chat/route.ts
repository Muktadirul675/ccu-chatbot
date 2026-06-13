import { MessageRole } from "@/generated/prisma/enums";
import { getAIStream } from "@/lib/ai/stream";
import { prisma } from "@/lib/prisma";
import { getOrCreateChatBySession } from "@/services/chat";
import { createMessage } from "@/services/message";
import { convertToModelMessages, UIMessage } from "ai";
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    const params = req.nextUrl.searchParams;
    const sessionId = params.get('sessionId')
    if (!sessionId) {
        return NextResponse.json({
            error: "No Session ID provided"
        }, { status: 400 })
    }
    const { id: chatId, created } = await getOrCreateChatBySession(sessionId);
    const { messages }: { messages: UIMessage[] } = await req.json()
    const lastMessage = messages.at(-1);
    if (!lastMessage || lastMessage.role !== 'user') {
        return NextResponse.json({
            error: "Invalid Message Trail",
        }, { status: 400 })
    }
    if (created) {
        const dbMessages: { chatId: string, role: MessageRole, content: string }[] = messages.map((msg) => {
            const text = msg.parts.find((part) => part.type === 'text')?.text ?? ""
            const role = msg.role === 'user' ? MessageRole.USER : MessageRole.ASSISTANT;
            return {
                chatId,
                role,
                content: text
            }
        })
        await prisma.message.createMany({
            data: dbMessages
        })
    } else {
        const text = lastMessage.parts.find((part) => part.type === 'text')?.text
        if (!text) {
            return NextResponse.json({
                error: "User Message has no text"
            }, { status: 400 })
        }
        const role = lastMessage.role
        await prisma.message.create({
            data: {
                chatId,
                role: role === 'user' ? MessageRole.USER : MessageRole.ASSISTANT,
                content: text
            }
        })
    }
    const stream = await getAIStream(chatId, (await convertToModelMessages(messages)));

    return stream.toUIMessageStreamResponse();
}