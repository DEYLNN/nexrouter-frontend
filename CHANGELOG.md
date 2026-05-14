# Changelog

## [0.5.1] - 2026-05-14

### Features
- Fix changelog click + add auto-changelog GitHub Action
- Add xiaomi-mimo-plan-sgp to USAGE_SUPPORTED_PROVIDERS + USAGE_APIKEY_PROVIDERS
- Add MiMo SGP usage card to quota page with profile + token info
- Add MiMo SGP platform cookie field for usage tracking + mimo-usage API endpoint
- OpenRouter: change alias to 'or', add 4 free static models
- Add prefix uniqueness check when creating custom provider nodes

### Fixes
- Remove GH Action (token missing workflow scope) + fix changelog click + auto_changelog script
- Fix MiMo SGP usage card: correct API data shape + plan detail + usage bar
- Fix Cloudflare name to Cloudflare AI + sync provider aliases
- Fix: kiro model IDs use dash format (claude-sonnet-4-6, claude-opus-4-7)
- Fix: save blockedModels for kiro/cwv per-account
- Fix endpoint card style, caveman mobile layout, kiro/cwv models update, per-account blocked models

### Improvements
- README: remove non-LLM provider sections, keep only relevant
- v0.5.0: comprehensive README with provider grid and architecture
- Sidebar: replace Admin/shutdown footer with Changelog + version link
- v0.5.0: bump version + changelog
- API key model access: allowedModels selector + restricted/full access toggle
- Endpoint page: API key action buttons always visible (eye/copy/delete)
- Quota table: format numbers compact (K/M/B)
- MiMo SGP quota card: masked email header, ID footer, expired handling
- Revert kiro claude 4.x model ids to dot style
- Use backend env for displayed API endpoint
- Initial split Next frontend


## [0.5.0] - 2026-05-14

### Features
- **API Key Model Access Control** — Create restricted API keys that only allow access to selected models. Full Access (default) or Restricted with multi-select model picker grouped by provider.
- **MiMo SGP Quota Card** — New quota page card for Xiaomi MiMo Plan SGP with token usage bar, masked email, user ID, and plan expiry handling. Stores platform session cookie for usage tracking.
- **OpenRouter alias** — Changed prefix from `openrouter` to `or`. Added 4 free static models: `poolside/laguna-m.1:free`, `openai/gpt-oss-120b:free`, `nvidia/nemotron-3-super-120b-a12b:free`, `minimax/minimax-m2.5:free`.
- **Provider prefix uniqueness check** — Creating a custom provider node now validates that the prefix isn't already used by a built-in provider or existing custom node.
- **Per-account blocked models** — Extended blocked models support to all providers (kiro, canopywave, codex), not just codex.

### Improvements
- **Quota table numbers** — Large token counts now display in compact K/M/B format (e.g. `59M / 700M`).
- **API key action buttons** — Eye, copy, and delete icons on API key cards are now always visible instead of only on hover.
- **Cloudflare provider name** — Renamed from "Cloudflare" to "Cloudflare AI" for clarity.
- **Provider alias sync** — Fixed missing alias mappings for `nous`, `morph`, `routeway`, `glm-cn`, `minimax-cn`, `mimo-sgp`, `or` in the SSE model resolver.
- **Kiro model IDs** — Reverted to dot-style format (`claude-sonnet-4.6`, `claude-opus-4.7`) with backend normalization for dot/dash variants.

### Fixes
- **MiMo SGP 400 error** — Fixed `reasoning_content` not being injected for mimo-sgp provider, causing "Param Incorrect" errors in thinking mode.
- **OpenRouter 401 error** — Fixed `or` alias not resolving to `openrouter` in `ALIAS_TO_PROVIDER_ID`, causing auth failures.
- **blockedModels not saving** — Fixed save logic for kiro/cwv per-account blocked models in EditConnectionModal.
- **ProxyFetch MITM noise** — Suppressed `ECONNREFUSED` log spam when no local proxy is running.

---

## [0.4.29] - 2026-05-13

- Initial split from monorepo into separate frontend/backend repos
- Backend running on port 18323 with `DATA_DIR=/root/.9router`
