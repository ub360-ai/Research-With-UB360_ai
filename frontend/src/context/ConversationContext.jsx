import { createContext, useContext, useState, useEffect } from 'react'

const ConversationContext = createContext()

export function ConversationProvider({ children }) {
    const [conversations, setConversations] = useState([])
    const [activeConversationId, setActiveConversationId] = useState(null)

    // Load conversations from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('conversations')
        if (saved) {
            const parsed = JSON.parse(saved)
            setConversations(parsed)
            if (parsed.length > 0 && !activeConversationId) {
                setActiveConversationId(parsed[0].id)
            }
        } else {
            // Create first conversation
            const firstConv = createNewConversation()
            setConversations([firstConv])
            setActiveConversationId(firstConv.id)
        }
    }, [])

    // Save to localStorage whenever conversations change
    useEffect(() => {
        if (conversations.length > 0) {
            localStorage.setItem('conversations', JSON.stringify(conversations))
        }
    }, [conversations])

    const createNewConversation = (title = null) => {
        const newConv = {
            id: Date.now().toString(),
            title: title || 'New Chat',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messageCount: 0,
        }
        return newConv
    }

    const addConversation = () => {
        const newConv = createNewConversation()
        setConversations((prev) => [newConv, ...prev])
        setActiveConversationId(newConv.id)
        return newConv.id
    }

    const deleteConversation = (id) => {
        setConversations((prev) => {
            const filtered = prev.filter((c) => c.id !== id)

            // If deleting active conversation, switch to another
            if (id === activeConversationId) {
                if (filtered.length > 0) {
                    setActiveConversationId(filtered[0].id)
                } else {
                    // Create new conversation if none left
                    const newConv = createNewConversation()
                    setActiveConversationId(newConv.id)
                    return [newConv]
                }
            }

            return filtered.length > 0 ? filtered : [createNewConversation()]
        })
    }

    const renameConversation = (id, newTitle) => {
        setConversations((prev) =>
            prev.map((c) =>
                c.id === id
                    ? { ...c, title: newTitle, updatedAt: new Date().toISOString() }
                    : c
            )
        )
    }

    const updateConversationTitle = (id, firstMessage) => {
        setConversations((prev) =>
            prev.map((c) =>
                c.id === id && c.title === 'New Chat'
                    ? {
                        ...c,
                        title: firstMessage.substring(0, 50) + (firstMessage.length > 50 ? '...' : ''),
                        updatedAt: new Date().toISOString(),
                    }
                    : c
            )
        )
    }

    const incrementMessageCount = (id) => {
        setConversations((prev) =>
            prev.map((c) =>
                c.id === id
                    ? { ...c, messageCount: c.messageCount + 1, updatedAt: new Date().toISOString() }
                    : c
            )
        )
    }

    const getActiveConversation = () => {
        return conversations.find((c) => c.id === activeConversationId)
    }

    const switchConversation = (id) => {
        setActiveConversationId(id)
    }

    return (
        <ConversationContext.Provider
            value={{
                conversations,
                activeConversationId,
                activeConversation: getActiveConversation(),
                addConversation,
                deleteConversation,
                renameConversation,
                switchConversation,
                updateConversationTitle,
                incrementMessageCount,
            }}
        >
            {children}
        </ConversationContext.Provider>
    )
}

export const useConversation = () => useContext(ConversationContext)
