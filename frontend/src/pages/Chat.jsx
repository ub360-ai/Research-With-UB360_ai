import { useEffect, useRef } from 'react'
import { useChat } from '../context/ChatContext'
import { useConversation } from '../context/ConversationContext'
import { useDocuments } from '../context/DocumentContext'
import ChatMessage from '../components/chat/ChatMessage'
import ChatInput from '../components/chat/ChatInput'
import TypingIndicator from '../components/chat/TypingIndicator'
import ExportButton from '../components/export/ExportButton'
import { FileText, Upload } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Chat() {
    const { getMessages, loading, sendMessage } = useChat()
    const { activeConversationId, updateConversationTitle, incrementMessageCount } = useConversation()
    const { documents } = useDocuments()
    const messagesEndRef = useRef(null)

    const messages = getMessages(activeConversationId)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, loading])

    const handleSendMessage = async (question, queryType) => {
        if (!activeConversationId) return

        try {
            await sendMessage(activeConversationId, question, queryType)

            // Auto-generate title from first message
            if (messages.length === 0) {
                updateConversationTitle(activeConversationId, question)
            }

            // Increment message count
            incrementMessageCount(activeConversationId)
        } catch (error) {
            // Error handled in context
        }
    }

    return (
        <div className="h-full flex flex-col relative">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto chat-scrollbar">
                {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center px-4">
                        <div className="text-center max-w-md">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-chat-accent rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <FileText className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                                Welcome to Research Assistant
                            </h2>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
                                {documents.length === 0 ? (
                                    <>
                                        Upload documents to get started with AI-powered research assistance.
                                    </>
                                ) : (
                                    <>
                                        You have {documents.length} document{documents.length !== 1 ? 's' : ''} uploaded.
                                        Ask me anything!
                                    </>
                                )}
                            </p>
                            {documents.length === 0 && (
                                <Link
                                    to="/documents"
                                    className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 min-h-[48px] bg-chat-accent text-white rounded-lg hover:bg-chat-accent/90 active:bg-chat-accent/80 transition-colors font-medium touch-manipulation"
                                >
                                    <Upload className="w-5 h-5" />
                                    Upload Documents
                                </Link>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto px-2 sm:px-4">
                        {messages.map((message) => (
                            <ChatMessage key={message.id} message={message} />
                        ))}
                        {loading && <TypingIndicator />}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="max-w-4xl mx-auto px-2 sm:px-4">
                    <ChatInput onSend={handleSendMessage} loading={loading} />
                </div>
            </div>

            {/* Export Button */}
            <ExportButton />
        </div>
    )
}
