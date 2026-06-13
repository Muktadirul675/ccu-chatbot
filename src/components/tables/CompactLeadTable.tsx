"use client";

import { Pagination } from "@/globals";
import Link from "next/link";
import IntentBadge from "../ui/badges/IntentBadge";
import { BiEdit, BiMessage } from "react-icons/bi";

type Lead = {
    id: string;
    chatId: string;
    firstName?: string | null;
    email?: string | null;
    country?: string | null;
    programName?: string | null;
    createdAt: string | Date;
};

type Props = {
    leads: Lead[];
    pagination?: Pagination;
};

const truncate = (str: string, len: number) =>
    str?.length > len ? str.slice(0, len) + "..." : str;

export default function CompactLeadTable({
    leads,
    pagination,
}: Props) {
    return (
        <div className="space-y-4">
            {/* Table */}
            <div className="border border-slate-200 rounded-md overflow-hidden shadow-sm bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-slate-800 text-white uppercase text-xs tracking-wider">
                        <tr>
                            <th className="text-left p-3 font-medium">Name</th>
                            <th className="text-left p-3 font-medium">Email</th>
                            <th className="text-left p-3 font-medium">Country</th>
                            <th className="text-left p-3 font-medium">Program</th>
                            <th className="text-left p-3 font-medium"></th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {leads.length ? (
                            leads.map((lead) => (
                                <tr
                                    key={lead.id}
                                    className="hover:bg-slate-50 transition"
                                >
                                    {/* Name */}
                                    <td className="p-3 text-slate-600">
                                        <Link
                                            href={`/dashboard/leads/${lead.id}`}
                                            className="hover:text-slate-900"
                                        >
                                            {truncate(
                                                lead.firstName ?? "N/A",
                                                25
                                            )}
                                        </Link>
                                    </td>

                                    {/* Email */}
                                    <td className="p-3 text-slate-500">
                                        <Link
                                            href={`/dashboard/leads/${lead.id}`}
                                            className="hover:text-slate-700"
                                        >
                                            {truncate(
                                                lead.email ?? "N/A",
                                                35
                                            )}
                                        </Link>
                                    </td>

                                    {/* Country */}
                                    <td className="p-3 text-slate-500">
                                        {lead.country ?? "—"}
                                    </td>

                                    {/* Program */}
                                    <td className="p-3 text-slate-600">
                                        {truncate(lead.programName ?? "—", 30)}
                                    </td>
                                    <td className="p-3 text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <Link href={`/dashboard/chats/${lead.chatId}`} className="text-blue-500">
                                                <BiMessage size={20} />
                                            </Link>
                                            <Link href={`/dashboard/leads/${lead.id}`} className="text-blue-500">
                                                <BiEdit size={20} />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="p-10 text-center text-slate-500"
                                >
                                    No Leads Found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && (
                <div className="flex items-center justify-between text-sm">
                    <p className="text-slate-500">
                        Page{" "}
                        <span className="text-slate-900 font-medium">
                            {pagination.currentPage}
                        </span>{" "}
                        of {pagination.totalPages} • Total{" "}
                        {pagination.totalItems} records
                    </p>

                    <div className="flex gap-2">
                        {pagination.hasPrevPage && (
                            <Link
                                href={`?page=${pagination.currentPage - 1
                                    }`}
                                className="px-3 py-1 border border-slate-300 rounded-md hover:bg-slate-100"
                            >
                                ← Prev
                            </Link>
                        )}

                        {pagination.hasNextPage && (
                            <Link
                                href={`?page=${pagination.currentPage + 1
                                    }`}
                                className="px-3 py-1 border border-slate-300 rounded-md hover:bg-slate-100"
                            >
                                Next →
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}