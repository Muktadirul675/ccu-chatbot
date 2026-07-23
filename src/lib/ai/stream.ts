import { MessageRole } from '@/generated/prisma/enums';
import { createMessage } from '@/services/message'
import {openai} from '@ai-sdk/openai';
import { ModelMessage, stepCountIs, streamText } from 'ai';
import { getSystemPrompt } from './prompt';
import { captureOrUpdateLead } from './tools';
import { intentTool } from './tools/intent';
import { searchInformation } from './tools/rag';

export async function getAIStream(chatId: string, messages: ModelMessage[]) {
    const system = await getSystemPrompt(chatId)
    const res = streamText({
        model: openai('gpt-5'),
        system: system,
        messages: messages,
        stopWhen: stepCountIs(8),
        async onFinish({ text }) {
            const role = MessageRole.ASSISTANT;
            await createMessage(chatId, role, text)
        },
        tools: {
            captureOrUpdateLead: captureOrUpdateLead,
            intentTool: intentTool,
            searchInformation: searchInformation
        }
    })
    return res;
}

