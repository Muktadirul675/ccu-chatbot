"use client";

import Link from "next/link";
import { Pagination } from "@/globals";

type Information = {
    id: string;
    title: string;
    content?: string | null;
};

type Props = {
    informations: Information[];
    pagination?: Pagination;
};

const truncate = (str: string, len: number) =>
    str.length > len ? str.slice(0, len) + "..." : str;

export default function InformationTable({
    informations,
    pagination,
}: Props) {
    return (
        <div className="space-y-4">
            {/* Table */}
            <div className="border border-slate-200 rounded-md overflow-hidden shadow-sm bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-slate-800 text-white uppercase text-xs tracking-wider">
                        <tr>
                            <th className="text-left p-3 font-medium">ID</th>
                            <th className="text-left p-3 font-medium">Title</th>
                            <th className="text-left p-3 font-medium">Content</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {informations.length ? (
                            informations.map((info) => (
                                <tr
                                    key={info.id}
                                    className="hover:bg-slate-50 transition"
                                >
                                    <td className="p-3">
                                        <Link
                                            href={`/dashboard/information/${info.id}`}
                                            className="text-slate-700 font-medium hover:text-slate-900"
                                        >
                                            {truncate(info.id, 8)}
                                        </Link>
                                    </td>

                                    <td className="p-3 text-slate-600">
                                        <Link
                                            href={`/dashboard/information/${info.id}`}
                                            className="hover:text-slate-900"
                                        >
                                            {truncate(info.title ?? "N/A", 60)}
                                        </Link>
                                    </td>

                                    <td className="p-3 text-slate-500">
                                        <Link
                                            href={`/dashboard/information/${info.id}`}
                                            className="hover:text-slate-700"
                                        >
                                            {truncate(info.content ?? "", 40)}
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={3}
                                    className="p-10 text-center text-slate-500"
                                >
                                    No Data Found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

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
                                href={`?page=${pagination.currentPage - 1}`}
                                className="px-3 py-1 border border-slate-300 rounded-md hover:bg-slate-100"
                            >
                                ← Prev
                            </Link>
                        )}

                        {pagination.hasNextPage && (
                            <Link
                                href={`?page=${pagination.currentPage + 1}`}
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