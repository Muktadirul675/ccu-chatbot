"use client";

import {
    ChatbotSetting,
    REDIS_PREFIX,
    SETTINGS_MAIL_HOST,
    SETTINGS_MAIL_PASSWORD,
    SETTINGS_MAIL_USER,
    SETTINGS_PASSWORD_KEY,
    SETTINGS_TRANSCRIPT_RECEIVERS_KEY,
    SETTINGS_USERNAME_KEY,
} from "@/globals";
import { useCallback, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { LuUser, LuLock, LuMail, LuPlus, LuLoader } from "react-icons/lu";

export default function SettingsForm({
    settings,
}: {
    settings: ChatbotSetting[];
}) {
    const settingsMap = useMemo(() => {
        const map: Record<string, string> = {};
        settings.forEach((s) => (map[s.key] = s.value ?? ""));
        return map;
    }, [settings]);

    const getSetting = useCallback(
        (key: string, fallback = "") => settingsMap[`${REDIS_PREFIX}${key}`] ?? fallback,
        [settingsMap]
    );

    // ---------------- initial values ----------------

    const [username, setUsername] = useState(
        getSetting(SETTINGS_USERNAME_KEY)
    );

    const [password, setPassword] = useState(
        getSetting(SETTINGS_PASSWORD_KEY)
    );

    const [confirmPassword, setConfirmPassword] = useState("");

    const [receivers, setReceivers] = useState<string[]>(() => {
        try {
            return JSON.parse(
                getSetting(SETTINGS_TRANSCRIPT_RECEIVERS_KEY, "[]")
            );
        } catch {
            return [];
        }
    });

    const [mailHost, setMailHost] = useState(getSetting(SETTINGS_MAIL_HOST));
    const [mailUser, setMailUser] = useState(getSetting(SETTINGS_MAIL_USER));
    const [mailPassword, setMailPassword] = useState(
        getSetting(SETTINGS_MAIL_PASSWORD)
    );
    const [confirmMailPassword, setConfirmMailPassword] = useState("");

    // ---------------- dirty state ----------------

    const [isPasswordChanged, setIsPasswordChanged] = useState(false);
    const [isMailPasswordChanged, setIsMailPasswordChanged] = useState(false);

    const [newReceiver, setNewReceiver] = useState("");
    const [loading, setLoading] = useState(false);

    // ---------------- validation ----------------

    const isValidEmail = (email: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const addReceiver = () => {
        const email = newReceiver.trim();
        if (!email) return;

        if (!isValidEmail(email)) {
            toast.error("Invalid email format");
            return;
        }

        setReceivers((p) => [...p, email]);
        setNewReceiver("");
        toast.success("Receiver added");
    };

    const removeReceiver = (i: number) => {
        setReceivers((p) => p.filter((_, idx) => idx !== i));
        toast.success("Receiver removed");
    };

    // ---------------- submit ----------------

    const handleUpdate = async () => {
        if (isPasswordChanged && password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (isMailPasswordChanged && mailPassword !== confirmMailPassword) {
            toast.error("Mail passwords do not match");
            return;
        }

        const invalidEmail = receivers.find((r) => !isValidEmail(r));
        if (invalidEmail) {
            toast.error(`Invalid email: ${invalidEmail}`);
            return;
        }

        try {
            setLoading(true);

            const payload: ChatbotSetting[] = [
                { key: SETTINGS_USERNAME_KEY, value: username },
                { key: SETTINGS_PASSWORD_KEY, value: password },
                { key: SETTINGS_MAIL_HOST, value: mailHost },
                { key: SETTINGS_MAIL_USER, value: mailUser },
                { key: SETTINGS_MAIL_PASSWORD, value: mailPassword },
                {
                    key: SETTINGS_TRANSCRIPT_RECEIVERS_KEY,
                    value: JSON.stringify(receivers),
                },
            ];

            const res = await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.message || "Failed to update settings");
            }

            toast.success("Settings updated successfully");

            // reset dirty state
            setIsPasswordChanged(false);
            setIsMailPasswordChanged(false);
            setConfirmPassword("");
            setConfirmMailPassword("");
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    // ---------------- UI ----------------

    return (
        <div className="my-5 w-full md:w-1/2 mx-auto p-6 bg-subtle border border-[#eef0f1] rounded-xl shadow-sm">

            {/* HEADER */}
            <div className="mb-6 border-b border-[#eef0f1] pb-4">
                <h1 className="text-xl font-semibold text-[#1c1c1c]">
                    Settings
                </h1>
                <p className="text-sm text-[#687076] mt-1">
                    Manage authentication and transcript receivers.
                </p>
            </div>
            {/* MAIL SETTINGS */}
            <div className="space-y-5 mb-8">

                <label className="text-xs font-medium text-[#687076] uppercase tracking-wider flex items-center gap-1.5">
                    <LuMail className="w-3.5 h-3.5" />
                    Mail Settings
                </label>

                {/* Host */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-[#687076]">SMTP Host</label>
                    <input
                        value={mailHost}
                        onChange={(e) => setMailHost(e.target.value)}
                        className="px-3 py-2 text-sm bg-white border border-[#dcdede] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                </div>

                {/* User */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-[#687076]">Mail User</label>
                    <input
                        value={mailUser}
                        onChange={(e) => setMailUser(e.target.value)}
                        className="px-3 py-2 text-sm bg-white border border-[#dcdede] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-[#687076]">Mail Password</label>
                    <input
                        type="password"
                        value={mailPassword}
                        onChange={(e) => {
                            setMailPassword(e.target.value);
                            setIsMailPasswordChanged(true);
                        }}
                        className="px-3 py-2 text-sm bg-white border border-[#dcdede] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                </div>

                {/* Confirm Mail Password */}
                {isMailPasswordChanged && (
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-[#687076]">
                            Confirm Mail Password
                        </label>

                        <input
                            type="password"
                            value={confirmMailPassword}
                            onChange={(e) =>
                                setConfirmMailPassword(e.target.value)
                            }
                            className="px-3 py-2 text-sm bg-white border border-[#dcdede] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                    </div>
                )}
            </div>

            {/* RECEIVERS */}
            <div className="space-y-4 border-t border-[#eef0f1] pt-5 mt-3">

                <label className="text-xs font-medium text-[#687076] flex items-center gap-1.5 uppercase tracking-wider">
                    <LuMail className="w-3.5 h-3.5" />
                    Transcript Receivers
                </label>

                <div className="space-y-2 my-2">
                    {receivers.length === 0 && (
                        <p className="text-sm text-[#a0a0a0]">
                            No receivers added
                        </p>
                    )}

                    {receivers.map((rc, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between px-3 py-2 border border-[#dcdede] bg-white"
                        >
                            <span className="text-sm text-[#1c1c1c]">
                                {rc}
                            </span>
                            <button
                                onClick={() => removeReceiver(i)}
                                className="text-sm text-[#687076] hover:text-red-600"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>

                <div className="flex gap-2">
                    <input
                        type="email"
                        value={newReceiver}
                        onChange={(e) => setNewReceiver(e.target.value)}
                        placeholder="Add email"
                        className="flex-1 px-3 py-2 text-sm bg-white border border-[#dcdede] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />

                    <button
                        onClick={addReceiver}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm border border-[#dcdede] bg-white text-[#687076] hover:bg-[#f8f9fa]"
                    >
                        <LuPlus className="w-3.5 h-3.5" />
                        Add
                    </button>
                </div>
            </div>
            <br />
            {/* ACTION */}
            <div className="flex justify-end pt-6 mt-3">
                <button
                    disabled={loading}
                    onClick={handleUpdate}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/80 disabled:opacity-70"
                >
                    {loading ? (
                        <>
                            <LuLoader className="w-4 h-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        "Update Settings"
                    )}
                </button>
            </div>
        </div>
    );
}