'use client'

import { TiTimes } from 'react-icons/ti';

export default function Topbar() {
    return <div className="w-full flex p-2 px-3 items-center bg-slate-200 border-b border-gray-300 gap-2">
        <img src="/logo.jpeg" alt="" className="w-10 h-10 rounded-full" />
        <h2 className="font-semibold">
            Gulliver
        </h2>
        <div className="ms-auto flex items-center gap-1">
            <button onClick={() => {
                window.parent.postMessage({
                    type: "CLOSE_CHAT"
                }, "*")
            }} className="p-1 bg-slate-300 rounded">
                <TiTimes size={20} />
            </button>
        </div>
    </div>
}