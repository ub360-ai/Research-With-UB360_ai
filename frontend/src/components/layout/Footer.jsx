import SocialLinks from '../branding/SocialLinks'

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Main Footer Content */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
                    {/* Branding */}
                    <div className="text-center md:text-left">
                        <h3 className="text-lg font-bold text-chat-accent mb-1">
                            Research with UB360.ai
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            AI-Powered Research Assistant | <span className="font-semibold">Free Forever</span>
                        </p>
                    </div>

                    {/* Social Links */}
                    <SocialLinks />
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <p>
                        © {new Date().getFullYear()} UB360.ai. All rights reserved.
                    </p>

                    <div className="flex items-center gap-4">
                        <a
                            href="https://x.com/ub360_ai"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-chat-accent transition-colors font-medium"
                        >
                            @ub360_ai on X
                        </a>
                        <span className="text-gray-400">•</span>
                        <span className="font-medium">
                            Built by UB360.ai
                        </span>
                    </div>
                </div>

                {/* Promotional Message */}
                <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                        Follow <a href="https://x.com/ub360_ai" target="_blank" rel="noopener noreferrer" className="text-chat-accent font-semibold hover:underline">@ub360_ai</a> for updates on AI, Machine Learning, Crypto, and Blockchain
                    </p>
                </div>
            </div>
        </footer>
    )
}
