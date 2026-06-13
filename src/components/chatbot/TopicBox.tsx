import { useChatbot } from "@/contexts/chatbot";

type Topic = {
    label: string;
    text: string
}

function TopicBubble({topic}:{topic:Topic}){
    return <div className="cursor-pointer hover:bg-slate-100 flex items-center border border-gray-300 gap-1 p-3 rounded-[30px] bg-muted text-sm font-medium">
        <div className="relative h-6 w-6 rounded-ful">
            <div className="h-6 w-6 rounded-full bg-primary flex justify-center items-center">
                <div className="h-3 w-3 rounded-full bg-white"></div>
            </div>
        </div>
        {topic.label}
    </div>
}

export default function TopicBox(){
    const topics : Topic[] = [
        {label: "Need Admission Help", text:"I need some help with admissions"},
        {label:"Want to Know About CCU",text:"I want to know about California Coast University"}
    ]

    const {sendMessage} = useChatbot();
    const handleClick = (topic: Topic) => {
        sendMessage({text: topic.text})
    }

    return <div className="flex items-center gap-3 flex-wrap">
        {topics.map((topic) => (
            <div key={topic.label} onClick={()=>handleClick(topic)}>
                <TopicBubble key={topic.label} topic={topic} />
            </div>
        ))}
    </div>
}