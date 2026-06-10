"use client";

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Modal } from "@/shared/components";
import { fetchSuggestedModels } from "@/shared/utils/providerModelsFetcher";

export default function AddCustomModelModal({ isOpen, providerAlias, providerDisplayAlias, modelsFetcher, existingModelIds = [], onSave, onClose }) {
  const [modelId, setModelId] = useState("");
  const [testStatus, setTestStatus] = useState(null); // null | "testing" | "ok" | "error"
  const [testError, setTestError] = useState("");
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncedModels, setSyncedModels] = useState([]);
  const [syncSearch, setSyncSearch] = useState("");
  const [syncError, setSyncError] = useState("");

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) { setModelId(""); setTestStatus(null); setTestError(""); setSyncSearch(""); setSyncError(""); }
  }, [isOpen]);

  // Strip provider's own alias prefix (e.g. "cc/model" -> "model" for cc provider)
  const stripAlias = (id) => {
    const prefix = `${providerAlias}/`;
    return id.startsWith(prefix) ? id.slice(prefix.length) : id;
  };

  const handleTest = async () => {
    const cleanId = stripAlias(modelId.trim());
    if (!cleanId) return;
    setTestStatus("testing");
    setTestError("");
    try {
      const res = await fetch("/api/models/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: `${providerAlias}/${cleanId}` }),
      });
      const data = await res.json();
      setTestStatus(data.ok ? "ok" : "error");
      setTestError(data.error || "");
    } catch (err) {
      setTestStatus("error");
      setTestError(err.message);
    }
  };

  const handleSave = async () => {
    const cleanId = stripAlias(modelId.trim());
    if (!cleanId || saving) return;
    setSaving(true);
    try {
      await onSave(cleanId);
    } finally {
      setSaving(false);
    }
  };

  const handleSyncModels = async () => {
    if (!modelsFetcher || syncing) return;
    setSyncing(true);
    setSyncError("");
    try {
      const models = await fetchSuggestedModels(modelsFetcher);
      setSyncedModels(models);
      if (!models.length) setSyncError("No models returned from /models.");
    } catch (err) {
      setSyncError(err.message || "Failed to sync models");
    } finally {
      setSyncing(false);
    }
  };

  const existingSet = new Set(existingModelIds);
  const filteredSyncedModels = syncedModels
    .filter((model) => model?.id)
    .filter((model) => {
      const q = syncSearch.trim().toLowerCase();
      if (!q) return true;
      return model.id.toLowerCase().includes(q) || (model.name || "").toLowerCase().includes(q);
    });

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleTest();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Custom Model">
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium mb-1.5 block">Model ID</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={modelId}
              onChange={(e) => { setModelId(e.target.value); setTestStatus(null); setTestError(""); }}
              onKeyDown={handleKeyDown}
              placeholder="e.g. claude-opus-4-5"
              className="flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:border-primary"
              autoFocus
            />
            <Button
              variant="secondary"
              icon="science"
              loading={testStatus === "testing"}
              onClick={handleTest}
              disabled={!modelId.trim() || testStatus === "testing"}
            >
              {testStatus === "testing" ? "Testing..." : "Test"}
            </Button>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Sent to provider as: <code className="font-mono bg-sidebar px-1 rounded">{stripAlias(modelId.trim()) || "model-id"}</code>
          </p>
        </div>

        {modelsFetcher && (
          <div className="rounded-xl border border-border bg-sidebar/30 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-medium">Sync from /models</p>
                <p className="text-xs text-text-muted">Fetch models from provider base URL, then add from the list.</p>
              </div>
              <Button
                size="sm"
                variant="secondary"
                icon="sync"
                loading={syncing}
                onClick={handleSyncModels}
                disabled={syncing}
              >
                {syncing ? "Syncing..." : syncedModels.length ? "Refresh" : "Sync"}
              </Button>
            </div>

            {(syncedModels.length > 0 || syncError) && (
              <div className="mt-3 flex flex-col gap-2">
                {syncedModels.length > 0 && (
                  <input
                    type="text"
                    value={syncSearch}
                    onChange={(e) => setSyncSearch(e.target.value)}
                    placeholder="Search synced models..."
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:border-primary"
                  />
                )}
                {syncError && (
                  <p className="text-xs text-red-500">{syncError}</p>
                )}
                {filteredSyncedModels.length > 0 && (
                  <div className="max-h-56 overflow-y-auto rounded-lg border border-border bg-background">
                    {filteredSyncedModels.map((model) => {
                      const added = existingSet.has(model.id);
                      return (
                        <button
                          key={model.id}
                          type="button"
                          onClick={() => { if (!added) setModelId(model.id); }}
                          className="flex w-full items-center gap-3 border-b border-border/60 px-3 py-2 text-left last:border-b-0 hover:bg-sidebar/60 disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={added}
                        >
                          <span className="material-symbols-outlined text-base text-text-muted">{added ? "check_circle" : "add_circle"}</span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium">{model.id}</span>
                            {model.name && model.name !== model.id && (
                              <span className="block truncate text-xs text-text-muted">{model.name}</span>
                            )}
                          </span>
                          <span className="text-xs text-text-muted">{added ? "Added" : "Select"}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
                {syncedModels.length > 0 && filteredSyncedModels.length === 0 && (
                  <p className="text-xs text-text-muted">No models match search.</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Test result */}
        {testStatus === "ok" && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <span className="material-symbols-outlined text-base">check_circle</span>
            Model is reachable
          </div>
        )}
        {testStatus === "error" && (
          <div className="flex items-start gap-2 text-sm text-red-500">
            <span className="material-symbols-outlined text-base shrink-0">cancel</span>
            <span>{testError || "Model not reachable"}</span>
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <Button onClick={onClose} variant="ghost" fullWidth size="sm">Cancel</Button>
          <Button
            onClick={handleSave}
            fullWidth
            size="sm"
            disabled={!modelId.trim() || saving}
          >
            {saving ? "Adding..." : "Add Model"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

AddCustomModelModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  providerAlias: PropTypes.string.isRequired,
  providerDisplayAlias: PropTypes.string.isRequired,
  modelsFetcher: PropTypes.shape({ url: PropTypes.string, type: PropTypes.string }),
  existingModelIds: PropTypes.arrayOf(PropTypes.string),
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
