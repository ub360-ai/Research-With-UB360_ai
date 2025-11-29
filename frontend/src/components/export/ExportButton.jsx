import { useState } from 'react'
import { Download, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ExportModal from './ExportModal'

export default function ExportButton() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            {/* Floating Action Button */}
            <motion.button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-40 p-4 bg-chat-accent text-white rounded-full shadow-lg hover:bg-chat-accent/90 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Export"
            >
                <Download className="w-6 h-6" />
            </motion.button>

            {/* Export Modal */}
            <AnimatePresence>
                {isOpen && <ExportModal onClose={() => setIsOpen(false)} />}
            </AnimatePresence>
        </>
    )
}
