"use client";

import { useEffect, useMemo, useState } from "react";
import ProviderIcon from "@/shared/components/ProviderIcon";
import { Button, Card, Input } from "@/shared/components";

const SORTERS = {
  priority: (a, b) => a.priority - b.priority,
  provider: (a, b) => a.providerLabel.localeCompare(b.providerLabel),
  updated: (a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0),
  status: (a, b) => String(a.testStatus).localeCompare(String(b.testStatus)),
};

function fmtDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString();
}

function fmtDuration(seconds) {
  if (seconds == null) return "-";
  if (seconds <= 0) return "Expired";
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  if (days > 0) return `${days}d ${hours}h left`;
  return `${hours}h left`;
}

function badgeClass(type) {
  if (type === "bad") return "bg-red-500/15 text-red-500";
  if (type === "warn") return "bg-amber-500/15 text-amber-500";
  return "bg-emerald-500/15 text-emerald-500";
}

function planBadgeClass(planType) {
  const plan = String(planType || "").toLowerCase();
  if (plan === "team") return "bg-sky-500/20 text-sky-400 ring-1 ring-sky-500/30";
  if (plan === "plus") return "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30";
  if (plan === "pro") return "bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30";
  if (plan === "enterprise") return "bg-fuchsia-500/20 text-fuchsia-400 ring-1 ring-fuchsia-500/30";
  return "bg-primary/15 text-primary";
}

async function copyText(value) {
  if (!value) return;
  if (navigator.clipboard?.writeText && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  const ok = document.execCommand("copy");
  textarea.remove();
  if (!ok) throw new Error("Copy failed");
}

function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export default function AuthFilesPage() {
  const [payload, setPayload] = useState({ files: [], total: 0, dataPath: "" });
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [providerType, setProviderType] = useState("all");
  const [sort, setSort] = useState("priority");
  const [onlyProblem, setOnlyProblem] = useState(false);
  const [onlyDisabled, setOnlyDisabled] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);
  const [refreshingId, setRefreshingId] = useState(null);
  const [refreshMessage, setRefreshMessage] = useState({ fileId: null, type: null, text: "" });
  const [importing, setImporting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [importMessage, setImportMessage] = useState(null);
  const [providerDropdownOpen, setProviderDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const handleCopy = async (key, value) => {
    try {
      await copyText(value);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey((current) => current === key ? null : current), 1500);
    } catch (error) {
      setCopiedKey(`${key}:error`);
      setTimeout(() => setCopiedKey((current) => current === `${key}:error` ? null : current), 1800);
    }
  };

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth-files", { cache: "no-store" });
      const data = await res.json();
      setPayload(data);
    } finally {
      setLoading(false);
    }
  };

  const refreshCodexAccessToken = async (file) => {
    setRefreshingId(file.id);
    setRefreshMessage({ fileId: null, type: null, text: "" });
    try {
      const res = await fetch("/api/auth-files/refresh-codex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: file.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to refresh access token");
      setRefreshMessage({ fileId: file.id, type: "ok", text: `Access token refreshed. Expires at ${fmtDate(data.expiresAt)}` });
      await load();
    } catch (error) {
      setRefreshMessage({ fileId: file.id, type: "bad", text: error.message });
    } finally {
      setRefreshingId(null);
    }
  };

  const importAuthFiles = async (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (!selectedFiles.length) return;

    setImporting(true);
    setImportMessage(null);
    try {
      const parsed = await Promise.all(selectedFiles.map(async (file) => JSON.parse(await file.text())));
      const files = parsed.flatMap((item) => Array.isArray(item) ? item : Array.isArray(item?.files) ? item.files : [item]);
      const res = await fetch("/api/auth-files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to import auth files");
      setImportMessage({ type: "ok", text: `Imported ${data.imported} auth file(s)` });
      await load();
    } catch (error) {
      setImportMessage({ type: "bad", text: error.message });
    } finally {
      setImporting(false);
      event.target.value = "";
    }
  };

  const deleteProviderAccount = async (id) => {
    const res = await fetch(`/api/providers/${encodeURIComponent(id)}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Failed to delete account");
    return data;
  };

  const deleteAuthFile = async (file) => {
    const label = file.email || file.name || file.filename || file.id;
    const ok = window.confirm(`Delete ${label}?\n\nThis removes the provider account/credential from the database. This cannot be undone.`);
    if (!ok) return;

    setDeletingId(file.id);
    setDeleteMessage(null);
    try {
      await deleteProviderAccount(file.id);
      setSelectedIds((current) => { const next = new Set(current); next.delete(file.id); return next; });
      setDeleteMessage({ type: "ok", text: `Deleted ${label}` });
      await load();
    } catch (error) {
      setDeleteMessage({ type: "bad", text: error.message || "Failed to delete account" });
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => { load(); }, []);

  const providerTypes = useMemo(() => {
    const counts = new Map();
    payload.files.forEach((file) => {
      const current = counts.get(file.provider) || { id: file.provider, label: file.providerLabel, count: 0 };
      current.count += 1;
      counts.set(file.provider, current);
    });
    return Array.from(counts.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [payload.files]);

  const selectedProvider = providerType === "all"
    ? { id: "all", label: "All provider types", count: payload.total }
    : providerTypes.find((item) => item.id === providerType) || { id: providerType, label: providerType, count: 0 };

  const sortLabels = { priority: "Priority", provider: "Provider", updated: "Last updated", status: "Status" };

  const files = useMemo(() => {
    const needle = query.trim().toLowerCase().replaceAll("*", "");
    return payload.files
      .filter((file) => providerType === "all" || file.provider === providerType)
      .filter((file) => !onlyProblem || file.problem)
      .filter((file) => !onlyDisabled || !file.isActive)
      .filter((file) => !needle || [file.filename, file.providerLabel, file.provider, file.name, file.authType].some((value) => String(value || "").toLowerCase().includes(needle)))
      .sort(SORTERS[sort] || SORTERS.priority);
  }, [payload.files, query, providerType, sort, onlyProblem, onlyDisabled]);

  const problemCount = payload.files.filter((file) => file.problem).length;
  const disabledCount = payload.files.filter((file) => !file.isActive).length;
  const visibleIds = useMemo(() => files.map((file) => file.id), [files]);
  const selectedVisibleCount = useMemo(() => visibleIds.filter((id) => selectedIds.has(id)).length, [visibleIds, selectedIds]);
  const selectedFiles = useMemo(() => payload.files.filter((file) => selectedIds.has(file.id)), [payload.files, selectedIds]);

  const toggleSelected = (id) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const selectVisible = () => {
    setSelectedIds((current) => {
      const next = new Set(current);
      visibleIds.forEach((id) => next.add(id));
      return next;
    });
  };

  const clearVisibleSelection = () => {
    setSelectedIds((current) => {
      const next = new Set(current);
      visibleIds.forEach((id) => next.delete(id));
      return next;
    });
  };

  const deleteSelected = async () => {
    if (!selectedFiles.length) return;
    const ok = window.confirm(`Delete ${selectedFiles.length} selected account(s)?\n\nBackup/export first if needed. This removes selected provider credentials from the database.`);
    if (!ok) return;

    setBulkDeleting(true);
    setDeleteMessage(null);
    const failed = [];
    let deleted = 0;
    try {
      for (const file of selectedFiles) {
        try {
          await deleteProviderAccount(file.id);
          deleted += 1;
        } catch (error) {
          failed.push(`${file.email || file.name || file.filename || file.id}: ${error.message || "failed"}`);
        }
      }
      setSelectedIds((current) => {
        const next = new Set(current);
        selectedFiles.forEach((file) => { if (!failed.some((item) => item.startsWith(file.email || file.name || file.filename || file.id))) next.delete(file.id); });
        return next;
      });
      setDeleteMessage({
        type: failed.length ? "bad" : "ok",
        text: failed.length ? `Deleted ${deleted}, failed ${failed.length}: ${failed.slice(0, 3).join(" | ")}${failed.length > 3 ? " ..." : ""}` : `Deleted ${deleted} selected account(s)`,
      });
      await load();
    } finally {
      setBulkDeleting(false);
    }
  };


  return (
    <div className="space-y-5">
      <Card className="p-5 bg-gradient-to-br from-sidebar to-bg border-border dark:!bg-[#0B1220] dark:!border-[#334155] dark:!shadow-none dark:!backdrop-blur-0">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">vpn_key</span>
              <h2 className="text-xl font-semibold text-text-main dark:!text-white">Auth Files</h2>
              <span className="rounded-full bg-sidebar px-2 py-0.5 text-xs text-text-muted dark:!bg-[#111827] dark:!text-[#CBD5E1]">{payload.total}</span>
            </div>
            <p className="mt-1 text-sm text-text-muted dark:!text-[#E5E7EB]">Map provider accounts from the local database with secrets safely masked.</p>
            <code className="mt-3 block truncate rounded-lg bg-bg px-3 py-2 text-xs text-text-muted dark:!bg-[#111827] dark:!text-[#CBD5E1]">{payload.dataPath || "Loading data path..."}</code>
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-sidebar px-4 text-sm font-medium text-text-main transition hover:border-primary/50 disabled:opacity-50 dark:!bg-[#111827] dark:!border-[#334155] dark:!text-white dark:hover:!border-[#64748B]">
              <span className="material-symbols-outlined text-[18px]">upload_file</span>
              {importing ? "Importing..." : "Upload JSON"}
              <input type="file" accept="application/json,.json" multiple className="hidden" onChange={importAuthFiles} disabled={importing} />
            </label>
            <Button variant="secondary" icon="refresh" onClick={load} loading={loading}>Refresh</Button>
          </div>
        </div>
        {importMessage && <p className={`mt-3 rounded-lg p-2 text-xs ${importMessage.type === "ok" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}>{importMessage.text}</p>}
        {deleteMessage && <p className={`mt-3 rounded-lg p-2 text-xs ${deleteMessage.type === "ok" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}>{deleteMessage.text}</p>}
      </Card>

      <Card className="p-4 dark:!bg-[#0B1220] dark:!border-[#334155] dark:!shadow-none dark:!backdrop-blur-0">
        <div className="grid gap-3 lg:grid-cols-[1fr_260px_190px]">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter by name, type, provider. Use * as wildcard" />

          <div className="relative">
            <button
              type="button"
              onClick={() => setProviderDropdownOpen((v) => !v)}
              className="flex h-10 w-full items-center justify-between gap-3 rounded-xl border border-border bg-surface px-3 text-left text-sm text-text-main transition-colors hover:border-primary/40 hover:bg-primary/5 dark:!bg-[#111827] dark:!border-[#334155] dark:!text-white dark:hover:!border-[#64748B] dark:hover:!bg-[#1E293B]"
            >
              <span className="flex min-w-0 items-center gap-2">
                {selectedProvider.id === "all" ? (
                  <span className="material-symbols-outlined text-[18px] text-text-muted dark:!text-[#CBD5E1]">apps</span>
                ) : (
                  <ProviderIcon src={`/providers/${selectedProvider.id}.png`} alt={selectedProvider.label} size={20} className="size-5 rounded object-contain" fallbackText={selectedProvider.label.slice(0, 2).toUpperCase()} />
                )}
                <span className="truncate">{selectedProvider.label}</span>
                <span className="rounded-full bg-sidebar px-1.5 py-0.5 text-[10px] text-text-muted dark:!bg-[#0B1220] dark:!text-[#CBD5E1]">{selectedProvider.count}</span>
              </span>
              <span className="material-symbols-outlined text-[18px] text-text-muted dark:!text-[#CBD5E1]">expand_more</span>
            </button>
            {providerDropdownOpen && (
              <>
                <button type="button" className="fixed inset-0 z-30 bg-transparent" onClick={() => setProviderDropdownOpen(false)} aria-label="Close provider filter" />
                <div className="absolute left-0 right-0 z-40 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-border bg-surface/95 p-1.5 shadow-xl shadow-black/10 backdrop-blur dark:!bg-[#0B1220] dark:!border-[#334155] dark:!shadow-black/40">
                  {[{ id: "all", label: "All provider types", count: payload.total }, ...providerTypes].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => { setProviderType(item.id); setProviderDropdownOpen(false); }}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${providerType === item.id ? "bg-primary/10 text-primary" : "text-text-main hover:bg-primary/5 dark:!text-white dark:hover:!bg-[#1E293B]"}`}
                    >
                      {item.id === "all" ? (
                        <span className="material-symbols-outlined text-[20px]">apps</span>
                      ) : (
                        <ProviderIcon src={`/providers/${item.id}.png`} alt={item.label} size={22} className="size-[22px] rounded object-contain" fallbackText={item.label.slice(0, 2).toUpperCase()} />
                      )}
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                      <span className="rounded-full bg-sidebar px-1.5 py-0.5 text-[10px] text-text-muted dark:!bg-[#0B1220] dark:!text-[#CBD5E1]">{item.count}</span>
                      {providerType === item.id && <span className="material-symbols-outlined text-[18px]">check</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setSortDropdownOpen((v) => !v)}
              className="flex h-10 w-full items-center justify-between gap-3 rounded-xl border border-border bg-surface px-3 text-sm text-text-main transition-colors hover:border-primary/40 hover:bg-primary/5"
            >
              <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[18px] text-text-muted dark:!text-[#CBD5E1]">sort</span>{sortLabels[sort]}</span>
              <span className="material-symbols-outlined text-[18px] text-text-muted dark:!text-[#CBD5E1]">expand_more</span>
            </button>
            {sortDropdownOpen && (
              <>
                <button type="button" className="fixed inset-0 z-30 bg-transparent" onClick={() => setSortDropdownOpen(false)} aria-label="Close sort filter" />
                <div className="absolute left-0 right-0 z-40 mt-2 rounded-2xl border border-border bg-surface/95 p-1.5 shadow-xl shadow-black/10 backdrop-blur dark:!bg-[#0B1220] dark:!border-[#334155] dark:!shadow-black/40">
                  {Object.entries(sortLabels).map(([key, label]) => (
                    <button key={key} type="button" onClick={() => { setSort(key); setSortDropdownOpen(false); }} className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${sort === key ? "bg-primary/10 text-primary" : "text-text-main hover:bg-primary/5 dark:!text-white dark:hover:!bg-[#1E293B]"}`}>
                      {label}
                      {sort === key && <span className="material-symbols-outlined text-[18px]">check</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <button onClick={() => setOnlyProblem((v) => !v)} className={`rounded-full px-3 py-1 ${onlyProblem ? "bg-red-500 text-white" : "bg-sidebar text-text-muted dark:!bg-[#111827] dark:!text-[#CBD5E1]"}`}>Problematic {problemCount}</button>
          <button onClick={() => setOnlyDisabled((v) => !v)} className={`rounded-full px-3 py-1 ${onlyDisabled ? "bg-amber-500 text-white" : "bg-sidebar text-text-muted dark:!bg-[#111827] dark:!text-[#CBD5E1]"}`}>Disabled {disabledCount}</button>
          <span className="mx-1 h-5 w-px bg-border" />
          <button onClick={selectVisible} disabled={!visibleIds.length || bulkDeleting} className="rounded-full bg-sidebar px-3 py-1 text-text-muted disabled:opacity-50 dark:!bg-[#111827] dark:!text-[#CBD5E1]">Select visible {files.length}</button>
          <button onClick={clearVisibleSelection} disabled={!selectedVisibleCount || bulkDeleting} className="rounded-full bg-sidebar px-3 py-1 text-text-muted disabled:opacity-50 dark:!bg-[#111827] dark:!text-[#CBD5E1]">Clear visible {selectedVisibleCount}</button>
          <button onClick={deleteSelected} disabled={!selectedFiles.length || bulkDeleting} className="rounded-full bg-red-500 px-3 py-1 font-semibold text-white disabled:opacity-50">{bulkDeleting ? "Deleting..." : `Delete selected ${selectedFiles.length}`}</button>
        </div>
      </Card>

      <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {files.map((file) => (
          <Card key={file.id} className="min-w-0 overflow-hidden p-3 sm:p-4 dark:!bg-[#0B1220] dark:!border-[#334155] dark:!shadow-none dark:!backdrop-blur-0">
            <div className="flex min-w-0 items-start gap-3">
              <label className="mt-2 flex shrink-0 cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={selectedIds.has(file.id)}
                  onChange={() => toggleSelected(file.id)}
                  className="size-4 accent-primary"
                  aria-label={`Select ${file.filename}`}
                />
              </label>
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary sm:size-11">
                <span className="material-symbols-outlined">key</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="max-w-full truncate rounded bg-sidebar px-2 py-0.5 text-[10px] font-semibold text-text-muted dark:!bg-[#111827] dark:!text-[#CBD5E1]">{file.providerLabel}</span>
                  <span className={`rounded px-2 py-0.5 text-[10px] font-semibold ${badgeClass(file.isActive ? "ok" : "warn")}`}>{file.isActive ? "Enabled" : "Disabled"}</span>
                  {file.problem && <span className="rounded bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold text-red-500">{file.problem}</span>}
                </div>
                <h3 className="mt-2 break-all text-sm font-semibold text-text-main sm:truncate sm:text-base dark:!text-white" title={file.filename}>{file.filename}</h3>
                <p className="text-xs text-text-muted dark:!text-[#CBD5E1]">{file.authType} / priority {file.priority} / {file.secretCount} secret fields</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 text-xs text-text-muted sm:grid-cols-2 dark:!text-[#CBD5E1]">
              <div className="min-w-0">Updated<br /><span className="break-words text-text-main dark:!text-white">{fmtDate(file.updatedAt)}</span></div>
              <div className="min-w-0">Status<br /><span className="break-words text-text-main dark:!text-white">{file.testStatus}</span></div>
            </div>

            {file.jwtMeta && (
              <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs dark:!bg-[#111827] dark:!border-[#334155]">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="font-semibold text-text-main dark:!text-white">Access token profile</span>
                  {file.jwtMeta.planType && <span className={`rounded-full px-2 py-0.5 font-semibold ${planBadgeClass(file.jwtMeta.planType)}`}>{file.jwtMeta.planType}</span>}
                </div>
                <div className="grid gap-2 text-text-muted dark:!text-[#CBD5E1]">
                  <div>Email<br /><span className="break-all text-text-main">{file.jwtMeta.email || "-"}</span></div>
                  <div>Subject<br /><span className="break-all font-mono text-text-main">{file.jwtMeta.subject || "-"}</span></div>
                  <div>Token expires<br /><span className={file.jwtMeta.isExpired ? "text-red-500" : "text-text-main"}>{fmtDate(file.jwtMeta.expiresAt)} ({fmtDuration(file.jwtMeta.expiresInSeconds)})</span></div>
                  <div>User ID<br /><span className="break-all font-mono text-text-main">{file.jwtMeta.userId || "-"}</span></div>
                </div>
                <Button
                  variant="secondary"
                  icon="refresh"
                  className="mt-3 w-full justify-center"
                  loading={refreshingId === file.id}
                  onClick={() => refreshCodexAccessToken(file)}
                >
                  Refresh access token
                </Button>
              </div>
            )}

            {refreshMessage.fileId === file.id && (
              <p className={`mt-3 rounded-lg p-2 text-xs ${refreshMessage.type === "ok" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}>{refreshMessage.text}</p>
            )}

            <div className="mt-4 space-y-2">
              {file.secrets.length ? file.secrets.map((secret) => (
                <div key={secret.field} className="flex min-w-0 flex-col gap-2 rounded-lg bg-sidebar px-3 py-2 text-xs sm:flex-row sm:items-center sm:justify-between dark:!bg-[#111827]">
                  <span className="font-mono text-text-main dark:!text-white">{secret.field}</span>
                  <div className="flex min-w-0 items-center gap-2 sm:justify-end">
                    <span className="min-w-0 flex-1 break-all font-mono text-text-muted sm:text-right dark:!text-[#CBD5E1]">{secret.preview} / {secret.length} chars</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(`${file.id}:${secret.field}`, secret.value)}
                      className="flex size-7 shrink-0 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-bg hover:text-primary dark:!text-[#CBD5E1] dark:hover:!bg-[#1E293B]"
                      title={`Copy ${secret.field}`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {copiedKey === `${file.id}:${secret.field}:error` ? "error" : copiedKey === `${file.id}:${secret.field}` ? "check" : "content_copy"}
                      </span>
                    </button>
                  </div>
                </div>
              )) : <div className="rounded-lg bg-sidebar px-3 py-2 text-xs text-text-muted dark:!bg-[#111827] dark:!text-[#CBD5E1]">No secret fields detected</div>}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => downloadJson(file.filename, file.exportJson)}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-text-muted transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary dark:!border-[#334155] dark:!text-[#CBD5E1] dark:hover:!border-[#64748B] dark:hover:!bg-[#1E293B] dark:hover:!text-white"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                Download JSON
              </button>
              <button
                type="button"
                onClick={() => deleteAuthFile(file)}
                disabled={deletingId === file.id}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/25 px-3 py-2 text-xs font-semibold text-red-400 transition-colors hover:border-red-500/50 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-[16px]">{deletingId === file.id ? "hourglass_empty" : "delete"}</span>
                {deletingId === file.id ? "Deleting..." : "Delete account"}
              </button>
            </div>

            {file.lastError && <p className="mt-3 line-clamp-2 rounded-lg bg-red-500/10 p-2 text-xs text-red-500">{file.lastError}</p>}
          </Card>
        ))}
      </div>

      {!loading && files.length === 0 && <Card className="p-8 text-center text-text-muted">No auth files match your filter.</Card>}
    </div>
  );
}