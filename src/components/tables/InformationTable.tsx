"use client";

import { useState } from "react";
import Link from "next/link";
import { Pagination } from "@/globals";
import { api } from "@/lib/api";
import { BiTrash } from "react-icons/bi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Information = {
    id: string;
    title: string;
    content?: string | null;
};

type Props = {
    informations: Information[];
    pagination?: Pagination;
    onDeleteSuccess?: () => void;
};

const truncate = (str: string, len: number) =>
    str.length > len ? str.slice(0, len) + "..." : str;

export default function InformationTable({
    informations,
    pagination,
    onDeleteSuccess,
}: Props) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter()

    const allIds = informations.map((info) => info.id);
    const isAllSelected =
        informations.length > 0 && selectedIds.length === informations.length;
    const isIndeterminate =
        selectedIds.length > 0 && selectedIds.length < informations.length;

    // Toggle selection for all items on current page
    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(allIds);
        }
    };

    // Toggle selection for individual items
    const handleSelectOne = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    // Delete handler calling api.delete with { ids: selectedIds }
    const handleDelete = async () => {
        if (!selectedIds.length) return;

        const confirmDelete = confirm(
            `Are you sure you want to delete ${selectedIds.length} item(s)?`
        );
        if (!confirmDelete) return;

        try {
            setIsDeleting(true);
            await api.delete("/information/bulk-delete", {
                data: { ids: selectedIds },
            });

            setSelectedIds([]);
            if (onDeleteSuccess) {
                onDeleteSuccess();
            }
            toast.success('Information Deleted')
            router.refresh()
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Top Action Bar when items are selected */}
            {selectedIds.length > 0 && (
                <div className="flex items-center justify-between p-3 bg-slate-100 border border-slate-200 rounded-md">
                    <span className="text-sm text-slate-700 font-medium">
                        {selectedIds.length} item(s) selected
                    </span>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition disabled:opacity-50"
                    >
                        <BiTrash className="w-4 h-4" />
                        {isDeleting ? "Deleting..." : "Delete Selected"}
                    </button>
                </div>
            )}

            {/* Table */}
            <div className="border border-slate-200 rounded-md overflow-hidden shadow-sm bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-slate-800 text-white uppercase text-xs tracking-wider">
                        <tr>
                            <th className="p-3 w-10 text-center">
                                <input
                                    type="checkbox"
                                    checked={isAllSelected}
                                    ref={(el) => {
                                        if (el) el.indeterminate = isIndeterminate;
                                    }}
                                    onChange={handleSelectAll}
                                    disabled={!informations.length}
                                    className="rounded border-slate-300 text-slate-800 focus:ring-slate-500 cursor-pointer"
                                />
                            </th>
                            <th className="text-left p-3 font-medium">ID</th>
                            <th className="text-left p-3 font-medium">Title</th>
                            <th className="text-left p-3 font-medium">Content</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {informations.length ? (
                            informations.map((info) => {
                                const isSelected = selectedIds.includes(info.id);
                                return (
                                    <tr
                                        key={info.id}
                                        className={`transition ${isSelected ? "bg-slate-50" : "hover:bg-slate-50"
                                            }`}
                                    >
                                        <td className="p-3 text-center">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => handleSelectOne(info.id)}
                                                className="rounded border-slate-300 text-slate-800 focus:ring-slate-500 cursor-pointer"
                                            />
                                        </td>

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
                                );
                            })
                        ) : (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="p-10 text-center text-slate-500"
                                >
                                    No Data Found
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
                        of {pagination.totalPages} • Total {pagination.totalItems} records
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