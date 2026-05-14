# AI Gateway Next Frontend

Frontend-only split for AI Gateway / 9Router dashboard.

## Env

```bash
cp .env.example .env.local
```

For local test with Hono test backend:

```env
PORT=20129
BACKEND_BASE_URL=http://127.0.0.1:18323
NEXT_PUBLIC_BACKEND_BASE_URL=http://157.173.124.46:18323
JWT_SECRET=change-me-same-as-backend
AUTH_COOKIE_SECURE=false
DATA_DIR=/tmp/ai-gateway-next-frontend
```

For HTTPS deployment, use HTTPS backend URL and set:

```env
AUTH_COOKIE_SECURE=true
```

## Run

```bash
npm install
npm run build
PORT=20129 npm run start
```

PM2 example:

```bash
BACKEND_BASE_URL=http://127.0.0.1:18323 \
NEXT_PUBLIC_BACKEND_BASE_URL=http://157.173.124.46:18323 \
JWT_SECRET=change-me-same-as-backend \
AUTH_COOKIE_SECURE=false \
DATA_DIR=/tmp/ai-gateway-next-frontend \
PORT=20129 \
pm2 start "npm run start" --name ai-gateway-next-test
```
