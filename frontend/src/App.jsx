import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './context/ThemeContext'
import { DocumentProvider } from './context/DocumentContext'
import { ChatProvider } from './context/ChatContext'
import { ConversationProvider } from './context/ConversationContext'
import Layout from './components/layout/Layout'
import Chat from './pages/Chat'
import Documents from './pages/Documents'
import PageLoader from './components/loader/PageLoader'
import './App.css'

function App() {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Simulate initial app load
        const timer = setTimeout(() => {
            setLoading(false)
        }, 2000) // 2 seconds loading screen

        return () => clearTimeout(timer)
    }, [])

    // Show loader on initial visit
    if (loading) {
        return <PageLoader />
    }

    return (
        <ThemeProvider>
            <DocumentProvider>
                <ConversationProvider>
                    <ChatProvider>
                        <Router>
                            <Layout>
                                <Routes>
                                    <Route path="/" element={<Chat />} />
                                    <Route path="/documents" element={<Documents />} />
                                </Routes>
                            </Layout>
                            <Toaster
                                position="top-right"
                                toastOptions={{
                                    duration: 3000,
                                    style: {
                                        background: '#10A37F',
                                        color: '#fff',
                                        borderRadius: '10px',
                                    },
                                }}
                            />
                        </Router>
                    </ChatProvider>
                </ConversationProvider>
            </DocumentProvider>
        </ThemeProvider>
    )
}

export default App
