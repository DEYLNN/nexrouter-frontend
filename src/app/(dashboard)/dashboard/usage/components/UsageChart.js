"use client";

import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import Card from "@/shared/components/Card";

const fmtTokens = (n) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n || 0);
};

const fmtCost = (n) => `$${(n || 0).toFixed(4)}`;

function ChartTooltip({ active, payload, label, viewMode }) {
  if (!active || !payload?.length) return null;
  const value = payload[0]?.value || 0;
  return (
    <div
      style={{
        minWidth: 142,
        padding: "10px 12px",
        borderRadius: 14,
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: "1px solid rgba(17,24,39,0.08)",
        boxShadow: "0 16px 38px -24px rgba(17,24,39,0.35)",
      }}
    >
      <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: 8, height: 8, borderRadius: 999, background: "linear-gradient(135deg,#4F7CFF,#8B5CF6)", boxShadow: "0 0 0 5px rgba(79,124,255,0.12)" }} />
        <span style={{ fontSize: 15, fontWeight: 700, color: "#111827", letterSpacing: "-0.02em" }}>
          {viewMode === "tokens" ? fmtTokens(value) : fmtCost(value)}
        </span>
      </div>
      <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 3 }}>
        {viewMode === "tokens" ? "Total tokens" : "Estimated cost"}
      </div>
    </div>
  );
}

ChartTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  viewMode: PropTypes.string,
};

export default function UsageChart({ period = "7d" }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("tokens");
  const [activeLabel, setActiveLabel] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/usage/chart?period=${period}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error("Failed to fetch chart data:", e);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const hasData = data.some((d) => d.tokens > 0 || d.cost > 0);
  const key = viewMode === "tokens" ? "tokens" : "cost";
  const formatter = viewMode === "tokens" ? fmtTokens : fmtCost;

  return (
    <Card className="relative flex min-w-0 flex-col gap-3 overflow-hidden p-3 sm:p-4">
      <div className="pointer-events-none absolute inset-x-8 top-4 h-24 rounded-full bg-[radial-gradient(circle,rgba(79,124,255,0.12),transparent_68%)] blur-2xl" />
      <div className="relative z-10 flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-medium uppercase tracking-[0.16em] text-text-muted">Usage trend</div>
          <div className="text-sm font-semibold text-text-main">Tokens & spend</div>
        </div>
        <div className="grid grid-cols-2 items-center gap-1 rounded-xl border border-[rgba(17,24,39,0.06)] bg-white/55 p-1 shadow-[0_8px_22px_-20px_rgba(17,24,39,0.3)] backdrop-blur-sm">
          {[
            ["tokens", "Tokens"],
            ["cost", "Cost"],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setViewMode(value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${viewMode === value ? "bg-gradient-to-r from-[#4F7CFF] to-[#8B5CF6] text-white shadow-[0_8px_18px_-12px_rgba(79,124,255,0.9)]" : "text-text-muted hover:bg-[rgba(79,124,255,0.06)] hover:text-text-main"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="relative z-10 flex h-52 items-center justify-center text-sm text-text-muted">Loading...</div>
      ) : !hasData ? (
        <div className="relative z-10 flex h-52 items-center justify-center text-sm text-text-muted">No data for this period</div>
      ) : (
        <div className="relative z-10 h-[250px] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 12, right: 14, left: 0, bottom: 0 }}
              onMouseMove={(state) => setActiveLabel(state?.activeLabel || null)}
              onMouseLeave={() => setActiveLabel(null)}
            >
              <defs>
                <linearGradient id="usageStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#4F7CFF" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
                <linearGradient id="usageFillPrimary" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4F7CFF" stopOpacity={0.28} />
                  <stop offset="45%" stopColor="#8B5CF6" stopOpacity={0.16} />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="usageFillSoft" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#4F7CFF" stopOpacity={0} />
                </linearGradient>
                <filter id="usageGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.31 0 0 0 0 0.49 0 0 0 0 1 0 0 0 0.35 0" />
                  <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <CartesianGrid vertical={false} stroke="rgba(0,0,0,0.05)" strokeDasharray="3 6" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#6B7280" }} tickLine={false} axisLine={false} interval="preserveStartEnd" dy={8} />
              <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} tickLine={false} axisLine={false} tickFormatter={formatter} width={54} />
              {activeLabel && <ReferenceLine x={activeLabel} stroke="rgba(79,124,255,0.22)" strokeWidth={1.2} strokeDasharray="4 4" ifOverflow="extendDomain" />}
              <Tooltip cursor={false} content={<ChartTooltip viewMode={viewMode} />} />
              <Area type="monotone" dataKey={key} stroke="none" fill="url(#usageFillSoft)" fillOpacity={1} dot={false} activeDot={false} isAnimationActive animationDuration={900} />
              <Area
                type="monotone"
                dataKey={key}
                stroke="url(#usageStroke)"
                strokeWidth={2.5}
                fill="url(#usageFillPrimary)"
                dot={false}
                activeDot={{ r: 5.5, stroke: "#fff", strokeWidth: 2.5, fill: "#4F7CFF", filter: "url(#usageGlow)" }}
                isAnimationActive
                animationDuration={950}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}

UsageChart.propTypes = {
  period: PropTypes.string,
};
