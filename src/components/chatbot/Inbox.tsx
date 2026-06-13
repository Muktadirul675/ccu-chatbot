"use client";

import { useChatbot } from "@/contexts/chatbot";
import { useEffect, useMemo, useRef, useState } from "react";
import TopicBox from "./TopicBox";
import UserMessage from "../ui/UserMessage";
import AIMessage from "../ui/AIMessage";

export default function Inbox() {
  const { messages, status } = useChatbot();

  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [autoScroll, setAutoScroll] = useState(true);

  const showTopicBubbles = useMemo(() => {
    if (messages.length === 1 && messages[0].role === "assistant") return true;
  }, [messages.length])

  const showTypingIndicator = useMemo(() => {
    if (status !== "streaming") return false;

    const lastMessage = messages[messages.length - 1];

    // No assistant message yet
    if (!lastMessage || lastMessage.role !== "assistant") {
      return true;
    }

    // Assistant message exists but has no text yet
    const hasText = lastMessage.parts?.some(
      (part) =>
        part.type === "text" &&
        part.text.trim().length > 0
    );

    return !hasText;
  }, [messages, status]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const threshold = 150;

      const distanceFromBottom =
        container.scrollHeight -
        container.scrollTop -
        container.clientHeight;

      setAutoScroll(distanceFromBottom < threshold);
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!autoScroll) return;

    bottomRef.current?.scrollIntoView({
      behavior: status === "streaming" ? "auto" : "smooth",
      block: "end",
    });
  }, [messages, status, autoScroll]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-background pb-10">
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-5"
      >
        {messages.map((message) => {
          const content =
            message.parts
              ?.filter((part) => part.type === "text")
              .map((part) => part.text)
              .join("") ?? "";

          if (!content.trim()) return null;

          return (
            <div key={message.id}>
              {message.role === "user" ? (
                <UserMessage content={content} />
              ) : (
                <AIMessage content={content} />
              )}
            </div>
          );
        })}

        {showTypingIndicator && (
          <div className="flex justify-start">
            <div
              className="
      rounded-2xl
      px-4 py-3
      bg-blue-600
      text-white
      border border-blue-500/30
      shadow-sm
    "
            >
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-white/70 animate-bounce" />
                <span className="h-2 w-2 rounded-full bg-white/70 animate-bounce [animation-delay:150ms]" />
                <span className="h-2 w-2 rounded-full bg-white/70 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
        {showTopicBubbles && <TopicBox />}
        <div ref={bottomRef} />

      </div>
    </div>
  );
}