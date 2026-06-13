"use client";

import { useState, useEffect } from "react";
import { FREE_PROVIDERS, AI_PROVIDERS } from "@/shared/constants/providers";
import ProviderIcon from "@/shared/components/ProviderIcon";
import { providerDisplayColor, providerDisplayName, providerIconPath } from "@/shared/utils/providerIcon";

// Keep providers without serviceKinds (default LLM) or with "llm" in serviceKinds
function isLLMProvider(id) {
  const p = AI_PROVIDERS[id];
  if (!p?.serviceKinds) return true;
  return p.serviceKinds.includes("llm");
}
import Card from "./Card";
import OverviewCards from "@/app/(dashboard)/dashboard/usage/components/OverviewCards";
import ProviderTopology from "@/app/(dashboard)/dashboard/usage/components/ProviderTopology";
import UsageChart from "@/app/(dashboard)/dashboard/usage/components/UsageChart";

const fmt = (n) => new Intl.NumberFormat().format(n || 0);

function timeAgo(timestamp) {
  const diff = Math.floor((Date.now() - new Date(timestamp)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// Auto-update time display every second without re-rendering parent
function TimeAgo({ timestamp }) {
  const [, setTick] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);
  
  return <>{timeAgo(timestamp)}</>;
}

function RecentRequests({ requests = [] }) {
  return (
    <Card className="flex min-w-0 flex-col overflow-hidden dark:!bg-[#0B1220] dark:!border-[#334155] dark:!shadow-none dark:!backdrop-blur-0" padding="sm" style={{ height: 480 }}>
      {/* Header */}
      <div className="px-1 py-2 border-b border-border dark:!border-[#334155] shrink-0">
        <span className="text-xs font-semibold text-text-muted uppercase tracking-wide dark:!text-[#E5E7EB]">Recent Requests</span>
      </div>

      {!requests.length ? (
        <div className="flex-1 flex items-center justify-center text-text-muted text-sm dark:!text-[#CBD5E1]">No requests yet.</div>
      ) : (
        <div className="flex-1 space-y-2 overflow-y-auto py-2 pr-1">
          {requests.map((r, i) => {
            const ok = !r.status || r.status === "ok" || r.status === "success";
            const providerName = providerDisplayName(r.provider || "unknown");
            const providerColor = providerDisplayColor(r.provider || "unknown");
            const totalTokens = (r.promptTokens || 0) + (r.completionTokens || 0);

            return (
              <div
                key={i}
                className="rounded-2xl border border-[rgba(23,33,27,0.10)] bg-[rgba(255,248,220,0.72)] p-3 shadow-[0_10px_28px_-24px_rgba(23,33,27,0.28)] transition-colors hover:bg-[rgba(255,248,220,0.92)] dark:!border-[#334155] dark:!bg-[#111827] dark:!shadow-none dark:hover:!bg-[#1E293B]"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="relative shrink-0">
                    <div
                      className="grid h-10 w-10 place-items-center rounded-xl border"
                      style={{ background: `${providerColor}18`, borderColor: `${providerColor}38` }}
                    >
                      <ProviderIcon
                        src={providerIconPath(r.provider)}
                        alt={providerName}
                        size={24}
                        className="h-6 w-6 rounded-lg object-cover"
                        fallbackText={providerName.slice(0, 2).toUpperCase()}
                        fallbackColor={providerColor}
                      />
                    </div>
                    <span className={`absolute -bottom-0.5 -right-0.5 block h-3 w-3 rounded-full ring-2 ring-[rgba(255,248,220,0.95)] dark:!ring-[#111827] ${ok ? "bg-emerald-500" : "bg-red-500"}`} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate font-mono text-[13px] font-semibold text-text-main dark:!text-white" title={r.model}>{r.model}</div>
                        <div className="mt-1 inline-flex max-w-full items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold" style={{ color: providerColor, background: `${providerColor}14`, borderColor: `${providerColor}35` }}>
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: providerColor }} />
                          <span className="truncate">{providerName}</span>
                        </div>
                      </div>
                      <div className="shrink-0 text-right text-[11px] text-text-muted dark:!text-[#CBD5E1]">
                        <TimeAgo timestamp={r.timestamp} />
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
                      <div className="rounded-xl bg-white/55 px-2 py-1.5 dark:!bg-[#0B1220]">
                        <div className="text-text-muted dark:!text-[#94A3B8]">In</div>
                        <div className="font-semibold text-primary dark:!text-[#93C5FD]">{fmt(r.promptTokens)}</div>
                      </div>
                      <div className="rounded-xl bg-white/55 px-2 py-1.5 dark:!bg-[#0B1220]">
                        <div className="text-text-muted dark:!text-[#94A3B8]">Out</div>
                        <div className="font-semibold text-success dark:!text-emerald-400">{fmt(r.completionTokens)}</div>
                      </div>
                      <div className="rounded-xl bg-white/55 px-2 py-1.5 dark:!bg-[#0B1220]">
                        <div className="text-text-muted dark:!text-[#94A3B8]">Total</div>
                        <div className="font-semibold text-text-main dark:!text-white">{fmt(totalTokens)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

const PERIODS = [
  { value: "24h", label: "24h" },
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
  { value: "60d", label: "60D" },
];

export default function UsageStats({ period: periodProp, setPeriod: setPeriodProp, hidePeriodSelector = false } = {}) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [providers, setProviders] = useState([]);
  const [periodLocal, setPeriodLocal] = useState("7d");
  const period = periodProp ?? periodLocal;
  const setPeriod = setPeriodProp ?? setPeriodLocal;

  // Fetch connected providers once, deduplicate by provider type
  // Always include noAuth free providers (e.g. opencode) regardless of connections
  useEffect(() => {
    fetch("/api/providers")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => {
        const seen = new Set();
        const unique = (d?.connections || []).filter((c) => {
          if (c.isActive === false) return false;
          if (!isLLMProvider(c.provider)) return false;
          if (seen.has(c.provider)) return false;
          seen.add(c.provider);
          return true;
        });
        const noAuthProviders = Object.values(FREE_PROVIDERS)
          .filter((p) => p.noAuth && !seen.has(p.id) && isLLMProvider(p.id))
          .map((p) => ({ provider: p.id, name: p.name }));
        setProviders([...unique, ...noAuthProviders]);
      })
      .catch(() => {});
  }, []);

  // Fetch filtered stats via REST when period changes
  useEffect(() => {
    // First load: show full spinner; subsequent: show subtle fetching indicator
    if (!stats) setLoading(true);
    else setFetching(true);

    fetch(`/api/usage/stats?period=${period}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data) setStats((prev) => ({ ...prev, ...data }));
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
        setFetching(false);
      });
  }, [period]); // eslint-disable-line react-hooks/exhaustive-deps

  // SSE connection - real-time updates for activeRequests + recentRequests only
  useEffect(() => {
    const es = new EventSource("/api/usage/stream");

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        // Always merge only real-time fields, never overwrite full stats from REST
        setStats((prev) => ({
          ...(prev || {}),
          activeRequests: data.activeRequests,
          recentRequests: data.recentRequests,
          errorProvider: data.errorProvider,
          pending: data.pending,
        }));
        setLoading(false);
      } catch (err) {
        console.error("[SSE CLIENT] parse error:", err);
      }
    };

    es.onerror = () => setLoading(false);

    return () => es.close();
  }, []);

  if (!stats && !loading) return <div className="text-text-muted">Failed to load usage statistics.</div>;

  const spinner = (
    <div className="flex items-center justify-center py-12 text-text-muted">
      <span className="material-symbols-outlined text-[32px] animate-spin">progress_activity</span>
    </div>
  );

  return (
    <div className="flex min-w-0 flex-col gap-6">
      {/* Period selector (hidden when controlled by parent) */}
      {!hidePeriodSelector && (
        <div className="flex w-full items-center gap-2 sm:w-auto sm:self-end">
          <div className="grid flex-1 grid-cols-4 items-center gap-1 rounded-lg border border-border bg-bg-subtle p-1 sm:flex sm:flex-none">
            {PERIODS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                disabled={fetching}
                className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${period === p.value ? "bg-primary text-white shadow-sm" : "text-text-muted hover:bg-bg-hover hover:text-text"}`}
              >
                {p.label}
              </button>
            ))}
          </div>
          {fetching && (
            <span className="material-symbols-outlined text-[16px] text-text-muted animate-spin">progress_activity</span>
          )}
        </div>
      )}

      {/* Overview cards */}
      {loading ? spinner : <OverviewCards stats={stats} />}

      {/* Provider topology + Recent Requests */}
      {loading ? spinner : (
        <div className="grid min-w-0 grid-cols-1 items-stretch gap-2 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
          <ProviderTopology
            providers={providers}
            activeRequests={stats.activeRequests || []}
            lastProvider={stats.recentRequests?.[0]?.provider || ""}
            errorProvider={stats.errorProvider || ""}
          />
          <RecentRequests requests={stats.recentRequests || []} />
        </div>
      )}

      {/* Token / Cost chart - sync period */}
      {loading ? spinner : <UsageChart period={period} />}

    </div>
  );
}
