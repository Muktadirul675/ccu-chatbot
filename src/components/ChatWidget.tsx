"use client";

import { useEffect, useRef, useState } from "react";

const IFRAME_ORIGIN = "https://ccu-chatbot.vercel.app";

export default function ChatWidget() {
  const toggleRef = useRef<HTMLInputElement>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // session id
  useEffect(() => {
    const existing = localStorage.getItem("chat_session_id");

    if (existing) {
      setSessionId(existing);
      return;
    }

    const newId = crypto.randomUUID();
    localStorage.setItem("chat_session_id", newId);
    setSessionId(newId);
  }, []);

  // open by default desktop
  useEffect(() => {
    if (window.innerWidth > 768 && toggleRef.current) {
      toggleRef.current.checked = true;
    }
  }, []);

  // postMessage listener
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.origin !== IFRAME_ORIGIN) return;

      if (event.data?.type === "CLOSE_CHAT") {
        if (toggleRef.current) toggleRef.current.checked = false;
      }

      if (event.data?.type === "OPEN_CHAT") {
        if (toggleRef.current) toggleRef.current.checked = true;
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  if (!sessionId) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[999999]">
      {/* hidden checkbox */}
      <input
        ref={toggleRef}
        id="chat-toggle"
        type="checkbox"
        className="hidden peer"
      />

      {/* ================= CHAT BOX ================= */}
      <div
        className="
          /* MOBILE STYLES (Default) */
          /* Break out of the parent container on mobile to fill the whole viewport */
          fixed inset-0 
          w-full h-full 
          bg-white rounded-none
          
          /* DESKTOP STYLES (768px and up) */
          /* Revert back to absolute anchoring inside the widget container */
          md:absolute md:top-auto md:left-auto md:bottom-0 md:right-0
          md:w-[360px] md:h-[520px]
          md:rounded-xl

          shadow-2xl
          z-[9999999]
          transition-all duration-300 ease-out

          /* Animation changes */
          /* On mobile, it slides up from the bottom; on desktop, it slides in from the right */
          translate-y-full md:translate-y-0 md:translate-x-[120%] 
          opacity-0

          peer-checked:translate-x-0 peer-checked:translate-y-0
          peer-checked:opacity-100
        "
      >
        <iframe
          className="w-full h-full border-0"
          src={`https://ccu-chatbot.vercel.app/chatbot?sessionId=${sessionId}`}
        />
      </div>

      {/* ================= BUBBLE ================= */}
      <label
        htmlFor="chat-toggle"
        className="
          w-[70px] h-[70px]
          rounded-full overflow-hidden
          cursor-pointer
          block
          shadow-lg

          z-[10]
          relative

          transition-transform duration-200
          hover:scale-105

          peer-checked:opacity-0
          peer-checked:pointer-events-none
        "
      >
        <img
          src="/logo.jpeg"
          className="w-full h-full rounded-full object-cover border-2 border-blue-500/50"
          alt="chat"
        />
      </label>
    </div>
  );
}