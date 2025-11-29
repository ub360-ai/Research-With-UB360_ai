import { motion } from 'framer-motion'
import Logo from '../branding/Logo'

export default function PageLoader() {
    return (
        <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50">
            <div className="text-center">
                {/* Animated Logo */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6"
                >
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <Logo size="xl" />
                    </motion.div>
                </motion.div>

                {/* Loading Bar */}
                <div className="w-64 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
                    <motion.div
                        className="h-full bg-gradient-to-r from-chat-accent to-green-600"
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </div>

                {/* Loading Text */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Loading Research Assistant...
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Powered by <span className="text-chat-accent font-semibold">UB360.ai</span>
                    </p>

                    {/* Animated Dots */}
                    <div className="flex items-center justify-center gap-1">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="w-2 h-2 bg-chat-accent rounded-full"
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.5, 1, 0.5],
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                    ease: "easeInOut"
                                }}
                            />
                        ))}
                    </div>
                </motion.div>

                {/* Promotional Message */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-6 text-xs text-gray-500 dark:text-gray-500"
                >
                    Follow{' '}
                    <a
                        href="https://x.com/ub360_ai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-chat-accent font-semibold hover:underline"
                    >
                        @ub360_ai
                    </a>
                    {' '}on X for AI, ML, Crypto insights
                </motion.p>
            </div>
        </div>
    )
}
