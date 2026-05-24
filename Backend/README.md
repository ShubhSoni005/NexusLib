# Backend

> **Status:** Placeholder — ready for future API development.

NexusLib currently runs entirely client-side (React SPA). This folder is reserved for future backend services.

## Planned Backend Services

| Service | Purpose | Tech (Planned) |
|---------|---------|----------------|
| `auth/` | User authentication (login, signup, JWT) | Node.js + Express |
| `uploads/` | File upload handling & storage | Multer + Cloudinary |
| `ai/` | AI Study Guide proxy (Gemini API) | Express middleware |
| `admin/` | Content approval workflow | REST API |

## When Backend is Added

1. Create `Backend/server.js` as the Express entry point
2. Add routes in `Backend/routes/`
3. Add middleware in `Backend/middleware/`
4. Update `package.json` with backend scripts
5. Add environment variables to `.env`
