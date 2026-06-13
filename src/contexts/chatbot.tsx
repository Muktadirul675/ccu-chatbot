"use client";

import { UIMessage, useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useMemo,
    useState,
} from "react";

type ChatbotContextType = {
    messages: UIMessage[];
    stop: ReturnType<typeof useChat>["stop"];
    setMessages: ReturnType<typeof useChat>["setMessages"];
    sendMessage: ReturnType<typeof useChat>["sendMessage"];
    status: ReturnType<typeof useChat>["status"];
    initialized: boolean;
    setInitialized: Dispatch<SetStateAction<boolean>>;
    setSessionId: Dispatch<SetStateAction<string>>;
};

const ChatbotContext = createContext<ChatbotContextType | null>(null);

export function ChatbotProvider({
    children,
    sessionId,
}: {
    children: ReactNode;
    sessionId: string;
}) {
    const [initialized, setInitialized] = useState(false);
    const [internalSessionId, setSessionId] = useState(sessionId);

    const transport = useMemo(() => {
        return new DefaultChatTransport({
            api: `/api/chat?sessionId=${sessionId}`,
        });
    }, [sessionId]);

    const chat = useChat({ transport });

    return (
        <ChatbotContext.Provider
            value={{
                messages: chat.messages,
                stop: chat.stop,
                setMessages: chat.setMessages,
                sendMessage: chat.sendMessage,
                status: chat.status,
                initialized,
                setInitialized,
                setSessionId,
            }}
        >
            {children}
        </ChatbotContext.Provider>
    );
}

export function useChatbot() {
    const context = useContext(ChatbotContext);

    if (!context) {
        throw new Error("useChatbot must be used inside ChatbotProvider");
    }

    return context;
}