"use client";

import { useState } from "react";
import { TiUserAdd } from "react-icons/ti";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function CreateUserForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState<"SUPER_ADMIN" | "ADMIN">("ADMIN");
    const router = useRouter()

    const handleSubmit = async () => {
        if (!username.trim()) {
            return toast.error("Username is required");
        }

        if (!password.trim()) {
            return toast.error("Password is required");
        }

        try {
            setLoading(true);

            const res = await fetch("/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                    role,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data?.message ||
                    data?.error ||
                    "Failed to create user"
                );
            }

            toast.success("User created successfully");

            setUsername("");
            setPassword("");

            router.refresh()
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to create user"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="w-full rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">
                    Create New User
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                    Create a new admin/dashboard user.
                </p>

                <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end">
                    <div className="flex flex-1 flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            type="text"
                            placeholder="Enter username"
                            className="rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500"
                        />
                    </div>

                    <div className="flex flex-1 flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            placeholder="Enter password"
                            className="rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500"
                        />
                    </div>

                    <div className="flex flex-1 flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Role
                        </label>

                        <select
                            value={role}
                            onChange={(e) =>
                                setRole(e.target.value as "SUPER_ADMIN" | "ADMIN")
                            }
                            className="rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500"
                        >
                            <option value="ADMIN">Admin</option>
                            <option value="SUPER_ADMIN">Super Admin</option>
                        </select>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex h-[42px] items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <TiUserAdd size={18} />
                        {loading ? "Creating..." : "Create"}
                    </button>
                </div>
            </div>
        </div>
    );
}