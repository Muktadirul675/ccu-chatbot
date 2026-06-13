
interface UserMessageProps {
  content: string;
}

export default function UserMessage({
  content,
}: UserMessageProps) {
  return (
    <div className="flex justify-end">
      <div
        className="
          max-w-[75%]
          rounded-2xl
          px-4 py-3
          text-sm
          leading-relaxed
          shadow-sm
          border
          bg-primary
          text-white
          border-transparent
        "
      >
        {content}
      </div>
    </div>
  );
}