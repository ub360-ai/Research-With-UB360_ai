import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X as XIcon, ExternalLink } from 'lucide-react'

export default function PromoBanner() {
    const [isVisible, setIsVisible] = useState(true)
    const [isDismissed, setIsDismissed] = useState(false)

    useEffect(() => {
        // Check if banner was dismissed
        const dismissed = localStorage.getItem('ub360_banner_dismissed')
        if (dismissed) {
            const dismissedTime = parseInt(dismissed)
            const hoursSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60)

            // Show again after 24 hours
            if (hoursSinceDismissed < 24) {
                setIsVisible(false)
                setIsDismissed(true)
            }
        }
    }, [])

    const handleDismiss = () => {
        setIsVisible(false)
        localStorage.setItem('ub360_banner_dismissed', Date.now().toString())

        // Show again after some time
        setTimeout(() => {
            setIsDismissed(false)
            setIsVisible(true)
        }, 30 * 60 * 1000) // 30 minutes
    }

    const handleXClick = () => {
        window.open('https://x.com/ub360_ai', '_blank', 'noopener,noreferrer')
    }

    return (
        <AnimatePresence>
            {isVisible && !isDismissed && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-chat-accent to-green-600 text-white shadow-lg"
                >
                    <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                            <div className="hidden sm:block">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </div>
                            <p className="text-sm sm:text-base font-medium">
                                <span className="font-bold">Follow @ub360_ai on X</span> for AI, ML, Crypto, and Blockchain insights!
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleXClick}
                                className="px-4 py-1.5 bg-white text-chat-accent rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors flex items-center gap-1"
                            >
                                Follow
                                <ExternalLink className="w-3 h-3" />
                            </button>

                            <button
                                onClick={handleDismiss}
                                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                                aria-label="Dismiss"
                            >
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
