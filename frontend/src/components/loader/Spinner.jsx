import { motion } from 'framer-motion'

export default function Spinner({ size = 'md', text = 'Loading...' }) {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8'
    }

    return (
        <div className="flex items-center gap-2">
            <motion.div
                className={`${sizes[size]} border-2 border-chat-accent border-t-transparent rounded-full`}
                animate={{ rotate: 360 }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />
            {text && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                    {text}
                </span>
            )}
        </div>
    )
}
