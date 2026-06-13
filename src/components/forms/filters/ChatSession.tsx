"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { IntentLabel } from "@/generated/prisma/enums";

export default function ChatFilterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [dateStart, setDateStart] = useState(
        searchParams.get("date_start") ?? ""
    );

    const [dateEnd, setDateEnd] = useState(
        searchParams.get("date_end") ?? ""
    );

    const [intent, setIntent] = useState(
        searchParams.get("intent") ?? ""
    );

    function submit(e: React.FormEvent) {
        e.preventDefault();

        const params = new URLSearchParams();

        if (dateStart) {
            params.set("date_start", dateStart);
        }

        if (dateEnd) {
            params.set("date_end", dateEnd);
        }

        if (intent) {
            params.set("intent", intent);
        }

        params.set("page", "1");

        router.push(`/dashboard/chats?${params.toString()}`);
    }

    return (
        <form
            onSubmit={submit}
            className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm flex flex-wrap gap-4 items-end"
        >
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">
                    Start Date
                </label>

                <input
                    type="date"
                    value={dateStart}
                    onChange={(e) => setDateStart(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">
                    End Date
                </label>

                <input
                    type="date"
                    value={dateEnd}
                    onChange={(e) => setDateEnd(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none"
                />
            </div>

            <div className="flex flex-col gap-1 min-w-[180px]">
                <label className="text-sm font-medium">
                    Intent
                </label>

                <select
                    value={intent}
                    onChange={(e) => setIntent(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none"
                >
                    <option value="">
                        All
                    </option>

                    {Object.values(IntentLabel).map((value) => (
                        <option
                            key={value}
                            value={value}
                        >
                            {value.charAt(0).toUpperCase() +
                                value.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

            <button
                type="submit"
                className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900"
            >
                Filter
            </button>
        </form>
    );
}