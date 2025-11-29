import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import { useDocuments } from '../../context/DocumentContext'
import MentionAutocomplete from './MentionAutocomplete'

export default function ChatInput({ onSend, loading }) {
    const [input, setInput] = useState('')
    const [queryType, setQueryType] = useState('answer')
    const [showMentions, setShowMentions] = useState(false)
    const [mentionSearch, setMentionSearch] = useState('')
    const [mentionPosition, setMentionPosition] = useState({ bottom: 0, left: 0 })
    const [selectedMentionIndex, setSelectedMentionIndex] = useState(0)
    const textareaRef = useRef(null)
    const { documents } = useDocuments()

    const handleSubmit = (e) => {
        e.preventDefault()
        if (input.trim() && !loading) {
            onSend(input.trim(), queryType)
            setInput('')
            setShowMentions(false)
        }
    }

    const handleInputChange = (e) => {
        const value = e.target.value
        setInput(value)

        // Check for @ symbol
        const cursorPosition = e.target.selectionStart
        const textBeforeCursor = value.slice(0, cursorPosition)
        const lastAtIndex = textBeforeCursor.lastIndexOf('@')

        if (lastAtIndex !== -1) {
            // Check if @ is at start or after a space
            const charBeforeAt = lastAtIndex > 0 ? textBeforeCursor[lastAtIndex - 1] : ' '
            if (charBeforeAt === ' ' || lastAtIndex === 0) {
                const searchTerm = textBeforeCursor.slice(lastAtIndex + 1)
                // Only show if search term doesn't contain spaces
                if (!searchTerm.includes(' ')) {
                    setMentionSearch(searchTerm)
                    setShowMentions(true)
                    setSelectedMentionIndex(0)

                    // Calculate position
                    if (textareaRef.current) {
                        const rect = textareaRef.current.getBoundingClientRect()
                        setMentionPosition({
                            bottom: window.innerHeight - rect.top + 10,
                            left: rect.left
                        })
                    }
                    return
                }
            }
        }

        setShowMentions(false)
    }

    const handleMentionSelect = (doc) => {
        // Find the last @ symbol
        const lastAtIndex = input.lastIndexOf('@')
        if (lastAtIndex !== -1) {
            // Replace from @ to cursor with @documentname
            const beforeAt = input.slice(0, lastAtIndex)
            const afterCursor = input.slice(textareaRef.current.selectionStart)
            const newInput = `${beforeAt}@${doc.filename} ${afterCursor}`
            setInput(newInput)
            setShowMentions(false)

            // Focus back on textarea
            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.focus()
                    const newCursorPos = beforeAt.length + doc.filename.length + 2
                    textareaRef.current.setSelectionRange(newCursorPos, newCursorPos)
                }
            }, 0)
        }
    }

    const handleKeyDown = (e) => {
        // Handle autocomplete navigation
        if (showMentions) {
            const filteredDocs = documents.filter(doc =>
                doc.filename.toLowerCase().includes(mentionSearch.toLowerCase())
            )

            if (e.key === 'ArrowDown') {
                e.preventDefault()
                setSelectedMentionIndex(prev =>
                    prev < filteredDocs.length - 1 ? prev + 1 : prev
                )
            } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setSelectedMentionIndex(prev => prev > 0 ? prev - 1 : 0)
            } else if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                if (filteredDocs[selectedMentionIndex]) {
                    handleMentionSelect(filteredDocs[selectedMentionIndex])
                }
            } else if (e.key === 'Escape') {
                e.preventDefault()
                setShowMentions(false)
            }
        } else {
            // Normal enter to send
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
            }
        }
    }

    // Close mentions when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (showMentions && textareaRef.current && !textareaRef.current.contains(e.target)) {
                setShowMentions(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [showMentions])

    return (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-chat-bg-dark p-4 relative">
            <div className="container mx-auto max-w-3xl">
                {/* Query Type Selector */}
                <div className="mb-3">
                    <select
                        value={queryType}
                        onChange={(e) => setQueryType(e.target.value)}
                        className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-chat-accent"
                        disabled={loading}
                    >
                        <option value="answer">Answer Question</option>
                        <option value="summarize">Summarize</option>
                        <option value="compare">Compare Sources</option>
                        <option value="extract">Extract Key Points</option>
                        <option value="timeline">Extract Timeline</option>
                    </select>
                </div>

                {/* Input Form */}
                <form onSubmit={handleSubmit} className="flex gap-2 relative">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask a question... (Type @ to mention documents)"
                        className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-chat-accent resize-none"
                        rows={1}
                        disabled={loading}
                        style={{
                            minHeight: '48px',
                            maxHeight: '200px',
                        }}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className="px-4 py-3 bg-chat-accent text-white rounded-lg hover:bg-chat-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                        <Send className="w-5 h-5" />
                    </button>

                    {/* Mention Autocomplete */}
                    {showMentions && (
                        <MentionAutocomplete
                            documents={documents}
                            position={mentionPosition}
                            onSelect={handleMentionSelect}
                            searchTerm={mentionSearch}
                            selectedIndex={selectedMentionIndex}
                        />
                    )}
                </form>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                    Press Enter to send, Shift+Enter for new line • Type @ to mention documents
                </p>
            </div>
        </div>
    )
}
