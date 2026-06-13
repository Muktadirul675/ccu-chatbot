"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function InformationSearchForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(
        searchParams.get("search") ?? ""
    );

    function submit(e: React.FormEvent) {
        e.preventDefault();

        const params = new URLSearchParams();

        if (search) {
            params.set("search", search);
        }

        params.set("page", "1");

        router.push(`/dashboard/information?${params.toString()}`);
    }

    return (
        <form
            onSubmit={submit}
            className="bg-white rounded-lg flex gap-2 items-center"
        >
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search information..."
                className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none"
            />

            <button
                type="submit"
                className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900"
            >
                Search
            </button>
        </form>
    );
}