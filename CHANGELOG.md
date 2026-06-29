# Changelog

## [0.5.18] - 2026-06-29

### Added
- Add Unimodel provider (alias `um`) — OpenAI-compatible inference API via unimodel.ai/v1.
  - Models: deepseek-v4-pro, deepseek-v4-flash, glm-5.2, glm-5.1

## [0.5.17] - 2026-06-29

### Added
- Add Babel Town provider (alias `bt`) — OpenAI-compatible inference API.
  - Base URL: `https://api.babel.town/v1`
  - Models: `glm-5.2`

## [0.5.15] - 2026-06-22

### Added
- Add Badtheory Labs provider (alias `btl`) with `deepseek-v4-flash` and `deepseek-v4-pro` models.

## [0.5.13] - 2026-06-18

### Added
- Add new OpenCode Go models: `kimi-k2.7-code`, `minimax-m3`, `glm-5.2`, `deepseek-v4-pro`, `deepseek-v4-flash`, `mimo-v2.5`, `mimo-v2.5-pro`.
- Add new Command Code models: `moonshotai/Kimi-K2.7-Code`, `zai-org/GLM-5.2`, `MiniMaxAI/MiniMax-M3`, `xiaomi/mimo-v2.5`, `xiaomi/mimo-v2.5-pro`, `nvidia/nemotron-3-ultra-550b-a55b`.

## [0.5.12] - 2026-06-18

### Added
- Add `minimax-m3` to B.AI static model list.

## [0.5.11] - 2026-06-18

### Removed
- Remove unfinished ZCode OAuth provider from the frontend catalog and OAuth flow.

## [0.5.9] - 2026-06-17

### Fixed
- Keep ftstoresz frontend version/changelog in sync after backend add-key validation fix.

## [0.5.8] - 2026-06-17

### Added
- Add ftstoresz provider to frontend catalog/OpenSSE mirrors with constant models `qwen3.7-max` and `claude-opus-4.7`.

## [0.5.7] - 2026-06-13

### Fixed
- Improve Request Logs token chips: compact In/Out/Total counts to K/M notation and use dark-safe provider contrast for the Total chip border/text.

## [0.5.6] - 2026-06-13

### Fixed
- Register MiMo Code Free in the frontend OpenSSE provider/model mirrors so `mimo-auto` appears as a constant model.
- Reuse the Xiaomi MiMo provider asset for MiMo Code Free and allow suggested-model sync for all providers with a `modelsFetcher`.

## [0.5.5] - 2026-06-13

### Added
- Add MiMo Code Free no-API-key provider (`mimo-free` / `mmf`) to the frontend provider catalog, provider icon aliases, and suggested-model filter.

## [0.5.4] - 2026-06-12

### Added
- Add Ambient API-key provider with FE/BE OpenSSE registration, static model catalog fetched from `https://api.ambient.xyz/v1/models`, alias `amb`, and dashboard icon asset.

## [0.5.2] - 2026-06-11

### Fixed
- Show request-log error details and status codes for failed provider calls instead of only a bare ERROR badge.

## [0.5.51] - 2026-06-09

### Changed
- Update FreeBuff frontend model catalog to expose MiniMax M3, MiMo V2.5, MiMo V2.5 Pro, Kimi K2.6, DeepSeek V4 Pro, and DeepSeek V4 Flash queues.
- Refresh FreeBuff provider notice so the dashboard no longer describes the free tier as DeepSeek V4 Flash-only.

## [0.5.50] - 2026-06-06

### Fixed
- Scope Auth Files `Problematic` and `Disabled` counters to the selected provider dropdown, so status filters are provider-specific instead of all-file totals.

## [0.5.49] - 2026-06-04

### Fixed
- Add Morph provider FE constant model `morph-dsv4flash` / Morph DeepSeek V4 Flash so `/dashboard/providers/morph` can display it.

## [0.5.48] - 2026-06-03

### Added
- Add Anuma provider to the frontend API-key provider catalog.
- Show Anuma as API-key-only UX; NexRouter injects the required `X-User-ID` header server-side.
- Register tested Anuma models in the model picker: ChatGPT 5.4, Claude Sonnet 4.6, Gemini 3.1 Pro, Gemini 3.5 Flash, Grok 4.3, Qwen 3.6 Max Preview, Kimi 2.6, Kimi 2.5, Qwen 3.6 Plus, MiniMax 2.7.

## [0.5.47] - 2026-06-02

### Changed
- Restore Ocenza static models to `gpt-oss-120b` and `step-3.5-flash-2603`.

## [0.5.46] - 2026-06-02

### Fixed
- Validate Ocenza API keys via `/v1/models` and update static models to the key-exposed model list.

## [0.5.45] - 2026-06-02

### Added
- Add Ocenza provider with constant models `gpt-oss-120b` and `step-3.5-flash-2603`.

## [0.5.44] - 2026-06-02

### Improvements
- Replace the Kiro/Husada live model native select with a modern searchable picker
- Show selected model metadata, blocked badge, and active check state in the live model test dropdown

## [0.5.43] - 2026-06-02

### Features
- Register Zenmux provider in the frontend provider catalog
- Add Zenmux icon asset and constant model list

## [0.5.42] - 2026-06-02

### Features
- Add Auth Files bulk selection controls for filtered/visible accounts
- Add delete selected action so problematic credentials can be removed in batches from the UI

## [0.5.41] - 2026-06-02

### Features
- Add Husada live model test UI to the edit connection modal
- Show Husada models in the per-key blocked model list so individual keys can be tested like Kiro

## [0.5.40] - 2026-06-02

### Fixes
- Restrict Gitlawb MiMo provider model picker to upstream-supported `xiaomi/mimo-*` chat models
- Remove unsupported MiniMax/OpenRouter catalog entries from the Gitlawb MiMo static list

## [0.5.39] - 2026-06-02

### Features
- Add Gitlawb MiMo provider entry with Gitlawb assets and `/v1/xiaomi-mimo` endpoint display
- Register 343 Gitlawb MiMo catalog models from OpenGateway, including `minimax/minimax-m3`
- Keep existing global Gitlawb provider entry unchanged

## [0.5.38] - 2026-06-01

### Chore
- Tighten project rules: every change must bump package version and CHANGELOG.md together
- Add repository rule requiring CHANGELOG.md updates for every future frontend change
- Add changelog generation helper script
- Rebrand frontend UI and metadata from AI Gateway/9Router to NexRouter
- Point dashboard changelog fetch URLs to the renamed NexRouter frontend repository
- Bump frontend package version to 0.5.37 so UI version matches changelog

## [0.5.36] - 2026-05-30

### Improvements
- Restore dashboard theme switching and default new sessions to dark mode
- Refine dark-mode navbar and sidebar glass opacity, glow, and active navigation states

## [0.5.35] - 2026-05-18

### Features
- Add GMI Cloud API-key provider with Gemini 3.1 Flash Lite Preview model

## [0.5.34] - 2026-05-17

### Features
- Add FreeBuff full-mode models to catalog

## [0.5.33] - 2026-05-16

### Improvements
- Use FreeBuff branded provider icon

## [0.5.32] - 2026-05-16

### Features
- Add FreeBuff OAuth connect flow

## [0.5.31] - 2026-05-16

### Improvements
- Hide unsupported FreeBuff models

## [0.5.30] - 2026-05-16

### Features
- Add FreeBuff model catalog entries

## [0.5.29] - 2026-05-16

### Improvements
- Register FreeBuff provider in frontend OpenSSE config

## [0.5.28] - 2026-05-16

### Improvements
- Polish FreeBuff no-key provider detail view

## [0.5.27] - 2026-05-16

### Features
- Add FreeBuff native provider model

## [0.5.26] - 2026-05-16

### Improvements
- Update AI Gateway titles and descriptions

## [0.5.25] - 2026-05-16

### Improvements
- Modernize login screen for AI Gateway

## [0.5.24] - 2026-05-16

### Improvements
- Rename sidebar product label to AI Gateway

## [0.5.23] - 2026-05-16

### Improvements
- Move premium styling to usage breakdown table

## [0.5.22] - 2026-05-16

### Improvements
- Restore recent requests table layout

## [0.5.21] - 2026-05-16

### Improvements
- Modernize usage breakdown model table

## [0.5.20] - 2026-05-16

### Improvements
- Redesign recent requests activity table

## [0.5.19] - 2026-05-16

### Improvements
- Improve usage chart mobile layout

## [0.5.18] - 2026-05-16

### Improvements
- Set usage overview default range to 7 days

## [0.5.17] - 2026-05-16

### Improvements
- Redesign usage overview chart with layered gradient area

## [0.5.16] - 2026-05-16

### Improvements
- Show no-key providers as ready in API key section

## [0.5.15] - 2026-05-16

### Improvements
- Merge free provider cards into OAuth and API key sections

## [0.5.14] - 2026-05-16

### Fixes
- Fix public models provider metadata mapping

## [0.5.13] - 2026-05-16

### Fixes
- Fix topology active animation for provider aliases

## [0.5.12] - 2026-05-16

### Improvements
- Restore usage topology activity animations

## [0.5.11] - 2026-05-16

### Features
- Add GLM model to Gitlawb provider

## [0.5.10] - 2026-05-16

### Features
- Add Gemini Flash Lite model to Gitlawb provider

## [0.5.9] - 2026-05-16

### Improvements
- Use default icon for AIMurah provider

## [0.5.8] - 2026-05-16

### Features
- Add AIMurah as static API key provider

## [0.5.7] - 2026-05-16

### Features
- Add default provider icon and apply it to Free Model Dev

## [0.5.6] - 2026-05-16

### Fixes
- Fix provider icons in usage logs for new providers

## [0.5.5] - 2026-05-16

### Improvements
- Switch sidebar back to light neutral theme

## [0.5.4] - 2026-05-16

### Improvements
- Polish dark premium sidebar and SaaS navbar

## [0.5.3] - 2026-05-16

### Improvements
- Refine navbar and sidebar visual integration

## [0.5.2] - 2026-05-16

### Improvements
- Document release note and cleanup rules for FE pushes

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
