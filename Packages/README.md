# Packages

All dependencies are managed via `package.json` at the project root (required by npm).

## Install All Dependencies

```bash
npm install
```

## Production Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^18.3.1 | UI library |
| `react-dom` | ^18.3.1 | React DOM renderer |
| `react-router-dom` | ^7.15.1 | Client-side routing |
| `lucide-react` | ^1.16.0 | Icon library |

## Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `vite` | ^5.4.10 | Build tool & dev server |
| `@vitejs/plugin-react` | ^4.3.3 | React Fast Refresh for Vite |
| `eslint` | ^9.13.0 | Code linting |
| `eslint-plugin-react` | ^7.37.2 | React-specific lint rules |
| `eslint-plugin-react-hooks` | ^5.0.0 | Hooks lint rules |
| `globals` | ^15.11.0 | Global variable definitions |

## Available Scripts

```bash
npm run dev      # Start development server (http://localhost:5173)
npm run build    # Build for production → dist/
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
```

## Environment Variables

Create a `.env` file at the project root:

```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```
