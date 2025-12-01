import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, MessageSquare, Download } from 'lucide-react'
import { exportConversation, exportConversationsBatch } from '../../util'
import toast from 'react-hot-toast'
import { useChat } from '../../context/ChatContext'
import { useConversation } from '../../context/ConversationContext'
import Spinner from '../loader/Spinner'

export default function ExportModal({ onClose }) {
    const [loading, setLoading] = useState(false)
    const [exportFormat, setExportFormat] = useState('pdf')
    const [exportType, setExportType] = useState('current') // 'current' or 'all'

    const { getMessages } = useChat()
    const { activeConversationId, conversations } = useConversation()

    const downloadFile = (blob, filename) => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
    }

    const handleExportCurrent = async () => {
        try {
            setLoading(true)
            const messages = getMessages(activeConversationId)

            if (messages.length === 0) {
                toast.error('No messages to export')
                return
            }

            // Get conversation title
            const conversation = conversations.find(c => c.id === activeConversationId)
            const title = conversation?.title || 'Conversation'

            // Format messages for backend
            const formattedMessages = messages.map(msg => ({
                role: msg.type === 'user' ? 'user' : 'assistant',
                content: msg.content,
                timestamp: msg.timestamp || new Date().toISOString()
            }))

            const response = await exportConversation({
                title: title,
                messages: formattedMessages,
                format: exportFormat
            })

            // Extract filename from response headers or use default
            const contentDisposition = response.headers['content-disposition']
            let filename = `${title}..Follow ub360_ai on x.${exportFormat}`

            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?(.+)"?/)
                if (filenameMatch) {
                    filename = filenameMatch[1]
                }
            }

            downloadFile(response.data, filename)
            toast.success(`Chat exported as ${exportFormat.toUpperCase()}!`)
            onClose()
        } catch (error) {
            console.error('Export error:', error)
            toast.error('Failed to export conversation')
        } finally {
            setLoading(false)
        }
    }

    const handleExportAll = async () => {
        try {
            setLoading(true)

            // Get all conversations with messages
            const allConversations = conversations
                .map(conv => {
                    const messages = getMessages(conv.id)
                    if (messages.length === 0) return null

                    return {
                        title: conv.title || 'Untitled Conversation',
                        messages: messages.map(msg => ({
                            role: msg.type === 'user' ? 'user' : 'assistant',
                            content: msg.content,
                            timestamp: msg.timestamp || new Date().toISOString()
                        }))
                    }
                })
                .filter(conv => conv !== null)

            if (allConversations.length === 0) {
                toast.error('No conversations to export')
                return
            }

            const response = await exportConversationsBatch({
                conversations: allConversations,
                format: exportFormat
            })

            const filename = `chat_histories..Follow ub360_ai on x.zip`
            downloadFile(response.data, filename)
            toast.success(`${allConversations.length} conversations exported!`)
            onClose()
        } catch (error) {
            console.error('Export error:', error)
            toast.error('Failed to export conversations')
        } finally {
            setLoading(false)
        }
    }

    const handleExport = () => {
        if (exportType === 'current') {
            handleExportCurrent()
        } else {
            handleExportAll()
        }
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, y: 100, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 100, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] sm:max-h-[85vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
                    <div className="flex-1 min-w-0 pr-2">
                        <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                            Export Chat History
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Download with UB360.ai branding
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 sm:p-2 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 rounded-lg transition-colors touch-manipulation flex-shrink-0"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
                    {/* Export Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            What to Export
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button
                                onClick={() => setExportType('current')}
                                className={`flex items-center justify-center gap-2 px-4 py-3 min-h-[52px] rounded-lg border-2 transition-colors touch-manipulation ${exportType === 'current'
                                    ? 'border-chat-accent bg-chat-accent/10 text-chat-accent'
                                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                                    }`}
                            >
                                <MessageSquare className="w-5 h-5 sm:w-4 sm:h-4" />
                                <span className="font-medium text-sm sm:text-base">Current Chat</span>
                            </button>
                            <button
                                onClick={() => setExportType('all')}
                                className={`flex items-center justify-center gap-2 px-4 py-3 min-h-[52px] rounded-lg border-2 transition-colors touch-manipulation ${exportType === 'all'
                                    ? 'border-chat-accent bg-chat-accent/10 text-chat-accent'
                                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                                    }`}
                            >
                                <Download className="w-5 h-5 sm:w-4 sm:h-4" />
                                <span className="font-medium text-sm sm:text-base">All Chats (ZIP)</span>
                            </button>
                        </div>
                    </div>

                    {/* Format Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Export Format
                        </label>
                        <div className="grid grid-cols-3 gap-2 sm:gap-3">
                            {['pdf', 'docx', 'json'].map((format) => (
                                <button
                                    key={format}
                                    onClick={() => setExportFormat(format)}
                                    className={`px-3 sm:px-4 py-3 min-h-[52px] rounded-lg border-2 transition-colors font-medium uppercase text-xs sm:text-sm touch-manipulation ${exportFormat === format
                                        ? 'border-chat-accent bg-chat-accent/10 text-chat-accent'
                                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                                        }`}
                                >
                                    {format}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            {exportFormat === 'pdf' && '📄 Professional PDF with watermarks'}
                            {exportFormat === 'docx' && '📝 Editable Word document'}
                            {exportFormat === 'json' && '💾 Structured data format'}
                        </p>
                    </div>

                    {/* Branding Info */}
                    <div className="bg-chat-accent/5 border border-chat-accent/20 rounded-lg p-3 sm:p-4">
                        <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                            <span className="font-semibold text-chat-accent">✨ UB360.ai Branding:</span>
                            <br />
                            All exports include watermarks and "Follow @ub360_ai on X" branding
                        </p>
                    </div>

                    {/* Export Button */}
                    <button
                        onClick={handleExport}
                        disabled={loading}
                        className="w-full px-6 py-3 sm:py-3.5 min-h-[52px] bg-chat-accent text-white rounded-lg hover:bg-chat-accent/90 active:bg-chat-accent/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold flex items-center justify-center gap-2 touch-manipulation"
                    >
                        {loading ? (
                            <>
                                <Spinner size="sm" text="" />
                                <span>Exporting...</span>
                            </>
                        ) : (
                            <>
                                <Download className="w-5 h-5" />
                                <span>
                                    Export {exportType === 'all' ? 'All Chats' : 'Current Chat'}
                                </span>
                            </>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    )
}
