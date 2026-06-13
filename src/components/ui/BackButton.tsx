"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { BsArrowLeft } from "react-icons/bs";

export default function BackButton({ size = 15 }: { size?: number }) {
    const router = useRouter()
    const back = useCallback(() => {
        router.back()
    }, [])
    return <div>
        <BsArrowLeft size={size} onClick={back} className="text-blue-500 font-semibold hover:text-blue-700 cursor-pointer"/>
    </div>
}
