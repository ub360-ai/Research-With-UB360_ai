export default function Logo({ size = 'md', className = '' }) {
    const sizes = {
        xs: 'w-6 h-6 text-xs',
        sm: 'w-8 h-8 text-sm',
        md: 'w-12 h-12 text-base',
        lg: 'w-16 h-16 text-xl',
        xl: 'w-24 h-24 text-3xl'
    }

    return (
        <div className={`${sizes[size]} ${className} rounded-full bg-gradient-to-br from-chat-accent to-green-600 flex items-center justify-center shadow-lg flex-shrink-0`}>
            <div className="text-white font-bold flex flex-col items-center justify-center leading-none">
                <span className="text-[0.6em]">UB</span>
                <span className="text-[0.8em] -mt-1">360</span>
                <span className="text-[0.4em] font-normal">.ai</span>
            </div>
        </div>
    )
}
