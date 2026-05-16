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

## Release / push rule

Zhen instruction — 2026-05-16:

Every meaningful FE push must keep version + changelog synced.

Before the final commit/push, run:

```bash
python3 scripts/release-note.py "Short summary of the change"
npm run build
git add -A
git commit -m "<same short summary or clear commit message>"
git push origin main
rm -rf .next
```

Rules:

- `package.json` version uses **patch bumps only** (`0.5.1 → 0.5.2 → ...`).
- Update `CHANGELOG.md` for every pushed FE change.
- Use one concise changelog bullet per work batch.
- Do not create minor version bumps unless Zhen explicitly asks.
- Existing helper `.github/scripts/auto_changelog.py` exists, but local agent pushes should prefer `scripts/release-note.py` because it is deterministic and avoids re-listing old commits.

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
