import React, { memo } from "react";
import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const markdownComponents: Partial<Components> = {
  // @ts-expect-error - `inline` is giving type error
  code: ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || "");
    return !inline ? (
      <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    ) : (
      <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-sm" {...props}>
        {children}
      </code>
    );
  },

  pre: ({ children }) => <>{children}</>,

  ol: ({ children, ...props }) => (
    <ol className="list-decimal list-outside ml-4 space-y-2" {...props}>
      {children}
    </ol>
  ),

  ul: ({ children, ...props }) => (
    <ul className="list-disc list-outside ml-4 space-y-2" {...props}>
      {children}
    </ul>
  ),

  li: ({ children, ...props }) => (
    <li className="py-1" {...props}>
      {children}
    </li>
  ),

  strong: ({ children, ...props }) => (
    <span className="font-semibold" {...props}>
      {children}
    </span>
  ),

  a: ({ href, children, ...props }) => (
    <Link
      href={href ?? ""}
      className="text-sky-400 hover:underline"
      target="_blank"
      rel="noreferrer"
      {...props}
    >
      {children}
    </Link>
  ),

  h1: ({ children, ...props }) => (
    <h1 className="text-3xl font-semibold mt-6 mb-2" {...props}>
      {children}
    </h1>
  ),

  h2: ({ children, ...props }) => (
    <h2 className="text-2xl font-semibold mt-6 mb-2" {...props}>
      {children}
    </h2>
  ),

  h3: ({ children, ...props }) => (
    <h3 className="text-xl font-semibold mt-6 mb-2" {...props}>
      {children}
    </h3>
  ),

  h4: ({ children, ...props }) => (
    <h4 className="text-lg font-semibold mt-6 mb-2" {...props}>
      {children}
    </h4>
  ),

  h5: ({ children, ...props }) => (
    <h5 className="text-base font-semibold mt-6 mb-2" {...props}>
      {children}
    </h5>
  ),

  h6: ({ children, ...props }) => (
    <h6 className="text-sm font-semibold mt-6 mb-2" {...props}>
      {children}
    </h6>
  ),

  p: ({ children, ...props }) => (
    <p className="mb-4 last:mb-0" {...props}>
      {children}
    </p>
  ),

  blockquote: ({ children, ...props }) => (
    <blockquote
      className="border-l-4 border-zinc-700 pl-4 my-4 italic"
      {...props}
    >
      {children}
    </blockquote>
  ),

  table: ({ children, ...props }) => (
    <div className="overflow-x-auto my-4">
      <table className="w-full border-collapse" {...props}>
        {children}
      </table>
    </div>
  ),

  th: ({ children, ...props }) => (
    <th className="border border-zinc-700 px-4 py-2 bg-zinc-800/50" {...props}>
      {children}
    </th>
  ),

  td: ({ children, ...props }) => (
    <td className="border border-zinc-700 px-4 py-2" {...props}>
      {children}
    </td>
  ),
};

interface MarkdownProps {
  content: string;
  className?: string;
}

const NonMemoizedMarkdown = ({ content, className = "" }: MarkdownProps) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={markdownComponents}
      //className={`prose prose-invert max-w-none ${className}`}
    >
      {content}
    </ReactMarkdown>
  );
};

export const Markdown = memo(NonMemoizedMarkdown);
