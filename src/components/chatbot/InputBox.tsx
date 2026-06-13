// components/input-box.tsx
"use client";

import { useChatbot } from "@/contexts/chatbot";
import { welcome_message } from "@/lib/welcome-message";
import { useEffect, useRef, useState } from "react";
import { BiPaperPlane } from "react-icons/bi";
import { BsStopFill } from "react-icons/bs";

export default function InputBox() {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { status, sendMessage, stop, initialized, setInitialized, setMessages } = useChatbot();

  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
    const maxHeight = 140; // Clean max height window before scrolling

    if (el.scrollHeight <= maxHeight) {
      el.style.overflowY = "hidden";
      el.style.height = `${el.scrollHeight}px`;
    } else {
      el.style.height = `${maxHeight}px`;
      el.style.overflowY = "auto";
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    resizeTextarea();
  };

  const handleSubmit = async () => {
    if (status === "streaming") {
      stop?.();
      return;
    }

    if (!value.trim()) return;
    sendMessage({ text: value.trim() });

    setValue("");
    
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  useEffect(() => {
    if (!initialized) {
      setMessages([
        {
          id: "init",
          role: "assistant",
          parts: [{ text: welcome_message, type: "text" }]
        }
      ]);
      setInitialized(true);
    }
  }, [initialized, setInitialized, setMessages]);

  const isStreaming = status === "streaming";

  return (
    <div className="w-full bg-white border-t border-gray-300 absolute bottom-0">
      <div className="flex items-end gap-3 px-4 py-3 bg-muted/30">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          rows={1}
          placeholder="Type your message..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          className="flex-1 min-h-6 max-h-35 py-1 resize-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70 leading-relaxed"
        />

        <div className="flex items-center h-8">
          <button
            onClick={handleSubmit}
            disabled={!value.trim() && !isStreaming}
            aria-label={isStreaming ? "Stop generating" : "Send message"}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-30
              ${isStreaming 
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" 
                : "bg-primary text-white hover:bg-primary/90"
              }`}
          >
            {isStreaming ? (
              <BsStopFill size={14} className="animate-pulse" />
            ) : (
              <BiPaperPlane size={14} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}