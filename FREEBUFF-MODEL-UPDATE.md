# FreeBuff Frontend Model Update Guide

Use this when Codebuff adds/renames FreeBuff models.

## Source of truth

Check backend guide first:

```text
FREEBUFF-MODEL-UPDATE.md
```

Backend must be updated before or together with frontend. Frontend only exposes/catalogs models; backend executor controls actual routing/session behavior.

## Frontend files to update

### 1. Static model catalog

File:

```text
open-sse/config/providerModels.js
```

Update `PROVIDER_MODELS.fb`.

Current known list:

```js
fb: [
  { id: "minimax-m2.7", name: "MiniMax M2.7" },
  { id: "minimax-m3", name: "MiniMax M3" },
  { id: "mimo-v2.5", name: "MiMo V2.5" },
  { id: "mimo-v2.5-pro", name: "MiMo V2.5 Pro" },
  { id: "kimi-k2.6", name: "Kimi K2.6" },
  { id: "deepseek-v4-pro", name: "DeepSeek V4 Pro" },
  { id: "deepseek-v4-flash", name: "DeepSeek V4 Flash" },
]
```

Keep IDs user-facing and backend-compatible:

```text
fb/<id> → backend MODEL_MAP → Codebuff backend model ID
```

### 2. Provider notice

File:

```text
src/shared/constants/providers.js
```

Update the `freebuff` notice if model availability changes.

Avoid stale copy like:

```text
Free tier currently uses DeepSeek V4 Flash.
```

Prefer generic copy:

```text
FreeBuff supports multiple Codebuff free/premium model queues.
```

### 3. Version + changelog

Files:

```text
package.json
CHANGELOG.md
```

Bump patch version and add a changelog entry for every frontend change.

Example:

```text
0.5.50 → 0.5.51
```

## Build/check

```bash
node --check open-sse/config/providerModels.js
node --check src/shared/constants/providers.js
npm run build
rm -rf .next
```

`rm -rf .next` after FE build keeps disk usage low; do not commit build output.

## Commit/push

```bash
git add CHANGELOG.md package.json open-sse/config/providerModels.js src/shared/constants/providers.js FREEBUFF-MODEL-UPDATE.md
git commit -m "feat(freebuff): update frontend model catalog"
git push origin main
```

Push to `main` triggers Vercel deploy for `https://ai.dkzhen.org`.

## Common gotchas

- Updating frontend only will show models but backend may still reject them.
- Updating backend only may work via API but dashboard/model picker can stay stale.
- `/v1/models` is backend-public-model filtered; frontend constants alone do not guarantee public API visibility.
- If a model returns `426 freebuff_update_required`, check backend session creation first: it must POST `/api/v1/freebuff/session` with `x-freebuff-model` and rotate/delete old model-locked sessions.
