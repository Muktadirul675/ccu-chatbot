import AIMessage from "@/components/ui/AIMessage";
import UserMessage from "@/components/ui/UserMessage";
import { getChat } from "@/services/chat";
import Link from "next/link";
import { BiLink } from "react-icons/bi";
import { BsLink } from "react-icons/bs";

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const chat = await getChat(id);
    if (!chat) {
        return <div>
            Hello World
        </div>
    }
    return <div className="w-full max-w-xl rounded bg-subtle shadow my-5 mx-auto border border-gray-300">
        <div className="bg-primary rounded-t text-white w-full p-3">
            <h3 className="text-lg font-semibold">
                Chat Session #{chat.id}
            </h3>
            <h3 className="text-base">
                Initiated At: {new Date(chat.createdAt).toLocaleDateString()}
            </h3>
        </div>
        {chat.leadCaptured ? 
            (chat.lead ? <div className="p-3 bg-green-300 text-green-600 flex items-center gap-2">
                <span className="font-semibold text-white">Lead captured!</span>
                <div className="flex items-center gap-1 ms-auto">
                    {chat.lead.firstName && <div className="bg-white rounded p-px px-2">{chat.lead.firstName}</div>}
                    {chat.lead.email && <div className="bg-white rounded p-px px-2">{chat.lead.email}</div>}
                </div>
                <Link href={`/dashboard/leads/${chat.lead.id}`} className="text-blue-500 p-1">
                    View
                </Link>
            </div> : <div className="bg-gray-300 text-slate-800">
                Lead Was Captured but somehow deleted.
            </div>)
        : null}
        <hr className="border-gray-300" />
        <div className="bg-subtle p-3 flex flex-col gap-2">
            {chat.messages.map((msg, index)=>{
                if(msg.role === 'USER'){
                    return <UserMessage key={index} content={msg.content}/>
                }
                return <AIMessage key={index} content={msg.content}/>
            })}
        </div>
    </div>
}