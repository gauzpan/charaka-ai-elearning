import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Renders model output as formatted markdown, styled to the design system.
// react-markdown does not emit raw HTML by default, so this is XSS-safe.
export function Markdown({ children }: { children: string }) {
  return (
    <div className="flex flex-col gap-3 text-sm leading-relaxed text-primary">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p>{children}</p>,
          strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          ul: ({ children }) => <ul className="list-disc space-y-1.5 pl-5">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal space-y-1.5 pl-5">{children}</ol>,
          li: ({ children }) => <li className="pl-1">{children}</li>,
          h1: ({ children }) => <h1 className="font-display text-lg text-primary">{children}</h1>,
          h2: ({ children }) => <h2 className="font-display text-base text-primary">{children}</h2>,
          h3: ({ children }) => <h3 className="font-display text-sm text-primary">{children}</h3>,
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-info underline">
              {children}
            </a>
          ),
          code: ({ className, children }) =>
            className ? (
              // fenced block (carries a language-* class) — pre supplies the frame
              <code className="font-mono text-[13px]">{children}</code>
            ) : (
              <code className="rounded bg-subtle px-1 py-0.5 font-mono text-[13px]">{children}</code>
            ),
          pre: ({ children }) => (
            <pre className="overflow-x-auto rounded-md border bg-subtle p-3 font-mono text-[13px] text-primary">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-strong pl-3 text-secondary">{children}</blockquote>
          ),
          hr: () => <hr className="border-default" />,
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border px-2 py-1 text-left font-semibold text-primary">{children}</th>
          ),
          td: ({ children }) => <td className="border px-2 py-1 align-top">{children}</td>,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
