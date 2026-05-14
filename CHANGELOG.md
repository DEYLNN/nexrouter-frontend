# Changelog

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
