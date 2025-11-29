# 🎨 Research Assistant Frontend

**ChatGPT-inspired React UI for UB360.ai Research Assistant**

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Visit: http://localhost:3000

---

## ✨ Features

- **ChatGPT-Style Interface** - Familiar, intuitive chat UI
- **Dark Mode** - Toggle between light and dark themes
- **Document Management** - Drag-and-drop upload, URL scraping
- **Export Tools** - Generate reports and bibliographies
- **Responsive Design** - Works on mobile, tablet, desktop
- **Professional Animations** - Smooth transitions and loaders
- **UB360.ai Branding** - Promote @ub360_ai on Twitter/X

---

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Axios** - API calls
- **React Hot Toast** - Notifications

---

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/       # Header, Footer, Layout
│   ├── chat/         # Chat messages, input
│   ├── documents/    # Document upload, list
│   └── export/       # Export modals
├── pages/
│   ├── Chat.jsx      # Main chat page
│   └── Documents.jsx # Document management
├── context/
│   ├── ThemeContext.jsx
│   ├── DocumentContext.jsx
│   └── ChatContext.jsx
├── api/
│   └── client.js     # API integration
└── App.jsx           # Main app
```

---

## 🎨 Design System

### Colors (ChatGPT-Inspired)
- **Accent:** `#10A37F` (ChatGPT green)
- **Light Mode:** White backgrounds, dark text
- **Dark Mode:** Dark backgrounds, light text

### Typography
- **Font:** Inter (Google Fonts)
- **Weights:** 400, 500, 600, 700

---

## 🔌 API Integration

Backend: `http://localhost:8000/api/v1`

Endpoints used:
- `/documents/upload` - Upload files
- `/documents/upload-url` - Scrape URLs
- `/documents` - List documents
- `/query` - Ask questions
- `/export/report` - Generate reports
- `/export/bibliography` - Generate bibliographies

---

## 🎯 Key Components

### Chat Interface
- Message bubbles (user vs AI)
- Citation cards
- Typing indicator
- Auto-scroll
- Copy message

### Document Upload
- Drag-and-drop zone
- File browser
- URL input
- Progress indicators

### Export Menu
- Report generation
- Bibliography (APA, MLA, Chicago)
- Download handling

---

## 🌙 Dark Mode

Toggle between light and dark themes. Preference saved to localStorage.

---

## 📱 Responsive

- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

---

## 🎨 UB360.ai Branding

- Logo in header
- Footer with social links
- "Follow @ub360_ai" call-to-action
- Promotional elements

---

## 🚀 Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📦 Dependencies

### Core
- react
- react-dom
- react-router-dom

### UI & Styling
- tailwindcss
- framer-motion
- lucide-react
- @headlessui/react

### Utilities
- axios
- react-hot-toast
- react-dropzone

---

## 🎯 Next Steps

1. Complete remaining components
2. Add chat functionality
3. Implement document management
4. Add export features
5. Polish animations
6. Test responsiveness

---

**Built with ❤️ by UB360.ai**  
**Follow [@ub360_ai](https://x.com/ub360_ai) on X**
