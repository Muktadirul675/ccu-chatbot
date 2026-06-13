import ChatSessionTable from "@/components/tables/ChatsTable"
import CompactLeadTable from "@/components/tables/CompactLeadTable"
import { getAnalytics } from "@/services/analytics"
import { getRecentChats } from "@/services/chat"
import { getRecentLeads } from "@/services/lead"

export default async function Page(){
    const [analytics, recentLeads, recentChats] = await Promise.all([
        getAnalytics(),
        getRecentLeads(),
        getRecentChats()
    ])
    return <div className="p-3">
        <h3 className="mb-2 font-semibold text-2xl">
            Dashboard
        </h3>
        <div className="flex items-center gap-2 my-3">
            <div className="bg-primary flex-1 p-3 rounded text-white flex flex-col gap-1">
                <h3 className="text-lg">{analytics.chatCount}</h3>
                Total Chat Sessions
            </div>
            <div className="bg-primary flex-1 p-3 rounded text-white flex flex-col gap-1">
                <h3 className="text-lg">{analytics.leadCount}</h3>
                Total Leads
            </div>
            <div className="bg-primary flex-1 p-3 rounded text-white flex flex-col gap-1">
                <h3 className="text-lg">{parseInt(`${analytics.leadCaptureRate}`)}%</h3>
                Lead Capture Rate
            </div>
        </div>
        <div className="my-3">
            <h3 className="text-lg font-semibold">Recent Leads</h3>
            <div className="my-2"></div>
            <CompactLeadTable leads={recentLeads}/>
        </div>
        <div className="my-3">
            <h3 className="text-lg font-semibold">Recent Chat Session</h3>
            <div className="my-2"></div>
            <ChatSessionTable data={recentChats}/>
        </div>
    </div>
}