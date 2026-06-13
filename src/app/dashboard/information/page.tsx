import InformationSearchForm from "@/components/forms/filters/Information";
import InformationTable from "@/components/tables/InformationTable";
import { getInformations } from "@/services/information";
import Link from "next/link";
import { BiPlus } from "react-icons/bi";

type Props = {
    searchParams?: Promise<{
        page?: string;
        search?: string;
    }>;
};

export default async function InformationPage({ searchParams }: Props) {
    const sParams = await searchParams;

    const page = Number(sParams?.page ?? 1);
    const search = sParams?.search ?? "";

    const informations = await getInformations(page, 20, search);

    return <div className="p-5">
        <div className="w-full flex justify-between">
            <h3 className="text-2xl font-semibold">
                Information
            </h3>
            <Link href={"/dashboard/information/add"} className="ms-auto p-2 border border-primary rounded-lg flex items-center gap-2 bg-primary text-white hover:bg-white hover:text-primary">
                <BiPlus /> Add
            </Link>
        </div>
        <div className="my-1 text-gray-500 text-sm">
            Manage information that are served to Gulliver, the AI chatbot. Click any row to view full details.
        </div>
        <div className="my-4">
            <InformationSearchForm />
        </div>
        <div className="my-3">
            <InformationTable informations={informations.data} pagination={informations.pagination} />
        </div>
    </div>
}