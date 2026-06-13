import CompactLeadTable from "@/components/tables/CompactLeadTable";
import { getLeadsCompact } from "@/services/lead";

type Props = {
    searchParams?: Promise<{
        page?: string;
    }>;
};

export default async function LeadsPage({ searchParams }: Props) {
    const sParams = await searchParams;
    const leadPage = Number(sParams?.page ?? 1)

    const leadsData = await getLeadsCompact(leadPage);

    return (
        <div className="p-3">
            <h3 className="text-2xl mb-3 font-semibold">
                Leads
            </h3>
            <CompactLeadTable
                leads={leadsData.data}
                pagination={leadsData.pagination}
            />
        </div>
    );
}