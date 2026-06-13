import { IntentLabel } from "@/generated/prisma/enums";
import ChatFilterForm from "@/components/forms/filters/ChatSession";
import ChatSessionTable from "@/components/tables/ChatsTable";
import { getChats } from "@/services/chat";

type Props = {
    searchParams?: Promise<{
        page?: string;
        date_start?: string;
        date_end?: string;
        intent?: IntentLabel;
    }>;
};

export default async function ChatsPage({ searchParams }: Props) {
    const sParams = await searchParams;

    const page = Number(sParams?.page ?? 1);

    const chats = await getChats(
        page,
        20,
        {
            dateStart: sParams?.date_start,
            dateEnd: sParams?.date_end,
            intent: sParams?.intent,
        }
    );

    return (
        <div className="p-5">
            <div className="w-full flex justify-between">
                <h3 className="text-2xl font-semibold">
                    Chat Sessions
                </h3>
            </div>

            <div className="my-1 text-gray-500 text-sm">
                Manage information that are served to Gulliver, the AI chatbot.
                Click any row to view full details.
            </div>

            <div className="my-4">
                <ChatFilterForm />
            </div>

            <div className="my-3">
                <ChatSessionTable
                    data={chats.data}
                    pagination={chats.pagination}
                />
            </div>
        </div>
    );
}