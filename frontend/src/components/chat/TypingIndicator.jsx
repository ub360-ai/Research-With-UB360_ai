import { motion } from 'framer-motion'
import Logo from '../branding/Logo'

export default function TypingIndicator() {
    return (
        <div className="flex justify-start px-4 py-3">
            <div className="flex gap-3 max-w-[85%]">
                {/* Professor UB360.ai Avatar */}
                <Logo size="sm" />

                {/* Thinking Animation */}
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Professor UB360.ai
                    </span>
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 dark:text-gray-300">Thinking</span>
                            <div className="flex items-center gap-1">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        className="w-1.5 h-1.5 bg-chat-accent rounded-full"
                                        animate={{
                                            scale: [1, 1.3, 1],
                                            opacity: [0.5, 1, 0.5],
                                        }}
                                        transition={{
                                            duration: 1,
                                            repeat: Infinity,
                                            delay: i * 0.15,
                                            ease: "easeInOut",
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
