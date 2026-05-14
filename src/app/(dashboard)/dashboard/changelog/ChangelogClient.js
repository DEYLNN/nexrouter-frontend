"use client";

import { APP_CONFIG } from "@/shared/constants/config";

function parseChangelog(content) {
  if (!content) return [];
  const versions = [];
  let current = null;
  let section = null;

  for (const line of content.split("\n")) {
    const versionMatch = line.match(/^## \[(.+?)\] - (.+)/);
    if (versionMatch) {
      if (current) versions.push(current);
      current = { version: versionMatch[1], date: versionMatch[2], sections: {} };
      section = null;
      continue;
    }
    const sectionMatch = line.match(/^### (.+)/);
    if (sectionMatch && current) {
      section = sectionMatch[1];
      current.sections[section] = [];
      continue;
    }
    const itemMatch = line.match(/^- \*\*(.+?)\*\* — (.+)/);
    if (itemMatch && current && section) {
      current.sections[section].push({ title: itemMatch[1], desc: itemMatch[2] });
      continue;
    }
    const plainMatch = line.match(/^- (.+)/);
    if (plainMatch && current && section) {
      current.sections[section].push({ title: null, desc: plainMatch[1] });
    }
  }
  if (current) versions.push(current);
  return versions;
}

const SECTION_COLORS = {
  Features: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
  Improvements: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/20" },
  Fixes: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
};

export default function ChangelogClient({ content }) {
  const versions = parseChangelog(content);

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-2">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-[28px] text-text-muted">history</span>
        <div>
          <h1 className="text-xl font-bold text-text-primary">Changelog</h1>
          <p className="text-xs text-text-muted">Current version: v{APP_CONFIG.version}</p>
        </div>
      </div>

      {versions.length === 0 && (
        <p className="text-sm text-text-muted">No changelog entries found.</p>
      )}

      {versions.map((v, i) => (
        <div key={v.version} className="relative pl-6">
          {/* Timeline line */}
          {i < versions.length - 1 && (
            <div className="absolute left-[7px] top-8 bottom-0 w-px bg-black/10 dark:bg-white/10" />
          )}
          {/* Timeline dot */}
          <div className={`absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 ${i === 0 ? "bg-primary border-primary" : "bg-surface border-black/20 dark:border-white/20"}`} />

          <div className="space-y-3">
            {/* Version header */}
            <div className="flex items-center gap-3">
              <span className={`text-sm font-bold ${i === 0 ? "text-primary" : "text-text-primary"}`}>
                v{v.version}
              </span>
              {i === 0 && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-primary/15 text-primary">Latest</span>
              )}
              <span className="text-xs text-text-muted">{v.date}</span>
            </div>

            {/* Sections */}
            {Object.entries(v.sections).map(([sectionName, items]) => {
              const colors = SECTION_COLORS[sectionName] || { bg: "bg-surface-2/40", text: "text-text-muted", border: "border-black/10 dark:border-white/10" };
              return (
                <div key={sectionName} className={`rounded-xl border ${colors.border} ${colors.bg} p-3 space-y-2`}>
                  <p className={`text-[11px] font-semibold uppercase tracking-wider ${colors.text}`}>{sectionName}</p>
                  <ul className="space-y-1.5">
                    {items.map((item, j) => (
                      <li key={j} className="text-sm text-text-primary leading-snug">
                        {item.title ? (
                          <>
                            <span className="font-semibold">{item.title}</span>
                            <span className="text-text-muted"> — {item.desc}</span>
                          </>
                        ) : (
                          <span className="text-text-muted">{item.desc}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
