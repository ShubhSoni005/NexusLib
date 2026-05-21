# NexusLib — GTU Engineering Resources

A professional academic resource sharing platform for GTU (Gujarat Technological University) engineering students. Built with React + Vite.

## Features

- 📚 Study materials for IT, CE & CSE branches (Semesters 1–8)
- 🤖 AI Study Guide chatbot (text, file & URL input)
- 📤 Community upload portal with cascading dropdowns & validation
- 🌙 Dark / Light mode toggle
- 🔍 Subject search within semesters
- 📋 6 resource categories: Syllabus, PYQ, Notes, YouTube, Solutions, Books

## Tech Stack

- **Frontend:** React 18 + Vite
- **Routing:** React Router DOM v6
- **Icons:** Lucide React
- **Styling:** Vanilla CSS with CSS custom properties
- **AI:** Gemini 1.5 Flash (optional via env var)

## Getting Started

```bash
npm install
npm run dev
```

## Environment Variables (optional)

Create a `.env` file in the root:

```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

Without the key, the AI Guide uses built-in GTU-specific responses.

## Routes

| Route | Page |
|-------|------|
| `/` | Home — branch directory |
| `/branch/:branch` | Semesters for a branch |
| `/branch/:branch/semester/:sem` | Subjects grid |
| `/branch/:branch/semester/:sem/subject/:subject` | Resource cards |
| `/study-guide` | AI chatbot study guide |
| `/upload` | Community upload portal |
| `/login` | Sign in |
| `/signup` | Create account |

## Deployment

Deployed on Vercel. Build command: `npm run build`. Output directory: `dist`.
