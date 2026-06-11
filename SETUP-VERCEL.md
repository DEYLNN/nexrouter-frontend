# NexRouter Frontend — Vercel Setup

Repo: `https://github.com/DEYLNN/nexrouter-frontend`

This repo is the dashboard/frontend only. The backend must be deployed separately and reachable from the browser.

## 1. Import Project

1. Open Vercel → **Add New Project**.
2. Import `DEYLNN/nexrouter-frontend`.
3. Framework preset: **Next.js**.
4. Root directory: repo root.
5. Install command:

```bash
npm install
```

6. Build command:

```bash
npm run build
```

7. Output: Vercel auto-detects Next.js.

## 2. Environment Variables

Set these in Vercel Project Settings → Environment Variables:

```env
BACKEND_BASE_URL=https://YOUR-BACKEND-DOMAIN
NEXT_PUBLIC_BACKEND_BASE_URL=https://YOUR-BACKEND-DOMAIN
JWT_SECRET=change-this-to-the-same-value-as-backend
AUTH_COOKIE_SECURE=true
DATA_DIR=/tmp/ai-gateway-next-frontend
```

Notes:

- `BACKEND_BASE_URL` is used by Next.js rewrites.
- `NEXT_PUBLIC_BACKEND_BASE_URL` is browser-visible, so it must be a public backend URL.
- `JWT_SECRET` must match backend `JWT_SECRET`.
- `AUTH_COOKIE_SECURE=true` requires HTTPS. Use `false` only for local HTTP testing.
- Do **not** point frontend `DATA_DIR` to the backend production DB.

## 3. Backend CORS / Public URL

The backend should be deployed first, for example:

```text
https://api.your-domain.com
```

Then set frontend env:

```env
BACKEND_BASE_URL=https://api.your-domain.com
NEXT_PUBLIC_BACKEND_BASE_URL=https://api.your-domain.com
```

## 4. Local Test Before Deploy

```bash
cp .env.example .env.local
npm install
npm run build
npm run start
```

Default local frontend port from `.env.example`:

```env
PORT=20129
```

## 5. Verify After Deploy

Open the Vercel URL and check:

1. Login works.
2. Provider list loads.
3. Models page loads.
4. A backend health/API call works through rewrites:

```text
https://YOUR-FRONTEND.vercel.app/api/health
```

Expected backend health shape:

```json
{"ok":true,"runtime":"hono-bun"}
```

## 6. Important Security Notes

- Never commit `.env.local`.
- Never put API keys/tokens in `NEXT_PUBLIC_*` variables.
- `NEXT_PUBLIC_BACKEND_BASE_URL` is public by design.
- Keep `JWT_SECRET` private and identical between FE/BE.
- If sharing the repo publicly, rotate any token that was ever committed historically.

## 7. Common Issues

### `/api/*` returns 404 or points to Vercel

Check:

```env
BACKEND_BASE_URL=https://YOUR-BACKEND-DOMAIN
```

Then redeploy.

### Login cookie not sticking

If using HTTPS:

```env
AUTH_COOKIE_SECURE=true
```

If local HTTP:

```env
AUTH_COOKIE_SECURE=false
```

### Dashboard loads but providers/models empty

Check backend is online and reachable from Vercel:

```bash
curl https://YOUR-BACKEND-DOMAIN/api/health
```
