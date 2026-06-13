import MarkdownRenderer from "./MarkdownRenderer";

interface AIMessageProps {
  content: string;
}

export default function AIMessage({
  content,
}: AIMessageProps) {
  return (
    <div className="flex justify-start">
      <div
        className="
          max-w-[75%]
          rounded-2xl
          px-4 py-3
          text-sm
          leading-relaxed
          shadow-sm
          border
          bg-blue-600
          text-white
          border-blue-500/30
        "
      >
        <MarkdownRenderer content={content} />
      </div>
    </div>
  );
}