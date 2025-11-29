/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // ChatGPT-inspired colors
                'chat-bg': {
                    light: '#FFFFFF',
                    dark: '#212121',
                },
                'chat-secondary': {
                    light: '#F7F7F8',
                    dark: '#2F2F2F',
                },
                'chat-tertiary': {
                    light: '#ECECF1',
                    dark: '#3F3F3F',
                },
                'chat-accent': '#10A37F',
                'chat-text': {
                    light: '#0D0D0D',
                    dark: '#ECECEC',
                },
                'chat-text-secondary': {
                    light: '#676767',
                    dark: '#B4B4B4',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['Fira Code', 'monospace'],
            },
            animation: {
                'bounce-slow': 'bounce 1.5s infinite',
            },
        },
    },
    plugins: [],
}
