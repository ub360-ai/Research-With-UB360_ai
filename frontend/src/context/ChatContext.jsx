import { createContext, useContext, useState, useEffect } from 'react'
import { query as apiQuery } from '../api/client'
import toast from 'react-hot-toast'

const ChatContext = createContext()

export function ChatProvider({ children }) {
    const [messagesByConversation, setMessagesByConversation] = useState({})
    const [loading, setLoading] = useState(false)

    // Load messages from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('messages')
        if (saved) {
            setMessagesByConversation(JSON.parse(saved))
        }
    }, [])

    // Save messages to localStorage
    useEffect(() => {
        if (Object.keys(messagesByConversation).length > 0) {
            localStorage.setItem('messages', JSON.stringify(messagesByConversation))
        }
    }, [messagesByConversation])

    const getMessages = (conversationId) => {
        return messagesByConversation[conversationId] || []
    }

    const sendMessage = async (conversationId, question, queryType = 'answer', nResults = 5) => {
        // Add user message
        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: question,
            timestamp: new Date().toISOString(),
        }

        setMessagesByConversation((prev) => ({
            ...prev,
            [conversationId]: [...(prev[conversationId] || []), userMessage],
        }))

        try {
            setLoading(true)

            // Get conversation history (exclude the current message we just added)
            const previousMessages = messagesByConversation[conversationId] || []
            const conversationHistory = previousMessages.map(msg => ({
                role: msg.type === 'user' ? 'user' : 'assistant',
                content: msg.content
            }))

            const response = await apiQuery({
                question,
                query_type: queryType,
                n_results: nResults,
                conversation_history: conversationHistory
            })

            // Add AI response
            const aiMessage = {
                id: Date.now() + 1,
                type: 'assistant',
                content: response.data.answer,
                citations: response.data.citations || [],
                queryType: response.data.query_type,
                timestamp: new Date().toISOString(),
            }

            setMessagesByConversation((prev) => ({
                ...prev,
                [conversationId]: [...(prev[conversationId] || []), aiMessage],
            }))

            return response.data
        } catch (error) {
            console.error('Error sending message:', error)
            toast.error('Failed to get response')

            // Add error message
            const errorMessage = {
                id: Date.now() + 1,
                type: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
                error: true,
                timestamp: new Date().toISOString(),
            }

            setMessagesByConversation((prev) => ({
                ...prev,
                [conversationId]: [...(prev[conversationId] || []), errorMessage],
            }))

            throw error
        } finally {
            setLoading(false)
        }
    }

    const clearConversation = (conversationId) => {
        setMessagesByConversation((prev) => ({
            ...prev,
            [conversationId]: [],
        }))
    }

    const clearAllMessages = () => {
        setMessagesByConversation({})
        localStorage.removeItem('messages')
    }

    return (
        <ChatContext.Provider
            value={{
                messagesByConversation,
                loading,
                getMessages,
                sendMessage,
                clearConversation,
                clearAllMessages,
            }}
        >
            {children}
        </ChatContext.Provider>
    )
}

export const useChat = () => useContext(ChatContext)
