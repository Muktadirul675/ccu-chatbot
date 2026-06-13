"use client";

import { UserRole } from "@/generated/prisma/enums";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import {
    LuLoader,
    LuShield,
    LuTrash2,
    LuUser,
    LuX
} from "react-icons/lu";
import BackButton from "../ui/BackButton";
import ChangePasswordButton from "../ui/ChangePasswordButton";

type Props = {
    user: {
        id: string;
        username: string;
        role: UserRole | null
    };
};

export default function EditUserPage({ user }: Props) {
    const router = useRouter();

    const [username, setUsername] = useState(user.username);
    const [role, setRole] = useState<UserRole>(
        user.role ?? UserRole.ADMIN
    );

    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);

    async function handleUpdate(e: FormEvent) {
        e.preventDefault();

        try {
            setLoading(true);

            const res = await fetch(`/api/users/${user.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    role,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data?.message || "Failed to update user");
                return;
            }

            toast.success("User updated successfully");
            router.push("/dashboard/users")
        } catch {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmDelete) return;

        try {
            setDeleting(true);

            const res = await fetch(`/api/users/${user.id}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data?.message || "Failed to delete user");
                return;
            }

            toast.success("User deleted successfully");

            router.push("/dashboard/users");
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setDeleting(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-white">
            <div className="w-full max-w-md bg-subtle border border-[#eef0f1] rounded-xl shadow-sm">

                {/* Header */}
                <div className="px-6 py-5 border-b border-[#eef0f1]">
                    <div className="flex items-center gap-2">
                        <BackButton size={20}/>
                        <h1 className="text-xl font-semibold text-[#1c1c1c] tracking-tight">
                            Edit User
                        </h1>
                    </div>

                    <p className="mt-1 text-sm text-[#687076]">
                        Update username, role or manage user actions.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleUpdate} className="p-6">

                    <div className="space-y-5">

                        {/* Username */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-[#687076] uppercase tracking-wider flex items-center gap-1.5">
                                <LuUser className="w-3.5 h-3.5" />
                                Username
                            </label>

                            <input
                                type="text"
                                value={username}
                                onChange={(e) =>
                                    setUsername(e.target.value)
                                }
                                disabled={loading || deleting}
                                className="w-full px-3 py-2.5 text-sm bg-white border border-[#dcdede] rounded-md text-[#1c1c1c] shadow-sm transition-colors focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-60 disabled:bg-[#f5f5f5]"
                            />
                        </div>

                        {/* Role */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-[#687076] uppercase tracking-wider flex items-center gap-1.5">
                                <LuShield className="w-3.5 h-3.5" />
                                Role
                            </label>

                            <select
                                value={role}
                                onChange={(e) =>
                                    setRole(
                                        e.target.value as
                                        | "ADMIN"
                                        | "SUPER_ADMIN"
                                    )
                                }
                                disabled={loading || deleting}
                                className="w-full px-3 py-2.5 text-sm bg-white border border-[#dcdede] rounded-md text-[#1c1c1c] shadow-sm transition-colors focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-60 disabled:bg-[#f5f5f5]"
                            >
                                <option value="ADMIN">Admin</option>
                                <option value="SUPER_ADMIN">
                                    Super Admin
                                </option>
                            </select>
                        </div>

                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 pt-5 mt-5 border-t border-[#eef0f1]">

                        {/* Save */}
                        <button
                            type="submit"
                            disabled={loading || deleting}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary rounded-md shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <LuLoader className="w-4 h-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </button>

                        {/* Change Password */}
                        <ChangePasswordButton userId={user.id} />

                        {/* Delete */}
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={loading || deleting}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm transition-colors disabled:opacity-70"
                        >
                            {deleting ? (
                                <>
                                    <LuLoader className="w-4 h-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <LuTrash2 className="w-4 h-4" />
                                    Delete User
                                </>
                            )}
                        </button>

                        {/* Cancel */}
                        <button
                            type="button"
                            onClick={() => router.back()}
                            disabled={loading || deleting}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-[#1c1c1c] bg-white border border-[#dcdede] hover:bg-[#f5f5f5] rounded-md transition-colors disabled:opacity-60"
                        >
                            <LuX className="w-4 h-4" />
                            Cancel
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
}