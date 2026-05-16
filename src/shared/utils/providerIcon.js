import { AI_PROVIDERS } from "@/shared/constants/providers";

const ALIASES = Object.fromEntries(
  Object.entries(AI_PROVIDERS).flatMap(([id, provider]) => {
    const entries = [[id.toLowerCase(), id]];
    if (provider?.alias) entries.push([String(provider.alias).toLowerCase(), id]);
    return entries;
  })
);

// Historical/special aliases seen in logs.
Object.assign(ALIASES, {
  cx: "codex",
  kr: "kiro",
  cwv: "canopywave",
  gh: "github",
  mms: "xiaomi-mimo-plan-sgp",
  "mimo-sgp": "xiaomi-mimo-plan-sgp",
  "openai-compatible-chat-5b54ddd1-0b0e-4452-9056-7a5e232672f9": "xiaomi-mimo-plan-sgp",
  fmd: "freemodel-dev",
  glb: "gitlawb",
  oc: "opencode",
  rwy: "routeway",
  aim: "aimurah",
});

export function canonicalProviderId(provider) {
  const raw = String(provider || "").trim().toLowerCase();
  return ALIASES[raw] || raw;
}

export function providerIconPath(provider) {
  const id = canonicalProviderId(provider);
  const icon = AI_PROVIDERS[id]?.icon;
  if (icon && icon.startsWith("/")) return icon;
  return `/providers/${id}.png`;
}

export function providerDisplayName(provider) {
  const raw = String(provider || "").trim();
  const id = canonicalProviderId(raw);
  return AI_PROVIDERS[id]?.name || raw;
}

export function providerDisplayColor(provider) {
  const id = canonicalProviderId(provider);
  return AI_PROVIDERS[id]?.color || "#6B7280";
}
