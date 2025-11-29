import { ExternalLink } from 'lucide-react'

export default function SocialLinks() {
    const handleXClick = () => {
        window.open('https://x.com/ub360_ai', '_blank', 'noopener,noreferrer')
    }

    return (
        <div className="flex items-center gap-4">
            <button
                onClick={handleXClick}
                className="flex items-center gap-2 px-4 py-2 bg-chat-accent text-white rounded-lg hover:bg-chat-accent/90 transition-colors group"
            >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span className="font-semibold">Follow @ub360_ai</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span>Stay updated on</span>
                <span className="font-semibold text-chat-accent">AI • ML • Crypto • Blockchain</span>
            </div>
        </div>
    )
}
