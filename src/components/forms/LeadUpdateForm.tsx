"use client";

import { api } from "@/lib/api";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { BiTrash, BiUpload } from "react-icons/bi";
import { LuLoader } from "react-icons/lu";

type TimelineOption =
    | "YEARS_1_2"
    | "YEARS_2_3"
    | "YEARS_3_4"
    | "YEARS_4_5"
    | "YEARS_5_10";

type FieldRelevance = "YES" | "NO" | "OTHER";

type MotivationOption =
    | "PAY_INCREASE_PROMOTION"
    | "PERSONAL_ACHIEVEMENT"
    | "LIFELONG_LEARNING"
    | "EDUCATIONAL_GAIN_DEGREE_COMPLETION"
    | "INDUSTRY_COMPETITION"
    | "OTHER";

type Lead = {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    state: string | null;
    bestPhone: string | null;
    country: string;
    programName: string | null;
    educationLevel: string | null;

    isAgeConfirmed: boolean;

    completionTimeline: TimelineOption | null;
    motivation: MotivationOption[];
    isFieldRelated: FieldRelevance | null;
};

export default function LeadUpdateForm({
    lead,
}: {
    lead: Lead;
}) {
    const router = useRouter();

    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [form, setForm] = useState({
        firstName: lead.firstName ?? "",
        lastName: lead.lastName ?? "",
        email: lead.email ?? "",
        state: lead.state ?? "",
        bestPhone: lead.bestPhone ?? "",
        country: lead.country ?? "",
        programName: lead.programName ?? "",
        educationLevel: lead.educationLevel ?? "",

        isAgeConfirmed: lead.isAgeConfirmed,

        completionTimeline: lead.completionTimeline ?? "",

        motivation: lead.motivation ?? [],

        isFieldRelated: lead.isFieldRelated ?? "",
    });

    const isLoading = updating || deleting;

    async function deleteLead() {
        setDeleting(true);

        try {
            await api.delete(`/leads/${lead.id}`);

            toast.success("Lead deleted");
            router.push("/dashboard/leads");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data?.error ?? "Something went wrong"
                );
            } else {
                toast.error("Unknown Error");
            }
        } finally {
            setDeleting(false);
        }
    }

    async function updateLead() {
        setUpdating(true);

        try {
            await api.put(`/leads/${lead.id}`, form);

            toast.success("Lead updated");
            router.push("/dashboard/leads");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data?.error ?? "Something went wrong"
                );
            } else {
                toast.error("Unknown Error");
            }
        } finally {
            setUpdating(false);
        }
    }

    return (
        <div className="w-full min-h-screen bg-white flex justify-center items-center p-5">
            <div className="w-full max-w-3xl rounded-lg p-5 bg-subtle shadow">
                <h3 className="text-lg font-semibold">Update Lead</h3>

                <h3 className="text-gray-500 text-sm my-2">
                    Update lead information and qualification data
                </h3>

                <br />

                <form className="space-y-4">
                    {/* First Name */}
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold text-sm">
                            First Name
                        </label>

                        <input
                            type="text"
                            value={form.firstName}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    firstName: e.target.value,
                                }))
                            }
                            disabled={isLoading}
                            className="rounded bg-white px-2 py-1 border border-gray-300 focus:outline-none"
                        />
                    </div>

                    {/* Last Name */}
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold text-sm">
                            Last Name
                        </label>

                        <input
                            type="text"
                            value={form.lastName}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    lastName: e.target.value,
                                }))
                            }
                            disabled={isLoading}
                            className="rounded bg-white px-2 py-1 border border-gray-300 focus:outline-none"
                        />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold text-sm">
                            Email
                        </label>

                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    email: e.target.value,
                                }))
                            }
                            disabled={isLoading}
                            className="rounded bg-white  px-2 py-1 border border-gray-300 focus:outline-none"
                        />
                    </div>

                    {/* State */}
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold text-sm">
                            State
                        </label>

                        <input
                            type="text"
                            value={form.state}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    state: e.target.value,
                                }))
                            }
                            disabled={isLoading}
                            className="rounded bg-white px-2 py-1 border border-gray-300 focus:outline-none"
                        />
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold text-sm">
                            Best Phone
                        </label>

                        <input
                            type="text"
                            value={form.bestPhone}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    bestPhone: e.target.value,
                                }))
                            }
                            disabled={isLoading}
                            className="rounded bg-white px-2 py-1 border border-gray-300 focus:outline-none"
                        />
                    </div>

                    {/* Country */}
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold text-sm">
                            Country
                        </label>

                        <input
                            type="text"
                            value={form.country}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    country: e.target.value,
                                }))
                            }
                            disabled={isLoading}
                            className="rounded bg-white px-2 py-1 border border-gray-300 focus:outline-none"
                        />
                    </div>

                    {/* Program Name */}
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold text-sm">
                            Program Name
                        </label>

                        <input
                            type="text"
                            value={form.programName}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    programName: e.target.value,
                                }))
                            }
                            disabled={isLoading}
                            className="rounded bg-white px-2 py-1 border border-gray-300 focus:outline-none"
                        />
                    </div>

                    {/* Education Level */}
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold text-sm">
                            Education Level
                        </label>

                        <input
                            type="text"
                            value={form.educationLevel}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    educationLevel: e.target.value,
                                }))
                            }
                            disabled={isLoading}
                            className="rounded bg-white px-2 py-1 border border-gray-300 focus:outline-none"
                        />
                    </div>

                    {/* Age Confirmed */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={form.isAgeConfirmed}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    isAgeConfirmed: e.target.checked,
                                }))
                            }
                            disabled={isLoading}
                        />

                        <label className="font-semibold text-sm">
                            Age Confirmed (18+)
                        </label>
                    </div>

                    {/* Completion Timeline */}
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold text-sm">
                            Completion Timeline
                        </label>

                        <select
                            value={form.completionTimeline}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    completionTimeline: e.target
                                        .value as TimelineOption,
                                }))
                            }
                            disabled={isLoading}
                            className="rounded bg-white px-2 py-2 border border-gray-300 focus:outline-none"
                        >
                            <option value="">
                                Select Timeline
                            </option>

                            <option value="YEARS_1_2">
                                1 - 2 Years
                            </option>

                            <option value="YEARS_2_3">
                                2 - 3 Years
                            </option>

                            <option value="YEARS_3_4">
                                3 - 4 Years
                            </option>

                            <option value="YEARS_4_5">
                                4 - 5 Years
                            </option>

                            <option value="YEARS_5_10">
                                5 - 10 Years
                            </option>
                        </select>
                    </div>

                    {/* Field Relevance */}
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold text-sm">
                            Field Relevance
                        </label>

                        <select
                            value={form.isFieldRelated}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    isFieldRelated: e.target
                                        .value as FieldRelevance,
                                }))
                            }
                            disabled={isLoading}
                            className="rounded bg-white px-2 py-2 border border-gray-300 focus:outline-none"
                        >
                            <option value="">
                                Select Option
                            </option>

                            <option value="YES">
                                Yes
                            </option>

                            <option value="NO">
                                No
                            </option>

                            <option value="OTHER">
                                Other
                            </option>
                        </select>
                    </div>

                    {/* Motivation */}
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold text-sm">
                            Motivation
                        </label>

                        <select
                            multiple
                            value={form.motivation}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    motivation: Array.from(
                                        e.target.selectedOptions
                                    ).map(
                                        (option) =>
                                            option.value as MotivationOption
                                    ),
                                }))
                            }
                            disabled={isLoading}
                            className="rounded bg-white px-2 py-2 border border-gray-300 focus:outline-none min-h-[140px]"
                        >
                            <option value="PAY_INCREASE_PROMOTION">
                                Pay Increase / Promotion
                            </option>

                            <option value="PERSONAL_ACHIEVEMENT">
                                Personal Achievement
                            </option>

                            <option value="LIFELONG_LEARNING">
                                Lifelong Learning
                            </option>

                            <option value="EDUCATIONAL_GAIN_DEGREE_COMPLETION">
                                Degree Completion
                            </option>

                            <option value="INDUSTRY_COMPETITION">
                                Industry Competition
                            </option>

                            <option value="OTHER">
                                Other
                            </option>
                        </select>

                        <span className="text-xs text-gray-500">
                            Hold Ctrl (Windows) or Cmd (Mac) to select multiple
                            options.
                        </span>
                    </div>
                </form>

                <br />

                <div className="flex items-center gap-2">
                    {/* DELETE */}
                    <button
                        disabled={isLoading}
                        onClick={deleteLead}
                        className="bg-red-500 rounded text-white p-2 hover:bg-red-600 flex items-center gap-1 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {deleting ? (
                            <>
                                <LuLoader className="animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <BiTrash />
                                Delete
                            </>
                        )}
                    </button>

                    {/* RIGHT SIDE */}
                    <div className="ms-auto flex items-center gap-2">
                        <button
                            disabled={isLoading}
                            onClick={() =>
                                router.push("/dashboard/leads")
                            }
                            className="bg-gray-300/60 text-black hover:bg-gray-300 p-2 rounded disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>

                        <button
                            disabled={isLoading}
                            onClick={updateLead}
                            className="bg-blue-800 text-white hover:bg-blue-900 p-2 rounded flex items-center gap-1 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {updating ? (
                                <>
                                    <LuLoader className="animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <BiUpload />
                                    Update
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}