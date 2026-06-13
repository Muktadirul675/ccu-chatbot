"use client";

import BackButton from "@/components/ui/BackButton";
import { api } from "@/lib/api";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { BiSolidBookContent } from "react-icons/bi";
import { LuLoader, LuUpload } from "react-icons/lu";
import { MdOutlineTitle } from "react-icons/md";

export default function AddInfoPage() {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [loading, setLoading] = useState(false);
    const router = useRouter()

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        if (!title.trim() || !content.trim()) {
            toast.error("Title or content can't be empty")
            return;
        }
        setLoading(true)
        try {
            await api.post("/information", {
                title,
                content,
            });
            toast.success("Information added")
            router.push("/dashboard/information")
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data?.error || "Something went wrong"
                );
            } else {
                toast.error("Something went wrong");
            }
        } finally {
            setLoading(false)
        }
    }

    return <div className="min-h-screen w-full bg-white flex justify-center items-center p-5">
        <form onSubmit={handleSubmit} className="w-full max-w-xl rounded-lg p-5 border border-gray-300 bg-subtle">
            <div>
                <h1 className="text-xl text-slate-800 font-semibold flex items-center gap-2">
                    <BackButton size={20} />
                    Add Information
                </h1>
                <h3 className="text-gray-500">Provide title and content of the information</h3>
            </div>
            <hr className="my-3 border-gray-300" />
            <div className="my-1 flex flex-col gap-2">
                <label htmlFor="title" className="font-semibold text-sm flex items-center gap-2 text-slate-800">
                    <MdOutlineTitle /> Title
                </label>
                <input type="text" className="rounded bg-white px-2 py-1 border border-gray-300 focus:outline-none" placeholder="Title goes here..." name="title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="mt-3 flex flex-col gap-2">
                <label htmlFor="content" className="font-semibold text-sm flex items-center gap-2 text-slate-800">
                    <BiSolidBookContent /> Content
                </label>
                <textarea rows={10} className="rounded bg-white px-2 py-1 border border-gray-300 focus:outline-none" name="content" placeholder="Write your content..." value={content} onChange={(e) => setContent(e.target.value)} />
            </div>
            <hr className="mt-5 border-gray-300" />
            <div className="flex justify-end pt-5">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-primary hover:bg-secondary rounded-md shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed min-w-30"
                >
                    {loading ? (
                        <>
                            <LuLoader className="w-4 h-4 animate-spin" />
                            Adding
                        </>
                    ) : (
                        <>
                            <LuUpload className="w-4 h-4" />
                            Submit
                        </>
                    )}
                </button>
            </div>
        </form>
    </div>
}