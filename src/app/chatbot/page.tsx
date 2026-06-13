import Inbox from "@/components/chatbot/Inbox";
import InputBox from "@/components/chatbot/InputBox";
import Topbar from "@/components/chatbot/Topbar";
import { ChatbotProvider } from "@/contexts/chatbot";

export default async function Page({ searchParams }: { searchParams: Promise<{ sessionId: string }> }) {
    const { sessionId } = await searchParams;

    if (!sessionId) {
        return <div>
            Session ID Not Provided
        </div>
    }

    return <div className="h-dvh flex flex-col">
        <ChatbotProvider sessionId={sessionId}>
            <Topbar />
            <Inbox />
            <InputBox />
        </ChatbotProvider>
    </div>
}
