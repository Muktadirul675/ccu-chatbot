import InformationUpdateForm from "@/components/forms/InormationUpdateForm";
import { getInformation } from "@/services/information";
import { notFound } from "next/navigation";

export default async function UpdateInformationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const information = await getInformation(id)
    if(!information){
        notFound()
    }
    return <InformationUpdateForm information={{id: information.id, title:information.title, content: information.content}}/>
}