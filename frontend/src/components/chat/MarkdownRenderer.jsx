import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function MarkdownRenderer({ content }) {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                // Paragraphs
                p: ({ node, ...props }) => (
                    <p className="mb-3 leading-relaxed text-gray-800 dark:text-gray-200" {...props} />
                ),

                // Bold text
                strong: ({ node, ...props }) => (
                    <strong className="font-bold text-gray-900 dark:text-white" {...props} />
                ),

                // Italic text
                em: ({ node, ...props }) => (
                    <em className="italic text-gray-800 dark:text-gray-200" {...props} />
                ),

                // Inline code
                code: ({ node, inline, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                        <SyntaxHighlighter
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            className="rounded-lg my-4 text-sm"
                            {...props}
                        >
                            {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                    ) : (
                        <code
                            className="bg-gray-100 dark:bg-gray-800 text-chat-accent px-1.5 py-0.5 rounded text-sm font-mono"
                            {...props}
                        >
                            {children}
                        </code>
                    )
                },

                // Unordered lists
                ul: ({ node, ...props }) => (
                    <ul className="list-disc list-inside mb-3 space-y-1 ml-4" {...props} />
                ),

                // Ordered lists
                ol: ({ node, ...props }) => (
                    <ol className="list-decimal list-inside mb-3 space-y-1 ml-4" {...props} />
                ),

                // List items
                li: ({ node, ...props }) => (
                    <li className="text-gray-800 dark:text-gray-200 leading-relaxed" {...props} />
                ),

                // Blockquotes
                blockquote: ({ node, ...props }) => (
                    <blockquote
                        className="border-l-4 border-chat-accent pl-4 py-2 my-3 bg-gray-50 dark:bg-gray-800/50 italic text-gray-700 dark:text-gray-300"
                        {...props}
                    />
                ),

                // Headings
                h1: ({ node, ...props }) => (
                    <h1 className="text-2xl font-bold mb-3 mt-4 text-gray-900 dark:text-white" {...props} />
                ),
                h2: ({ node, ...props }) => (
                    <h2 className="text-xl font-bold mb-3 mt-4 text-gray-900 dark:text-white" {...props} />
                ),
                h3: ({ node, ...props }) => (
                    <h3 className="text-lg font-bold mb-2 mt-3 text-gray-900 dark:text-white" {...props} />
                ),
                h4: ({ node, ...props }) => (
                    <h4 className="text-base font-bold mb-2 mt-3 text-gray-900 dark:text-white" {...props} />
                ),

                // Links
                a: ({ node, ...props }) => (
                    <a
                        className="text-chat-accent hover:underline font-medium"
                        target="_blank"
                        rel="noopener noreferrer"
                        {...props}
                    />
                ),

                // Horizontal rule
                hr: ({ node, ...props }) => (
                    <hr className="my-4 border-gray-300 dark:border-gray-700" {...props} />
                ),

                // Tables
                table: ({ node, ...props }) => (
                    <div className="overflow-x-auto my-4">
                        <table className="min-w-full border border-gray-300 dark:border-gray-700" {...props} />
                    </div>
                ),
                th: ({ node, ...props }) => (
                    <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 bg-gray-100 dark:bg-gray-800 font-semibold text-left" {...props} />
                ),
                td: ({ node, ...props }) => (
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2" {...props} />
                ),
            }}
        >
            {content}
        </ReactMarkdown>
    )
}
