import { User, Bot, Copy } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import MarkdownRenderer from './MarkdownRenderer'
import Logo from '../branding/Logo'

export default function ChatMessage({ message }) {
    const isUser = message.type === 'user'

    const copyMessage = () => {
        navigator.clipboard.writeText(message.content)
        toast.success('Copied to clipboard')
    }

    // User message (RIGHT-ALIGNED)
    if (isUser) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="flex justify-end px-4 py-3"
            >
                <div className="max-w-[70%] bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3">
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap break-words">
                        {message.content}
                    </p>
                </div>
            </motion.div>
        )
    }

    // AI message (LEFT-ALIGNED with Markdown)
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex justify-start px-4 py-3"
        >
            <div className="flex gap-3 max-w-[85%]">
                {/* Professor UB360.ai Avatar */}
                <Logo size="sm" />

                {/* Message Content */}
                <div className="flex-1 min-w-0">
                    {/* Professor Name */}
                    <div className="mb-2 flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            Professor UB360.ai
                        </span>
                        {message.queryType && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-chat-accent/10 text-chat-accent font-medium">
                                {message.queryType}
                            </span>
                        )}
                    </div>

                    {/* Message Text with Markdown Rendering */}
                    <div className="prose dark:prose-invert max-w-none">
                        <MarkdownRenderer content={message.content} />
                    </div>

                    {/* Citations */}
                    {message.citations && message.citations.length > 0 && (
                        <div className="mt-4 space-y-2">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Sources:
                            </p>
                            <div className="space-y-2">
                                {message.citations.slice(0, 3).map((citation, idx) => (
                                    <div
                                        key={idx}
                                        className="text-sm p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 dark:text-white truncate">
                                                    {citation.document_name}
                                                </p>
                                                {citation.page_number && (
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        Page {citation.page_number}
                                                    </p>
                                                )}
                                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                                    {citation.text_snippet}
                                                </p>
                                            </div>
                                            <span className="text-xs text-chat-accent font-medium flex-shrink-0">
                                                {(citation.relevance_score * 100).toFixed(0)}%
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="mt-3 flex gap-2">
                        <button
                            onClick={copyMessage}
                            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1 transition-colors"
                        >
                            <Copy className="w-3 h-3" />
                            Copy
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
