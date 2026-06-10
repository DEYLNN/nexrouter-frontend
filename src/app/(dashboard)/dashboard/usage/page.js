"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { UsageStats, RequestLogger, CardSkeleton, SegmentedControl } from "@/shared/components";
import RequestLogsTable from "./components/RequestLogsTable";

const PERIODS = [
  { value: "24h", label: "24h" },
  { value: "7d", label: "7D" },
  { value: "14d", label: "14D" },
  { value: "30d", label: "30D" },
];

export default function UsagePage() {
  return (
    <Suspense fallback={<CardSkeleton />}>
      <UsageContent />
    </Suspense>
  );
}

function UsageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [tabLoading, setTabLoading] = useState(false);
  const [period, setPeriod] = useState("7d");
  const [clearOpen, setClearOpen] = useState(false);
  const [clearScope, setClearScope] = useState("all");
  const [clearBusy, setClearBusy] = useState(false);
  const [clearResult, setClearResult] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const tabFromUrl = searchParams.get("tab");
  const activeTab = tabFromUrl && ["overview", "logs"].includes(tabFromUrl)
    ? tabFromUrl
    : "overview";

  const handleTabChange = (value) => {
    if (value === activeTab) return;
    setTabLoading(true);
    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    router.push(`/dashboard/usage?${params.toString()}`, { scroll: false });
    setTimeout(() => setTabLoading(false), 300);
  };

  const handleClearUsage = async () => {
    setClearBusy(true);
    setClearResult(null);
    try {
      const res = await fetch("/api/usage/clear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope: clearScope, vacuum: true, confirm: "CLEAR_USAGE_DATA" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.ok === false) throw new Error(data.error || "Failed to clear usage data");
      setClearResult(data);
      setRefreshKey((n) => n + 1);
    } catch (error) {
      setClearResult({ ok: false, error: error.message });
    } finally {
      setClearBusy(false);
    }
  };

  return (
    <div className="flex min-w-0 flex-col gap-6 px-1 sm:px-0">
      {/* Tabs + period selector on same row */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <SegmentedControl
          options={[
            { value: "overview", label: "Overview" },
            { value: "logs", label: "Logs" },
          ]}
          value={activeTab}
          onChange={handleTabChange}
          className="w-full sm:w-auto"
        />
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          {activeTab === "overview" && (
            <SegmentedControl
              options={PERIODS}
              value={period}
              onChange={setPeriod}
              size="sm"
              className="w-full sm:w-auto"
            />
          )}
          <button
            type="button"
            onClick={() => { setClearOpen(true); setClearResult(null); }}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-red-200/70 bg-red-50 px-3 text-xs font-semibold text-red-600 transition-colors hover:border-red-300 hover:bg-red-100 dark:!border-red-900/60 dark:!bg-red-950/30 dark:!text-red-300 dark:hover:!bg-red-950/50"
          >
            <span className="material-symbols-outlined text-[17px]">delete_sweep</span>
            Clear usage
          </button>
        </div>
      </div>

      {tabLoading ? (
        <CardSkeleton />
      ) : (
        <>
          {activeTab === "overview" && (
            <Suspense fallback={<CardSkeleton />}>
              <UsageStats key={refreshKey} period={period} setPeriod={setPeriod} hidePeriodSelector />
            </Suspense>
          )}
          {activeTab === "logs" && (
            <Suspense fallback={<CardSkeleton />}>
              <RequestLogsTable key={refreshKey} />
            </Suspense>
          )}
        </>
      )}


      {clearOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-border bg-bg p-5 shadow-2xl dark:!border-[#334155] dark:!bg-[#0B1220]">
            <div className="flex items-start gap-3">
              <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-red-100 text-red-600 dark:!bg-red-950/50 dark:!text-red-300">
                <span className="material-symbols-outlined text-[22px]">warning</span>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold text-text-main dark:!text-white">Clear usage data?</h2>
                <p className="mt-1 text-sm text-text-muted dark:!text-[#CBD5E1]">Deletes selected usage rows, then runs SQLite VACUUM to shrink the DB file.</p>
              </div>
            </div>

            <div className="mt-4 grid gap-2">
              {[
                { value: "all", label: "All usage data", desc: "Usage history, daily summaries, request details" },
                { value: "usage", label: "Usage stats only", desc: "Usage history + daily summaries" },
                { value: "details", label: "Request details only", desc: "Observability request/response details" },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setClearScope(item.value)}
                  className={`rounded-2xl border p-3 text-left transition-colors ${clearScope === item.value ? "border-red-300 bg-red-50 text-red-700 dark:!border-red-800 dark:!bg-red-950/30 dark:!text-red-200" : "border-border bg-bg-subtle text-text-main hover:bg-bg-hover dark:!border-[#334155] dark:!bg-[#111827] dark:!text-white"}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold">{item.label}</span>
                    {clearScope === item.value && <span className="material-symbols-outlined text-[18px]">check_circle</span>}
                  </div>
                  <div className="mt-0.5 text-xs text-text-muted dark:!text-[#CBD5E1]">{item.desc}</div>
                </button>
              ))}
            </div>

            {clearResult && (
              <div className={`mt-4 rounded-2xl border p-3 text-xs ${clearResult.ok === false ? "border-red-200 bg-red-50 text-red-700 dark:!border-red-900 dark:!bg-red-950/30 dark:!text-red-200" : "border-green-200 bg-green-50 text-green-700 dark:!border-green-900 dark:!bg-green-950/30 dark:!text-green-200"}`}>
                {clearResult.ok === false ? clearResult.error : `Cleared: ${clearResult.deleted?.usageHistory || 0} history, ${clearResult.deleted?.usageDaily || 0} daily, ${clearResult.deleted?.requestDetails || 0} details.`}
              </div>
            )}

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setClearOpen(false)}
                disabled={clearBusy}
                className="h-10 rounded-xl border border-border px-4 text-sm font-semibold text-text-muted transition-colors hover:bg-bg-hover disabled:opacity-60 dark:!border-[#334155] dark:!text-[#CBD5E1]"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleClearUsage}
                disabled={clearBusy}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {clearBusy && <span className="material-symbols-outlined text-[17px] animate-spin">progress_activity</span>}
                Confirm clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
