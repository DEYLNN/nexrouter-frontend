<p align="center">
  <img src="public/providers/openai.png" width="48" height="48" alt="OpenAI" style="border-radius:12px">&nbsp;
  <img src="public/providers/anthropic.png" width="48" height="48" alt="Anthropic" style="border-radius:12px">&nbsp;
  <img src="public/providers/gemini.png" width="48" height="48" alt="Gemini" style="border-radius:12px">&nbsp;
  <img src="public/providers/deepseek.png" width="48" height="48" alt="DeepSeek" style="border-radius:12px">&nbsp;
  <img src="public/providers/xai.webp" width="48" height="48" alt="xAI" style="border-radius:12px">&nbsp;
  <img src="public/providers/mistral.png" width="48" height="48" alt="Mistral" style="border-radius:12px">&nbsp;
  <img src="public/providers/openrouter.png" width="48" height="48" alt="OpenRouter" style="border-radius:12px">
</p>

<h1 align="center">AI Gateway</h1>

<p align="center">
  <strong>Unified AI provider proxy & dashboard</strong><br>
  <span>Route, manage, and monitor 100+ AI providers through a single API endpoint.</span>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-0.5.0-blue?style=flat-square" alt="Version">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/Hono-Fire-orange?style=flat-square&logo=hono" alt="Hono">
  <img src="https://img.shields.io/badge/providers-106+-green?style=flat-square" alt="Providers">
  <img src="https://img.shields.io/badge/license-MIT-yellow?style=flat-square" alt="License">
</p>

---

## Features

- **🔀 Multi-provider proxy** — OpenAI, Claude, Gemini, DeepSeek, xAI, and 100+ more through a single `/v1/chat/completions` endpoint
- **🔄 Auto-failover** — Combo routing with fallback, round-robin, and sticky strategies
- **📊 Usage tracking** — Per-provider quota monitoring with auto-refresh
- **🔑 API key management** — Full access or per-model restriction with multi-select
- **🚫 Blocked models** — Per-account model blocking for cost control
- **📱 Caveman mode** — Terse system prompts (lite/full/ultra) for mobile-friendly responses
- **🧠 Reasoning support** — Thinking mode pass-through for DeepSeek, MiMo, Kiro, and more
- **🔌 OAuth + API key** — Mix OAuth-based and API key-based providers
- **📈 Request logging** — Full request/response detail with token usage stats
- **🎨 Modern dashboard** — Dark/light theme, responsive, real-time status

---

## Supported Providers

<details open>
<summary><strong>💬 LLM / Chat (40+ providers)</strong></summary>
<br>
<table>
<tr>
<td align="center" width="90"><img src="public/providers/openai.png" width="36"><br><sub>OpenAI</sub></td>
<td align="center" width="90"><img src="public/providers/anthropic.png" width="36"><br><sub>Anthropic</sub></td>
<td align="center" width="90"><img src="public/providers/gemini.png" width="36"><br><sub>Gemini</sub></td>
<td align="center" width="90"><img src="public/providers/deepseek.png" width="36"><br><sub>DeepSeek</sub></td>
<td align="center" width="90"><img src="public/providers/xai.webp" width="36"><br><sub>xAI</sub></td>
<td align="center" width="90"><img src="public/providers/mistral.png" width="36"><br><sub>Mistral</sub></td>
<td align="center" width="90"><img src="public/providers/openrouter.png" width="36"><br><sub>OpenRouter</sub></td>
<td align="center" width="90"><img src="public/providers/groq.png" width="36"><br><sub>Groq</sub></td>
</tr>
<tr>
<td align="center" width="90"><img src="public/providers/codex.png" width="36"><br><sub>Codex</sub></td>
<td align="center" width="90"><img src="public/providers/kiro.png" width="36"><br><sub>Kiro AI</sub></td>
<td align="center" width="90"><img src="public/providers/cursor.png" width="36"><br><sub>Cursor</sub></td>
<td align="center" width="90"><img src="public/providers/cline.png" width="36"><br><sub>Cline</sub></td>
<td align="center" width="90"><img src="public/providers/github.png" width="36"><br><sub>GitHub</sub></td>
<td align="center" width="90"><img src="public/providers/gemini-cli.png" width="36"><br><sub>Gemini CLI</sub></td>
<td align="center" width="90"><img src="public/providers/qwen.png" width="36"><br><sub>Qwen</sub></td>
<td align="center" width="90"><img src="public/providers/glm.png" width="36"><br><sub>GLM</sub></td>
</tr>
<tr>
<td align="center" width="90"><img src="public/providers/kimi.png" width="36"><br><sub>Kimi</sub></td>
<td align="center" width="90"><img src="public/providers/minimax.png" width="36"><br><sub>MiniMax</sub></td>
<td align="center" width="90"><img src="public/providers/perplexity.png" width="36"><br><sub>Perplexity</sub></td>
<td align="center" width="90"><img src="public/providers/together.png" width="36"><br><sub>Together</sub></td>
<td align="center" width="90"><img src="public/providers/fireworks.png" width="36"><br><sub>Fireworks</sub></td>
<td align="center" width="90"><img src="public/providers/cerebras.png" width="36"><br><sub>Cerebras</sub></td>
<td align="center" width="90"><img src="public/providers/cohere.png" width="36"><br><sub>Cohere</sub></td>
<td align="center" width="90"><img src="public/providers/nvidia.png" width="36"><br><sub>NVIDIA</sub></td>
</tr>
<tr>
<td align="center" width="90"><img src="public/providers/hyperbolic.png" width="36"><br><sub>Hyperbolic</sub></td>
<td align="center" width="90"><img src="public/providers/morph.png" width="36"><br><sub>Morph</sub></td>
<td align="center" width="90"><img src="public/providers/nous-portal.png" width="36"><br><sub>Nous</sub></td>
<td align="center" width="90"><img src="public/providers/canopywave.png" width="36"><br><sub>CanopyWave</sub></td>
<td align="center" width="90"><img src="public/providers/cloudflare-ai.png" width="36"><br><sub>Cloudflare</sub></td>
<td align="center" width="90"><img src="public/providers/siliconflow.png" width="36"><br><sub>SiliconFlow</sub></td>
<td align="center" width="90"><img src="public/providers/chutes.png" width="36"><br><sub>Chutes</sub></td>
<td align="center" width="90"><img src="public/providers/routeway.png" width="36"><br><sub>Routeway</sub></td>
</tr>
<tr>
<td align="center" width="90"><img src="public/providers/byteplus.png" width="36"><br><sub>BytePlus</sub></td>
<td align="center" width="90"><img src="public/providers/volcengine-ark.png" width="36"><br><sub>Volcengine</sub></td>
<td align="center" width="90"><img src="public/providers/xiaomi-mimo-plan-sgp.png" width="36"><br><sub>MiMo SGP</sub></td>
<td align="center" width="90"><img src="public/providers/vertex.png" width="36"><br><sub>Vertex</sub></td>
<td align="center" width="90"><img src="public/providers/azure.png" width="36"><br><sub>Azure</sub></td>
<td align="center" width="90"><img src="public/providers/bai.png" width="36"><br><sub>B.AI</sub></td>
<td align="center" width="90"><img src="public/providers/antigravity.png" width="36"><br><sub>Antigravity</sub></td>
<td align="center" width="90"><img src="public/providers/opencode.png" width="36"><br><sub>OpenCode</sub></td>
</tr>
<tr>
<td align="center" width="90"><img src="public/providers/commandcode.png" width="36"><br><sub>CommandCode</sub></td>
<td align="center" width="90"><img src="public/providers/ollama.png" width="36"><br><sub>Ollama</sub></td>
<td align="center" width="90"><img src="public/providers/alicode.png" width="36"><br><sub>Alibaba</sub></td>
<td align="center" width="90"><img src="public/providers/iflow.png" width="36"><br><sub>iFlow</sub></td>
<td align="center" width="90"><img src="public/providers/qiniu.png" width="36"><br><sub>Qiniu</sub></td>
<td align="center" width="90"><img src="public/providers/swiftrouter.png" width="36"><br><sub>SwiftRouter</sub></td>
<td align="center" width="90"><img src="public/providers/nanobanana.png" width="36"><br><sub>NanoBanana</sub></td>
<td align="center" width="90"><img src="public/providers/nebius.png" width="36"><br><sub>Nebius</sub></td>
</tr>
</table>
</details>

<details>
<summary><strong>🌐 Web / Subscription (2 providers)</strong></summary>
<br>
<table>
<tr>
<td align="center" width="90"><img src="public/providers/grok-web.png" width="36"><br><sub>Grok Web</sub></td>
<td align="center" width="90"><img src="public/providers/perplexity-web.png" width="36"><br><sub>Perplexity Web</sub></td>
</tr>
</table>
</details>

<details>
<summary><strong>🔊 Text-to-Speech (8 providers)</strong></summary>
<br>
<table>
<tr>
<td align="center" width="90"><img src="public/providers/elevenlabs.png" width="36"><br><sub>ElevenLabs</sub></td>
<td align="center" width="90"><img src="public/providers/aws-polly.png" width="36"><br><sub>AWS Polly</sub></td>
<td align="center" width="90"><img src="public/providers/google-tts.png" width="36"><br><sub>Google TTS</sub></td>
<td align="center" width="90"><img src="public/providers/edge-tts.png" width="36"><br><sub>Edge TTS</sub></td>
<td align="center" width="90"><img src="public/providers/cartesia.png" width="36"><br><sub>Cartesia</sub></td>
<td align="center" width="90"><img src="public/providers/playht.png" width="36"><br><sub>PlayHT</sub></td>
<td align="center" width="90"><img src="public/providers/coqui.png" width="36"><br><sub>Coqui</sub></td>
<td align="center" width="90"><img src="public/providers/inworld.png" width="36"><br><sub>Inworld</sub></td>
</tr>
</table>
</details>

<details>
<summary><strong>🎨 Image & Video (8 providers)</strong></summary>
<br>
<table>
<tr>
<td align="center" width="90"><img src="public/providers/stability-ai.png" width="36"><br><sub>Stability AI</sub></td>
<td align="center" width="90"><img src="public/providers/fal-ai.png" width="36"><br><sub>Fal.ai</sub></td>
<td align="center" width="90"><img src="public/providers/black-forest-labs.png" width="36"><br><sub>FLUX/BFL</sub></td>
<td align="center" width="90"><img src="public/providers/runwayml.png" width="36"><br><sub>Runway</sub></td>
<td align="center" width="90"><img src="public/providers/topaz.png" width="36"><br><sub>Topaz</sub></td>
<td align="center" width="90"><img src="public/providers/recraft.png" width="36"><br><sub>Recraft</sub></td>
<td align="center" width="90"><img src="public/providers/comfyui.png" width="36"><br><sub>ComfyUI</sub></td>
<td align="center" width="90"><img src="public/providers/sdwebui.png" width="36"><br><sub>SD WebUI</sub></td>
</tr>
</table>
</details>

<details>
<summary><strong>🔍 Embedding & Search (12 providers)</strong></summary>
<br>
<table>
<tr>
<td align="center" width="90"><img src="public/providers/jina-ai.png" width="36"><br><sub>Jina AI</sub></td>
<td align="center" width="90"><img src="public/providers/voyage-ai.png" width="36"><br><sub>Voyage AI</sub></td>
<td align="center" width="90"><img src="public/providers/brave-search.png" width="36"><br><sub>Brave</sub></td>
<td align="center" width="90"><img src="public/providers/exa.png" width="36"><br><sub>Exa</sub></td>
<td align="center" width="90"><img src="public/providers/tavily.png" width="36"><br><sub>Tavily</sub></td>
<td align="center" width="90"><img src="public/providers/firecrawl.png" width="36"><br><sub>Firecrawl</sub></td>
<td align="center" width="90"><img src="public/providers/serper.png" width="36"><br><sub>Serper</sub></td>
<td align="center" width="90"><img src="public/providers/google-pse.png" width="36"><br><sub>Google PSE</sub></td>
</tr>
<tr>
<td align="center" width="90"><img src="public/providers/searchapi.png" width="36"><br><sub>SearchAPI</sub></td>
<td align="center" width="90"><img src="public/providers/searxng.png" width="36"><br><sub>SearXNG</sub></td>
<td align="center" width="90"><img src="public/providers/linkup.png" width="36"><br><sub>Linkup</sub></td>
<td align="center" width="90"><img src="public/providers/youcom.png" width="36"><br><sub>You.com</sub></td>
</tr>
</table>
</details>

<details>
<summary><strong>🎤 Speech-to-Text (2 providers)</strong></summary>
<br>
<table>
<tr>
<td align="center" width="90"><img src="public/providers/deepgram.png" width="36"><br><sub>Deepgram</sub></td>
<td align="center" width="90"><img src="public/providers/assemblyai.png" width="36"><br><sub>AssemblyAI</sub></td>
</tr>
</table>
</details>

---

## Quick Start

### Prerequisites

- **Node.js** 18+ or **Bun** 1.1+
- **Hono backend** running (see [ai-gateway-hono-backend](https://github.com/DEYLNN/ai-gateway-hono-backend))

### Setup

```bash
git clone https://github.com/DEYLNN/ai-gateway-next-frontend.git
cd ai-gateway-next-frontend
npm install
cp .env.example .env.local
```

### Environment

```env
# Backend connection
BACKEND_BASE_URL=http://127.0.0.1:18323
NEXT_PUBLIC_BACKEND_BASE_URL=http://localhost:18323

# Auth
JWT_SECRET=<same-as-backend>
AUTH_COOKIE_SECURE=false

# Data
DATA_DIR=/tmp/ai-gateway-next-frontend
```

### Run

```bash
npm run dev        # Dev mode (port 20128)
npm run build      # Production build
npm start          # Serve production build
```

---

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Dashboard UI  │────▶│  Hono Backend    │────▶│  100+ Providers  │
│   (Next.js 15)  │     │  (SSE proxy)     │     │  OpenAI, Claude, │
│                 │◀────│  port 18323      │◀────│  Gemini, etc.    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                       │
        │    ┌──────────────┐   │
        └───▶│  SQLite DB   │◀──┘
             │  (API keys,  │
             │   providers, │
             │   usage)     │
             └──────────────┘
```

### API Endpoints

| Endpoint | Description |
|----------|-------------|
| `POST /v1/chat/completions` | Chat completions (OpenAI-compatible) |
| `POST /v1/messages` | Claude Messages API |
| `POST /v1/embeddings` | Embeddings |
| `POST /v1/audio/speech` | Text-to-Speech |
| `GET /v1/models` | List available models |
| `GET /health` | Health check |

### Key Features

- **Combo Routing** — Chain multiple providers with fallback/round-robin strategies
- **Model Aliases** — Use `kr/claude-sonnet-4.6` to route to Kiro, `cx/gpt-5.5` for Codex
- **Caveman Mode** — Inject terse system prompts (lite/full/ultra) for concise responses
- **Per-account blocking** — Block specific models on specific provider accounts
- **API key restrictions** — Create keys that only access selected models

---

## Provider Prefixes

| Prefix | Provider | Prefix | Provider |
|--------|----------|--------|----------|
| `kr` | Kiro AI | `cx` | OpenAI Codex |
| `gh` | GitHub Copilot | `cu` | Cursor |
| `cl` | Cline | `gc` | Gemini CLI |
| `or` | OpenRouter | `ds` | DeepSeek |
| `qw` | Qwen | `glm` | GLM |
| `cwv` | CanopyWave | `mms` | MiMo Plan SGP |
| `mimo` | Xiaomi MiMo | `cf` | Cloudflare AI |
| `morph` | Morph LLM | `nous` | Nous Portal |
| `oc` | OpenCode | `ocg` | OpenCode Go |

---

## Contributing

1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Push and open a PR

---

## License

MIT

---

<p align="center">
  <sub>Built with ❤️ by <a href="https://github.com/DEYLNN">DEYLNN</a></sub>
</p>
