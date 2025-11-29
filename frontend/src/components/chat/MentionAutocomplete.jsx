import { motion, AnimatePresence } from 'framer-motion'
import { FileText } from 'lucide-react'

export default function MentionAutocomplete({
    documents,
    position,
    onSelect,
    searchTerm,
    selectedIndex
}) {
    // Filter documents based on search term
    const filteredDocs = documents.filter(doc =>
        doc.filename.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (filteredDocs.length === 0) {
        return null
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                style={{
                    bottom: position.bottom,
                    left: position.left,
                    maxWidth: '400px',
                    minWidth: '300px'
                }}
            >
                {/* Header */}
                <div className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                        Mention Document
                    </p>
                </div>

                {/* Document List */}
                <div className="max-h-64 overflow-y-auto">
                    {filteredDocs.map((doc, index) => (
                        <button
                            key={doc.document_id}
                            onClick={() => onSelect(doc)}
                            className={`w-full px-3 py-2.5 flex items-start gap-3 transition-colors ${index === selectedIndex
                                    ? 'bg-chat-accent/10 dark:bg-chat-accent/20'
                                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                        >
                            <FileText className={`w-4 h-4 flex-shrink-0 mt-0.5 ${index === selectedIndex ? 'text-chat-accent' : 'text-gray-400'
                                }`} />
                            <div className="flex-1 text-left min-w-0">
                                <p className={`text-sm font-medium truncate ${index === selectedIndex
                                        ? 'text-chat-accent'
                                        : 'text-gray-900 dark:text-white'
                                    }`}>
                                    @{doc.filename}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {doc.document_type} • {doc.num_chunks} chunks
                                </p>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Footer Hint */}
                <div className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        ↑↓ Navigate • Enter to select • Esc to cancel
                    </p>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
