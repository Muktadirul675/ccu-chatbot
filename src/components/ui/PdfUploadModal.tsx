"use client";

import { useState, useRef } from "react";
import { BiFile, BiUpload, BiX } from "react-icons/bi";
import { ImSpinner2 } from "react-icons/im";
import { toast } from "react-hot-toast";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

type Props = {
    onSuccess?: () => void;
};

export default function PdfUploadModal({ onSuccess }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type !== "application/pdf") {
                toast.error("Please select a valid PDF file");
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleReset = () => {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleClose = () => {
        if (isUploading) return;
        setIsOpen(false);
        handleReset();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            toast.error("Please choose a PDF file to upload");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            setIsUploading(true);

            // Axios handles multipart/form-data headers automatically when sending FormData
            await api.post("/information/pdf-extract", formData);

            toast.success("PDF processed successfully");
            handleClose();

            if (onSuccess) {
                onSuccess();
            }
            router.refresh()
        } catch (error: any) {
            console.error("PDF upload error:", error);
            toast.error(
                error.response?.data?.error ??
                error.response?.data?.message ??
                "Failed to process PDF"
            );
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-md text-sm font-medium transition shadow-sm"
            >
                <BiUpload className="w-4 h-4" />
                Extract from PDF
            </button>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                            <h3 className="font-semibold text-slate-900 text-base">
                                Upload PDF Document
                            </h3>
                            <button
                                onClick={handleClose}
                                disabled={isUploading}
                                className="text-slate-400 hover:text-slate-600 transition disabled:opacity-50"
                            >
                                <BiX className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Body Form */}
                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            {/* Dropzone Container */}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${file
                                        ? "border-slate-800 bg-slate-50"
                                        : "border-slate-300 hover:border-slate-400 bg-slate-50/50"
                                    }`}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />

                                {file ? (
                                    <>
                                        <BiFile className="w-10 h-10 text-slate-700" />
                                        <p className="text-sm font-medium text-slate-800 truncate max-w-xs">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <BiUpload className="w-8 h-8 text-slate-400" />
                                        <p className="text-sm text-slate-600">
                                            <span className="font-semibold text-slate-900">
                                                Click to upload
                                            </span>{" "}
                                            or drag & drop
                                        </p>
                                        <p className="text-xs text-slate-400">PDF up to 10MB</p>
                                    </>
                                )}
                            </div>

                            {file && (
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        disabled={isUploading}
                                        className="text-xs text-red-600 hover:underline"
                                    >
                                        Remove file
                                    </button>
                                </div>
                            )}

                            {/* Modal Actions */}
                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={isUploading}
                                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-md transition disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={!file || isUploading}
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-md text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed min-w-[110px]"
                                >
                                    {isUploading ? (
                                        <>
                                            <ImSpinner2 className="w-4 h-4 animate-spin" />
                                            Parsing...
                                        </>
                                    ) : (
                                        "Extract"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}