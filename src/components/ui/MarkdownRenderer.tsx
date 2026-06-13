"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownRendererProps = {
  content: string;
};

export default function MarkdownRenderer({
  content,
}: MarkdownRendererProps) {
  return (
    <div className="prose prose-sm max-w-none dark:prose-invert prose-pre:bg-muted prose-code:text-primary">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold">
              {children}
            </h1>
          ),

          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold">
              {children}
            </h2>
          ),

          h3: ({ children }) => (
            <h3 className="text-xl font-semibold">
              {children}
            </h3>
          ),

          p: ({ children }) => (
            <p className="leading-7">
              {children}
            </p>
          ),

          ul: ({ children }) => (
            <ul className="list-disc pl-6">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="list-decimal pl-6">
              {children}
            </ol>
          ),

          li: ({ children }) => (
            <li className="mb-1">
              {children}
            </li>
          ),

          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
              {children}
            </blockquote>
          ),

          code(props) {
            const { children, className } = props;

            const isInline = !className;

            if (isInline) {
              return (
                <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
                  {children}
                </code>
              );
            }

            return (
              <pre className="overflow-x-auto rounded-xl p-4">
                <code className={className}>
                  {children}
                </code>
              </pre>
            );
          },

          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4"
            >
              {children}
            </a>
          ),
          br: () => (<br/>)
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}