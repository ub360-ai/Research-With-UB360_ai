import { useState } from 'react'
import { Plus, MessageSquare, Trash2, Edit2, Check, X, Menu, ChevronLeft } from 'lucide-react'
import { useConversation } from '../../context/ConversationContext'
import { Link } from 'react-router-dom'

export default function Sidebar({ isOpen, onToggle }) {
    const {
        conversations,
        activeConversationId,
        addConversation,
        deleteConversation,
        renameConversation,
        switchConversation,
    } = useConversation()

    const [editingId, setEditingId] = useState(null)
    const [editTitle, setEditTitle] = useState('')

    const handleStartEdit = (conv) => {
        setEditingId(conv.id)
        setEditTitle(conv.title)
    }

    const handleSaveEdit = () => {
        if (editTitle.trim()) {
            renameConversation(editingId, editTitle.trim())
        }
        setEditingId(null)
    }

    const handleCancelEdit = () => {
        setEditingId(null)
        setEditTitle('')
    }

    const handleDelete = (e, id) => {
        e.stopPropagation()
        if (window.confirm('Delete this conversation?')) {
            deleteConversation(id)
        }
    }

    const groupConversations = () => {
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        const lastWeek = new Date(today)
        lastWeek.setDate(lastWeek.getDate() - 7)

        const groups = {
            today: [],
            yesterday: [],
            lastWeek: [],
            older: [],
        }

        conversations.forEach((conv) => {
            const convDate = new Date(conv.updatedAt)
            if (convDate >= today) {
                groups.today.push(conv)
            } else if (convDate >= yesterday) {
                groups.yesterday.push(conv)
            } else if (convDate >= lastWeek) {
                groups.lastWeek.push(conv)
            } else {
                groups.older.push(conv)
            }
        })

        return groups
    }

    const groups = groupConversations()

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onToggle}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:relative top-16 lg:top-0 left-0 h-[calc(100%-4rem)] lg:h-full w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-200 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="font-semibold text-gray-900 dark:text-white">Chats</h2>
                            <button
                                onClick={onToggle}
                                className="lg:hidden p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                        </div>
                        <button
                            onClick={addConversation}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-chat-accent text-white rounded-lg hover:bg-chat-accent/90 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            New Chat
                        </button>
                    </div>

                    {/* Conversation List */}
                    <div className="flex-1 overflow-y-auto chat-scrollbar p-2">
                        {groups.today.length > 0 && (
                            <div className="mb-4">
                                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 py-1">
                                    Today
                                </div>
                                {groups.today.map((conv) => (
                                    <ConversationItem
                                        key={conv.id}
                                        conversation={conv}
                                        isActive={conv.id === activeConversationId}
                                        isEditing={editingId === conv.id}
                                        editTitle={editTitle}
                                        onEditTitle={setEditTitle}
                                        onStartEdit={handleStartEdit}
                                        onSaveEdit={handleSaveEdit}
                                        onCancelEdit={handleCancelEdit}
                                        onDelete={handleDelete}
                                        onSelect={() => switchConversation(conv.id)}
                                    />
                                ))}
                            </div>
                        )}

                        {groups.yesterday.length > 0 && (
                            <div className="mb-4">
                                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 py-1">
                                    Yesterday
                                </div>
                                {groups.yesterday.map((conv) => (
                                    <ConversationItem
                                        key={conv.id}
                                        conversation={conv}
                                        isActive={conv.id === activeConversationId}
                                        isEditing={editingId === conv.id}
                                        editTitle={editTitle}
                                        onEditTitle={setEditTitle}
                                        onStartEdit={handleStartEdit}
                                        onSaveEdit={handleSaveEdit}
                                        onCancelEdit={handleCancelEdit}
                                        onDelete={handleDelete}
                                        onSelect={() => switchConversation(conv.id)}
                                    />
                                ))}
                            </div>
                        )}

                        {groups.lastWeek.length > 0 && (
                            <div className="mb-4">
                                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 py-1">
                                    Last 7 Days
                                </div>
                                {groups.lastWeek.map((conv) => (
                                    <ConversationItem
                                        key={conv.id}
                                        conversation={conv}
                                        isActive={conv.id === activeConversationId}
                                        isEditing={editingId === conv.id}
                                        editTitle={editTitle}
                                        onEditTitle={setEditTitle}
                                        onStartEdit={handleStartEdit}
                                        onSaveEdit={handleSaveEdit}
                                        onCancelEdit={handleCancelEdit}
                                        onDelete={handleDelete}
                                        onSelect={() => switchConversation(conv.id)}
                                    />
                                ))}
                            </div>
                        )}

                        {groups.older.length > 0 && (
                            <div className="mb-4">
                                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 py-1">
                                    Older
                                </div>
                                {groups.older.map((conv) => (
                                    <ConversationItem
                                        key={conv.id}
                                        conversation={conv}
                                        isActive={conv.id === activeConversationId}
                                        isEditing={editingId === conv.id}
                                        editTitle={editTitle}
                                        onEditTitle={setEditTitle}
                                        onStartEdit={handleStartEdit}
                                        onSaveEdit={handleSaveEdit}
                                        onCancelEdit={handleCancelEdit}
                                        onDelete={handleDelete}
                                        onSelect={() => switchConversation(conv.id)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer Links */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                        <Link
                            to="/documents"
                            className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            📄 Documents
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    )
}

function ConversationItem({
    conversation,
    isActive,
    isEditing,
    editTitle,
    onEditTitle,
    onStartEdit,
    onSaveEdit,
    onCancelEdit,
    onDelete,
    onSelect,
}) {
    return (
        <div
            className={`group relative px-2 py-2 rounded-lg cursor-pointer transition-colors ${isActive
                    ? 'bg-gray-200 dark:bg-gray-800'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
            onClick={onSelect}
        >
            {isEditing ? (
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => onEditTitle(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') onSaveEdit()
                            if (e.key === 'Escape') onCancelEdit()
                        }}
                        className="flex-1 px-2 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
                        autoFocus
                    />
                    <button
                        onClick={onSaveEdit}
                        className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded"
                    >
                        <Check className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onCancelEdit}
                        className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="flex-1 text-sm text-gray-900 dark:text-white truncate">
                        {conversation.title}
                    </span>
                    <div className="hidden group-hover:flex items-center gap-1">
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                onStartEdit(conversation)
                            }}
                            className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                            <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                            onClick={(e) => onDelete(e, conversation.id)}
                            className="p-1 text-gray-500 hover:text-red-600"
                        >
                            <Trash2 className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
