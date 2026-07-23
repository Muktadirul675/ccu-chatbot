"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BiTrash } from "react-icons/bi";
import { ImSpinner2 } from "react-icons/im"; // Spinner icon for loading state
import axios from "axios";
import { toast } from "react-hot-toast"; // Or "react-hot-toast"
import { api } from "@/lib/api";

type DeleteLeadButtonProps = {
    leadId: string;
};

export default function DeleteLeadButton({ leadId }: DeleteLeadButtonProps) {
    const [deleting, setDeleting] = useState(false);
    const router = useRouter();

    async function deleteLead() {
        setDeleting(true);

        try {
            await api.delete(`/leads/${leadId}`);

            toast.success("Lead deleted");
            router.push("/dashboard/leads");
            router.refresh(); // Refresh current route data if needed
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

    return (
        <button
            onClick={deleteLead}
            disabled={deleting}
            title="Delete Lead"
            aria-label="Delete Lead"
            className="inline-flex items-center justify-center p-1.5 rounded-md hover:bg-red-600 text-red-500 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {deleting ? (
                <ImSpinner2 className="w-5 h-5 animate-spin" />
            ) : (
                <BiTrash className="w-5 h-5" />
            )}
        </button>
    );
}