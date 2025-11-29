# 🎨 Frontend Setup Guide - Phase 4

## ✅ What's Been Created

### Configuration Files
- ✅ `package.json` - Dependencies and scripts
- ✅ `vite.config.js` - Vite configuration with API proxy
- ✅ `tailwind.config.js` - ChatGPT-inspired color scheme
- ✅ `postcss.config.js` - PostCSS setup
- ✅ `index.html` - Entry point with Inter font

### Core Application
- ✅ `src/main.jsx` - React entry point
- ✅ `src/App.jsx` - Main app with routing and providers
- ✅ `src/index.css` - Tailwind + ChatGPT scrollbar styles
- ✅ `src/App.css` - Additional styles

---

## 🚀 Next Steps to Complete

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

This will install:
- React & React DOM
- React Router
- Axios (API calls)
- Framer Motion (animations)
- React Hot Toast (notifications)
- React Dropzone (file uploads)
- Lucide React (icons)
- Headless UI (accessible components)
- TailwindCSS & PostCSS

---

### Step 2: Create Remaining Files

I've set up the foundation. You now need to create:

#### **Context Providers** (3 files)
1. `src/context/ThemeContext.jsx` - Dark mode toggle
2. `src/context/DocumentContext.jsx` - Document state
3. `src/context/ChatContext.jsx` - Chat history

#### **Layout Components** (3 files)
4. `src/components/layout/Layout.jsx` - Main layout wrapper
5. `src/components/layout/Header.jsx` - Top header with UB360.ai logo
6. `src/components/layout/Footer.jsx` - Footer with @ub360_ai link

#### **Pages** (2 files)
7. `src/pages/Chat.jsx` - Main chat interface
8. `src/pages/Documents.jsx` - Document management

#### **API Client** (1 file)
9. `src/api/client.js` - Axios instance

---

## 📝 Quick File Templates

### 1. ThemeContext.jsx
```jsx
import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'light'
    setTheme(saved)
    document.documentElement.classList.toggle('dark', saved === 'dark')
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
```

### 2. API Client (src/api/client.js)
```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  timeout: 30000,
})

export const uploadDocument = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return api.post('/documents/upload', formData)
}

export const uploadURL = (url) => {
  return api.post('/documents/upload-url', null, { params: { url } })
}

export const listDocuments = () => {
  return api.get('/documents')
}

export const deleteDocument = (id) => {
  return api.delete(`/documents/${id}`)
}

export const query = (data) => {
  return api.post('/query', data)
}

export const exportReport = (data) => {
  return api.post('/export/report', data, { responseType: 'blob' })
}

export const exportBibliography = (data) => {
  return api.post('/export/bibliography', data, { responseType: 'blob' })
}

export default api
```

---

## 🎨 ChatGPT-Style Components to Build

### Header Component
- UB360.ai logo (left)
- "Research Assistant" title
- Dark mode toggle (right)
- Clean, minimal design

### Chat Interface
- Message list (scrollable)
- User messages (right-aligned, gray background)
- AI messages (left-aligned, white background)
- Citations as expandable cards
- Input box at bottom
- Send button with icon

### Footer
```jsx
<footer className="border-t border-gray-200 dark:border-gray-700 py-4">
  <div className="container mx-auto px-4 text-center">
    <p className="text-sm text-gray-600 dark:text-gray-400">
      Built by <strong className="text-chat-accent">UB360.ai</strong>
    </p>
    <a 
      href="https://x.com/ub360_ai" 
      target="_blank"
      className="inline-flex items-center gap-2 text-chat-accent hover:underline mt-2"
    >
      <TwitterIcon size={16} />
      Follow @ub360_ai
    </a>
  </div>
</footer>
```

---

## 🏃 Running the Frontend

### Development Server
```bash
cd frontend
npm run dev
```

Visit: http://localhost:3000

### Build for Production
```bash
npm run build
```

---

## 🎯 Key Features to Implement

### 1. Chat Interface
- [ ] Message bubbles (user vs AI)
- [ ] Typing indicator
- [ ] Citation cards
- [ ] Copy button
- [ ] Auto-scroll

### 2. Document Upload
- [ ] Drag-and-drop zone
- [ ] File browser
- [ ] URL input
- [ ] Progress bar
- [ ] Success animation

### 3. Export Menu
- [ ] Floating action button
- [ ] Modal with options
- [ ] Download handling
- [ ] Success toast

### 4. Animations
- [ ] Message fade-in
- [ ] Typing dots
- [ ] Modal transitions
- [ ] Button hovers

---

## 📦 Project Status

### ✅ Completed
- Project structure
- Configuration files
- Package dependencies
- Core app setup
- Tailwind with ChatGPT colors

### 🔄 Next (You Need to Create)
- Context providers (3 files)
- Layout components (3 files)
- Page components (2 files)
- API client (1 file)
- Chat components
- Document components
- Export components

---

## 💡 Development Tips

1. **Start with contexts** - They're needed by everything
2. **Build layout next** - Header, Footer, Layout wrapper
3. **Then pages** - Chat page first, Documents second
4. **Add components** - Chat messages, document cards, etc.
5. **Polish with animations** - Framer Motion for smooth transitions

---

## 🎨 ChatGPT Design Reference

### Colors
- Background: `#FFFFFF` (light) / `#212121` (dark)
- Accent: `#10A37F` (green)
- User message: `#F7F7F8`
- AI message: `#FFFFFF`

### Spacing
- Messages: 16px padding
- Between messages: 12px gap
- Container: max-width 768px

### Typography
- Font: Inter
- Message text: 16px
- Timestamps: 12px, gray

---

## 🚀 Ready to Build!

You have the foundation. Now:
1. Run `npm install` in the frontend directory
2. Create the remaining files using the templates above
3. Start the dev server with `npm run dev`
4. Build the ChatGPT-style UI!

**The backend is ready, the frontend foundation is set. Time to bring it all together!** 🎉
