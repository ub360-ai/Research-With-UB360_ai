import { motion } from 'framer-motion'

export default function FloatingWatermarks() {
    const watermarks = [
        { text: 'Follow @ub360_ai', top: '10%', left: '15%', delay: 0 },
        { text: 'UB360.ai', top: '25%', right: '20%', delay: 0.5 },
        { text: 'Follow @ub360_ai on X', top: '45%', left: '10%', delay: 1 },
        { text: 'Research with UB360.ai', top: '60%', right: '15%', delay: 1.5 },
        { text: '@ub360_ai', top: '75%', left: '25%', delay: 2 },
        { text: 'Free Forever', top: '85%', right: '30%', delay: 2.5 },
    ]

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {watermarks.map((mark, index) => (
                <motion.div
                    key={index}
                    className="absolute text-gray-200 dark:text-gray-800 font-semibold select-none"
                    style={{
                        top: mark.top,
                        left: mark.left,
                        right: mark.right,
                        opacity: 0.08,
                        fontSize: '1.5rem',
                        transform: 'rotate(-15deg)',
                    }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{
                        opacity: 0.08,
                        y: 0,
                        transition: {
                            delay: mark.delay,
                            duration: 1,
                            repeat: Infinity,
                            repeatType: 'reverse',
                            repeatDelay: 5
                        }
                    }}
                >
                    {mark.text}
                </motion.div>
            ))}
        </div>
    )
}
