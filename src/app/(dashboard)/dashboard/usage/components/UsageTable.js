"use client";

import { useState, useEffect, useCallback, useMemo, Fragment } from "react";
import PropTypes from "prop-types";
import Card from "@/shared/components/Card";
import Badge from "@/shared/components/Badge";
import ProviderIcon from "@/shared/components/ProviderIcon";
import { providerDisplayColor, providerDisplayName, providerIconPath } from "@/shared/utils/providerIcon";

const fmt = (n) => new Intl.NumberFormat().format(n || 0);
const fmtCost = (n) => `$${(n || 0).toFixed(2)}`;

function fmtTime(iso) {
  if (!iso) return "Never";
  const diffMins = Math.floor((Date.now() - new Date(iso)) / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
  return new Date(iso).toLocaleDateString();
}

function SortIcon({ field, currentSort, currentOrder }) {
  if (currentSort !== field) return <span className="ml-1 text-[11px] opacity-35">↕</span>;
  return <span className="ml-1 text-[11px] text-[#4F7CFF]">{currentOrder === "asc" ? "↑" : "↓"}</span>;
}

SortIcon.propTypes = {
  field: PropTypes.string.isRequired,
  currentSort: PropTypes.string.isRequired,
  currentOrder: PropTypes.string.isRequired,
};

/**
 * Render 3 token or cost cells based on viewMode
 */
function ValueCells({ item, viewMode, isSummary = false }) {
  const cellClass = "px-4 py-3.5 text-right font-mono text-[12px] whitespace-nowrap";
  if (viewMode === "tokens") {
    return (
      <>
        <td className={`${cellClass} text-text-muted dark:!text-[#CBD5E1]`}>{isSummary && item.promptTokens === undefined ? "—" : fmt(item.promptTokens)}</td>
        <td className={`${cellClass} text-text-muted dark:!text-[#CBD5E1]`}>{isSummary && item.completionTokens === undefined ? "—" : fmt(item.completionTokens)}</td>
        <td className={`${cellClass} font-semibold text-text-main dark:!text-white`}>{fmt(item.totalTokens)}</td>
      </>
    );
  }
  return (
    <>
      <td className={`${cellClass} text-text-muted dark:!text-[#CBD5E1]`}>{isSummary && item.inputCost === undefined ? "—" : fmtCost(item.inputCost)}</td>
      <td className={`${cellClass} text-text-muted dark:!text-[#CBD5E1]`}>{isSummary && item.outputCost === undefined ? "—" : fmtCost(item.outputCost)}</td>
      <td className={`${cellClass} font-semibold text-[#F59E0B]`}>{fmtCost(item.totalCost || item.cost)}</td>
    </>
  );
}

ValueCells.propTypes = {
  item: PropTypes.object.isRequired,
  viewMode: PropTypes.string.isRequired,
  isSummary: PropTypes.bool,
};

function ModelSummaryCell({ group, expanded }) {
  const provider = group.items?.[0]?.provider || String(group.groupKey || "").split("/")[0] || "unknown";
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className={`material-symbols-outlined shrink-0 text-[18px] text-text-muted dark:!text-[#CBD5E1] transition-transform ${expanded ? "rotate-90" : ""}`}>chevron_right</span>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[rgba(17,24,39,0.06)] bg-white/75 shadow-[0_8px_18px_-16px_rgba(17,24,39,0.35)]">
        <ProviderIcon src={providerIconPath(provider)} alt={provider} size={22} className="rounded-md object-contain" fallbackText={provider.slice(0, 2).toUpperCase()} fallbackColor={providerDisplayColor(provider)} />
      </div>
      <div className="min-w-0">
        <div className={`truncate text-[13px] font-semibold leading-5 tracking-[-0.01em] ${group.summary.pending > 0 ? "text-[#4F7CFF]" : "text-text-main dark:!text-white"}`} title={group.groupKey}>{group.groupKey}</div>
        <div className="truncate text-[11px] text-text-muted dark:!text-[#CBD5E1]" title={providerDisplayName(provider)}>{providerDisplayName(provider)}</div>
      </div>
    </div>
  );
}

ModelSummaryCell.propTypes = {
  group: PropTypes.object.isRequired,
  expanded: PropTypes.bool,
};

function DefaultSummaryCell({ group, expanded }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className={`material-symbols-outlined text-[18px] text-text-muted dark:!text-[#CBD5E1] transition-transform ${expanded ? "rotate-90" : ""}`}>chevron_right</span>
      <span className={`truncate font-semibold transition-colors ${group.summary.pending > 0 ? "text-[#4F7CFF]" : "text-text-main dark:!text-white"}`}>{group.groupKey}</span>
    </div>
  );
}

DefaultSummaryCell.propTypes = {
  group: PropTypes.object.isRequired,
  expanded: PropTypes.bool,
};

/**
 * Reusable sortable usage table with expandable group rows.
 *
 * @param {object} props
 * @param {string} props.title - Table title
 * @param {Array} props.columns - Column definitions [{field, label}]
 * @param {Array} props.groupedData - Grouped data from groupDataByKey
 * @param {string} props.tableType - Table type key for sort URL params
 * @param {string} props.sortBy - Current sort field
 * @param {string} props.sortOrder - Current sort order
 * @param {function} props.onToggleSort - Sort toggle handler
 * @param {string} props.viewMode - "tokens" or "costs"
 * @param {string} props.storageKey - localStorage key for expanded state
 * @param {function} props.renderGroupLabel - Render group summary first cell content
 * @param {function} props.renderDetailCells - Render detail row custom cells (before value cells)
 * @param {function} props.renderSummaryCells - Render summary row cells after group label (placeholder cols)
 * @param {string} props.emptyMessage - Empty state message
 */
export default function UsageTable({
  title,
  columns,
  groupedData,
  tableType,
  sortBy,
  sortOrder,
  onToggleSort,
  viewMode,
  storageKey,
  renderDetailCells,
  renderSummaryCells,
  emptyMessage,
}) {
  const [expanded, setExpanded] = useState(new Set());

  // Load expanded state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setExpanded(new Set(JSON.parse(saved)));
    } catch (e) {
      console.error(`Failed to load ${storageKey}:`, e);
    }
  }, [storageKey]);

  // Save expanded state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify([...expanded]));
    } catch (e) {
      console.error(`Failed to save ${storageKey}:`, e);
    }
  }, [expanded, storageKey]);

  const toggleGroup = useCallback((groupKey) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(groupKey) ? next.delete(groupKey) : next.add(groupKey);
      return next;
    });
  }, []);

  const valueColumns = useMemo(() => {
    if (viewMode === "tokens") {
      return [
        { field: "promptTokens", label: "Input Tokens" },
        { field: "completionTokens", label: "Output Tokens" },
        { field: "totalTokens", label: "Total Tokens" },
      ];
    }
    return [
      { field: "promptTokens", label: "Input Cost" },
      { field: "completionTokens", label: "Output Cost" },
      { field: "cost", label: "Total Cost" },
    ];
  }, [viewMode]);

  const totalColSpan = columns.length + valueColumns.length;

  return (
    <Card className="dark:!bg-[#0B1220] dark:!border-[#334155] dark:!shadow-none dark:!backdrop-blur-0 overflow-hidden border-[rgba(17,24,39,0.07)] shadow-[0_14px_34px_-28px_rgba(17,24,39,0.30)]">
      {title ? (
        <div className="border-b border-[rgba(17,24,39,0.06)] bg-white/45 p-4">
          <h3 className="font-semibold">{title}</h3>
        </div>
      ) : null}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left text-sm">
          <thead className="bg-[rgba(255,255,255,0.72)] text-[11px] uppercase tracking-[0.11em] text-text-muted dark:!text-[#CBD5E1] backdrop-blur-sm">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.field}
                  className={`px-4 py-3 cursor-pointer font-semibold transition-colors hover:bg-[rgba(79,124,255,0.04)] ${col.align === "right" ? "text-right" : ""}`}
                  onClick={() => onToggleSort(tableType, col.field)}
                >
                  {col.label}{" "}
                  <SortIcon field={col.field} currentSort={sortBy} currentOrder={sortOrder} />
                </th>
              ))}
              {valueColumns.map((col) => (
                <th
                  key={col.field}
                  className="px-4 py-3 text-right cursor-pointer font-semibold transition-colors hover:bg-[rgba(79,124,255,0.04)]"
                  onClick={() => onToggleSort(tableType, col.field)}
                >
                  {col.label}{" "}
                  <SortIcon field={col.field} currentSort={sortBy} currentOrder={sortOrder} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groupedData.map((group) => (
              <Fragment key={group.groupKey}>
                {/* Group summary row */}
                <tr
                  className="group cursor-pointer transition-colors hover:bg-[rgba(79,124,255,0.04)]"
                  onClick={() => toggleGroup(group.groupKey)}
                >
                  <td className="border-t border-[rgba(17,24,39,0.05)] px-4 py-3.5">
                    {tableType === "model" ? (
                      <ModelSummaryCell group={group} expanded={expanded.has(group.groupKey)} />
                    ) : (
                      <DefaultSummaryCell group={group} expanded={expanded.has(group.groupKey)} />
                    )}
                  </td>
                  {renderSummaryCells(group)}
                  <ValueCells item={group.summary} viewMode={viewMode} isSummary />
                </tr>
                {/* Detail rows */}
                {expanded.has(group.groupKey) && group.items.map((item) => (
                  <tr
                    key={`detail-${item.key}`}
                    className="group-detail bg-[rgba(79,124,255,0.018)] transition-colors hover:bg-[rgba(79,124,255,0.045)]"
                  >
                    {renderDetailCells(item)}
                    <ValueCells item={item} viewMode={viewMode} />
                  </tr>
                ))}
              </Fragment>
            ))}
            {groupedData.length === 0 && (
              <tr>
                <td colSpan={totalColSpan} className="px-6 py-10 text-center text-sm text-text-muted dark:!text-[#CBD5E1]">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

UsageTable.propTypes = {
  title: PropTypes.string.isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({
    field: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    align: PropTypes.string,
  })).isRequired,
  groupedData: PropTypes.array.isRequired,
  tableType: PropTypes.string.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortOrder: PropTypes.string.isRequired,
  onToggleSort: PropTypes.func.isRequired,
  viewMode: PropTypes.string.isRequired,
  storageKey: PropTypes.string.isRequired,
  renderDetailCells: PropTypes.func.isRequired,
  renderSummaryCells: PropTypes.func.isRequired,
  emptyMessage: PropTypes.string.isRequired,
};

// Re-export utilities for use in UsageStats orchestrator
export { fmt, fmtCost, fmtTime };
