import { IntentLabel } from "@/generated/prisma/enums";
import { useMemo } from "react";

export default function IntentBadge({ intent }: { intent: IntentLabel }) {
    const colorGroup = useMemo(() => {
        if (intent === IntentLabel.admission) {
            return 'bg-primary text-white';
        }
        return 'bg-gray-300 text-black'
    }, [intent])
    
    return <div className={`px-1.5 py-1 w-fit rounded font-semibold uppercse ${colorGroup} uppercase text-xs`}>
        {intent}
    </div>
}