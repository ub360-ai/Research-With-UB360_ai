import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import Logo from '../branding/Logo'

export default function Header() {
    const { theme, toggleTheme } = useTheme()

    return (
        <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-chat-bg-dark shadow-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo & Title */}
                <div className="flex items-center gap-3">
                    <Logo size="sm" />
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                            Research with UB360.ai
                        </h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            AI-Powered Research Assistant • <span className="text-chat-accent font-semibold">Free Forever</span>
                        </p>
                    </div>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-2">
                    {/* Follow Badge */}
                    <a
                        href="https://x.com/ub360_ai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-chat-accent/10 hover:bg-chat-accent/20 text-chat-accent rounded-lg transition-colors text-sm font-medium"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        @ub360_ai
                    </a>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        aria-label="Toggle theme"
                    >
                        {theme === 'light' ? (
                            <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        ) : (
                            <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        )}
                    </button>
                </div>
            </div>
        </header>
    )
}
