import React from 'react';
import ReactMarkdown from 'react-markdown';

/**
 * Reusable, styled ReactMarkdown component
 * Supports bold, italic, lists, code blocks, blockquotes, and tables
 */
export default function MarkdownRenderer({ content, className = '' }) {
  if (!content) return null;

  return (
    <div className={`markdown-content text-inherit leading-relaxed ${className}`}>
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-base font-black text-white mt-2 mb-1" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-sm font-extrabold text-emerald-400 mt-2 mb-1" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-xs font-bold text-amber-300 mt-1.5 mb-0.5" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="mb-1.5 last:mb-0 leading-relaxed" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside space-y-1 my-1.5 pl-1" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside space-y-1 my-1.5 pl-1" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="text-inherit leading-snug" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-extrabold text-emerald-300" {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className="italic text-slate-300" {...props} />
          ),
          code: ({ node, inline, ...props }) =>
            inline ? (
              <code className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-300 font-mono text-[11px] border border-slate-700" {...props} />
            ) : (
              <pre className="p-2.5 rounded-xl bg-slate-950/90 text-emerald-400 font-mono text-[11px] overflow-x-auto my-2 border border-slate-800">
                <code {...props} />
              </pre>
            ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-2 border-emerald-500 pl-3 italic text-slate-300 my-2" {...props} />
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
