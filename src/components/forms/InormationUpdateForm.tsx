"use client";

import { api } from "@/lib/api";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { BiSolidBookContent, BiTrash, BiUpload } from "react-icons/bi";
import { LuLoader } from "react-icons/lu";
import { MdOutlineTitle } from "react-icons/md";

export default function InformationUpdateForm({
    information,
}: {
    information: { id: string; title: string; content: string };
}) {
    const [title, setTitle] = useState(information.title);
    const [content, setContent] = useState(information.content);
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const router = useRouter();

    const isLoading = updating || deleting;

    async function deleteInfo() {
        setDeleting(true);
        try {
            await api.delete(`/information/${information.id}`)
            toast("Information Deleted")
            router.push("/dashboard/information")
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data.error ?? "Something went wrong")
            } else {
                toast.error("Unknown Error")
            }
        } finally {
            setDeleting(false)
        }
    }

    async function update() {
        if (title === information.title && content === information.content) {
            router.push("/dashboard/information")
            return;
        }
        if (!title.trim() || !content.trim()) {
            toast.error("Title or Content can't be empty")
            return;
        }
        setUpdating(true)
        try {
            await api.put(`/information/${information.id}`, {
                title,
                content
            })
            toast.success("Information updated")
            router.push("/dashboard/information")
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data.error ?? "Something went wrong")
            } else {
                toast.error("Unknown Error")
            }
        } finally {
            setUpdating(false)
        }
    }

    return (
        <div className="w-full min-h-screen bg-white flex justify-center items-center p-5">
            <div className="w-full max-w-xl rounded-lg p-5 bg-subtle shadow">
                <h3 className="text-lg font-semibold">Update Information</h3>
                <h3 className="text-gray-500 text-sm my-2">
                    Update information title and content
                </h3>

                <br />

                <form>
                    <div className="my-1 flex flex-col gap-2">
                        <label className="font-semibold text-sm flex items-center gap-2 text-slate-800">
                            <MdOutlineTitle /> Title
                        </label>

                        <input
                            type="text"
                            className="rounded bg-white px-2 py-1 border border-gray-300 focus:outline-none"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="mt-3 flex flex-col gap-2">
                        <label className="font-semibold text-sm flex items-center gap-2 text-slate-800">
                            <BiSolidBookContent /> Content
                        </label>

                        <textarea
                            rows={10}
                            className="rounded bg-white px-2 py-1 border border-gray-300 focus:outline-none"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                </form>

                <br />

                <div className="flex items-center gap-2">
                    {/* DELETE */}
                    <button
                        disabled={isLoading}
                        onClick={() => deleteInfo()}
                        className="bg-red-500 rounded text-white p-2 hover:bg-red-600 flex items-center gap-1 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {deleting ? (
                            <>
                                <LuLoader className="animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <BiTrash /> Delete
                            </>
                        )}
                    </button>

                    {/* CANCEL */}
                    <button
                        disabled={isLoading}
                        onClick={() => router.push("/dashboard/information")}
                        className="ms-auto bg-gray-300/60 text-black hover:bg-gray-300 p-2 rounded disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>

                    {/* UPDATE */}
                    <button
                        disabled={isLoading}
                        onClick={() => update()}
                        className="bg-blue-800 text-white hover:bg-blue-900 p-2 rounded flex items-center gap-1 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {updating ? (
                            <>
                                <LuLoader className="animate-spin" />
                                Updating...
                            </>
                        ) : (
                            <>
                                <BiUpload /> Update
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}