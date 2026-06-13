import LeadUpdateForm from "@/components/forms/LeadUpdateForm";
import { getLead } from "@/services/lead";
import { notFound } from "next/navigation";

export default async function LeadsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const lead = await getLead(id)
    if(!lead) notFound()
    return <LeadUpdateForm lead={lead}/>
}