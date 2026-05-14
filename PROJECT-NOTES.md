# AI Gateway Next Frontend — Local Agent Notes

Zhen instruction — 2026-05-14:

This is the active frontend/UI project for Zhen's AI Gateway / 9Router dashboard.

## Project

```txt
/root/.openclaw/workspace/projects/ai-gateway-next-frontend
```

## Repo

```txt
https://github.com/DEYLNN/ai-gateway-next-frontend
```

## Role

- This is the frontend split from 9router.
- Zhen expects frequent UI edits here.
- It is okay to edit this folder when Zhen asks for FE/UI/dashboard changes.
- Push updates to GitHub when requested or after meaningful UI work.

## Env target pattern

For Vercel frontend connected to backend:

```env
BACKEND_BASE_URL=<backend-url>
NEXT_PUBLIC_BACKEND_BASE_URL=<backend-url>
JWT_SECRET=<same-as-backend>
AUTH_COOKIE_SECURE=true-or-false-based-on-HTTPS
```

Current backend main runtime is usually:

```txt
http://localhost:18323/v1
PM2: ai-gateway-hono-backend
```

Public/test backend may be:

```txt
http://157.173.124.46:18323
```

## Cleanup habit after push/build

To avoid filling disk:

- After pushing UI updates, remove build output if not running locally:

```bash
rm -rf .next
```

- If local runtime is not needed and disk is tight, `node_modules/` may also be removed:

```bash
rm -rf node_modules
```

- Do not delete source files, `.env.example`, `.gitignore`, or README.
- Do not remove `node_modules` if a local PM2/Next test is currently running from this folder.

## Backend safety reminder

Do not casually edit backend project:

```txt
/root/.openclaw/workspace/projects/ai-gateway-hono-backend
```

That backend is core agent infrastructure. If a requested 9router/backend modification needs writing there, explain plan and confirm first.
