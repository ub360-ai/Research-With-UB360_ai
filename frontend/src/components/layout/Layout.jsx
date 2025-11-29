import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MessageSquare, FileText, Menu } from 'lucide-react'
import Header from './Header'
import Footer from './Footer'
import Sidebar from './Sidebar'
import FloatingWatermarks from '../branding/FloatingWatermarks'
import PromoBanner from '../branding/PromoBanner'

export default function Layout({ children }) {
    const location = useLocation()
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const isChat = location.pathname === '/'

    return (
        <div className="min-h-screen flex flex-col bg-chat-bg-light dark:bg-chat-bg-dark relative">
            {/* Floating Watermarks */}
            <FloatingWatermarks />

            {/* Promotional Banner */}
            <PromoBanner />

            <Header />

            <div className="flex-1 flex overflow-hidden relative z-10">
                {/* Sidebar - only show on chat page */}
                {isChat && (
                    <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
                )}

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Navigation - only show on non-chat pages */}
                    {!isChat && (
                        <nav className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-chat-secondary-dark">
                            <div className="container mx-auto px-4">
                                <div className="flex gap-1">
                                    <Link
                                        to="/"
                                        className="px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                                    >
                                        <MessageSquare className="w-4 h-4" />
                                        Chat
                                    </Link>
                                    <Link
                                        to="/documents"
                                        className="px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 text-chat-accent border-b-2 border-chat-accent"
                                    >
                                        <FileText className="w-4 h-4" />
                                        Documents
                                    </Link>
                                </div>
                            </div>
                        </nav>
                    )}

                    {/* Toggle Button for Mobile */}
                    {isChat && (
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden fixed top-20 left-4 z-30 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    )}

                    {/* Page Content */}
                    <main className="flex-1 overflow-hidden">
                        {children}
                    </main>
                </div>
            </div>

            <Footer />
        </div>
    )
}
