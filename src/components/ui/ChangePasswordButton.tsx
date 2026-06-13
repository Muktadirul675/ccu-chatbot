"use client";

import { useState } from "react";
import toast from "react-hot-toast";

type Props = {
    userId: string;
};

export default function ChangePasswordButton({ userId }: Props) {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        const password = window.prompt("Enter new password");

        if (!password) return;

        try {
            setLoading(true);

            const res = await fetch(
                `/api/users/${userId}/change-password`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        password,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                toast.error(
                    data?.message ||
                    data?.error ||
                    "Failed to change password"
                );
                return;
            }

            toast.success(
                data?.message || "Password changed successfully"
            );
        } catch {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg bg-orange-500 text-white flex items-center justify-center gap-1 hover:bg-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed text-center"
        >
            {loading ? "Changing..." : "Change Password"}
        </button>
    );
}

