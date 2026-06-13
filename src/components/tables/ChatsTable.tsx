"use client";

import Link from "next/link";
import { Pagination } from "@/globals";
import { IntentLabel } from "@/generated/prisma/enums";
import IntentBadge from "../ui/badges/IntentBadge";

type ChatSession = {
    id: string;
    createdAt: Date;
    intent: IntentLabel,
    lead: {
        firstName: string | null;
        email: string | null;
        bestPhone: string | null;
    } | null;
    _count: {
        messages: number;
    };
    leadCaptured: boolean;
};

type Props = {
    data: ChatSession[];
    pagination?: Pagination;
};

const truncate = (str: string, len: number) =>
    str.length > len ? str.slice(0, len) + "..." : str;

export default function ChatSessionTable({
    data,
    pagination,
}: Props) {
    return (
        <div className="space-y-4">
            {/* Table */}
            <div className="border border-slate-200 rounded-md overflow-hidden shadow-sm bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-slate-800 text-white uppercase text-xs tracking-wider">
                        <tr>
                            <th className="text-left p-3 font-medium">
                                ID
                            </th>
                            <th className="text-left p-3 font-medium">
                                Lead Name
                            </th>
                            <th className="text-left p-3 font-medium">
                                Email
                            </th>
                            <th className="text-left p-3 font-medium">
                                Phone
                            </th>
                            <th className="text-left p-3 font-medium">
                                Messages
                            </th>
                            <th className="text-left p-3 font-medium">
                                Created
                            </th>
                            <th className="text-left p-3 font-medium">
                                Intention
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {data.length ? (
                            data.map((chat) => (
                                <tr
                                    key={chat.id}
                                    className="hover:bg-slate-50 transition"
                                >
                                    <td className="p-3">
                                        <Link
                                            href={`/dashboard/chats/${chat.id}`}
                                            className="text-slate-700 font-medium hover:text-slate-900"
                                        >
                                            {truncate(chat.id, 18)}
                                        </Link>
                                    </td>

                                    <td className="p-3 text-slate-600">
                                        <Link
                                            href={`/dashboard/chats/${chat.id}`}
                                            className="hover:text-slate-900"
                                        >
                                            {chat.lead?.firstName ?? "—"}
                                        </Link>
                                    </td>

                                    <td className="p-3 text-slate-500">
                                        <Link
                                            href={`/dashboard/chats/${chat.id}`}
                                            className="hover:text-slate-700"
                                        >
                                            {truncate(
                                                chat.lead?.email ?? "—",
                                                40
                                            )}
                                        </Link>
                                    </td>

                                    <td className="p-3 text-slate-500">
                                        <Link
                                            href={`/dashboard/chats/${chat.id}`}
                                            className="hover:text-slate-700"
                                        >
                                            {chat.lead?.bestPhone ?? "—"}
                                        </Link>
                                    </td>

                                    <td className="p-3 text-slate-500">
                                        <Link
                                            href={`/dashboard/chats/${chat.id}`}
                                            className="hover:text-slate-700"
                                        >
                                            {chat._count.messages}
                                        </Link>
                                    </td>

                                    <td className="p-3 text-slate-500">
                                        <Link
                                            href={`/dashboard/chats/${chat.id}`}
                                            className="hover:text-slate-700"
                                        >
                                            {new Date(
                                                chat.createdAt
                                            ).toLocaleDateString()}
                                        </Link>
                                    </td>
                                    <td className="p-3 text-slate-500">
                                        <Link
                                            href={`/dashboard/chats/${chat.id}`}
                                            className="hover:text-slate-700"
                                        >
                                            <IntentBadge intent={chat.intent}/>
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={6}
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