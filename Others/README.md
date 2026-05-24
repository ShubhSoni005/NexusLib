# Others

Miscellaneous configuration files and project-level docs.

## Config Files (at project root)

| File | Location | Purpose |
|------|----------|---------|
| `vercel.json` | `/vercel.json` | Vercel SPA routing rewrites |
| `.gitignore` | `/.gitignore` | Git ignore rules |
| `vite.config.js` | `/vite.config.js` | Vite build configuration |
| `package.json` | `/package.json` | npm project manifest |

> These files must remain at the **project root** to work correctly with their respective tools.

## Deployment

- **Platform:** Vercel
- **Live URL:** https://nexuslib.vercel.app
- **GitHub:** https://github.com/ShubhSoni005/NexusLib
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Auto-deploy:** Every push to `main` triggers a Vercel deployment

## vercel.json Explanation

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

This ensures all routes (e.g. `/branch/IT`) are handled by the React SPA instead of returning 404.
